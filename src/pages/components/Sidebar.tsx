import React, { useEffect, useState } from "react";
import { Fzf, FzfOptions, byLengthAsc } from "fzf";
import _, { replace, result, update } from "lodash";
import Accordion from "react-bootstrap/Accordion";
import { marked } from "marked";
import * as d3 from "d3";

const Sidebar = () => {
  interface FileData {
    fileName: string;
    content: string;
  }

  interface File {
    id: string;
    name: string;
  }

  interface SearchResult {
    fileName: string;
    content: string;
    wordOccurence: number;
    contentWithHighlightedWords: string;
    fileNameWithHighlightedWords: string;
  }

  interface OpenedResult {
    openedFromResults: any;
    fileName: string;
    content: string;
    contentWithRemovedBrackets: string;
  }

  interface Node {
    id: string;
    // Add other properties here as needed
  }

  interface Link {
    source: string;
    target: string;
    // Add other properties here as needed
  }

  interface CustomNode extends d3.SimulationNodeDatum {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
  }

  const [filesData, setFilesData] = useState([]);
  const [filtersFileData, setFiltersFileData] = useState<FileData[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [checkboxes, setCheckboxes] = useState([]);
  const [allCheckboxes, setAllCheckboxes] = useState([]);
  const [shouldShowDivs, setShouldShowDivs] = useState(true);
  const [themeChangericon, setThemeChangerIcon] = useState(true);
  const [graphOrTextView, setgraphOrTextView] = useState(true);
  const [openedResults, setOpenedResults] = useState<OpenedResult[]>([]);
  const [filtersData, setFiltersData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [graphDimension, setGraphDimension] = useState({
    width: 0,
    height: 0,
  });

  // console.log("filesData: ", filesData);
  // console.log("filters file data: ", filtersFileData);
  // console.log("checkboxes: ", checkboxes);
  // console.log("searchResults", searchResults);
  // console.log("currentCategories: ", allCheckboxes);
  // console.log("openedResults: ", openedResults);
  // console.log("filtersData: ", filtersData);
  // console.log("graphData: ", graphData);

  useEffect(() => {
    const fetchFilesData = async () => {
      try {
        const response = await fetch("/api");
        if (!response.ok) {
          throw new Error("Failed to fetch files data.");
        } else {
          let data = await response.json();

          const modifiedData = data.map((item: any) => {
            return {
              ...item,
              fileName: item.fileName.split(".").slice(0, -1).join("."),
            };
          });

          setFiltersData(modifiedData);

          // remove .md extension from Filenames
          data = data.map((item: any) => {
            const fileNameWithoutExtension = item.fileName.split(".")[0];
            return {
              ...item,
              fileName: fileNameWithoutExtension,
            };
          });

          // separating data and filters file
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
          // console.log("categories", categories);

          setAllCheckboxes(categories);
        }
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

    const wordsArray = wordToSearch
      .match(/(-?)"([^"]*)"|\S+/g)
      .map((match: any) => match.replace(/^(-?)"([^"]*)"$/, "$1$2"));
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
            // console.log("item: ", item);
            if (item.value.toLowerCase() === word.toLowerCase()) {
              const categoryTitle = category.category;
              const itemId = item.id;
              item.state = "checked";
              item.status = "include";
              // console.log("item: ", item);

              // console.log(`Word: ${word}`);
              // console.log(`Category: ${categoryTitle}`);
              // console.log(`Item ID: ${itemId}`);
            }
          }
        }
      }
      for (const category of allCheckboxes as any[]) {
        for (const item of category.items) {
          const lowerItemValue = item.value.toLowerCase();
          const lowerWordsArray = wordsArray.map((word: any) =>
            word.toLowerCase()
          );

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

    // getting search result data from backend
    let newEntries: any = [];
    let responseJson: any = [];
    try {
      const encodedWords = encodeURIComponent(wordsArray.join(","));
      const response = await fetch(`/api/search?q=${encodedWords}`);
      responseJson = await response.json();
      // console.log("responseJson: ", responseJson);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }

    newEntries = responseJson;

    //===========New Code============

    // for (let i = 0; i < wordsArray.length; i++) {
    //   if (wordsArray[i].startsWith("-")) {
    //     wordsArray[i] = wordsArray[i].substring(1);
    //   }
    // }

    // let newTestFiles: any = [];
    // let newEntries: any = [];

    // console.log("inputValue", inputValue);
    // for (const file of filesData) {
    //   let inputExpression = inputValue;
    //   const fzf: any = new Fzf<File[]>([file], options);
    //   for (const word of wordsArray) {
    //     if (word === "OR" || word === "AND") {
    //       continue;
    //     } else {
    //       newTestFiles = fzf.find(word);
    //       const isFound = newTestFiles.length > 0;
    //       if (isFound) {
    //         if (word === "#") {
    //           inputExpression = inputExpression.replace(
    //             // new RegExp(`(\\b|\\B)#?${word}\\b`, "g"),
    //             // new RegExp(`(\\b|\\B)#?${word}\\b|\\B#\\b`, "g"),
    //             new RegExp(`#${word}|#`, "g"),
    //             "true"
    //           );
    //         } else {
    //           inputExpression = inputExpression.replace(
    //             new RegExp(`(\\b|\\B)#?${word}\\b`, "g"),
    //             // new RegExp(`(\\b|\\B)#?${word}\\b|\\B#\\b`, "g"),
    //             "true"
    //           );
    //         }
    //       } else {
    //         if (word === "#") {
    //           inputExpression = inputExpression.replace(
    //             // new RegExp(`(\\b|\\B)#?${word}\\b`, "g"),
    //             // new RegExp(`(\\b|\\B)#?${word}\\b|\\B#\\b`, "g"),
    //             new RegExp(`#${word}|#`, "g"),
    //             "false"
    //           );
    //         } else {
    //           inputExpression = inputExpression.replace(
    //             new RegExp(`(\\b|\\B)#?${word}\\b`, "g"),
    //             // new RegExp(`(\\b|\\B)#?${word}\\b|\\B#\\b`, "g"),
    //             "false"
    //           );
    //         }
    //       }
    //     }
    //   }
    //   // console.log(`${inputExpression} for ${file.fileName} `);
    //   const expressionEvaluation = evaluateLogicalExpression(inputExpression);
    //   // console.log(`${expressionEvaluation} for ${file.fileName} `);
    //   if (expressionEvaluation === 1) {
    //     newEntries.push(file);
    //   }
    // }

    //===========New Code End============

    // Remove Brackets and Calculate Occurence of Words

    removeBrackets(newEntries, wordToSearch);

    highlightSearchWord(newEntries, wordToSearch);

    newEntries = newEntries
      .slice()
      .sort((a: any, b: any) => b.wordOccurence - a.wordOccurence);

    // console.log("newEntries: ", newEntries);

    setSearchResults(newEntries);
  };

  // this function now working on backend
  // function evaluateLogicalExpression(expression: any) {
  //   // console.log("expression: ", expression);
  //   const replacedExpression = expression
  //     .replace(/true/g, "1")
  //     .replace(/false/g, "0")
  //     .replace(/-0/g, "1")
  //     .replace(/-1/g, "0")
  //     .replace(/(\d)\s*(?=\d)/g, "$1 & ")
  //     .replace(/OR/g, "|")
  //     .replace(/AND/g, "&")
  //     .replace(/[|&]+\s*$/, "")
  //     .replace(/^[|&]+\s*|[|&]+\s*$/g, "")
  //     .replace(/-(?!\w)/g, "") // Remove minus sign not followed by a word
  //     .replace(/#(?!\w)/g, ""); // Remove # sign not followed by a word

  //   // console.log("replacedExpression: ", replacedExpression);

  //   let result = eval(replacedExpression);
  //   return result;
  // }

  function removeBrackets(newEntries: any, wordToSearch: any) {
    // console.log("newEntries: ", newEntries);
    for (const entry of newEntries) {
      let textToConvert = entry.content;
      const regex = /\[\[([^[\]]+)\]\]/g;

      // entry.content = textToConvert.replace(
      //   regex,
      //   (match: any, word: any) => `${word}`
      // );

      const contentWithRemovedBrackets = textToConvert.replace(
        regex,
        (match: any, word: any) => `${word}`
      );
      entry.contentWithRemovedBrackets = contentWithRemovedBrackets;

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
      const contentWithHighlightedWords =
        entry.contentWithRemovedBrackets.replace(
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
    console.log("themeChangerIcon: ", themeChangericon);
    setThemeChangerIcon(!themeChangericon);
    const sideNav = document.querySelector(`.${"side-nav"}`);
    const mainPanel = document.querySelector(`.${"main"}`);
    const graphPanel = document.querySelector(`.${"graph-container"}`);
    if (sideNav && mainPanel) {
      sideNav.classList.toggle("night-mode");
      mainPanel.classList.toggle("night-mode");
    } else if (sideNav && graphPanel) {
      sideNav.classList.toggle("night-mode");
      graphPanel.classList.toggle("night-mode");
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
      if (currentValue.includes(valueToAdd)) {
        updatedValue = currentValue
          // .replace(
          //   new RegExp(`\\s*${valueToAdd}\\s*(?!.*\\s*${valueToAdd}\\s*)`),
          //   ""
          // )
          // .replace(/ +/g, " ") // Replace consecutive whitespace with a single space
          // .trim();
          .replace(new RegExp(`\\b${valueToAdd}\\b`, "g"), "") // Remove the specific word
          .replace(/ +/g, " ") // Replace multiple consecutive spaces with a single space
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

  const handleGraphOrTextView = () => {
    setgraphOrTextView(!graphOrTextView);

    if (graphOrTextView) {
      const nodes: any = [];
      const links: any = [];

      const nodeExists = (id: any) => {
        return nodes.some((node: any) => node.id === id);
      };

      // Iterate through each object in openedResults
      openedResults.forEach((result) => {
        // Create a node for the fileName
        const nodeId = result.fileName;
        const match = result.contentWithRemovedBrackets.match(/#(\w+)/);
        const nodeTag = match ? match[0] : null;
        if (!nodeExists(nodeId)) {
          nodes.push({ id: nodeId, tag: nodeTag });
        }

        // Parse the content to extract underlined words
        const underlinedWords = result.content.match(
          /<span[^>]*>(.*?)<\/span>/g
        );
        if (underlinedWords) {
          underlinedWords.forEach((word) => {
            // Remove HTML tags from underlined word
            const cleanWord = word.replace(/<\/?[^>]+(>|$)/g, "");
            if (!nodeExists(cleanWord)) {
              nodes.push({ id: cleanWord, tag: nodeTag });
            }

            // Create a link between fileName and underlined word
            links.push({ source: nodeId, target: cleanWord, value: 1 });
          });
        }
      });

      // Create the final object in the desired format
      const resultData = { nodes, links };
      let graphNewData = resultData;

      setTimeout(() => {
        let element: any = document.getElementById("graph-div");

        // Calculate the width and height
        let graphWidth = element.offsetWidth;
        let graphHeight = element.offsetHeight;

        function ForceGraph(
          { nodes, links }: { nodes: Node[]; links: Link[] },
          {
            nodeId = (d: any) => d.id, // given d in nodes, returns a unique identifier (string)
            nodeGroup = null, // given d in nodes, returns an (ordinal) value for color
            nodeGroups = null as any[] | null, // an array of ordinal values representing the node groups
            nodeTitle = null, // given d in nodes, a title string
            nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
            nodeStroke = "#fff", // node stroke color
            nodeStrokeWidth = 0, // node stroke width, in pixels
            nodeStrokeOpacity = 1, // node stroke opacity
            nodeRadius = 5, // node radius, in pixels
            nodeStrength = -30,
            linkSource = ({ source }: { source: string }) => source, // Specify the type as string
            linkTarget = ({ target }: { target: string }) => target, // Specify the type as string
            linkStroke = "#999", // link stroke color
            linkStrokeOpacity = 0.6, // link stroke opacity
            linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
            linkStrokeLinecap = "round", // link stroke linecap
            linkStrength = 0.3,
            colors = d3.schemeTableau10, // an array of color strings, for the node groups
            width = 640, // outer width, in pixels
            height = 400, // outer height, in pixels
            invalidation = undefined, // when this promise resolves, stop the simulation
          } = {}
        ) {
          // Compute values.
          const N = d3.map(nodes, nodeId).map(intern);
          const LS = d3.map(links, linkSource).map(intern);
          const LT = d3.map(links, linkTarget).map(intern);
          if (nodeTitle === null) {
            let nodeTitle = (_: any, i: any) => N[i];
          }
          const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
          const G =
            nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
          const W =
            typeof linkStrokeWidth !== "function"
              ? null
              : d3.map(links, linkStrokeWidth);
          const L =
            typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

          // Replace the input nodes and links with mutable objects for the simulation.
          nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
          links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

          // Compute default domains.
          if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

          // Construct the scales.
          const color =
            nodeGroup === null ? null : d3.scaleOrdinal(nodeGroups!, colors);

          // Construct the forces.
          const forceNode = d3.forceManyBody();
          const forceLink = d3.forceLink(links).id(({ index: i = 0 }) => N[i]);
          if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
          if (linkStrength !== undefined) forceLink.strength(linkStrength);

          // console.log("nodes ", nodes);
          const customNodes: CustomNode[] = nodes as CustomNode[];

          const simulation = d3
            .forceSimulation(customNodes)
            .force("link", forceLink)
            .force("charge", forceNode)
            .force("center", d3.forceCenter())
            .on("tick", ticked);

          const svg = d3
            .create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
            .style("transition", "fill-opacity 0.2s, stroke-opacity 0.2s");

          const container = svg.append("g");

          const link = container
            .append("g")
            .attr(
              "stroke",
              typeof linkStroke !== "function" ? linkStroke : null
            )
            .attr("stroke-opacity", linkStrokeOpacity)
            .attr(
              "stroke-width",
              typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null
            )
            .attr("stroke-linecap", linkStrokeLinecap)
            .selectAll("line")
            .data(links)
            .join("line");

          const zoom: any = d3.zoom().on("zoom", zoomed);

          // Apply zoom behavior to the container
          svg.call(zoom);

          function zoomed(event: any) {
            // Update the transform of the container based on the zoom event
            container.attr("transform", event.transform);
          }

          const node = container
            .append("g")
            .attr("fill", nodeFill)
            .attr("stroke", nodeStroke)
            .attr("stroke-opacity", nodeStrokeOpacity)
            .attr("stroke-width", nodeStrokeWidth)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", nodeRadius)
            .on("mouseover", handleMouseOver) // Add mouseover event listener
            .on("mouseout", handleMouseOut)
            .classed("node-pointer", true)
            .call(drag(simulation) as any, drag(simulation));

          // Append text labels to the container, positioned near the nodes
          const nodeText = container
            .append("g")
            .selectAll("title")
            .data(nodes)
            .join("text")
            // .attr("x", (d) => d.x + 12) // Adjust the x-coordinate based on your preference
            // .attr("y", (d) => d.y) // Adjust the y-coordinate based on your preference
            .attr("x", (d: any) => d.x) // Keep the x-coordinate the same as the node
            .attr("y", (d: any) => d.y + nodeRadius + 12)
            .attr("dy", ".35em") // Adjust the vertical alignment based on your preference
            .style("font-size", "5px") // Adjust the font size based on your preference
            .text((d) => d.id);

          const nodeTitles = container
            .append("g")
            .selectAll("title")
            .data(nodes)
            .join("title")
            .text((d) => d.id);

          // In the ticked function, update the positions of text and title elements

          // if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
          // if (L) link.attr("stroke", ({ index: i }) => L[i]);
          if (W) link.attr("stroke-width", (d: Link, i: number) => `${W[i]}`);
          if (L) link.attr("stroke", (d: Link, i: number) => `${L[i]}`);
          if (G && color) {
            node.attr("fill", (_, i) => color(G[i]));
          }
          if (T) {
            node.append("title").text((d: Node, i: number) => String(T[i]));
          }

          if (invalidation != null) {
            // invalidation.then(() => {
            //   // Handle invalidation here
            //   simulation.stop();
            // });
          }

          function intern(value: any) {
            return value !== null && typeof value === "object"
              ? value.valueOf()
              : value;
          }

          // function ticked() {
          //   link
          //     .attr("x1", (d: any) => d.source.x)
          //     .attr("y1", (d: any) => d.source.y)
          //     .attr("x2", (d: any) => d.target.x)
          //     .attr("y2", (d: any) => d.target.y);

          //   node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
          // }

          function ticked() {
            link
              .attr("x1", (d: any) => d.source.x)
              .attr("y1", (d: any) => d.source.y)
              .attr("x2", (d: any) => d.target.x)
              .attr("y2", (d: any) => d.target.y);
            node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
            nodeText.attr("x", (d: any) => d.x + 12).attr("y", (d: any) => d.y);
            nodeTitles.text((d) => d.id);
          }

          // function handleMouseOver(event, d) {
          //   // Find neighbors of the hovered node based on links
          //   // const neighbors = links
          //   //   .filter((link) => link.source === d || link.target === d)
          //   //   .map((link) => (link.source === d ? link.target : link.source));

          //   // // Add the hovered node and its neighbors to the array
          //   // hoveredNodes = [d.id, ...neighbors.map((neighbor) => neighbor.id)];

          //   d3.select(this)
          //     .attr("fill", "red") // Change to your desired color
          //     .attr("r", nodeRadius) // Optionally, increase the node size
          //     .transition()
          //     .duration(400); // Transition duration in milliseconds

          //   // Change the color of the links directly connected to the hovered node
          //   link
          //     .transition()
          //     .duration(400)
          //     .attr("stroke", (linkData) => {
          //       if (linkData.source === d || linkData.target === d) {
          //         return linkStroke; // Change to your desired link color
          //       } else {
          //         return linkStroke;
          //       }
          //     });

          //   // Reduce the opacity of nodes that are not directly connected
          //   node
          //     .transition()
          //     .duration(600)
          //     .attr("fill-opacity", (nodeData) => {
          //       if (nodeData === d) {
          //         return 1; // Opacity of the hovered node
          //       } else if (areNodesConnected(nodeData, d)) {
          //         return 1; // Opacity of directly connected nodes
          //       } else {
          //         return 0.1; // Opacity of other nodes
          //       }
          //     });

          //   // Reduce the opacity of links that are not directly connected
          //   link
          //     .transition()
          //     .duration(600)
          //     .attr("stroke-opacity", (linkData) => {
          //       if (linkData.source === d || linkData.target === d) {
          //         return 1; // Opacity of links directly connected to the hovered node
          //       } else {
          //         return 0; // Opacity of other links
          //       }
          //     });

          //   console.log("Hovered Nodes:", hoveredNodes);
          // }

          function handleMouseOver(this: any, event: any, d: any) {
            // Set the initial state before transitioning
            d3.select(this as SVGElement)
              .attr("fill", "red") // Change to your desired color
              .attr("r", nodeRadius * 1.2) // Optionally, increase the node size
              .attr("fill-opacity", 1); // Set initial opacity to 1

            // Initialize the links with their original stroke color and opacity
            link
              .attr("stroke", (linkData) => {
                if (linkData.source === d || linkData.target === d) {
                  return linkStroke; // Original link color
                } else {
                  return linkStroke;
                }
              })
              .attr("stroke-opacity", linkStrokeOpacity);

            // Initialize the nodes with their original fill color and opacity
            node
              .attr("fill", (nodeData) => {
                if (nodeData === d) {
                  return "red"; // Original node color
                } else {
                  return nodeFill;
                }
              })
              .attr("fill-opacity", (nodeData) => {
                if (nodeData === d) {
                  return 1; // Opacity of the hovered node
                } else if (areNodesConnected(nodeData, d)) {
                  return 1; // Opacity of directly connected nodes
                } else {
                  return 0.1; // Opacity of other nodes
                }
              });

            // Start the transition
            d3.select(this as SVGElement)
              .transition()
              .duration(400) // Transition duration in milliseconds
              .attr("r", nodeRadius); // Optionally, increase the node size

            // Change the color of the links directly connected to the hovered node
            link
              .transition()
              .duration(400)
              .attr("stroke", (linkData) => {
                if (linkData.source === d || linkData.target === d) {
                  return "red"; // Change to your desired link color
                } else {
                  return linkStroke;
                }
              });

            // Transition to reduce the opacity of nodes that are not directly connected
            node
              .transition()
              .duration(600)
              .attr("fill-opacity", (nodeData) => {
                if (nodeData === d) {
                  return 1; // Opacity of the hovered node
                } else if (areNodesConnected(nodeData, d)) {
                  return 1; // Opacity of directly connected nodes
                } else {
                  return 0.1; // Opacity of other nodes
                }
              });

            // Transition to reduce the opacity of links that are not directly connected
            link
              .transition()
              .duration(600)
              .attr("stroke-opacity", (linkData) => {
                if (linkData.source === d || linkData.target === d) {
                  return 1; // Opacity of links directly connected to the hovered node
                } else {
                  return 0; // Opacity of other links
                }
              });

            // console.log("Hovered Nodes:", hoveredNodes);
          }

          function handleMouseOut(this: any) {
            d3.select(this)
              .attr("fill", nodeFill) // Reset to the original node color
              .attr("r", nodeRadius) // Reset to the original node size
              .transition()
              .duration(400) // Transition duration in milliseconds
              .attr("fill-opacity", 1); // Reset opacity

            // Reset the color and opacity of all links to their original values with a transition
            link
              .transition()
              .duration(400)
              .attr("stroke", linkStroke)
              .attr("stroke-opacity", linkStrokeOpacity);

            // Reset the opacity of all nodes to their original value with a transition
            node.transition().duration(200).attr("fill-opacity", 1);
          }

          function areNodesConnected(node1: any, node2: any) {
            // Check if two nodes are directly connected through a link
            return links.some((linkData: any) => {
              return (
                (linkData.source === node1 && linkData.target === node2) ||
                (linkData.source === node2 && linkData.target === node1)
              );
            });
          }

          function drag(simulation: any) {
            function dragstarted(event: any) {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              event.subject.fx = event.subject.x;
              event.subject.fy = event.subject.y;
            }

            function dragged(event: any) {
              event.subject.fx = event.x;
              event.subject.fy = event.y;
            }

            function dragended(event: any) {
              if (!event.active) simulation.alphaTarget(0);
              event.subject.fx = null;
              event.subject.fy = null;
            }

            return d3
              .drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended);
          }
          console.log("svg", svg);
          const svgElement = svg.node() as SVGSVGElement; // Cast svg.node() to SVGSVGElement
          const result = {
            scales: { color },
            svg: svgElement, // Assign the SVG element
          };

          return result;

          // return Object.assign(svg.node(), { scales: { color } });
        }

        const options: any = {
          nodeFill: "blue",
          nodeStroke: "blue",
          width: graphWidth,
          height: graphHeight,
        };
        console.log("graphNewData: ", graphNewData);

        let svgResult: any = ForceGraph(graphNewData, options);
        console.log("svgResult", svgResult);

        const graphDiv = document.getElementById("graph-div");

        if (graphDiv) {
          graphDiv.appendChild(svgResult.svg);
        }
      }, 400);

      // setTimeout(() => {
      //   const graphDiv: any = document.getElementById("graph-div");
      //   const divWidth = graphDiv.offsetWidth;
      //   const divHeight = graphDiv.offsetHeight;
      //   <ForceGraph2D graphData={formattedGraphData} />;
      //   // console.log(myGraph);
      // }, 400);

      // setTimeout(() => {
      //   const graphDiv: any = document.getElementById("graph-div");
      //   const divWidth = graphDiv.offsetWidth;
      //   const divHeight = graphDiv.offsetHeight;

      //   const myGraph = ForceGraph();
      //   let forceGraph = myGraph(graphDiv)
      //     .graphData(formattedGraphData)
      //     .width(divWidth)
      //     .height(divHeight)
      //     .backgroundColor("#F4F4F4")
      //     .nodeRelSize(4)
      //     .onNodeHover((node: any) => {
      //       console.log("Node hovered:", node);
      //       if (node === null) {
      //         const graphData = forceGraph.graphData();
      //         console.log("graphData:", graphData);
      //         const links = graphData.links;
      //         const nodes = graphData.nodes;
      //         console.log("Links:", links);
      //         console.log("nodes", nodes);
      //         nodes.forEach((node: any) => {
      //           node.color = "#3082B9";
      //         });
      //       } else {
      //         const neighbors = new Set(
      //           formattedGraphData.links
      //             .filter(
      //               (link: any) => link.source === node || link.target === node
      //             )
      //             .map((link: any) =>
      //               link.source === node ? link.target : link.source
      //             )
      //         );
      //         const neighborsArray = Array.from(neighbors);
      //         const neighborIds = neighborsArray.map((neighbor) => neighbor.id); // Extracting only the id values
      //         neighborIds.push(node.id);
      //         console.log("neighborsIds", neighborIds);
      //         const graphData = forceGraph.graphData();
      //         console.log("graphData:", graphData);
      //         const links = graphData.links;

      //         console.log("Links:", links);

      //         // const filteredLinks = links.filter((link: any) => {
      //         //   const sourceId = link.source.id;
      //         //   const targetId = link.target.id;

      //         //   return (
      //         //     !neighborIds.includes(sourceId) &&
      //         //     !neighborIds.includes(targetId)
      //         //   );
      //         // });

      //         // console.log("filteredLinks", filteredLinks);

      //         const nodes = graphData.nodes;
      //         console.log("nodes", nodes);

      //         nodes.forEach((node: any) => {
      //           if (!neighborIds.includes(node.id)) {
      //             // console.log("nodeid", node.id);
      //             node.color = "#605C5C";
      //           }
      //         });

      //         // Refresh the graph to apply the color changes
      //         // forceGraph.graphData(graphData);
      //       }
      //     });
      // }, 400);
    }
  };

  const removeSearchResult = (resultToRemove: any) => {
    // console.log("search Results: ", searchResults, resultToRemove);
    const newResult = searchResults.filter(
      (result) => result.fileName !== resultToRemove.fileName
    );
    // console.log("newResult:  ", newResult);
    setSearchResults(newResult);
  };

  const openSearchResult = (resultToOpen: any) => {
    // console.log("resultToOpen: ", resultToOpen);
    let matchingFile: any = searchResults.find(
      (file: any) => file.fileName === resultToOpen.fileName
    );

    marked.setOptions({
      breaks: true,
    });

    matchingFile.content = marked(matchingFile.content);
    // console.log("markedContent", matchingFile);

    const regex = /\[\[([^[\]]+)\]\]/g;
    const hashtagParagraphRegex = /<p>#.*?<\/p>/g;
    if (matchingFile) {
      const contentWithoutHashtags = matchingFile.content.replace(
        hashtagParagraphRegex,
        ""
      );
      // console.log("contentWithoutHashtags", contentWithoutHashtags);

      const contentWithStyledWords = contentWithoutHashtags.replace(
        regex,
        (match: any, word: any) =>
          `<span style="text-decoration: underline; cursor: pointer;">${word}</span>`
      );
      // console.log("contentwithstyledwords", contentWithStyledWords);

      const updatedResultToOpen = {
        ...resultToOpen,
        content: contentWithStyledWords,
        openedFromResults: true,
      };

      const doesExist = openedResults.some(
        (result) => result.fileName === updatedResultToOpen.fileName
      );

      if (!doesExist) {
        const updatedOpenedResults = [...openedResults, updatedResultToOpen];
        setOpenedResults(updatedOpenedResults);
      } else {
        console.log("An object with the same fileName already exists.");
      }

      // scroll to where the file is opened
      setTimeout(() => {
        const divElements = document.querySelectorAll(".opened-results");
        // console.log("divElement", divElements);
        divElements.forEach((div: any) => {
          const h4Elements = div.querySelectorAll("h4");
          h4Elements.forEach((h4: any) => {
            if (h4.textContent === resultToOpen.fileName.toUpperCase()) {
              div.classList.add("highlighted-heading");
              h4.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "center",
              });

              setTimeout(() => {
                div.classList.remove("highlighted-heading");
              }, 1500);
            }

            // const openedResultsDivs =
            //   document.querySelectorAll(".opened-results");

            // openedResultsDivs.forEach((div:any) => {
            //   const h4Element = div.querySelector("h4");
            //   if (h4Element && h4Element.textContent === "taimoor") {
            //     div.classList.add("your-desired-class");
            //   }
            // });
          });
        });
      }, 10);
    }
  };

  const collapseOpenedResult = (resultToCollapse: any) => {
    // console.log("resultToCollapse", resultToCollapse);
    const collapsedResult = openedResults.filter(
      (item: any) => item.fileName !== resultToCollapse.fileName
    );
    setOpenedResults(collapsedResult);
  };

  const removeBothSearchResults = (resultToRemove: any) => {
    console.log("resultToRemove", resultToRemove);
    collapseOpenedResult(resultToRemove);
    removeSearchResult(resultToRemove);
    console.log("searchValue: ", searchValue);

    const updatedSearchValue = `${searchValue} -"${resultToRemove.fileName}"`;

    console.log("updatedSearchValue", updatedSearchValue);
    setSearchValue(updatedSearchValue);
  };

  const handleLinkClick = async (
    linkClickedFromFile: any,
    linkClicked: any
  ) => {
    // console.log("linkClickedFromFile: ", linkClickedFromFile);
    // console.log("linkClicked: ", linkClicked);
    try {
      const response = await fetch(`/api/linkFile?q=${linkClicked}`);
      const newDataObject = await response.json();
      // console.log("responseJson: ", responseJson);

      // console.log("newDataObject", newDataObject);
      marked.setOptions({
        breaks: true,
      });

      newDataObject.content = marked(newDataObject.content);

      const regex = /\[\[([^[\]]+)\]\]/g;
      const hashtagParagraphRegex = /<p>#.*?<\/p>/g;
      if (newDataObject) {
        console.log("newDataObject", newDataObject);
        const contentWithoutHashtags = newDataObject.content.replace(
          hashtagParagraphRegex,
          ""
        );
        const contentWithStyledWords = contentWithoutHashtags.replace(
          regex,
          (match: any, word: any) =>
            `<span style="text-decoration: underline; cursor: pointer;">${word}</span>`
        );
        // console.log("contentwithstyledword", contentWithStyledWords);

        const index = openedResults.findIndex(
          (item: any) => item.fileName === linkClickedFromFile
        );
        if (index !== -1) {
          const updatedResults = {
            ...newDataObject,
            content: contentWithStyledWords,
            openedFromResults: false,
          };

          const doesExist = openedResults.some(
            (result) => result.fileName === updatedResults.fileName
          );

          if (!doesExist) {
            // Create a copy of the openedResults array
            const updatedOpenedResults = [...openedResults];

            // Insert the updatedResults object at index + 1
            updatedOpenedResults.splice(index + 1, 0, updatedResults);

            // Update the state with the new array
            setOpenedResults(updatedOpenedResults);
          } else {
            const resultsWithRemovedLink = openedResults.filter(
              (item: any) => item.fileName !== updatedResults.fileName
            );
            const index = resultsWithRemovedLink.findIndex(
              (item: any) => item.fileName === linkClickedFromFile
            );

            const updatedOpenedResults = [...resultsWithRemovedLink];

            // Insert the updatedResults object at index + 1
            updatedOpenedResults.splice(index + 1, 0, updatedResults);

            // Update the state with the new array
            setOpenedResults(updatedOpenedResults);
          }

          // scroll to where the file is opened
          setTimeout(() => {
            const divElements = document.querySelectorAll(".view-panel-title");
            // console.log("divElement", divElements);
            divElements.forEach((div: any) => {
              const h4Elements = div.querySelectorAll("h4");
              // console.log("h4", h4Elements);
              h4Elements.forEach((h4: any) => {
                if (h4.textContent === linkClicked.toUpperCase()) {
                  // console.log("h4", h4);
                  h4.classList.add("highlighted-heading");
                  h4.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "center",
                  });
                  setTimeout(() => {
                    h4.classList.remove("highlighted-heading");
                  }, 3000);
                }
              });
            });
          }, 10);
        }
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div>
      <div className="side-nav">
        <div className={"logoVc"}>
          <div>
            <p>TCM Weaver</p>
          </div>
          <div className={"icon-profile"}>
            <div className={"themeChanger"}>
              {themeChangericon ? (
                <img
                  src="/dark-mode.png"
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
            <div>
              {graphOrTextView ? (
                <div className={"simpleIcon"}>
                  <img
                    src="/graph-logo.png"
                    alt="img"
                    onClick={() => {
                      handleGraphOrTextView();
                    }}
                  />
                </div>
              ) : (
                <div className={"note-icon"}>
                  <img
                    src="/text-logo.png"
                    alt="img"
                    onClick={() => {
                      handleGraphOrTextView();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
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
                      <div className="results-title">
                        <span>
                          {(result as { wordOccurence: number }).wordOccurence}
                        </span>

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
                      </div>

                      <img
                        src="xmark.png"
                        alt="img"
                        className="remove-search-result"
                        onClick={() => removeBothSearchResults(result)}
                      />
                    </div>
                    <div>
                      <div>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: (
                              result as {
                                contentWithHighlightedWords: string;
                              }
                            ).contentWithHighlightedWords,
                          }}
                          className="note"
                        />
                      </div>
                      <div>
                        <img
                          src="arrow-right.png"
                          alt="img"
                          className="remove-search-result"
                          onClick={() => openSearchResult(result)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="menus">
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
        {/* <div className="height-check">

        </div> */}
      </div>

      {graphOrTextView ? (
        <div className="main">
          {openedResults.length > 0 ? (
            openedResults.map((result, index) => (
              <div key={index} className="opened-results">
                {/* Render your result content here */}
                <div className="view-panel-title">
                  <h4>{result.fileName.toUpperCase()}</h4>
                  {result.openedFromResults ? (
                    <div className="view-panel-title-icons">
                      <img
                        src="/arrow-left.png"
                        alt="img"
                        onClick={() => collapseOpenedResult(result)}
                      />
                      <img
                        src="/xmark.png"
                        alt="img"
                        onClick={() => removeBothSearchResults(result)}
                      />
                    </div>
                  ) : (
                    <div>
                      <img
                        src="/collapse.png"
                        alt="img"
                        onClick={() => collapseOpenedResult(result)}
                        className="link-collapse-icon"
                      />
                    </div>
                  )}
                </div>

                <div className="opened-result-detail">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: result.content,
                    }}
                    className="opened-result-description"
                    onClick={(e: any) => {
                      if (
                        e.target.tagName === "SPAN" &&
                        e.target.style.textDecoration === "underline"
                      ) {
                        const clickedWord = e.target.textContent; // Get the clicked word
                        handleLinkClick(result.fileName, clickedWord);
                      }
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p style={{ padding: "16px" }}>No results are open.</p>
          )}
        </div>
      ) : (
        <div className="graph-container">
          <div id="graph-div" className="graph-div"></div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
