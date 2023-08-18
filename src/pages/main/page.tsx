// "use client";
// import React, { useState, useEffect } from "react";
// import styles from "./page.module.css";
// import { CiSearch } from "react-icons/ci";
// import { BsFolder2 } from "react-icons/bs";
// import path from "path";
// // import {unified} from 'unified'
// import remarkHTML from "remark-html";
// // import remarkParse from 'remark-parse'

// import { remark } from "remark";
// import remarkMdx from "remark-mdx";
// import { Fzf, FzfOptions, byLengthAsc } from "fzf";
// import LayoutWrapper from "../components/LayoutWrapper";
// import AdminLayout from "../components/AdminLayout";

// const page = () => {
//   const [filesData, setFilesData] = useState([]);
//   const [selectedFileContent, setSelectedFileContent] = useState<any>(null);
//   const [searchValue, setSearchValue] = useState("");
//   const [searchResults, setSearchResults] = useState([]);

//   // console.log('filesData' , filesData)

//   useEffect(() => {
//     const fetchFilesData = async () => {
//       try {
//         const response = await fetch("/api");
//         if (!response.ok) {
//           throw new Error("Failed to fetch files data.");
//         }
//         let data = await response.json();
//         data = data.map((item: any) => {
//           const fileNameWithoutExtension = item.fileName.split(".")[0];
//           return {
//             ...item,
//             fileName: fileNameWithoutExtension,
//           };
//         });
//         setFilesData(data);
//       } catch (error) {
//         console.error("Error fetching files data:", error);
//       }
//     };
//     fetchFilesData();
//   }, []);

//   const handleWordClick = (word: string) => {
//     console.log("word link: ", word);
//     const matchedFile = filesData.find((file) => file.fileName === word);

//     if (matchedFile) {
//       console.log("Matched File Object:", matchedFile);
//     } else {
//       console.log("File not found: ", word);
//     }
//     handleFileClick(matchedFile);
//   };

//   const handleFileClick = async (content: any) => {
//     let clickedTitle = [content];
//     const regex = /\[\[([^[\]]+)\]\]/g;

//     clickedTitle[0]["content"] = clickedTitle[0]["content"].replace(
//       regex,
//       (match, word) =>
//         `<p style="text-decoration: underline; color: blue; cursor: pointer;">${word}</p>`
//     );
//     // console.log("clicked title: ", clickedTitle);

//     setSelectedFileContent(clickedTitle);
//   };

//   const handleSearch = async (event: any) => {
//     const inputValue = event.target.value;
//     setSearchValue(inputValue);

//     let wordToSearch: any;

//     if (inputValue.endsWith(" ") || inputValue.startsWith(" ")) {
//       wordToSearch = inputValue.trim();
//       wordToSearch = wordToSearch.replace(/^\s+/, "");
//     } else {
//       wordToSearch = inputValue;
//     }

//     wordToSearch = wordToSearch.replace(/-\s+/g, "-");

//     // Remove extra spaces within words
//     wordToSearch = wordToSearch.replace(/\s+/g, " ");

//     // Remove single '-' followed by a space
//     wordToSearch = wordToSearch.replace(/-\s(?=\S)/g, "-");

//     // Remove trailing '-' at the end of the search query
//     wordToSearch = wordToSearch.replace(/-$/g, "");

//     // Remove all spaces if the query consists only of spaces
//     if (/^\s*$/.test(wordToSearch)) {
//       wordToSearch = "";
//     }

//     // console.log("wordToSearch before split:", wordToSearch);

//     const wordsArray = wordToSearch.split(" ");
//     console.log("words array: ", wordsArray);

//     const wordsToSearch = [];
//     const wordsToExclude: any[] = [];
//     const orGateWord: any[] = [];

//     for (let i = 0; i < wordsArray.length; i++) {
//       const word = wordsArray[i];
//       if (word.startsWith("-")) {
//         const wordToExclude = word.substring(1);
//         wordsToExclude.push(wordToExclude);
//       } else if (word === "OR" || word === "or") {
//         if (word === "OR") {
//           if (i > 0) {
//             orGateWord.push(wordsArray[i - 1]); // Capture word before "OR"
//           }
//           orGateWord.push("OR"); // Capture "OR"
//           if (i < wordsArray.length - 1) {
//             orGateWord.push(wordsArray[i + 1]); // Capture word after "OR"
//           }
//         }
//       } else {
//         wordsToSearch.push(word);
//       }
//     }

//     wordToSearch = wordsToSearch;

//     console.log("word to search", wordToSearch);
//     console.log("Words to exclude: ", wordsToExclude);
//     console.log("gate word: ", orGateWord);

//     const options: FzfOptions = {
//       selector: (item: any) => `${item.fileName} (${item.content})`,
//       casing: "case-insensitive",
//       fuzzy: false,
//     };
//     const fzf: any = new Fzf(filesData, options);

//     let entries = []; // Initialize the array to store results

//     for (const word of wordToSearch) {
//       const newResults = fzf.find(word); // Perform search for the current word
//       entries = entries.concat(newResults); // Add new results to the entries array
//     }
//     console.log("entries: ", entries);

//     const filteredEntries = entries.filter((entry) => {
//       const allWordsPresent = wordToSearch.every((word) => {
//         const wordPattern = new RegExp(`${word}`, "i");
//         return (
//           wordPattern.test(entry.item.fileName) ||
//           wordPattern.test(entry.item.content)
//         );
//       });
//       return allWordsPresent;
//     });

//     console.log("Filtered entries", filteredEntries);

//     const fullyFilteredEntries = filteredEntries.filter((entry) => {
//       const containsExcludedWord = wordsToExclude.some((excludedWord) => {
//         const excludedWordPattern = new RegExp(`${excludedWord}`, "i");
//         return (
//           excludedWordPattern.test(entry.item.fileName) ||
//           excludedWordPattern.test(entry.item.content)
//         );
//       });

//       return !containsExcludedWord;
//     });

//     console.log("Fully filtered entries: ", fullyFilteredEntries);

//     for (const entry of fullyFilteredEntries) {
//       let textToConvert = entry["item"]["content"];
//       const regex = /\[\[([^[\]]+)\]\]/g;

//       const formattedContent = textToConvert.replace(
//         regex,
//         (match, word) => `${word}`
//       );

//       const { item } = entry;
//       const fileNameOccurrences = (
//         item.fileName.match(new RegExp(wordToSearch, "gi")) || []
//       ).length;
//       const contentOccurrences = (
//         formattedContent.match(new RegExp(wordToSearch, "gi")) || []
//       ).length;
//       item.wordOccurence = fileNameOccurrences + contentOccurrences;
//       item.highlightedFileName = item.fileName.replace(
//         new RegExp(wordToSearch, "gi"),
//         (match) =>
//           `<span style="background-color: rgb(197, 189, 189)">${match}</span>`
//       );

//       item.highlightedContent = formattedContent.replace(
//         new RegExp(wordToSearch, "gi"),
//         (match) =>
//           `<span style="background-color: rgb(197, 189, 189)">${match}</span>`
//       );
//     }
//     fullyFilteredEntries.sort(
//       (a: any, b: any) => b.item.wordOccurence - a.item.wordOccurence
//     );

//     console.log("Search Results Generated:", fullyFilteredEntries);
//     setSearchResults(fullyFilteredEntries);
//   };

//   return (
//     <LayoutWrapper layout={AdminLayout}>
//       <div className={styles.mainContainer}>
//         <header className={styles.mainHeader}>
//           <span className={styles.searchIcon}>
//             <BsFolder2 size={22} />
//           </span>
//           <span className={styles.searchIcon}>
//             <CiSearch size={24} />
//           </span>
//         </header>

//         <div className={styles.mainDiv}>
//           <section className={styles.leftSection}>
//             <input
//               type="text"
//               className={styles.searchButton}
//               placeholder="Smart search"
//               value={searchValue}
//               onChange={handleSearch}
//             />
//             {searchValue.length > 0 && (
//               <div>
//                 {searchResults.map((result, index) => (
//                   <div style={{ marginTop: "20px" }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <h3
//                         dangerouslySetInnerHTML={{
//                           __html: result.item.highlightedFileName,
//                         }}
//                         style={{ margin: "0px", cursor: "pointer" }}
//                         onClick={() => handleFileClick(result["item"])}
//                       />
//                       <h3 style={{ margin: "0px" }}>
//                         {result["item"]["wordOccurence"]}
//                       </h3>
//                     </div>
//                     <p
//                       dangerouslySetInnerHTML={{
//                         __html: result.item.highlightedContent,
//                       }}
//                       style={{
//                         margin: "0px 0px 10px 0px",
//                         overflow: "hidden",
//                         display: "-webkit-box",
//                         textOverflow: "ellipsis",
//                         WebkitLineClamp: 1, // Number of lines to show
//                         WebkitBoxOrient: "vertical",
//                       }}
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>
//           <section className={styles.rightSection}>
//             {selectedFileContent ? (
//               <div>
//                 <h3>{selectedFileContent[0].fileName}</h3>
//                 <p
//                   dangerouslySetInnerHTML={{
//                     __html: selectedFileContent[0].content,
//                   }}
//                   onClick={(e) => {
//                     if (e.target.tagName === "P") {
//                       const clickedWord = e.target.textContent; // Get the clicked word
//                       handleWordClick(clickedWord);
//                     }
//                   }}
//                 />
//               </div>
//             ) : (
//               <p>No file is open</p>
//             )}
//           </section>
//         </div>
//       </div>
//     </LayoutWrapper>
//   );
// };

// export default page;
