import { sql } from '@vercel/postgres';
import { sql as drizzleSql } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { vaultsTable } from '../../db/schema/vaults';
import { eq, lt, gte, ne } from "drizzle-orm";
import { Fzf } from 'fzf';




export default async function search(req, res) {
    try {
        const tableNamesStr = req.query.AccessVaults
        const tableNames = tableNamesStr.split(',');
        const inputValue = req.query.q.replace(/,/g, ' ');
        // console.log('req inputValue:', inputValue);
        const wordsArray = req.query.q.split(',');
        console.log('inputValue: ', inputValue)
        console.log('req wordsArray: ', wordsArray)

        const db = drizzle(sql)



        let rows = []

        for (const table of tableNames) {
            const selectQuery = drizzleSql`SELECT * FROM `;
            const selectQueryJoint = `${table}`
            selectQuery.queryChunks[0].value[0] += selectQueryJoint
            const queryResult = await db.execute(drizzleSql`${selectQuery}`);
            console.log('queryresult', queryResult.rows.length)
            for (const item of queryResult.rows) {
                if (typeof item === 'object' && item !== null) {
                    rows.push(item);
                }
            }
        }

        const datasets = rows
        console.log('rows', rows.length)


        // Remove ".md" extension
        const extensionRemovedData = datasets.map(item => {
            return {
                ...item,
                fileName: item.filename.replace(/\.md$/, '')
            };
        });


        //===========getting the synonyms file from vault and formatt it into object==================

        const standardVaultReference = await db.select({referenceNo: vaultsTable.reference_table}).from(vaultsTable).where(eq(vaultsTable.vault_name , 'Standard Vault'))

        const selectQuery = drizzleSql`SELECT * FROM `;
        const selectQueryJoint = `${standardVaultReference[0].referenceNo} where filename = 'Synonyms.md'`
        selectQuery.queryChunks[0].value[0] += selectQueryJoint
        const queryResult = await db.execute(drizzleSql`${selectQuery}`);

        function parseSynonyms(text) {
            const lines = text.split('\n');
            const synonyms = {};
            lines.forEach(line => {
                // Skip empty or whitespace-only lines
                if (line.trim() === '') {
                    return;
                }
                const parts = line.split(' ');
                const key = parts.shift().substring(1); // Remove the leading '#' and take the first part
                const values = parts.join(' ').split(',').filter(value => value.trim() !== ''); // Join the remaining parts, split by comma, and remove blank values
                synonyms[key] = values;
            });
            return synonyms;
        }
        
        // Example usage
        const synonyms = parseSynonyms(queryResult.rows[0].content);
        console.log('==================synonyms' , synonyms);

        //===========end getting the synonyms file from vault and format it into object==================


        function findSynonyms(wordsArray, synonyms) {
            const result = {};
        
            wordsArray.forEach(word => {
                // Check if the word is present in the keys
                if (synonyms[word]) {
                    if (!result[word]) {
                        result[word] = synonyms[word].slice();
                    }
                } else {
                    // Check if the word is present in the values
                    for (const key in synonyms) {
                        if (synonyms[key].includes(word)) {
                            result[word] = synonyms[key].filter(val => val !== word);
                            result[word].push(key);
                            break;
                        }
                    }
                }
            });
        
            return result;
        }
        
        // Finding synonyms
        const synonymsResult = findSynonyms(wordsArray, synonyms);
        console.log('Synonyms:', synonymsResult);


        function updateInputValue(inputValue, synonymsResult) {
            const updatedInputValue = inputValue.split(' ').map(word => {
                if (synonymsResult[word]) {
                    return `${word} OR ${synonymsResult[word].join(' OR ')}`;
                }
                return word;
            }).join(' ');
        
            return updatedInputValue;
        }
        
        // Update input value with synonyms
        const updatedInputValue = updateInputValue(inputValue, synonymsResult);
        console.log('Updated Input Value:', updatedInputValue);


        function updateWordsArray(wordsArray, synonymsResult) {
            const updatedWordsArray = [];
        
            wordsArray.forEach(word => {
                if (word === 'OR') {
                    updatedWordsArray.push(word);
                } else {
                    updatedWordsArray.push(word);
                    if (synonymsResult[word]) {
                        updatedWordsArray.push(...synonymsResult[word]);
                    }
                }
            });
        
            return updatedWordsArray;
        }
        
        // Update wordsArray with synonyms
        const updatedWordsArray = updateWordsArray(wordsArray, synonymsResult);
        console.log('Updated Words Array:', updatedWordsArray);


        


        // filter the data
        const options = {
            selector: (item) => `${item.fileName} (${item.content})`,
            casing: "case-insensitive",
            fuzzy: false,
        };

        for (let i = 0; i < updatedWordsArray.length; i++) {
            // console.log('each word',updatedWordsArray[i])
            if (updatedWordsArray[i].startsWith("-")) {
                updatedWordsArray[i] = updatedWordsArray[i].substring(1);
            }
            // console.log('each word',updatedWordsArray[i])
        }

        let newTestFiles = [];
        let newEntries = [];

        for (const file of extensionRemovedData) {
            let inputExpression = updatedInputValue;
            const fzf = new Fzf([file], options);
            for (const word of updatedWordsArray) {
                if (word === "OR" || word === "AND") {
                    continue;
                } else {
                    newTestFiles = fzf.find(word);
                    const isFound = newTestFiles.length > 0;
                    // console.log(isFound)
                    if (isFound) {
                        if (word === "#") {
                            inputExpression = inputExpression.replace(
                                new RegExp(`#${word}|#`, "g"),
                                "true"
                            );
                        } else {
                            inputExpression = inputExpression.replace(
                                new RegExp(`(\\b|\\B)#?${word}\\b`, "g"),
                                "true"
                            );
                        }
                    } else {
                        if (word === "#") {
                            inputExpression = inputExpression.replace(
                                new RegExp(`#${word}|#`, "g"),
                                "false"
                            );
                        } else {
                            inputExpression = inputExpression.replace(
                                new RegExp(`(\\b|\\B)#?${word}\\b`, "g"),
                                "false"
                            );
                        }
                    }
                }
            }
            // console.log(`${inputExpression} for ${file.fileName} `);
            const expressionEvaluation = evaluateLogicalExpression(inputExpression);
            // console.log(`${expressionEvaluation} for ${file.fileName} `);
            if (expressionEvaluation === 1) {
                newEntries.push(file);
            }
        }
      
        console.log('newEntries = ', newEntries.length)


        res.status(200).json(newEntries);
    } catch (error) {
        console.error('Error reading files:', error);
        res.status(500).json({ error: 'Failed to read files.' });
    }

    function evaluateLogicalExpression(expression) {
        // console.log("expression: ", expression);
        const replacedExpression = expression
            .replace(/true/g, "1")
            .replace(/false/g, "0")
            .replace(/-0/g, "1")
            .replace(/-1/g, "0")
            .replace(/(\d)\s*(?=\d)/g, "$1 & ")
            .replace(/OR/g, "|")
            .replace(/AND/g, "&")
            .replace(/[|&]+\s*$/, "")
            .replace(/^[|&]+\s*|[|&]+\s*$/g, "")
            .replace(/-(?!\w)/g, "") // Remove minus sign not followed by a word
            .replace(/#(?!\w)/g, ""); // Remove # sign not followed by a word

        // console.log("replacedExpression: ", replacedExpression);

        let result = eval(replacedExpression);
        return result;
    }
}