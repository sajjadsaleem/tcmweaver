import React, { useEffect, useState } from "react";
import { Fzf, FzfOptions, byLengthAsc } from "fzf";
import _, { replace } from "lodash";
import Accordion from "react-bootstrap/Accordion";
import AccordionItem from "react-bootstrap/esm/AccordionItem";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader";
import AccordionBody from "react-bootstrap/esm/AccordionBody";

const Sidebar = () => {
  interface FileData {
    fileName: string;
    content: string;
  }

  interface File {
    id: string;
    name: string;
  }

  const [filesData, setFilesData] = useState([]);
  const [filtersFileData, setFiltersFileData] = useState<FileData[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]);
  const [allCheckboxes, setAllCheckboxes] = useState([]);
  const [shouldShowDivs, setShouldShowDivs] = useState(true);
  const [themeChangericon, setThemeChangerIcon] = useState(true);

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
          .filter((word: any) => word.trim() !== "");

        setFiltersFileData(filteredData);

        const categories: any = [];
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

        const checkboxes: any = [];

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

    //changing filter status for each word in search bar
    wordsArray.forEach((word: any) => {
      if (word.startsWith("-")) {
        word = word.replace("-", "");
        for (const category of allCheckboxes as any[]) {
          for (const item of category.items) {
            if (item.value.toLowerCase() === word.toLowerCase()) {
              const categoryTitle = category.category;
              const itemId = item.id;
              item.state = "checked";
              item.status = "exclude";
              console.log("item: ", item);

              console.log(`Word: ${word}`);
              console.log(`Category: ${categoryTitle}`);
              console.log(`Item ID: ${itemId}`);
            }
          }
        }
      } else if (!word.startsWith("-")) {
        for (const category of allCheckboxes as any[]) {
          for (const item of category.items) {
            console.log("item: ", item);
            if (item.value.toLowerCase() === word.toLowerCase()) {
              const categoryTitle = category.category;
              const itemId = item.id;
              item.state = "checked";
              item.status = "include";
              console.log("item: ", item);

              console.log(`Word: ${word}`);
              console.log(`Category: ${categoryTitle}`);
              console.log(`Item ID: ${itemId}`);
            }
          }
        }
      }
      for (const category of allCheckboxes as any[]) {
        for (const item of category.items) {
          const lowerItemValue = item.value.toLowerCase();
          const lowerWordsArray = wordsArray.map((word:any) => word.toLowerCase());

          if (
            !lowerWordsArray.includes(lowerItemValue) &&
            !lowerWordsArray.includes(`-${lowerItemValue}`)
          ) {
            item.state = "unchecked";
            item.status = "neutral";
          }
        }
      }
    });

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

    const options: FzfOptions<File> = {
      selector: (item: any) => `${item.fileName} (${item.content})`,
      casing: "case-insensitive",
      fuzzy: false,
    };
    const fzf: any = new Fzf<File[]>(filesData, options);

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
      const fzf: any = new Fzf<File[]>([file], options);
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
      // console.log(`${expressionEvaluation} for ${file.fileName} `);
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
    setThemeChangerIcon(!themeChangericon);
    const sideNav = document.querySelector(`.${"side-nav"}`);
    if (sideNav) {
      sideNav.classList.toggle("night-mode");
    }
  }

  const handleCheckboxClick = (category: any, id: any) => {
    const updatedCheckboxes: any = allCheckboxes.map(
      (checkboxCategory: any) => {
        if (checkboxCategory.category === category) {
          const updatedItems = checkboxCategory.items.map((item: any) => {
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
      }
    );

    const currentValue = searchValue;
    let valueToInclude = null;
    let valueToCheck = null;

    const foundCategory = updatedCheckboxes.find(
      (checkboxCategory: any) => checkboxCategory.category === category
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

  const handleAccordionClick = () => {
    setShouldShowDivs(!shouldShowDivs);
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
                {themeChangericon ? (
                  <img
                    src="/mood.png"
                    alt="img"
                    onClick={handleThemeChangerClick}
                  />
                ) : (
                  <img
                    src="/light-mode.png"
                    alt="img"
                    onClick={handleThemeChangerClick}
                  />
                )}
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

            <div
              className={`search-results ${
                !shouldShowDivs ? "results-height" : ""
              }`}
            >
              {searchValue.length > 0 && (
                <div>
                  {searchResults.map((result, index) => (
                    <div className="filter-data" key={index}>
                      <div className="set set-1">
                        <div>
                          <h1
                            dangerouslySetInnerHTML={{
                              __html: (
                                result as {
                                  fileNameWithHighlightedWords: string;
                                }
                              ).fileNameWithHighlightedWords,
                            }}
                            // onClick={() => handleFileClick(result["item"])}
                          />
                          <p>
                            {
                              (result as { wordOccurence: number })
                                .wordOccurence
                            }
                          </p>
                        </div>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: (
                              result as { contentWithHighlightedWords: string }
                            ).contentWithHighlightedWords,
                          }}
                          className="note"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="menus-link">
              {!shouldShowDivs && (
                <div className="sub-accordion">
                  <Accordion>
                    {allCheckboxes.map((category: any, index: any) => (
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
                            {category.items.map((item: any) => (
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
                                    handleCheckboxClick(
                                      category.category,
                                      item.id
                                    )
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
              )}
              {shouldShowDivs && (
                <div className="filter-accordion">
                  <Accordion>
                    <Accordion.Item
                      eventKey="0"
                      key="0"
                      title="filter"
                      className="accordion-item"
                    >
                      <Accordion.Header
                        className="accordion-header"
                        onClick={handleAccordionClick}
                      >
                        Filters
                      </Accordion.Header>
                    </Accordion.Item>
                  </Accordion>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
