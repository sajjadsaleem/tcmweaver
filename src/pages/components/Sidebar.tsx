import React, { useEffect, useState } from "react";
import { Fzf, FzfOptions, byLengthAsc } from "fzf";
import _, { replace } from "lodash";
import Accordion from "react-bootstrap/Accordion";

const sidebar = () => {
  interface FileData {
    fileName: string;
    content: string;
  }
  const [filesData, setFilesData] = useState([]);
  const [filtersFileData, setFiltersFileData] = useState<FileData[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]);
  const [allCheckboxes, setAllCheckboxes] = useState([]);

  // console.log("filesData: ", filesData);
  // console.log("filters file data: ", filtersFileData);
  // console.log("checkboxes: ", checkboxes);
  console.log("current categories", allCheckboxes);

  useEffect(() => {
    const fetchFilesData = async () => {
      try {
        const response = await fetch("/api");
        if (!response.ok) {
          throw new Error("Failed to fetch files data.");
        }
        let data = await response.json();
        data = data.map((item: any) => {
          const fileNameWithoutExtension = item.fileName.split(".")[0];
          return {
            ...item,
            fileName: fileNameWithoutExtension,
          };
        });
        const filtersFile = data.filter(
          (item: any) => item.fileName !== "filters"
        );
        setFilesData(filtersFile);
        const filtersObject = data.find(
          (item: any) => item.fileName === "filters"
        );
        let filteredData = filtersObject ? [filtersObject] : [];

        filteredData = filteredData[0].content
          .split("\n")
          .filter((word) => word.trim() !== "");

        setFiltersFileData(filteredData);

        const categories = [];
        let currentCategories = null;

        for (const item of filteredData) {
          if (item.startsWith("# ") && item.length > 2) {
            currentCategories = item.slice(2);
            categories.push({
              category: currentCategories,
              items: [],
            });
          } else if (currentCategories) {
            const categoryIndex = categories.length - 1;
            categories[categoryIndex].items.push({
              id: categories[categoryIndex].items.length + 1,
              state: "unchecked",
              status: "neutral",
              value: item,
            });
          }
        }

        setAllCheckboxes(categories);

        const checkboxes = [];

        let currentCategory = null;

        for (const word of filteredData) {
          if (word.startsWith("#")) {
            currentCategory = word.substring(2);
          } else {
            checkboxes.push({
              id: checkboxes.length + 1,
              state: "unchecked",
              status: "neutral",
              value: word,
              category: currentCategory,
            });
          }
        }

        // console.log("newcheckboxes", checkboxes);
        setCheckboxes(checkboxes);

        // searchWords.forEach((word, index) => {
        //   checkboxes.push({
        //     id: checkboxes.length + 1,
        //     state: "unchecked",
        //     value: "neutral",
        //     content: word,
        //   });
        // });
      } catch (error) {
        console.error("Error fetching files data:", error);
      }
    };
    fetchFilesData();
  }, []);

  const handleSearch = async (event: any) => {
    const inputValue = event.target.value;
    setSearchValue(inputValue);

    let wordToSearch: any;

    if (inputValue.endsWith(" ") || inputValue.startsWith(" ")) {
      wordToSearch = inputValue.trim();
      wordToSearch = wordToSearch.replace(/^\s+/, "");
    } else {
      wordToSearch = inputValue;
    }

    wordToSearch = wordToSearch.replace(/-\s+/g, "-");

    // Remove extra spaces within words
    wordToSearch = wordToSearch.replace(/\s+/g, " ");

    // Remove single '-' followed by a space
    wordToSearch = wordToSearch.replace(/-\s(?=\S)/g, "-");

    // Remove trailing '-' at the end of the search query
    wordToSearch = wordToSearch.replace(/-$/g, "");

    // Remove all spaces if the query consists only of spaces
    if (/^\s*$/.test(wordToSearch)) {
      wordToSearch = "";
    }

    // console.log("wordToSearch before split:", wordToSearch);

    const wordsArray = wordToSearch.split(" ");
    console.log("words array: ", wordsArray);

    const resultCalculateWithOR: any = [];
    let currentPair = [];
    const wordsToSearch = [];
    const wordsToExclude: any[] = [];
    const orGateWord: any[] = [];

    for (const word of wordsArray) {
      if (word === "OR") {
        if (currentPair.length > 0) {
          resultCalculateWithOR.push([...currentPair]);
        }
        currentPair = [];
      } else {
        currentPair.push(word);
      }
    }
    if (currentPair.length > 0) {
      resultCalculateWithOR.push(currentPair);
    }

    // console.log("resultCalculateWithOR: ", resultCalculateWithOR);

    for (let i = 0; i < wordsArray.length; i++) {
      const word = wordsArray[i];
      if (word.startsWith("-")) {
        const wordToExclude = word.substring(1);
        wordsToExclude.push(wordToExclude);
      } else if (word === "OR" || word === "or") {
        if (word === "OR") {
          if (i > 0) {
            orGateWord.push(wordsArray[i - 1]); // Capture word before "OR"
          }
          orGateWord.push("OR"); // Capture "OR"
          if (i < wordsArray.length - 1) {
            orGateWord.push(wordsArray[i + 1]); // Capture word after "OR"
          }
        }
      } else {
        wordsToSearch.push(word);
      }
    }

    wordToSearch = wordsToSearch;

    console.log("word to search", wordToSearch);
    // console.log("Words to exclude: ", wordsToExclude);
    // console.log("gate word: ", orGateWord);

    const options: FzfOptions = {
      selector: (item: any) => `${item.fileName} (${item.content})`,
      casing: "case-insensitive",
      fuzzy: false,
    };
    const fzf: any = new Fzf(filesData, options);

    let entries: any = []; // Initialize the array to store results

    for (const word of wordToSearch) {
      const newResults = fzf.find(word); // Perform search for the current word
      entries = entries.concat(newResults); // Add new results to the entries array
    }

    //===========New Code============

    for (let i = 0; i < wordsArray.length; i++) {
      if (wordsArray[i].startsWith("-")) {
        wordsArray[i] = wordsArray[i].substring(1);
      }
    }

    let newTestFiles: any = [];
    let newEntries: any = [];

    for (const file of filesData) {
      let inputExpression = inputValue;
      const fzf: any = new Fzf([file], options);
      for (const word of wordsArray) {
        if (word === "OR" || word === "AND") {
          continue;
        } else {
          newTestFiles = fzf.find(word);
          const isFound = newTestFiles.length > 0;
          if (isFound) {
            if (word === "#") {
              inputExpression = inputExpression.replace(
                // new RegExp(`(\\b|\\B)#?${word}\\b`, "g"),
                // new RegExp(`(\\b|\\B)#?${word}\\b|\\B#\\b`, "g"),
                new RegExp(`#${word}|#`, "g"),
                "true"
              );
            } else {
              inputExpression = inputExpression.replace(
                new RegExp(`(\\b|\\B)#?${word}\\b`, "g"),
                // new RegExp(`(\\b|\\B)#?${word}\\b|\\B#\\b`, "g"),
                "true"
              );
            }
          } else {
            if (word === "#") {
              inputExpression = inputExpression.replace(
                // new RegExp(`(\\b|\\B)#?${word}\\b`, "g"),
                // new RegExp(`(\\b|\\B)#?${word}\\b|\\B#\\b`, "g"),
                new RegExp(`#${word}|#`, "g"),
                "false"
              );
            } else {
              inputExpression = inputExpression.replace(
                new RegExp(`(\\b|\\B)#?${word}\\b`, "g"),
                // new RegExp(`(\\b|\\B)#?${word}\\b|\\B#\\b`, "g"),
                "false"
              );
            }
          }
        }
      }
      // console.log(`${inputExpression} for ${file.fileName} `);
      const expressionEvaluation = evaluateLogicalExpression(inputExpression);
      console.log(`${expressionEvaluation} for ${file.fileName} `);
      if (expressionEvaluation === 1) {
        newEntries.push(file);
      }
    }

    //===========New Code End============

    // Remove Brackets and Calculate Occurence of Words
    removeBrackets(newEntries, wordToSearch);
    highlightSearchWord(newEntries, wordToSearch);

    console.log("newEntries: ", newEntries);
    newEntries = newEntries
      .slice()
      .sort((a: any, b: any) => b.wordOccurence - a.wordOccurence);

    setSearchResults(newEntries);
  };

  function evaluateLogicalExpression(expression: any) {
    // console.log("expression: ", expression);
    const replacedExpression = expression
      .replace(/true/g, "1")
      .replace(/false/g, "0")
      .replace(/-0/g, "1")
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

  function removeBrackets(newEntries: any, wordToSearch: any) {
    for (const entry of newEntries) {
      let textToConvert = entry.content;
      const regex = /\[\[([^[\]]+)\]\]/g;

      entry.content = textToConvert.replace(
        regex,
        (match: any, word: any) => `${word}`
      );

      let wordOccurence = 0;

      for (const word of wordToSearch) {
        const fileNameOccurrences = (
          entry.fileName.match(new RegExp(word, "gi")) || []
        ).length;
        const contentOccurrences = (
          entry.content.match(new RegExp(word, "gi")) || []
        ).length;

        wordOccurence += fileNameOccurrences + contentOccurrences;
      }
      entry.wordOccurence = wordOccurence;
    }
  }

  function highlightSearchWord(newEntries: any, wordToSearch: any) {
    for (const entry of newEntries) {
      const contentWithHighlightedWords = entry.content.replace(
        new RegExp(`(${wordToSearch.join("|")})`, "gi"),
        (match: any) => `<span>${match}</span>`
      );
      const fileNameWithHighlightedWords = entry.fileName.replace(
        new RegExp(`(${wordToSearch.join("|")})`, "gi"),
        (match: any) => `<span>${match}</span>`
      );
      entry.contentWithHighlightedWords = contentWithHighlightedWords;
      entry.fileNameWithHighlightedWords = fileNameWithHighlightedWords;
    }
  }

  function handleThemeChangerClick() {
    const sideNav = document.querySelector(`.${"side-nav"}`);
    if (sideNav) {
      sideNav.classList.toggle("night-mode");
    }
  }

  const handleCheckboxClick = (category: any, id: any) => {
    const updatedCheckboxes = allCheckboxes.map((checkboxCategory) => {
      if (checkboxCategory.category === category) {
        const updatedItems = checkboxCategory.items.map((item) => {
          if (item.id === id) {
            // Toggle the state and status of the checkbox
            const newState =
              item.status === "neutral"
                ? "checked"
                : item.status === "include"
                ? "checked"
                : "unchecked";
            const newStatus =
              item.status === "neutral"
                ? "include"
                : item.status === "include"
                ? "exclude"
                : "neutral";

            return {
              ...item,
              state: newState,
              status: newStatus,
            };
          }
          return item;
        });
        return {
          ...checkboxCategory,
          items: updatedItems,
        };
      }
      return checkboxCategory;
    });

    const currentValue = searchValue;
    let valueToInclude = null;
    let valueToCheck = null;

    const foundCategory = updatedCheckboxes.find(
      (checkboxCategory) => checkboxCategory.category === category
    );
    if (foundCategory) {
      const foundItem = foundCategory.items.find((item: any) => item.id === id);
      valueToInclude = foundItem ? foundItem.value : null;
      valueToCheck = foundItem ? foundItem.status : null;
    }

    if (valueToCheck === "include") {
      const updatedValue = currentValue + " " + valueToInclude;
      const syntheticEvent = {
        target: { value: updatedValue },
      };
      handleSearch(syntheticEvent);
    } else if (valueToCheck === "exclude") {
      const valueToAdd = valueToInclude;
      let updatedValue = currentValue;
      // const updatedValue =
      //   currentValue + " -" + updatedCheckboxes[id - 1]["value"];
      if (currentValue.includes(valueToAdd)) {
        updatedValue = currentValue
          .replace(
            new RegExp(`\\s*${valueToAdd}\\s*(?!.*\\s*${valueToAdd}\\s*)`),
            ""
          )
          .trim();
        updatedValue += ` -${valueToAdd}`;
      } else {
        // If the value is not present, add it with a leading minus sign
        updatedValue = currentValue + " -" + valueToInclude;
      }
      const syntheticEvent = {
        target: { value: updatedValue },
      };
      handleSearch(syntheticEvent);
    } else {
      const valueToRemove = valueToInclude;
      const regex = new RegExp(`\\s*-?${valueToRemove}\\s*`, "gi");
      const updatedValue = currentValue.replace(regex, "").trim();
      const syntheticEvent = {
        target: { value: updatedValue },
      };
      handleSearch(syntheticEvent);
    }
    setAllCheckboxes(updatedCheckboxes);
  };

  return (
    <div>
      <div className="side-nav">
        <div className="navVc">
          <div className={"logoVc"}>
            <div>
              <p>TCM Weaver</p>
            </div>
            <div className={"icon-profile"}>
              <div className={"themeChanger"}>
                <img
                  src="/mood.png"
                  alt="img"
                  onClick={handleThemeChangerClick}
                />
              </div>
              <div className={"simpleIcon"}>
                <img src="/logo.png" alt="img" />
              </div>
              <div className={"noteIcon"}>
                <img src="/logo-2.png" alt="img" />
              </div>
            </div>
          </div>
          <div className={"menus"}>
            <div className={"menuBtn"}>
              <input
                type="text"
                className={"formControl"}
                placeholder=" Smart search"
                value={searchValue}
                onChange={handleSearch}
              />
            </div>

            {searchValue.length > 0 && (
              <div>
                {searchResults.map((result, index) => (
                  <div className="filter-data">
                    <div className="set set-1">
                      <div>
                        <h1
                          dangerouslySetInnerHTML={{
                            __html: result.fileNameWithHighlightedWords,
                          }}
                          // onClick={() => handleFileClick(result["item"])}
                        />
                        <p>{result.wordOccurence}</p>
                      </div>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: result.contentWithHighlightedWords,
                        }}
                        className="note"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="munus-link">
              <Accordion>
                {allCheckboxes.map((category, index) => (
                  <Accordion.Item
                    eventKey={index.toString()}
                    key={category.category}
                    title={category.category}
                    className="accordion-item"
                  >
                    <Accordion.Header className="accordion-header">
                      {category.category}
                    </Accordion.Header>
                    <Accordion.Body className="accordion-body">
                      <div className="form-check form-check-inline">
                        {category.items.map((item) => (
                          <div
                            className="form-check form-check-inline"
                            key={item.id}
                          >
                            <input
                              className={`form-check-input ${
                                category.items[item.id - 1]["status"] ===
                                "exclude"
                                  ? "customCheckBackground"
                                  : ""
                              }`}
                              type="checkbox"
                              id={`checkbox${item.id}`}
                              checked={item.state === "checked"}
                              onChange={() =>
                                handleCheckboxClick(category.category, item.id)
                              }
                              value={item.value}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`checkbox${item.id}`}
                            >
                              {item.value}
                            </label>
                          </div>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default sidebar;
