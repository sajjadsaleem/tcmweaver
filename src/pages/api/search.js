import fs from 'fs/promises';
import path from 'path';
import { Fzf } from 'fzf';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function search(req, res) {
    try {
        const inputValue = req.query.q.replace(/,/g, ' ');
        console.log('req inputValue:', inputValue);
        const wordsArray = req.query.q.split(',');
        console.log('req wordsArray: ', wordsArray)


        // reading all files
        // const directoryPath = `${process.cwd()}/public/cornish-vault`;
        // const fileNames = await fs.readdir(directoryPath);
        // const filesData = await Promise.all(
        //     fileNames.map(async (fileName) => {
        //         const filePath = path.join(directoryPath, fileName);
        //         const content = await fs.readFile(filePath, 'utf-8');
        //         return { fileName, content };
        //     })
        // );

        // console.log('filesData', filesData)

        const datasets = await prisma.dataset.findMany({
            select: {
                filename: true,
                content: true,
                // Add other columns you want to include here
            },
        });

        // console.log('dataset:', datasets)

        // Remove ".md" extension
        const extensionRemovedData = datasets.map(item => {
            return {
                ...item,
                fileName: item.filename.replace(/\.md$/, '')
            };
        });

        // console.log('extensionRemovedData', extensionRemovedData)

        // remove filters file from other data
        const filesWithoutFilters = extensionRemovedData.filter(item => item.fileName !== "SAMPLE FILTERS");

        // console.log('filesWithoutFilters', filesWithoutFilters)


        // filter the data
        const options = {
            selector: (item) => `${item.fileName} (${item.content})`,
            casing: "case-insensitive",
            fuzzy: false,
        };

        for (let i = 0; i < wordsArray.length; i++) {
            // console.log('each word',wordsArray[i])
            if (wordsArray[i].startsWith("-")) {
                wordsArray[i] = wordsArray[i].substring(1);
            }
            // console.log('each word',wordsArray[i])
        }

        let newTestFiles = [];
        let newEntries = [];

        for (const file of filesWithoutFilters) {
            let inputExpression = inputValue;
            const fzf = new Fzf([file], options);
            for (const word of wordsArray) {
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
        // console.log('newEntries: ', newEntries)

        // const datasets = await prisma.dataset.findMany({
        //     where: {
        //         OR: wordsArray.map((word) => ({
        //             OR: [
        //                 { filename: { contains: word } }, // Match word in filename
        //                 { content: { contains: word } },  // Match word in content
        //             ],
        //         })),
        //     },
        // });

        // console.log('datasets = ', datasets)

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