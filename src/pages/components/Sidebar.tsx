import React, { useEffect, useRef, useState } from "react";
import { Fzf, FzfOptions } from "fzf";
import _ from "lodash";
import Accordion from "react-bootstrap/Accordion";
import { marked } from "marked";
import * as d3 from "d3";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Grid, IconButton, InputAdornment, List, ListItem, ListItemText, Slider, TextField } from "@mui/material";
import * as Helpers from '../../util/Helpers'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux'
import { stAccessTokenVerify } from '../../store/apps/auth'
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from '@mui/material/CircularProgress';
import WorkspaceContent from "./WorkspaceContent";
import TemporaryDrawer from "./RightModal";
import UnstyledTextareaIntroduction from "./contactSupport";


var internalId: any = 0
let controller: any




const Sidebar = () => {

  const dispatch = useDispatch()
  const getStAuth = useSelector((state: any) => state.stAuth)

  const router = useRouter();

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
    totalMarkedData: string;
  }

  interface OpenedResult {
    openedFromResults: any;
    fileName: string;
    content: string;
    contentWithRemovedBrackets: string;
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
  const [graphSearchValue, setGraphSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  // const [checkboxes, setCheckboxes] = useState([]);
  const [allCheckboxes, setAllCheckboxes] = useState([]);
  const [shouldShowFilters, setShouldShowFilters] = useState(true);
  const [themeChangericon, setThemeChangerIcon] = useState<any>()
  const [graphOrTextView, setgraphOrTextView] = useState(true);
  const [openedResults, setOpenedResults] = useState<OpenedResult[]>([]);
  const [openedResultsRawData, setOpenedResultsRawData] = useState<any>([])
  const [isCopied, setIsCopied] = useState(false);
  const [filtersData, setFiltersData] = useState<any>([]);
  const [graphData, setGraphData] = useState<any>([]);
  const [fileOpenedFromGraph, setFileOpenedFromGraph] = useState<any>({});
  const [hideFiltersForPreview, sethideFiltersForPreview] = useState(true);
  const [graphNodeOpened, setGraphNodeOpened] = useState<any>([]);
  const [textColorForNode, setTextColorForNode] = useState<any>()
  const [graphLinkColor, setGraphLinkColor] = useState<any>()
  const [nodeTextSize, setNodeTextSize] = useState<any>(8)
  const [centerForceValue, setCenterForceValue] = useState(1)
  const [sliderValue, setSliderValue] = useState(-30)
  const [linkForceValue, setLinkForceValue] = useState(0.2)
  const [accessToken, setAccessToken] = useState('');
  const [syncPopup, setSyncPopup] = useState(false);
  const [folders, setFolders] = useState([]);
  const [foldersPopup, setFoldersPopup] = useState(false);
  const [showAccountOptions, setShowAccountOptions] = useState(false);
  const [getUser, setUser] = useState<any>({})
  const [getPermissions, setPermissions] = useState([])
  const [userLogoutPopup, setUserLogoutPopup] = useState(false)
  const [showEditUserDialog, setShowEditUserDialog] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'User',
    status: '',
    image: ''
  });
  const [editUserLoader, setEditUserLoader] = useState(false)
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false)
  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showSetPasswordToggle, setShowSetPasswordToggle] = useState(false)
  const [showConfirmPasswordToggle, setShowConfirmPasswordToggle] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [updatePasswordLoader, setUpdatePasswordLoader] = useState<any>(false)
  const [homepageFile, setHomepageFile] = useState<any>([])
  const [getPackage, setPackage] = useState([])
  // const [selectedVaultOption, setSelectedVaultOption] = useState('Basic Vault');
  const [showLockedVaultPopup, setShowLockedVaultPopup] = useState(false)
  const [userAccessVaults, setUserAccessVaults] = useState<any>([])
  const accountOptionsRef = useRef<any>(null);
  const usersIconRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);
  const [billingLoader, setBillingLoader] = useState(false)
  const [previewNodeLinkLoader, setPreviewNodeLinkLoader] = useState<any>(false)
  const [animationKey, setAnimationKey] = useState(0);
  const [showAddGraphNodeColor, setShowAddGraphNodeColor] = useState<any>([])
  const [nodeColorRemoveCheck, setNodeColorRemoveCheck] = useState<any>('')
  const [rawSearchResults, setRawSearchResults] = useState<any>([])
  const [textSearchLoader, setTextSearchLoader] = useState<any>(false)
  const [graphSearchLoader, setGraphSearchLoader] = useState<any>(false)
  const [graphSize, setGraphSize] = useState({ width: 640, height: 400 });
  const [checkGraphStatus, setCheckGraphStatus] = useState<any>(false)
  const [previousGraphData, setPreviousGraphData] = useState<any>({})
  const [graphSearchWordsArray, setGraphSearchWordsArray] = useState<any>([])
  const [graphResizeChecker, setGraphResizeChecker] = useState<any>(false)
  const [graphFiltersName, setGraphFiltersName] = useState<any>([])
  const [graphTagFilters, setGraphTagFilters] = useState<any>([])
  const [showGraphFilters, setShowGraphFilters] = useState<any>(false)
  const [graphDataAfterFilters, setGraphDataAfterFilters] = useState<any>([])
  const [linkClickLoader, setLinkClickLoader] = useState<boolean>(false)
  const [linkClickedId, setLinkClickedId] = useState('')
  const [nodeSizeChangeChecker, setNodeSizeChangeChecker] = useState(true)
  const [showSearchResultsFound, setShowSearchResultsFound] = useState(false)
  const [showContactSupportToast, setShowContactSupportToast] = useState(false)
  const [contactSupportLoader, setContactSupportLoader] = useState(false)
  const [contactSupportMessage, setContactSupportMessage] = useState('')
  const [linkClickFromFile, setLinkClickFromFile] = useState('')

  // console.log("filesData: ", filesData);
  // console.log("filters file data: ", filtersFileData);
  // console.log("checkboxes: ", checkboxes);
  // console.log("searchResults", searchResults);
  // console.log("allCheckboxes: ", allCheckboxes);
  // console.log('themeChangeicon' , themeChangericon)
  // console.log("openedResults: ", openedResults.length, openedResults);
  // console.log("filtersData: ", filtersData);
  // console.log("graphData: ", graphData);
  // console.log('graphDataAfterFilters', graphDataAfterFilters)
  // console.log("searchValue: ", searchValue);
  // console.log("fileopenedfromgraph", fileOpenedFromGraph);
  // console.log("graphNodeOpened", graphNodeOpened);
  // console.log('userEmail ', userEmail)
  // console.log('getUser' , getUser)
  // console.log('allVaults' , allVaults)
  // console.log('getpackage' , getPackage)
  // console.log('clickedvault' , clickedVault)
  // console.log('homepagefile', homepageFile)
  // console.log('useraccessvaults' , userAccessVaults)
  // console.log('showaddgraphnodecolor' , showAddGraphNodeColor)
  // console.log('slidervalue', sliderValue)
  // console.log('shouldShowFilters' , shouldShowFilters)
  // console.log('searchResults' , searchResults.length)
  // console.log('textColorForNode',textColorForNode)
  // console.log('previousGraphData' , previousGraphData)
  // console.log('checkGraphStatus', checkGraphStatus)
  // console.log('graphsize' , graphSize)
  // console.log('graphTagFilters' , graphTagFilters)
  // console.log('showSearchResultToast',showSearchResultToast)
  // console.log('rawSearchResults' , rawSearchResults)
  // console.log('search value' , searchValue)
  // console.log('hideFiltersForPreview',hideFiltersForPreview)
  // console.log('contactSupportMessage', contactSupportMessage)
  // console.log('nodeTextSize', nodeTextSize)
  // console.log('centerForceValue', centerForceValue)




  // Check to see if this is a redirect back from Checkout
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query) {
      const sessionId = query.get('session_id');
      if (query.get('success')) {
        toast("Payment successful", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          type: "success",
          theme: "light",
        });
      }

      if (query.get('canceled')) {
        toast("Payment failed", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          type: "error",
          theme: "light",
        });
      }

      router.replace({
        pathname: router.pathname,
        query: {},
      }, undefined, { shallow: true });
    }
  }, []);


  // Api Call to get home, filters, nodeColors , synonyms
  useEffect(() => {
    const fetchFilesData = async () => {
      try {
        const response = await fetch("/api");
        if (!response.ok) {
          throw new Error("Failed to fetch filters, home , nodeColors , synonyms");
        } else {
          let data = await response.json();

          marked.setOptions({
            breaks: true,
            headerIds: false,
            mangle: false
          });

          let homepageFile = _.cloneDeep(data);

          homepageFile.homeObjects[0].content = homepageFile.homeObjects[0].content.replace(/\n(?=\n)/g, "\n\n<br/>\n")
          const markedHomeObjects = homepageFile.homeObjects.map((obj: any) => ({
            ...obj,
            content: marked(obj.content),
          }));

          setHomepageFile(markedHomeObjects[0])


          const markedFilterObjects = homepageFile.filterObjects.map((obj: any) => ({
            ...obj,
            content: marked(obj.content),
          }));


          setFiltersData(markedFilterObjects[0])


          // separating data and filters file

          // commenting this to check 
          // const filtersFile = data.filter(
          //   (item: any) => item.fileName !== "SAMPLE FILTERS"
          // );
          // setFilesData(filtersFile);

          // console.log(data)
          let filteredData = data.filterObjects.filter((obj: any) => obj.filename.toLowerCase().includes('filter'));

          filteredData = filteredData[0].content
            .split("\n")
            .filter((word: any) => word.trim() !== "");


          const trimmedData = filteredData.map((item: any) => item.trim());


          setFiltersFileData(trimmedData);
          // console.log('trimmedData', trimmedData)

          const categories: any = [];
          let currentCategories = null;

          for (const item of trimmedData) {
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

          // doing this to filter the tag filters in graph view
          let filterToExcludeInGraph: any = []
          for (let i = 0; i < trimmedData.length - 1; i++) {
            if (trimmedData[i].startsWith("# ") && trimmedData[i + 1].startsWith("#")) {
              filterToExcludeInGraph.push(trimmedData[i].split(" ")[1])
            }
          }

          setGraphFiltersName(filterToExcludeInGraph)

          // saperating tag filters for graph
          let tagFiltersForGraph: any = []
          let currentCategoriesForGraph = null;
          for (let i = 0; i < trimmedData.length; i++) {
            if (trimmedData[i].startsWith("# ") && trimmedData[i].length > 2 && trimmedData[i + 1].startsWith("#")) {
              currentCategoriesForGraph = trimmedData[i].slice(2);
              tagFiltersForGraph.push({
                category: currentCategoriesForGraph,
                items: [],
              });
            } else if (currentCategoriesForGraph) {
              if (/^#\S/.test(trimmedData[i])) {
                const categoryIndex = tagFiltersForGraph.length - 1;
                tagFiltersForGraph[categoryIndex].items.push({
                  id: tagFiltersForGraph[categoryIndex].items.length + 1,
                  state: "unchecked",
                  status: "neutral",
                  value: trimmedData[i],
                });
              }
            }
          }

          setGraphTagFilters(tagFiltersForGraph)


        }
      } catch (error) {
        console.error("Error fetching files data:", error);
      }
    };

    const fetchNodeColors = async () => {
      await axios.get(`/api/nodeColors`)
        .then((res: any) => {
          // console.log('res from fetching node colors' , res.data.nodeColors)

          const regex = /# (Dark Mode|Light Mode) Graph Nodes:[\s\S]*?(?=# (Dark Mode|Light Mode)|$)/g;

          // Extract matches from content
          const matches = [];
          let match;
          while ((match = regex.exec(res.data.nodeColors[0].content)) !== null) {
            const mode = match[1].toLowerCase();
            const content = match[0];

            // Regular expression to match tags and colors within each mode
            const modeRegex = /# (\S+) \n([\S]+)/g;

            // Extract matches for tags and colors within each mode
            const modeMatches = [];
            let modeMatch;
            while ((modeMatch = modeRegex.exec(content)) !== null) {
              const tag = modeMatch[1].replace(/^#/, '');
              const color = `#${modeMatch[2]}`;
              modeMatches.push({ tag, color });
            }

            // Add the mode-specific matches to the main array
            matches.push({ mode, data: modeMatches });
          }

          setShowAddGraphNodeColor(matches)
          // console.log(matches);

        })
        .catch((err: any) => {
          console.log('Error fetching node colors', err)
        })

    }

    fetchFilesData()
    fetchNodeColors()

  }, []);


  // close user options dropdown
  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        accountOptionsRef.current &&
        !accountOptionsRef.current.contains(event.target) &&
        usersIconRef.current &&
        !usersIconRef.current.contains(event.target)
      ) {
        setShowAccountOptions(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);


  useEffect(() => {
    const getInit = () => {
      setUser(getStAuth.stAccessTokenVerify)
      setPermissions(getStAuth.stAccessTokenVerify.user_permissions)
      setPackage(getStAuth.stAccessTokenVerify.user_package)
      const userVaultsAccess = getStAuth.stAccessTokenVerify.user_vaultsAccess || [];

      setUserAccessVaults(userVaultsAccess.map((vault: any) => vault.tableName));

      // console.log('stAccessTokenVerify1=',getStAuth.stAccessTokenVerify.user_vaultsAccess)
    }

    getInit()
  }, [getUser, getPermissions, getStAuth]);


  // call graph on changing theme
  useEffect(() => {
    let element: any;

    if (window.innerWidth <= 575) {
      element = document.getElementById("graph-div-mobile");
    } else {
      element = document.getElementById("graph-div");
    }
    if (element && element.children) {
      const hasSvg = Array.from(element.children).some((child: any) => child.tagName.toLowerCase() === 'svg');
      if (hasSvg) {
        const newWidth = element.offsetWidth;
        const newHeight = element.offsetHeight;
        setGraphResizeChecker(true)
        setGraphSize({ width: newWidth, height: newHeight });
      }
    }
  }, [graphLinkColor])

  // set graph width and height on resize
  useEffect(() => {
    const updateGraphSize = () => {
      let element: any;

      if (window.innerWidth <= 575) { // Adjust the threshold according to your design
        element = document.getElementById("graph-div-mobile");
      } else {
        element = document.getElementById("graph-div");
      }

      if (element) {
        const newWidth = element.offsetWidth;
        const newHeight = element.offsetHeight;

        setGraphSize({ width: newWidth, height: newHeight });
      }
    };

    updateGraphSize();

    // Add event listeners or other mechanisms to update size on window resize, etc.
    window.addEventListener('resize', updateGraphSize);

    // Clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener('resize', updateGraphSize);
    };
  }, []);


  // make graph on theme change & resizing screen
  useEffect(() => {
    if (!graphOrTextView) {
      if (graphData && typeof graphData === 'object' && !Array.isArray(graphData)) {
        handleGraphForces(graphDataAfterFilters, 'resizeScreen')
      }
    }
  }, [graphSize])


  // setting theme icon, text color for node, graph link color on theme change
  useEffect(() => {
    const storedTheme: any = localStorage.getItem('theme');
    const checkTheme = JSON.parse(storedTheme)
    setThemeChangerIcon(storedTheme ? JSON.parse(storedTheme) : false);
    setTextColorForNode(checkTheme ? '#6C655C' : '#B3B3B5')
    setGraphLinkColor(checkTheme ? '#CFCCC7' : '#565959')
  }, []);


  useEffect(() => {
    if (!graphOrTextView) {
      if (graphData && typeof graphData === 'object' && !Array.isArray(graphData)) {
        // setGraphResizeChecker(false)
        // setNodeSizeChangeChecker(false)
        // console.log('nodetextsize ', nodeTextSize)
        handleGraphForces(graphDataAfterFilters, 'nodeTextChange')
      }
    }
  }, [nodeTextSize])


  useEffect(() => {
    if (!graphOrTextView) {
      if (graphData && typeof graphData === 'object' && !Array.isArray(graphData)) {

        // const updateGraphSize = () => {
        //   let element: any;

        //   if (window.innerWidth <= 575) { // Adjust the threshold according to your design
        //     element = document.getElementById("graph-div-mobile");
        //   } else {
        //     element = document.getElementById("graph-div");
        //   }
        //   if (element) {
        //     const newWidth = element.offsetWidth;
        //     const newHeight = element.offsetHeight;

        //     setGraphSize({ width: newWidth, height: newHeight });
        //   }
        // };

        // updateGraphSize();

        setGraphResizeChecker(false)
        setNodeSizeChangeChecker(true)
        handleGraphForces(graphDataAfterFilters, 'sliderChange')
      }
    }
  }, [centerForceValue])


  useEffect(() => {
    if (!graphOrTextView) {
      if (graphData && typeof graphData === 'object' && !Array.isArray(graphData)) {
        const updateGraphSize = () => {
          let element: any;

          if (window.innerWidth <= 575) { // Adjust the threshold according to your design
            element = document.getElementById("graph-div-mobile");
          } else {
            element = document.getElementById("graph-div");
          }
          if (element) {
            const newWidth = element.offsetWidth;
            const newHeight = element.offsetHeight;

            setGraphSize({ width: newWidth, height: newHeight });
          }
        };

        // updateGraphSize();
        setGraphResizeChecker(false)
        setNodeSizeChangeChecker(true)
        handleGraphForces(graphDataAfterFilters, 'sliderChange')
      }
    }
  }, [linkForceValue])


  useEffect(() => {
    if (!graphOrTextView) {
      if (graphData && typeof graphData === 'object' && !Array.isArray(graphData)) {
        const updateGraphSize = () => {
          let element: any;

          if (window.innerWidth <= 575) { // Adjust the threshold according to your design
            element = document.getElementById("graph-div-mobile");
          } else {
            element = document.getElementById("graph-div");
          }
          if (element) {
            const newWidth = element.offsetWidth;
            const newHeight = element.offsetHeight;

            setGraphSize({ width: newWidth, height: newHeight });
          }
        };

        // updateGraphSize();
        setGraphResizeChecker(false)
        setNodeSizeChangeChecker(true)
        handleGraphForces(graphDataAfterFilters, 'sliderChange')
      }
    }
  }, [sliderValue])


  useEffect(() => {
    if (nodeColorRemoveCheck !== '') {

      const tagExists = graphData.nodes.some((node: any) => node.tag === nodeColorRemoveCheck);

      if (tagExists) {
        makeGraph(graphData);
      }
    }

    setNodeColorRemoveCheck('')

    // if (showAddGraphNodeColor.source === 'handleRemoveNodeColor') {
    //   console.log('Updated showAddGraphNodeColor:', showAddGraphNodeColor);
    // }
    // Perform any additional actions or checks here

    // Call makeGraph whenever showAddGraphNodeColor changes
    // makeGraph(graphData);

  }, [showAddGraphNodeColor]);



  const searchBarFormation = async (event: any) => {
    const inputValue = event.target.value;

    if (graphOrTextView) {
      setSearchValue(inputValue);
    } else {
      setGraphSearchValue(inputValue);
    }


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

    const wordsArray = (wordToSearch.match(/(-?)"([^"]*)"|\S+/g) || []).map(
      (match: any) => match.replace(/^(-?)"([^"]*)"$/, "$1$2")
    );

    return { wordToSearch, wordsArray };
  }


  const searchSecondPart = async (wordsArray: any, wordToSearch: any) => {
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

    // console.log("word to search", wordToSearch);

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

    if (internalId) {
      clearTimeout(internalId);
    }

    if (typeof controller != typeof undefined) {
      controller.abort()
    }

    controller = new AbortController()

    internalId = setTimeout(async () => {
      try {
        (graphOrTextView ? setTextSearchLoader(true) : setGraphSearchLoader(true));


        const tableNamesStr = userAccessVaults.join(',');
        const encodedWords = encodeURIComponent(wordsArray.join(","));
        !graphOrTextView && setGraphSearchWordsArray(encodedWords);
        responseJson = await axios.get(`/api/search?q=${encodedWords}&AccessVaults=${tableNamesStr}`, {
          signal: controller.signal,
        });


        const copySearchResults = _.cloneDeep(responseJson.data);
        setRawSearchResults(copySearchResults);
        // console.log('copySearchResults',copySearchResults)

        newEntries = _.cloneDeep(responseJson.data)
        // console.log('newentries' , newEntries)

        // Remove Brackets and Calculate Occurence of Words
        removeBrackets(newEntries, wordToSearch);

        highlightSearchWord(newEntries, wordToSearch);

        markAllData(newEntries, wordToSearch)



        newEntries = newEntries.slice().sort((a: any, b: any) => b.wordOccurence - a.wordOccurence);

        // console.log("newEntries: ", newEntries);

        setSearchResults(newEntries);
        (graphOrTextView ? setTextSearchLoader(false) : setGraphSearchLoader(false));
        setShowSearchResultsFound(true)
        // setShowSearchResultToast(true)
        // setTimeout(() => {
        // setShowSearchResultToast(false)
        // }, 2200)

        // console.log(responseJson.data);
        // console.log('responseJson' , responseJson)
        // responseJson = await response.json();
        // console.log("responseJson: ", responseJson);
      } catch (error) {
        (graphOrTextView ? setTextSearchLoader(false) : setGraphSearchLoader(false));
        setShowSearchResultsFound(true)
        console.log("Error fetching search results:", error);
      }
    }, 400);

  }


  const handleSearch = async (event: any) => {
    setShowSearchResultsFound(false)

    let { wordToSearch, wordsArray } = await searchBarFormation(event)


    // console.log("words array: ", wordsArray);

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
              // console.log("item: ", item);

              // console.log(`Word: ${word}`);
              // console.log(`Category: ${categoryTitle}`);
              // console.log(`Item ID: ${itemId}`);
            }
          }
        }
      } else if (!word.startsWith("-")) {
        // console.log('inside wordsArray else')
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

    searchSecondPart(wordsArray, wordToSearch)



  };


  const handleSearchFromFilters = async (event: any) => {
    setShowSearchResultsFound(false)

    let { wordToSearch, wordsArray } = await searchBarFormation(event)


    // console.log("words array: ", wordsArray);

    //changing filter status for each word in search bar
    // wordsArray.forEach((word: any) => {
    //   if (word.startsWith("-")) {
    //     word = word.replace("-", "");
    //     for (const category of allCheckboxes as any[]) {
    //       for (const item of category.items) {
    //         if (item.value.toLowerCase() === word.toLowerCase()) {
    //           const categoryTitle = category.category;
    //           const itemId = item.id;
    //           item.state = "checked";
    //           item.status = "exclude";
    //           console.log("item: ", item);

    //           console.log(`Word: ${word}`);
    //           console.log(`Category: ${categoryTitle}`);
    //           console.log(`Item ID: ${itemId}`);
    //         }
    //       }
    //     }
    //   } else if (!word.startsWith("-")) {
    //     console.log('inside wordsArray else')
    //     for (const category of allCheckboxes as any[]) {
    //       for (const item of category.items) {
    //         console.log("item: ", item);
    //         if (item.value.toLowerCase() === word.toLowerCase()) {
    //           const categoryTitle = category.category;
    //           const itemId = item.id;
    //           item.state = "checked";
    //           item.status = "include";
    //           // console.log("item: ", item);

    //           // console.log(`Word: ${word}`);
    //           // console.log(`Category: ${categoryTitle}`);
    //           // console.log(`Item ID: ${itemId}`);
    //         }
    //       }
    //     }
    //   }

    //   for (const category of allCheckboxes as any[]) {
    //     for (const item of category.items) {
    //       const lowerItemValue = item.value.toLowerCase();
    //       const lowerWordsArray = wordsArray.map((word: any) =>
    //         word.toLowerCase()
    //       );

    //       if (
    //         !lowerWordsArray.includes(lowerItemValue) &&
    //         !lowerWordsArray.includes(`-${lowerItemValue}`)
    //       ) {
    //         item.state = "unchecked";
    //         item.status = "neutral";
    //       }
    //     }
    //   }
    // });

    searchSecondPart(wordsArray, wordToSearch)

  };


  const handleGraphSearch = async (event: any) => {
    setShowSearchResultsFound(false)

    let { wordToSearch, wordsArray } = await searchBarFormation(event)
    // console.log("words array: ", wordsArray);

    //changing filter status for each word in search bar
    wordsArray.forEach((word: any) => {
      if (word.startsWith("-")) {
        word = word.replace("-", "");
        for (const category of allCheckboxes as any[]) {
          for (const item of category.items) {
            if (item.value.toLowerCase() === word.toLowerCase()) {
              const categoryTitle = category.category;
              const itemId = item.id;
              // item.state = "checked";
              // item.status = "exclude";
              // console.log("item: ", item);

              // console.log(`Word: ${word}`);
              // console.log(`Category: ${categoryTitle}`);
              // console.log(`Item ID: ${itemId}`);
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

    searchSecondPart(wordsArray, wordToSearch)
  };


  const handleGraphSearchFromFilters = async (event: any) => {

    setShowSearchResultsFound(false)


    let { wordToSearch, wordsArray } = await searchBarFormation(event)

    searchSecondPart(wordsArray, wordToSearch)
  };


  const generateGraphfromSearch = (searchResultsForGraph: any) => {
    // console.log('searchResultsforGraph' , searchResultsForGraph , graphOrTextView)

    // Graph Search including links
    if (!graphOrTextView && searchResultsForGraph.length > 0) {
      setShouldShowFilters(false);
      const nodes: any = [];
      const links: any = [];
      let tempNodes: any = []
      let count = 0;
      let finalCount = 0;
      const nodeExists = (id: any) => { return nodes.some((node: any) => node.id === id) };

      // Iterate through each object
      if (searchResultsForGraph.length > 0) {
        // console.log("search results for graph: ", searchResultsForGraph);
        // If search bar has words

        // If files are not open in workspace
        // console.log("search Results", searchResults);

        const updatedOpenedResults: any = []
        // console.log('updatedOpenedResults ', updatedOpenedResults)

        const searchResultsForGraphCopy = _.cloneDeep(searchResultsForGraph);

        searchResultsForGraphCopy.forEach((result: any) => {
          let matchingFile: any = result;

          marked.setOptions({
            breaks: true,
          });

          let editedResult = matchingFile.content.replace(/\n(?=\n)/g, "\n\n<br/>\n")
          matchingFile.content = marked(editedResult);



          // matchingFile.content = marked(matchingFile.content);
          // console.log("markedContent", matchingFile);

          const regex = /\[\[([^[\]]+)\]\]/g;
          const hashtagParagraphRegex = /#\S+/g;
          if (matchingFile) {
            // console.log('matching file: ' , matchingFile)
            const contentWithoutHashtags = matchingFile.content.replace(hashtagParagraphRegex, "");
            // console.log("contentWithoutHashtags", contentWithoutHashtags);

            const contentWithStyledWords = contentWithoutHashtags.replace(
              regex, (match: any, word: any) =>
              `<span style="text-decoration: underline; cursor: pointer;">${word}</span>`
            );
            // console.log("contentwithstyledwords", contentWithStyledWords);

            const updatedResultToOpen = {
              ...result,
              content: contentWithStyledWords,
              openedFromResults: true,
            };

            // const doesExist = openedResults.some(
            //   (result) => result.fileName === updatedResultToOpen.fileName
            // );
            const doesExist = updatedOpenedResults.some(
              (result: any) => result.fileName === updatedResultToOpen.fileName
            );

            if (!doesExist) {
              updatedOpenedResults.push(updatedResultToOpen); // Add the updated object to the copy
            } else {
              console.log("An object with the same fileName already exists.");
            }
          }
        });


        finalCount = updatedOpenedResults.length;
        // console.log("updatedOpenedResults: ", updatedOpenedResults);

        updatedOpenedResults.forEach(async (result: any) => {
          const nodeId = result.fileName
          const matches = result.contentWithRemovedBrackets.match(/#(\w+-?\w*)/g);
          // const nodeTag = match ? match[0] : null;
          let nodeTag: any = matches ? matches.map((match: any) => match.substring(1)) : ["tagnotfound"];
          // const cleanedTag = nodeTag.substring(1);
          if (!nodeExists(nodeId)) {
            nodes.push({ id: nodeId, tag: nodeTag });
          }
        })

        updatedOpenedResults.map((result: any) => {
          const nodeId = result.fileName

          const underlinedWords: any = result.content.match(
            /<span[^>]*>(.*?)<\/span>/g
          );

          let wordsArray: any = [];
          if (underlinedWords && Array.isArray(underlinedWords)) {
            wordsArray = underlinedWords.map((span: any) => {
              // Use a regular expression to extract the text content between the <span> tags
              const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
              // Check if a match was found and return the extracted text, or an empty string if not
              return match ? match[1] : "";
            });

            // Now you can use wordsArray safely
          }

          wordsArray.forEach((word: any) => {
            const nodeWithWord = nodes.find((node: any) => node.id === word);

            if (nodeWithWord) {
              if (nodeId !== nodeWithWord.id) {
                // Node with the word exists, update its tag
                links.push({ source: nodeId, target: nodeWithWord.id });
              }
            }
          });
        })

        const resultData: any = { nodes, links }
        // console.log('resultData' , resultData)


        let filteredGraphData: any = []

        // Step 1: Find items with status "exclude" in updatedCheckboxes
        const excludedValues: any = [];
        graphTagFilters.forEach((category: any) => {
          category.items.forEach((item: any) => {
            if (item.status === "exclude") {
              excludedValues.push(item.value.substring(1));
            }
          });
        });

        // Step 2: Find corresponding node ids in graphDataCopy
        const excludedNodeIds: any = [];
        resultData.nodes.forEach((node: any) => {
          const tag = node.tag.map((tagCheck: any) => tagCheck.toLowerCase().replace(/^#/, ''));

          // Check if any of the tags exist in the excludedValues array
          if (tag.some((tagCheck: any) => excludedValues.includes(tagCheck))) {
            excludedNodeIds.push(node.id);
          }
        });

        // console.log('excludedNodeIds',excludedNodeIds)

        // Step 3: Remove links with source or target matching excluded node ids
        filteredGraphData.links = resultData.links.filter((link: any) => {
          return !excludedNodeIds.includes(link.source) && !excludedNodeIds.includes(link.target);
        });

        // Step 4: Remove nodes with ids in excludedNodeIds
        filteredGraphData.nodes = resultData.nodes.filter((node: any) => !excludedNodeIds.includes(node.id));

        console.log('updatedOpenedResults', updatedOpenedResults)
        console.log('excludedNodeIds', excludedNodeIds)


        setTimeout(() => {
          setOpenedResults(updatedOpenedResults)
          setOpenedResultsRawData(updatedOpenedResults)
          setGraphData(resultData);
          setGraphDataAfterFilters(filteredGraphData)
          makeGraph(filteredGraphData);
        }, 200)
      }
    } else {
      console.log('should not be in this else , generateGraphfromSearch ')
      setShouldShowFilters(false);
      const nodes: any = [];
      const links: any = [];
      const resultData: any = { nodes, links };
      // console.log('resultData: ' , resultData)
      // let graphNewData = resultData;
      setGraphData(resultData);
      let graphDiv: any;

      if (window.innerWidth <= 575) {
        graphDiv = document.getElementById("graph-div-mobile");
      } else {
        graphDiv = document.getElementById("graph-div");
      }

      if (graphDiv) {
        const svgElement = graphDiv.querySelector('svg');
        if (svgElement) {
          graphDiv.removeChild(svgElement);
        } else {
          console.log('SVG element not found or already removed. in generateGraphfromSearch function');
        }
      } else {
        console.log('Element with ID "graph-div" not found. in generateGraphfromSearch function ');
      }

      setOpenedResults(searchResultsForGraph);
      setOpenedResultsRawData(searchResultsForGraph)
    }
  };


  const generateGraphfromGraphResult = (searchResultsForGraph: any) => {
    // console.log('searchResultsforGraph' , searchResultsForGraph , graphOrTextView)

    // Graph Search including links
    if (!graphOrTextView && searchResultsForGraph.length > 0) {
      setShouldShowFilters(false);
      const nodes: any = [];
      const links: any = [];
      // let tempNodes: any = []
      // let count = 0;
      // let finalCount = 0;
      const nodeExists = (id: any) => { return nodes.some((node: any) => node.id === id) };

      // Iterate through each object
      if (searchResultsForGraph.length > 0) {

        // console.log('updatedOpenedResults ', updatedOpenedResults)

        const searchResultsForGraphCopy = _.cloneDeep(searchResultsForGraph);
        const updatedOpenedResults: any = searchResultsForGraphCopy

        // searchResultsForGraphCopy.forEach((result:any) => {

        // });

        // finalCount = updatedOpenedResults.length;
        // console.log("updatedOpenedResults: ", updatedOpenedResults);

        searchResultsForGraphCopy.forEach(async (result: any) => {
          const nodeId = result.fileName
          // const match = result.contentWithRemovedBrackets.match(/#(\w+)/);
          const matches = result.contentWithRemovedBrackets.match(/#(\w+-?\w*)/g);
          // const nodeTag = match ? match[0] : null;
          let nodeTag: any = matches ? matches.map((match: any) => match.substring(1)) : ["tagnotfound"];
          // const cleanedTag = nodeTag.substring(1);
          if (!nodeExists(nodeId)) {
            nodes.push({ id: nodeId, tag: nodeTag });
          }
        })


        // console.log('match' , match)
        // let nodeTag:any = match ? match[0] : null;


        searchResultsForGraph.map((result: any) => {
          const nodeId = result.fileName

          const underlinedWords: any = result.content.match(
            /<span[^>]*>(.*?)<\/span>/g
          );

          let wordsArray: any = [];
          if (underlinedWords && Array.isArray(underlinedWords)) {
            wordsArray = underlinedWords.map((span: any) => {
              // Use a regular expression to extract the text content between the <span> tags
              const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
              // Check if a match was found and return the extracted text, or an empty string if not
              return match ? match[1] : "";
            });

            // Now you can use wordsArray safely
          }

          wordsArray.forEach((word: any) => {
            const nodeWithWord = nodes.find((node: any) => node.id === word);

            if (nodeWithWord) {
              if (nodeId !== nodeWithWord.id) {
                // Node with the word exists, update its tag
                links.push({ source: nodeId, target: nodeWithWord.id });
              }
            }
          });
        })

        const resultData: any = { nodes, links }
        // console.log('resultData' , resultData)


        let filteredGraphData: any = {}

        // Step 1: Find items with status "exclude" in updatedCheckboxes
        const excludedValues: any = [];
        graphTagFilters.forEach((category: any) => {
          category.items.forEach((item: any) => {
            if (item.status === "exclude") {
              excludedValues.push(item.value.substring(1));
            }
          });
        });

        // Step 2: Find corresponding node ids in graphDataCopy
        const excludedNodeIds: any = [];
        resultData.nodes.forEach((node: any) => {
          const tag = node.tag.map((tagCheck: any) => tagCheck.toLowerCase().replace(/^#/, ''));

          // Check if any of the tags exist in the excludedValues array
          if (tag.some((tagCheck: any) => excludedValues.includes(tagCheck))) {
            excludedNodeIds.push(node.id);
          }
        });
        // resultData.nodes.forEach((node:any) => {
        //   if (excludedValues.includes(node.tag)) {
        //     excludedNodeIds.push(node.id);
        //   }
        // });

        // console.log('excludedNodeIds',excludedNodeIds)

        // Step 3: Remove links with source or target matching excluded node ids
        filteredGraphData.links = resultData.links.filter((link: any) => {
          return !excludedNodeIds.includes(link.source) && !excludedNodeIds.includes(link.target);
        });

        // Step 4: Remove nodes with ids in excludedNodeIds
        filteredGraphData.nodes = resultData.nodes.filter((node: any) => !excludedNodeIds.includes(node.id));

        // Now, graphDataCopy is updated with the desired changes.
        // console.log('resultData' , resultData)



        // console.log('filteredGraphData: ', filteredGraphData);
        // makeGraph(filteredGraphData)


        setTimeout(() => {
          setOpenedResults(updatedOpenedResults)
          setOpenedResultsRawData(updatedOpenedResults)
          setGraphData(resultData);
          setGraphDataAfterFilters(filteredGraphData)
          makeGraphFromGraphResults(filteredGraphData);
        }, 200)
      }
    } else {
      console.log('should not be in this else, generateGraphfromGraphResult')
      setShouldShowFilters(false);
      const nodes: any = [];
      const links: any = [];
      const resultData: any = { nodes, links };
      // console.log('resultData: ' , resultData)
      // let graphNewData = resultData;
      setGraphData(resultData);
      let graphDiv: any;

      if (window.innerWidth <= 575) {
        graphDiv = document.getElementById("graph-div-mobile");
      } else {
        graphDiv = document.getElementById("graph-div");
      }

      if (graphDiv) {
        const svgElement = graphDiv.querySelector('svg');
        if (svgElement) {
          graphDiv.removeChild(svgElement);
        } else {
          console.log('SVG element not found or already removed. in generateGraphfromSearch function');
        }
      } else {
        console.log('Element with ID "graph-div" not found. in generateGraphfromSearch function ');
      }
      setOpenedResults(searchResultsForGraph);
      setOpenedResultsRawData(searchResultsForGraph)
    }
  };


  const handleSiteNameClick = () => {
    if (typeof controller != typeof undefined) {
      controller.abort()
    }

    setSearchValue("");
    setGraphSearchValue("")
    setSearchResults([]);
    setOpenedResults([]);
    setOpenedResultsRawData([])

    sethideFiltersForPreview(true);
    setGraphNodeOpened([])
    setCheckGraphStatus(false)
    setPreviousGraphData([])
    setGraphData([])
    setGraphDataAfterFilters([])
    setTextSearchLoader(false)
    setGraphSearchLoader(false)
    setShowGraphFilters(false)

    if (graphOrTextView) {
      setShouldShowFilters(true);
    }

    const updatedCheckboxes: any = allCheckboxes.map((eachCategory: any) => ({
      ...eachCategory,
      items: eachCategory.items.map((eachItem: any) => ({
        ...eachItem,
        state: "unchecked",
        status: "neutral",
      })),
    }));
    setAllCheckboxes(updatedCheckboxes)

    const updatedGraphFilters: any = graphTagFilters.map((eachCategory: any) => ({
      ...eachCategory,
      items: eachCategory.items.map((eachItem: any) => ({
        ...eachItem,
        state: "unchecked",
        status: "neutral",
      })),
    }));
    setGraphTagFilters(updatedGraphFilters)
    let graphDiv: any;

    if (window.innerWidth <= 575) {
      graphDiv = document.getElementById("graph-div-mobile");
    } else {
      graphDiv = document.getElementById("graph-div");
    }

    if (graphDiv) {
      graphDiv.innerHTML = "";
    }



    // console.log(searchResultsInnerContainer, mobileWorkspaceContainer)

    if (window.innerWidth < 786) {
      const searchResultsInnerContainer: any = document.querySelector('.search-results-inner-container');
      const mobileWorkspaceContainer: any = document.querySelector('.mobile-workspace-container');
      let mobileHomepageVideo: any
      if (searchResultsInnerContainer && getComputedStyle(searchResultsInnerContainer).display === 'block') {
        searchResultsInnerContainer.style.display = 'none';
        mobileWorkspaceContainer.style.display = 'none';
        setTimeout(() => {
          mobileHomepageVideo = document.querySelector('.mobile-homepage-video');
          mobileHomepageVideo.style.display = 'block'
        }, 200);

      } else if (mobileWorkspaceContainer) {
        mobileWorkspaceContainer.style.display = 'none';
        searchResultsInnerContainer.style.display = 'none';
        setTimeout(() => {
          mobileHomepageVideo = document.querySelector('.mobile-homepage-video');
          mobileHomepageVideo.style.display = 'block'
        }, 200);
      } else if (mobileHomepageVideo) {
        setTimeout(() => {
          mobileHomepageVideo = document.querySelector('.mobile-homepage-video');
          if (mobileHomepageVideo) {
            mobileHomepageVideo.style.display = 'block';
          }
        }, 200);
      }
    }


  };


  function removeBrackets(newEntries: any, wordToSearch: any) {
    // console.log("newEntries: ", newEntries);
    for (const entry of newEntries) {
      let textToConvert = entry.content;
      const regex = /\[\[([^[\]]+)\]\]/g;

      // entry.content = textToConvert.replace(
      //   regex,
      //   (match: any, word: any) => `${word}`
      // );

      const contentWithRemovedBrackets = textToConvert.replace(regex,(match: any, word: any) => `${word}`);
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
      const contentWithHighlightedWords = entry.contentWithRemovedBrackets.replace(
        new RegExp(`(${wordToSearch.join("|")})`, "gi"), (match: any) => `<span>${match}</span>`);

      const fileNameWithHighlightedWords = entry.fileName.replace(
        new RegExp(`(${wordToSearch.join("|")})`, "gi"),
        (match: any) => `<span>${match}</span>`
      );
      entry.contentWithHighlightedWords = contentWithHighlightedWords;
      entry.fileNameWithHighlightedWords = fileNameWithHighlightedWords;
    }
  }


  function markAllData(newentries: any, wordToSearch: any) {
    // console.log('wordtosearch' , wordToSearch)
    // console.log(newentries)

    for (const entry of newentries) {

      let matchingFile: any = {}

      marked.setOptions({
        breaks: true,
      });

      // matchingFile.content = marked(entry.content);

      function stripHtml(html: any) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
      }

      const plainText = stripHtml(entry.content);
      const hashtagWordRegex = /#\S+/g;
      const plainTextWithoutTags = plainText.replace(hashtagWordRegex, "");
      const plainTextWithoutBrackets = stripHtml(plainTextWithoutTags).replace(/\[\[|\]\]/g, '');
      const pattern = new RegExp(`(?:\\b(?:${wordToSearch.join('|')})\\b)\\W+(\\w+\\W+\\w+\\W+\\w+)`, 'gi');

      const matches = [];
      let match;
      while ((match = pattern.exec(plainTextWithoutBrackets)) !== null) { matches.push(match[0]) }

      const result = matches.join('\n');
      // console.log(result);

      const highlightedResult = result.replace(new RegExp(`(${wordToSearch.join('|')})`, 'ig'),
        (match) => `<span>${match}</span>`
      );


      if (highlightedResult !== null && highlightedResult !== '') {
        // console.log('result' , result)
        entry.totalMarkedData = highlightedResult
      } else {
        //   matchingFile.content = entry.content
        // // console.log(matchingFile.content)

        // const regex = /\[\[([^[\]]+)\]\]/g;
        // const hashtagParagraphRegex = /^#\w+/gm;

        // if (matchingFile) {
        //   const contentWithoutHashtag = matchingFile.content.replace(
        //     hashtagParagraphRegex,
        //     ""
        //   );

        //   const contentWithStyledWord = contentWithoutHashtag.replace(
        //     regex,
        //     (match: any, word: any) =>
        //       `<span>${word}</span>`
        //   );

        //   const searchPattern = new RegExp(`(${wordToSearch.join('|')})`, 'gi');

        //   const contentWithBackground = contentWithStyledWord.replace(
        //     searchPattern,
        //     '<span style="background-color: #666262; text-decoration: underline;">$1</span>'
        //   );

        //   const regexRemove = /(^|\n)(#[^\n]*){1,5}(\n|$)/g;
        //   const finalContent = contentWithBackground.replace(regexRemove, '');



        //   // console.log(finalContent)

        //   // console.log(result);

        //   // console.log(contentWithBackground)


        //   entry.totalMarkedData = finalContent 
        // }

        const plainText = stripHtml(entry.content);
        const hashtagWordRegex = /#\S+/g;
        const plainTextWithoutTags = plainText.replace(hashtagWordRegex, "");
        const plainTextWithoutBrackets = stripHtml(plainTextWithoutTags).replace(/\[\[|\]\]/g, '');

        const linesToKeep = plainTextWithoutBrackets.split('\n')
          .filter(line => wordToSearch.some((word: any) => line.toLowerCase().includes(word.toLowerCase())));
        const result = linesToKeep.join('\n');

        const highlightedResult = result.replace(new RegExp(`(${wordToSearch.join('|')})`, 'ig'),
          (match) => `<span>${match}</span>`
        );
        // console.log(highlightedResult)
        if (highlightedResult !== '') {
          entry.totalMarkedData = highlightedResult
        } else {
          const plainText = stripHtml(entry.content);
          const hashtagWordRegex = /#\S+/g;
          const plainTextWithoutTags = plainText.replace(hashtagWordRegex, "");
          const plainTextWithoutBrackets = stripHtml(plainTextWithoutTags).replace(/\[\[|\]\]/g, '');
          entry.totalMarkedData = plainTextWithoutBrackets


        }



      }
    }
  }


  const handleThemeChangerClick = () => {

    if (!themeChangericon) {
      setTextColorForNode('#6C655C')
      setGraphLinkColor('#CFCCC7')
    } else {
      setTextColorForNode('#B3B3B5')
      setGraphLinkColor('#565959')
    }

    // console.log('themeChangericon', themeChangericon)
    const currentTheme = !themeChangericon
    setThemeChangerIcon(!themeChangericon);
    const changeTheme = JSON.stringify(currentTheme)
    // console.log('changeTheme', changeTheme)

    localStorage.setItem('theme', changeTheme);

    const sideNav: any = document.querySelector(`.${"side-nav"}`);

    const workspacePanel: any = document.querySelector(`.${"workspace-content"}`);

    sideNav.classList.toggle("night-mode");
    workspacePanel.classList.toggle("night-mode");


  }


  const handleCheckboxClick = (category: any, id: any) => {
    const updatedCheckboxes: any = allCheckboxes.map((checkboxCategory: any) => {
      if (checkboxCategory.category === category) {
        const updatedItems = checkboxCategory.items.map((item: any) => {
          if (item.id === id) {
            let newState;
            if (item.status === "neutral") {
              newState = "checked";
            } else if (item.status === "include") {
              newState = "checked";
            } else {
              newState = "unchecked";
            }

            let newStatus;
            if (item.status === "neutral") {
              newStatus = "include";
            } else if (item.status === "include") {
              newStatus = "exclude";
            } else {
              newStatus = "neutral";
            }
            // console.log(newState , newStatus)

            return {
              ...item,
              state: newState,
              status: newStatus,
            };
          }
          return item;
        });

        // console.log('match', updatedItems);

        return {
          ...checkboxCategory,
          items: updatedItems,
        };
      }
      return checkboxCategory;
    });

    setAllCheckboxes(updatedCheckboxes);


    let currentValue

    if (graphOrTextView) {
      currentValue = searchValue
    } else {
      currentValue = graphSearchValue
    }

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
      let updatedValue
      if (!currentValue) {
        updatedValue = `"${valueToInclude}"`
      } else {
        updatedValue = currentValue + ` "${valueToInclude}"`;
      }

      const syntheticEvent = {
        target: { value: updatedValue },
      };

      if (graphOrTextView) {
        handleSearchFromFilters(syntheticEvent)
      } else {
        handleGraphSearchFromFilters(syntheticEvent)
      }

    } else if (valueToCheck === "exclude") {
      const valueToAdd = valueToInclude;
      // console.log('valuetoadd' , valueToAdd , currentValue)
      let updatedValue = currentValue;
      if (currentValue.includes(valueToAdd)) {

        // updatedValue = currentValue
        // .replace(new RegExp(`${valueToAdd.replace(/"/g, "")}`, "gi"), "")
        // .replace(/""/g, "")
        // .trim();

        const regex = new RegExp(`\\s*(-?["']?${valueToAdd}["']?)(?=\\s*)`, "gi");
        updatedValue = currentValue.replace(regex, "").trim();

        updatedValue += ` -"${valueToAdd}"`;
        console.log(updatedValue)
      } else {
        updatedValue = currentValue + ` -"${valueToInclude}"`;
      }

      const syntheticEvent = {
        target: { value: updatedValue },
      };

      (graphOrTextView ? handleSearchFromFilters : handleGraphSearchFromFilters)(syntheticEvent);

    } else {
      const valueToRemove = valueToInclude;
      const regex = new RegExp(`\\s*(-?["']?${valueToRemove}["']?)(?=\\s*)`, "gi");
      const updatedValue = currentValue.replace(regex, "").trim();
      // console.log('updatedValue' , updatedValue)
      const syntheticEvent = {
        target: { value: updatedValue },
      };

      (graphOrTextView ? handleSearchFromFilters : handleGraphSearchFromFilters)(syntheticEvent);
    }

  };


  const handleGraphFilters = (category: any, id: any, valueOfFilter: any) => {
    const graphDataCopy = _.cloneDeep(graphData);

    const updatedCheckboxes: any = graphTagFilters.map((checkboxCategory: any) => {
      if (checkboxCategory.category === category) {
        const updatedItems = checkboxCategory.items.map((item: any) => {
          if (item.id === id) {
            let newState;
            if (item.status === "neutral") {
              newState = "checked";
            } else {
              newState = "unchecked";
            }

            let newStatus;
            if (item.status === "neutral") {
              newStatus = "exclude";
            } else {
              newStatus = "neutral";
            }
            // console.log(newState , newStatus)

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

    // console.log('updatedcheckboxes', updatedCheckboxes)

    setGraphTagFilters(updatedCheckboxes);


    let filteredGraphData: any = []

    // Step 1: Find items with status "exclude" in updatedCheckboxes
    const excludedValues: any = [];
    updatedCheckboxes.forEach((category: any) => {
      category.items.forEach((item: any) => {
        if (item.status === "exclude") {
          excludedValues.push(item.value.substring(1));
        }
      });
    });


    const excludedNodeIds: any = [];

    // console.log('graphDatacopy' ,graphDataCopy)
    if (graphDataCopy.nodes.length > 0) {

      graphDataCopy.nodes.forEach((node: any) => {
        const tag = node.tag.map((tagCheck: any) => tagCheck.toLowerCase().replace(/^#/, ''));

        // Check if any of the tags exist in the excludedValues array
        if (tag.some((tagCheck: any) => excludedValues.includes(tagCheck))) {
          excludedNodeIds.push(node.id);
        }
      });


      // console.log('excludedNodeIds',excludedNodeIds)

      // Step 3: Remove links with source or target matching excluded node ids
      filteredGraphData.links = graphDataCopy.links.filter((link: any) => {
        return !excludedNodeIds.includes(link.source) && !excludedNodeIds.includes(link.target);
      });

      // Step 4: Remove nodes with ids in excludedNodeIds
      filteredGraphData.nodes = graphDataCopy.nodes.filter((node: any) => !excludedNodeIds.includes(node.id));

      console.log('openedResults', openedResults)
      console.log('openedResultsRawData', openedResultsRawData)
      console.log('excluded ids', excludedNodeIds)

      const filteredOpenedResults = openedResultsRawData.filter((note: any) => !excludedNodeIds.includes(note.fileName));
      console.log('filteredOpenedResults', filteredOpenedResults)




      setGraphDataAfterFilters(filteredGraphData)
      makeGraph(filteredGraphData)
      setOpenedResults(filteredOpenedResults)

    } else {
      console.log('No graph data found , handleGraphFilters')
    }

  };


  const handleAccordionClick = () => {
    setShouldShowFilters(!shouldShowFilters);
    sethideFiltersForPreview(true)
  };


  const handleGraphOrTextView = () => {
    setgraphOrTextView(!graphOrTextView);
    if (graphNodeOpened.length > 0) {
      sethideFiltersForPreview(false)
    }

    if (graphOrTextView) {
      // console.log('true')
      setGraphSearchValue(searchValue)
      setShouldShowFilters(false);
      const nodes: any = [];
      const links: any = [];

      const nodeExists = (id: any) => { return nodes.some((node: any) => node.id === id); };

      if (openedResults.length > 0) {


        openedResultsRawData.forEach(async (result: any) => {
          const nodeId = result.fileName;

          const matches = result.contentWithRemovedBrackets.match(/#(\w+-?\w*)/g);

          let nodeTag: any = matches ? matches.map((match: any) => match.substring(1)) : ["tagnotfound"];


          if (!nodeExists(nodeId)) {
            nodes.push({ id: nodeId, tag: nodeTag });
          }
        })

        // console.log('nodes' ,nodes)

        openedResultsRawData.map((result: any) => {
          const nodeId = result.fileName

          const underlinedWords: any = result.content.match(/<span[^>]*>(.*?)<\/span>/g);

          let wordsArray: any = [];
          if (underlinedWords && Array.isArray(underlinedWords)) {
            wordsArray = underlinedWords.map((span: any) => {
              const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
              return match ? match[1] : "";
            });
          }

          wordsArray.forEach((word: any) => {
            const nodeWithWord = nodes.find((node: any) => node.id === word);
            if (nodeWithWord) {
              if (nodeId !== nodeWithWord.id) {
                links.push({ source: nodeId, target: nodeWithWord.id });
              }
            }
          });

        })

        const resultData: any = { nodes, links }

        let filteredGraphData: any = []

        // Step 1: Find items with status "exclude" in updatedCheckboxes
        const excludedValues: any = [];
        graphTagFilters.forEach((category: any) => {
          category.items.forEach((item: any) => {
            if (item.status === "exclude") {
              excludedValues.push(item.value.substring(1));
            }
          });
        });

        // Step 2: Find corresponding node ids in graphDataCopy
        const excludedNodeIds: any = [];

        resultData.nodes.forEach((node: any) => {
          const tag = node.tag.map((tagCheck: any) => tagCheck.toLowerCase().replace(/^#/, ''));

          if (tag.some((tagCheck: any) => excludedValues.includes(tagCheck))) {
            excludedNodeIds.push(node.id);
          }
        });

        // Step 3: Remove links with source or target matching excluded node ids
        filteredGraphData.links = resultData.links.filter((link: any) => {
          return !excludedNodeIds.includes(link.source) && !excludedNodeIds.includes(link.target);
        });

        // Step 4: Remove nodes with ids in excludedNodeIds
        filteredGraphData.nodes = resultData.nodes.filter((node: any) => !excludedNodeIds.includes(node.id));

        setTimeout(() => {

          setGraphData(resultData);
          setGraphDataAfterFilters(filteredGraphData)
          makeGraph(filteredGraphData);
        }, 200)

      } else {
        // console.log('search results not opened')
        const updatedOpenedResults: any = openedResults.slice();

        searchResults.forEach((result) => {
          let matchingFile: any = result;

          marked.setOptions({ breaks: true });

          let editedResult = matchingFile.content.replace(/\n(?=\n)/g, "\n\n<br/>\n")

          matchingFile.content = marked(editedResult);

          const regex = /\[\[([^[\]]+)\]\]/g;
          const hashtagParagraphRegex = /#\S+/g;
          // const hashtagParagraphRegex = /<p>#.*?<\/p>/g;
          if (matchingFile) {
            // console.log('matchingFile: ', matchingFile)
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
              ...result,
              content: contentWithStyledWords,
              openedFromResults: true,
            };

            // const doesExist = openedResults.some(
            //   (result) => result.fileName === updatedResultToOpen.fileName
            // );
            const doesExist = updatedOpenedResults.some(
              (result: any) => result.fileName === updatedResultToOpen.fileName
            );

            if (!doesExist) {
              updatedOpenedResults.push(updatedResultToOpen);
            } else {
              console.log("An object with the same fileName already exists.");
            }
          }
        });

        // add all nodes
        updatedOpenedResults.forEach(async (result: any) => {
          const nodeId = result.fileName;
          const matches = result.contentWithRemovedBrackets.match(/#(\w+-?\w*)/g);
          let nodeTag: any = matches ? matches.map((match: any) => match.substring(1)) : ["tagnotfound"];


          if (!nodeExists(nodeId)) {
            nodes.push({ id: nodeId, tag: nodeTag });
          }
        })



        updatedOpenedResults.map((node: any) => {
          const nodeId = node.fileName;
          const underlinedWords = node.content.match(/<span[^>]*>(.*?)<\/span>/g);

          let wordsArray

          if (underlinedWords) {
            wordsArray = underlinedWords.map((span: any) => {
              const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
              return match ? match[1] : "";
            });
          } else if (underlinedWords === null) {
            wordsArray = [node.fileName];
          }

          // console.log('wordsarray' , wordsArray)

          wordsArray.forEach((word: any) => {
            const nodeWithWord = nodes.find((node: any) => node.id === word);

            if (nodeWithWord) {
              if (nodeId !== nodeWithWord.id) {
                // Node with the word exists, update its tag
                links.push({ source: nodeId, target: nodeWithWord.id });
              }
            }
          });
        })




        const resultData: any = { nodes, links };
        // console.log('resultData' , resultData)

        let filteredGraphData: any = []

        // Step 1: Find items with status "exclude" in updatedCheckboxes
        const excludedValues: any = [];
        graphTagFilters.forEach((category: any) => {
          category.items.forEach((item: any) => {
            if (item.status === "exclude") {
              excludedValues.push(item.value.substring(1));
            }
          });
        });

        // Step 2: Find corresponding node ids in graphDataCopy
        const excludedNodeIds: any = [];
        // resultData.nodes.forEach((node:any) => {
        //   if (excludedValues.includes(node.tag)) {
        //     excludedNodeIds.push(node.id);
        //   }
        // });

        resultData.nodes.forEach((node: any) => {
          const tag = node.tag.map((tagCheck: any) => tagCheck.toLowerCase().replace(/^#/, ''));

          // Check if any of the tags exist in the excludedValues array
          if (tag.some((tagCheck: any) => excludedValues.includes(tagCheck))) {
            excludedNodeIds.push(node.id);
          }
        });

        // console.log('excludedNodeIds',excludedNodeIds)

        // Step 3: Remove links with source or target matching excluded node ids
        filteredGraphData.links = resultData.links.filter((link: any) => {
          return !excludedNodeIds.includes(link.source) && !excludedNodeIds.includes(link.target);
        });

        // Step 4: Remove nodes with ids in excludedNodeIds
        filteredGraphData.nodes = resultData.nodes.filter((node: any) => !excludedNodeIds.includes(node.id));


        // Filter text notes
        const filteredUpdatedOpenedResults = updatedOpenedResults.filter((note: any) => !excludedNodeIds.includes(note.fileName))

        // console.log('filteredUpdatedOpenedResults', filteredUpdatedOpenedResults)

        setTimeout(() => {
          if (resultData.nodes.length === 0) {

          } else {
            setGraphData(resultData);
            setGraphDataAfterFilters(filteredGraphData)
            makeGraph(filteredGraphData);
            setOpenedResultsRawData(updatedOpenedResults)
            setOpenedResults(filteredUpdatedOpenedResults);
          }

        }, 200);
      }

    } else {
      // console.log('false')
      setCheckGraphStatus(false)
      let graphDiv: any;

      if (window.innerWidth <= 575) {
        graphDiv = document.getElementById("graph-div-mobile");
      } else {
        graphDiv = document.getElementById("graph-div");
      }

      if (graphDiv) {
        const svgElement = graphDiv.querySelector('svg');
        if (svgElement) {
          graphDiv.removeChild(svgElement);
        } else {
          console.log('SVG element not found or already removed.');
        }
      } else {
        console.log('Element with ID "graph-div" not found.');
      }

      setShouldShowFilters(true);
      setSearchValue(graphSearchValue)
    }
  };


  const makeGraph = (graphNewData: any) => {
    let element: any;

    if (window.innerWidth <= 575) {
      element = document.getElementById("graph-div-mobile");
    } else {
      element = document.getElementById("graph-div");
    }

    // console.log('element', element)

    let graphWidth = element.offsetWidth;
    let graphHeight = element.offsetHeight;


    function ForceGraph(
      { nodes, links }: { nodes: any; links: any },
      {
        nodeId = (d: any) => d.id,
        nodeGroup = null,
        nodeGroups = null as any[] | null,
        nodeTitle,
        nodeFill = "currentColor",
        nodeStroke = "#fff",
        nodeStrokeWidth = 0,
        nodeStrokeOpacity = 1,
        nodeRadius = 4,
        nodeStrength = -30,
        linkSource = ({ source }: { source: string }) => source,
        linkTarget = ({ target }: { target: string }) => target,
        linkStroke = graphLinkColor,
        linkStrokeOpacity = 1,
        linkStrokeWidth = 0.5,
        linkStrokeLinecap = "round",
        linkStrength = 0.3,
        colors = d3.schemeTableau10,
        width = 640,
        height = 400,
        invalidation = undefined,
      }: {
        nodeId?: (d: any) => string;
        nodeGroup?: ((node: any) => string) | null;
        nodeGroups?: any[] | null;
        nodeTitle?: ((node: any, index: number) => string) | null;
        nodeFill?: string;
        nodeStroke?: string;
        nodeStrokeWidth?: number;
        nodeStrokeOpacity?: number;
        nodeRadius?: number;
        nodeStrength?: number;
        linkSource?: (d: any) => string;
        linkTarget?: (d: any) => string;
        linkStroke?: string;
        linkStrokeOpacity?: number;
        linkStrokeWidth?: number;
        linkStrokeLinecap?: string;
        linkStrength?: number;
        colors?: any;
        width?: number;
        height?: number;
        invalidation?: any;
      } = {}
    ) {
      // Compute values.
      const N = d3.map(nodes, nodeId).map(intern);
      const LS = d3.map(links, linkSource).map(intern);
      const LT = d3.map(links, linkTarget).map(intern);
      if (nodeTitle === undefined) nodeTitle = (_: any, i: any) => N[i];

      const T: any = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
      const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
      const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
      const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

      // Replace the input nodes and links with mutable objects for the simulation.
      nodes = d3.map(nodes, (_, i) => ({ id: N[i], tag: nodes[i].tag }));
      links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

      // console.log("nodes", nodes);

      // Compute default domains.
      if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

      // Construct the scales.
      const color = nodeGroup === null ? null : d3.scaleOrdinal(nodeGroups!, colors);

      // Construct the forces.
      const forceNode = d3.forceManyBody();
      const forceLink = d3.forceLink(links).id(({ index: i = 0 }) => N[i]);
      if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
      if (linkStrength !== undefined) forceLink.strength(linkForceValue);

      // console.log("nodes ", nodes);
      const customNodes: any = nodes;
      // console.log('nodes in force' , nodes)

      console.log('in make graph>force graph')


      function ticked() {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);

        // node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

        node.attr("transform", (d: any) => `translate(${d.x} ${d.y})`);

        // node.select("text")
        //   .attr("x", (d: any) => d.x - (getNodeTextWidth(d) / 4.5))
        //   .attr("y", (d: any) => d.y + 12);



        //   nodeText.attr("x", (d: any) => d.x - (getNodeTextWidth(d) / 4.5)).attr("y", (d: any) => d.y + 12);



        // nodeTitles.text((d: any) => d.id);
      }



      function zoomed(event: any) {
        container.attr("transform", event.transform);
      }

      function getColorByTag(tag: any) {

        const themeBasedColors = themeChangericon ? showAddGraphNodeColor.find((group: any) => group.mode === "light mode") : showAddGraphNodeColor.find((group: any) => group.mode === "dark mode");

        const tagColors: Record<string, string> = {};
        themeBasedColors.data.forEach((colorGroup: any) => {
          const tag = colorGroup.tag;
          tagColors[tag] = colorGroup.color;
        });


        for (const word of tag) {
          if (tagColors[word]) {
            return tagColors[word];
          }
        }

        return nodeFill;

      }

      function handleNodeClick(event: any, d: any) {
        // console.log(event, d);
        setFileOpenedFromGraph(d);
        // Get the div element and set its content based on the clicked node
        const nodeInfoDiv: any = document.getElementById("nodeInfo");
        // nodeInfoDiv.innerHTML = `<strong>ID:</strong> ${d.id}<br><strong>Tag:</strong> ${d.tag}`;

        // Position the div over the clicked node
        nodeInfoDiv.style.left = `${event.pageX - 30}px`;
        nodeInfoDiv.style.top = `${event.pageY - 35}px`;



        // Show the div
        nodeInfoDiv.style.display = "flex";

        // Prevent the click event from propagating further (e.g., to zoom or drag)
        event.stopPropagation();
      }

      function hideNodeInfo() {
        const nodeInfoDiv: any = document.getElementById("nodeInfo");
        if (nodeInfoDiv) {
          nodeInfoDiv.style.display = "none";
        }
      }

      function intern(value: any) {
        // console.log('hello intern')
        return value !== null && typeof value === "object" ? value.valueOf() : value;
      }



      function getNodeTextWidth(d: any, text: string) {
        // Create a hidden div to measure the text width
        const tempDiv: any = d3.select('body')
          .append('div')
          .attr('class', 'temp-text-container')
          .style('position', 'absolute')
          .style('visibility', 'hidden')
          .text(text); // Use the actual text content here

        // Get the width of the hidden div
        const textWidth = tempDiv.node().getBoundingClientRect().width;

        // Remove the temporary div from the DOM
        tempDiv.remove();

        return textWidth;
      }


      function handleMouseOver(this: any, event: any, d: any) {
        d3.select(this as SVGElement)
          .transition()
          .duration(400)
          .attr("fill-opacity", 1) // Set initial opacity to 1
        // .attr("fill", "red") // Change to your desired color



        // Initialize the links with their original stroke color and opacity
        link
          .attr("stroke", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              // console.log('linkstroke' , linkStroke)
              return linkStroke; // Original link color
            } else {
              // console.log('linkstroke else' , linkStroke)
              return linkStroke;
            }
          })
          .attr("stroke-opacity", linkStrokeOpacity);

        // Initialize the nodes with their original fill color and opacity
        node
          .attr("fill-opacity", (nodeData) => {
            if (nodeData === d) {
              return 1; // Opacity of the hovered node
            } else if (areNodesConnected(nodeData, d)) {
              return 1; // Opacity of directly connected nodes
            } else {
              return 0.1; // Opacity of other nodes
            }
          })


        // nodeText
        //   .transition().duration(300)
        //   .style('opacity', (nodeData: any) => {
        //     if (nodeData === d) {
        //       return 1
        //     } else if (areNodesConnected(nodeData, d)) {
        //       return 1
        //     } else {
        //       return 0.1
        //     }
        //   })
        //   .style("font-size", (nodeData: any) => {
        //     return nodeData.id === d.id ? '12px' : nodeTextSize
        //   })

        // Start the transition
        // d3.select(this as SVGElement)
        //   .transition().duration(400).attr("r", nodeRadius);

        d3.select(this)
          .select('circle') // Select the nested circle element
          .transition()
          .duration(400)
          .attr("r", calculateNodeRadius(d) * 1.2);

        d3.select(this)
          .select('text')
          .transition()
          .duration(400)
          .style("font-size", (nodeData: any) => {
            return nodeData.id === d.id ? '12px' : nodeTextSize
          })
          .attr("dy", function (d: any, i: number) {
            return nodeRadius + 20 + "px"
          })

        // Change the color of the links directly connected to the hovered node
        link
          .transition()
          .duration(400)
          .attr("stroke", (linkData: any) => {
            // console.log('stroke' , linkData , d)
            if (linkData.source === d || linkData.target === d) {
              return linkStroke; // Change to your desired link color
            } else {
              return linkStroke;
            }
          });

        // Transition to reduce the opacity of nodes that are not directly connected
        node
          .transition()
          .duration(400)
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
          .duration(400)
          .attr("stroke-opacity", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              // console.log(linkData.source , linkData.target , d)
              return 1; // Opacity of links directly connected to the hovered node
            } else {

              // console.log('in else' , linkData.source , linkData.target , d)
              return 0.1; // Opacity of other links
            }
          });

        // console.log("Hovered Nodes:", hoveredNodes);
      }


      function handleMouseOut(this: any, d: any) {
        let tempMouseOverNode
        // console.log('d', d)
        const nodeData = d.fromElement.__data__;

        if (nodeData && nodeData.id) {
          tempMouseOverNode = nodeData.id;
        } else if (d.target) {
          // For non-Firefox browsers or when __data__ is not available
          tempMouseOverNode = d.target.getAttribute("id");
        } else if (d.relatedTarget) {
          // For Firefox
          tempMouseOverNode = d.relatedTarget.getAttribute("id");
        }

        // console.log('tempMouseOverNode', tempMouseOverNode)

        const nodeObject = { id: tempMouseOverNode.replace("node-", "") };

        d3.select(this)
          .transition()
          .duration(400)
          .attr("fill-opacity", 1);

        d3.select(this)
          .select('circle') // Select the nested circle element
          .transition()
          .duration(400)
          .attr("r", calculateNodeRadius(nodeObject));

        d3.select(this)
          .select('text')
          .transition()
          .duration(400)
          .style('opacity', 1)
          .style("font-size", `${nodeTextSize}px`)
          .attr("dy", function (d: any, i: number) {
            return nodeRadius + 10 + "px"
          })


        // Reset the color and opacity of all links to their original values with a transition
        link
          .transition()
          .duration(400)
          .attr("stroke", linkStroke)
          .attr("stroke-opacity", linkStrokeOpacity);

        // Reset the opacity of all nodes to their original value with a transition
        node
          .transition()
          .duration(200)
          .attr("fill-opacity", 1);


        // console.log('nodetextsize', nodeTextSize)
        // nodeText.transition().duration(200)
        //   .style('opacity', 1)
        //   .style("font-size", `${nodeTextSize}px`)
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
          if (!event.active) simulation.alphaTarget(0.1).restart();
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

      function calculateNodeRadius(d: any) {
        // console.log('d' , d)
        const linkCount = links.filter((link: any) => link.source.id === d.id).length;
        // console.log('linkcount' , linkCount)
        if (linkCount <= 4) {
          // console.log('less than 4')
          return nodeRadius;
        } else {
          let checkLinkCount = linkCount - 4
          let onePercentOfCheckLinkCount = 0.12 * checkLinkCount;
          // console.log(d.id , onePercentOfCheckLinkCount , 'radius to return' , onePercentOfCheckLinkCount+ 4);

          return onePercentOfCheckLinkCount + 4;
        }
      }

      function hasLinks(node: any) {
        // Assuming links is your array of links
        // Replace links with your actual links data structure
        const links: any = [];  // Replace this with your actual links data

        // Check if the node's ID is present in any link's source or target
        return links.some((link: any) => link.source.id === node.id || link.target.id === node.id);
      }


      const simulation = d3.forceSimulation(customNodes)
        .force("link", forceLink)
        .force("charge", d3.forceManyBody().strength(sliderValue))
        .force("center", d3.forceCenter().strength(centerForceValue))
        .force("forceX", d3.forceX(0).strength(function (d) { return hasLinks(d) ? 0 : 0.05; }))
        .force("forceY", d3.forceY(0).strength(function (d) { return hasLinks(d) ? 0 : 0.05; }))
        .force('collide', d3.forceCollide((d) => {
          let radius = calculateNodeRadius(d)
          return radius + 15
        }))
        .on("tick", ticked);

      const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .style("transition", "fill-opacity 0.2s, stroke-opacity 0.2s")


      const container = svg.append("g");



      const link = container.append("g")
        .attr("id", "links-g-tag")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
        .attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .data(links)
        .join("line");


      const zoom: any = d3.zoom().on("zoom", zoomed);
      svg.call(zoom);

      document.addEventListener("click", hideNodeInfo);

      const node = container.append("g")
        .attr("id", 'nodes-g-tag')
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
        // .selectAll("circle")
        .selectAll("g")
        .data(nodes)
        // .join("circle")
        .join("g")
        // .attr("r", (d: any) => {
        //   const radius = calculateNodeRadius(d)
        //   return radius;
        // })
        .attr("id", function (d: any) {
          return "node-" + d.id
        })
        .attr("fill", (d: any) => {
          const color = getColorByTag(d.tag);
          return color;
        })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleNodeClick)
        .classed("node-pointer", true)
        .call(drag(simulation) as any, drag(simulation));


      node.append("circle")
        .attr("r", (d: any) => {
          const radius = calculateNodeRadius(d)
          return radius;
        })


      node.append("text")
        .text(function (d: any, i: number) {
          return T[i];
        })
        .attr("dy", function (d: any, i: number) {
          return nodeRadius + 10 + "px"
        })
        .attr("text-anchor", "middle")
        .attr("font-size", nodeTextSize)
        .attr("fill", textColorForNode)
        .style("pointer-events", "none")






      // Append text labels to the container, positioned near the nodes
      // const nodeText = container
      //   .append("g")
      //   .attr("id", "text-g-tag")
      //   .selectAll("title")
      //   .data(nodes)
      //   .join("text")
      //   // .attr("x", (d) => d.x + 12) // Adjust the x-coordinate based on your preference
      //   // .attr("y", (d) => d.y) // Adjust the y-coordinate based on your preference
      //   .attr("x", (d: any) => d.x) // Keep the x-coordinate the same as the node
      //   .attr("y", (d: any) => d.y + nodeRadius + 12)
      //   .attr("dy", ".35em") // Adjust the vertical alignment based on your preference
      //   .attr("font-size", nodeTextSize) // Adjust the font size based on your preference
      //   .style("pointer-events", "none")
      //   .text((d: any) => d.id)
      //   .attr('fill', textColorForNode);

      // const nodeTitles = container
      //   .append("g")
      //   .attr("id", "titles-g-tag")
      //   .selectAll("title")
      //   .data(nodes)
      //   .join("title")
      //   .text((d: any) => d.id);


      const initialZoomLevel = calculateInitialZoom(nodes.length, width, height);
      svg.call(zoom.transform, d3.zoomIdentity.scale(initialZoomLevel));

      function calculateInitialZoom(nodeCount: any, width: any, height: any) {
        const desiredNodeCountForFit = 10;
        const minimumScale = 1;
        const scale = Math.max(minimumScale, Math.min(3, Math.sqrt(desiredNodeCountForFit / nodeCount)));
        return scale;
      }

      // In the ticked function, update the positions of text and title elements

      // if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
      // if (L) link.attr("stroke", ({ index: i }) => L[i]);
      if (W) link.attr("stroke-width", (d: any, i: any) => `${W[i]}`);
      if (L) link.attr("stroke", (d: any, i: any) => `${L[i]}`);
      // if (G && color) {
      //   node.attr("fill", (_, i) => color(G[i]));
      // }
      // if (T) {
      //   node.append("title").text((d: any, i: any) => String(T[i]));
      // }

      if (invalidation != null) {
        // invalidation.then(() => {
        //   // Handle invalidation here
        //   simulation.stop();
        // });
      }

      const svgElement = svg.node() as SVGSVGElement;
      const result = {
        scales: { color },
        svg: svgElement,
      };

      setCheckGraphStatus(true)
      const previousNodes = [...nodes]
      const previousLinks = [...links]

      setPreviousGraphData({ nodes: previousNodes, links: previousLinks })


      return result;

      // return Object.assign(svg.node(), { scales: { color } });
    }

    function WanderGraph(
      { nodes, links }: { nodes: any; links: any },
      {
        nodeId = (d: any) => d.id, // given d in nodes, returns a unique identifier (string)
        nodeGroup = null, // given d in nodes, returns an (ordinal) value for color
        nodeGroups = null as any[] | null, // an array of ordinal values representing the node groups
        nodeTitle, // given d in nodes, a title string
        nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
        nodeStroke = "#fff", // node stroke color
        nodeStrokeWidth = 0, // node stroke width, in pixels
        nodeStrokeOpacity = 1, // node stroke opacity
        nodeRadius = 4, // node radius, in pixels
        nodeStrength = -30,
        linkSource = ({ source }: { source: string }) => source, // Specify the type as string
        linkTarget = ({ target }: { target: string }) => target, // Specify the type as string
        linkStroke = graphLinkColor, // link stroke color
        linkStrokeOpacity = 1, // link stroke opacity
        linkStrokeWidth = 0.5, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength = 0.3,
        colors = d3.schemeTableau10, // an array of color strings, for the node groups
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        invalidation = undefined // when this promise resolves, stop the simulation
      }: {
        nodeId?: (d: any) => string;
        nodeGroup?: ((node: any) => string) | null;
        nodeGroups?: any[] | null;
        nodeTitle?: ((node: any, index: number) => string) | null;
        nodeFill?: string;
        nodeStroke?: string;
        nodeStrokeWidth?: number;
        nodeStrokeOpacity?: number;
        nodeRadius?: number;
        nodeStrength?: number;
        linkSource?: (d: any) => string;
        linkTarget?: (d: any) => string;
        linkStroke?: string;
        linkStrokeOpacity?: number;
        linkStrokeWidth?: number;
        linkStrokeLinecap?: string;
        linkStrength?: number;
        colors?: any;
        width?: number;
        height?: number;
        invalidation?: any;
      } = {}
    ) {

      console.log('in make graph>wander graph ')

      // Compute values.
      const N = d3.map(nodes, nodeId).map(intern);
      const LS = d3.map(links, linkSource).map(intern);
      const LT = d3.map(links, linkTarget).map(intern);
      if (nodeTitle === undefined) nodeTitle = (_: any, i: any) => N[i];

      const T: any = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
      const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
      const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
      const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

      // Replace the input nodes and links with mutable objects for the simulation.


      let formattingNodes: any = []
      let notFoundNodes: any = []

      nodes.forEach((eachNode: any) => {
        const matchingNodeIndex = previousGraphData.nodes.findIndex((prevNode: any) => prevNode.id === eachNode.id);

        if (matchingNodeIndex !== -1) {
          formattingNodes.push(previousGraphData.nodes[matchingNodeIndex]);
        } else {
          notFoundNodes.push(eachNode)
          // const nodeArray = Object.entries(eachNode).map(([key, value]) => ({ [key]: value }));
          // console.log('nodeArray' , nodeArray)
          // currentNodeMap = d3.map(nodes, (_, i) => ({ id: N[i], tag: nodes[i].tag }));
          // const currentNodeMap = d3.map(nodeArray, (_, i) => ({ id: N[i], tag: nodeArray[i].tag }));
          // console.log('currentNodeMap',currentNodeMap)
        }
      });

     
      nodes = d3.map(nodes, (_, i) => ({ id: N[i], tag: nodes[i].tag }));
      links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));
      // const linksCopy = _.cloneDeep(links)

      // const formattingNodesMap:any = new Map(formattingNodes.map((node:any) => [node.id, node]));
      let formattingNodeCopy = formattingNodes;

      nodes.forEach((node: any, index: any) => {
        const nodeReplacement = formattingNodeCopy.find((eachnode: any) => eachnode.id === node.id);
        if (nodeReplacement) {
          nodeReplacement.fx = nodeReplacement.x;
          nodeReplacement.fy = nodeReplacement.y;

          // Update the node in the nodes array
          nodes[index] = nodeReplacement;
        }
      })


      links.forEach((link: any, index: any) => {
        if (typeof link.source === 'string') {
          const sourceObject = formattingNodeCopy.find((node: any) => node.id === link.source);
          if (sourceObject) {
            links[index].source = sourceObject
          }
        }

        // Check if target is a string, and convert it to an object if needed
        if (typeof link.target === 'string') {
          const targetObject = formattingNodeCopy.find((node: any) => node.id === link.target);
          if (targetObject) {
            links[index].target = targetObject
          }
        }
      });

      // Construct the forces.
      const forceNode = d3.forceManyBody();
      const forceLink = d3.forceLink(links).id(({ index: i = 0 }) => N[i]);
      if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
      if (linkStrength !== undefined) forceLink.strength(linkForceValue);


      // let tickCount = 0
      function ticked() {

        link
          .attr("x1", (d: any) => {
            const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
              return checkEachNode.id === d.source.id
            })
            if (xmark) {
              return xmark.x
            }
            else {
              // console.log('d',d)
              if (nodes) {
                const sourceXMark = nodes.find((checkEachNode: any) => {
                  return checkEachNode.id === d.source.id
                })
                if (sourceXMark) {
                  return sourceXMark.x
                }
              }
            }
          })
          .attr("y1", (d: any) => {
            const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
              return checkEachNode.id === d.source.id
            })
            if (xmark) {
              return xmark.y
            }
            else {
              // console.log('d',d)
              if (nodes) {
                const sourceXMark = nodes.find((checkEachNode: any) => {
                  return checkEachNode.id === d.source.id
                })
                if (sourceXMark) {
                  return sourceXMark.y
                }
              }
            }
          })
          .attr("x2", (d: any) => {
            return d.target.x
          })
          .attr("y2", (d: any) => {
            return d.target.y
          });




        node.attr("transform", (d: any) => `translate(${d.x} ${d.y})`);


        // node
        //   .attr('cx', (d: any) => d.x)
        //   .attr('cy', (d: any) => d.y)



        // .attr("cx", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.x
        //   }
        //   else {
        //     return d.x
        //   }
        // })
        // .attr("x", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.x
        //   }
        //   else {
        //     return d.x
        //   }
        // })
        // .attr("y", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.y
        //   }
        //   else {
        //     return d.y
        //   }
        // })
        // .attr("cy", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.y
        //   }
        //   else {
        //     return d.y
        //   }
        // });

        // nodeText
        //   .attr("x", (d: any) => {
        //     const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
        //       return checkEachNode.id === d.id
        //     })
        //     if (xmark) {
        //       return xmark.x - (getNodeTextWidth(d) / 4.5)
        //     }
        //     else {
        //       return d.x - (getNodeTextWidth(d) / 4.5)
        //     }

        //   })
        //   .attr("y", (d: any) => {
        //     const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
        //       return checkEachNode.id === d.id
        //     })
        //     if (xmark) {
        //       return xmark.y + 12
        //     }
        //     else {
        //       return d.y + 12
        //     }
        //   });


        // if (tickCount % 5 === 0) {
        //   nodeText
        //     .attr("x", (d: any) => {
        //       const xmark = formattingNodeCopy.find((checkEachNode: any) => checkEachNode.id === d.id);
        //       return xmark ? xmark.x - (getNodeTextWidth(d) / 4.5) : d.x - (getNodeTextWidth(d) / 4.5);
        //     })
        //     .attr("y", (d: any) => {
        //       const xmark = formattingNodeCopy.find((checkEachNode: any) => checkEachNode.id === d.id)
        //       return xmark ? xmark.y + 12 : d.y + 12;
        //     });
        // }

        // tickCount++;


        // nodeTitles
        //   .text((d: any) => {
        //     const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
        //       return checkEachNode.id === d.id
        //     })
        //     if (xmark) {
        //       return xmark.id
        //     }
        //     else {
        //       return d.id
        //     }
        //   });

        formattingNodes = []
        formattingNodeCopy = []


        // console.log('link',link)
      }

      const debouncedUpdate = _.debounce(ticked, 10);

      function zoomed(event: any) {
        container.attr("transform", event.transform);
      }

      function getColorByTag(tag: string) {
        const themeBasedColors = themeChangericon ? showAddGraphNodeColor.find((group: any) => group.mode === "light mode") : showAddGraphNodeColor.find((group: any) => group.mode === "dark mode");

        const tagColors: Record<string, string> = {};
        themeBasedColors.data.forEach((colorGroup: any) => {
          const tag = colorGroup.tag;
          tagColors[tag] = colorGroup.color;
        });


        for (const word of tag) {
          if (tagColors[word]) {
            return tagColors[word];
          }
        }

        return nodeFill;
      }

      function handleNodeClick(event: any, d: any) {
        setFileOpenedFromGraph(d);
        // Get the div element and set its content based on the clicked node
        const nodeInfoDiv: any = document.getElementById("nodeInfo");
        // nodeInfoDiv.innerHTML = `<strong>ID:</strong> ${d.id}<br><strong>Tag:</strong> ${d.tag}`;

        // Position the div over the clicked node
        nodeInfoDiv.style.left = `${event.pageX - 30}px`;
        nodeInfoDiv.style.top = `${event.pageY - 35}px`;



        // Show the div
        nodeInfoDiv.style.display = "flex";

        // Prevent the click event from propagating further (e.g., to zoom or drag)
        event.stopPropagation();
      }

      function hideNodeInfo() {
        const nodeInfoDiv: any = document.getElementById("nodeInfo");
        if (nodeInfoDiv) {
          nodeInfoDiv.style.display = "none";
        }
      }

      function intern(value: any) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
      }

      function getNodeTextWidth(d: any) {
        // Create a hidden div to measure the text width
        const tempDiv: any = d3.select('body')
          .append('div')
          .attr('class', 'temp-text-container')
          .style('position', 'absolute')
          .style('visibility', 'hidden')
          .text(d.id);

        // Get the width of the hidden div
        const textWidth = tempDiv.node().getBoundingClientRect().width;

        // Remove the temporary div from the DOM
        tempDiv.remove();

        return textWidth;
      }

      function handleMouseOver(this: any, event: any, d: any) {
        // console.log('event', event)

        // console.log('event' , event, 'nodes' , nodes)

        // Set the initial state before transitioning
        d3.select(this as SVGElement)
          .transition()
          .duration(400)
          // .attr("fill", "red") // Change to your desired color
          // .attr("r", calculateNodeRadius(d) * 1.1) // Optionally, increase the node size
          .attr("fill-opacity", 1); // Set initial opacity to 1

        // Initialize the links with their original stroke color and opacity
        link
          .attr("stroke", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return linkStroke; // Original link color
            } else {
              return linkStroke;
            }
          })
          .attr("stroke-opacity", linkStrokeOpacity);

        // Initialize the nodes with their original fill color and opacity
        node
          .attr("fill-opacity", (nodeData: any) => {
            if (nodeData === d) {
              return 1; // Opacity of the hovered node
            } else if (areNodesConnected(nodeData, d)) {
              return 1; // Opacity of directly connected nodes
            } else {
              return 0.1; // Opacity of other nodes
            }
          });

        // nodeText
        //   .transition().duration(300)
        //   .style('opacity', (nodeData: any) => {
        //     if (nodeData === d) {
        //       return 1
        //     } else if (areNodesConnected(nodeData, d)) {
        //       return 1
        //     } else {
        //       return 0.1
        //     }
        //   })
        //   .style("font-size", (nodeData: any) => {
        //     return nodeData === d ? '12px' : nodeTextSize
        //   })

        // Start the transition
        d3.select(this as SVGElement)
          .select('circle')
          .transition()
          .duration(400) // Transition duration in milliseconds
          .attr("r", calculateNodeRadius(d) * 1.2); // Optionally, increase the node size


        d3.select(this)
          .select('text')
          .transition()
          .duration(400)
          .style("font-size", (nodeData: any) => {
            return nodeData.id === d.id ? '12px' : nodeTextSize
          })
          .attr("dy", function (d: any, i: number) {
            return nodeRadius + 20 + "px"
          })


        // Change the color of the links directly connected to the hovered node
        link
          .transition()
          .duration(400)
          .attr("stroke", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return "red"; // Change to your desired link color
            } else {
              return linkStroke;
            }
          });

        // Transition to reduce the opacity of nodes that are not directly connected
        node
          .transition()
          .duration(400)
          .attr("fill-opacity", (nodeData: any) => {
            if (nodeData === d) {
              return 1; // Opacity of the hovered node
            } else if (areNodesConnected(nodeData, d)) {
              return 1; // Opacity of directly connected nodes
            } else {
              return 0.1; // Opacity of other nodes
            }
          });

        // nodeText
        //   .transition()
        //   .duration(600)
        //   .style('opacity' , (nodeData:any) => {
        //     if (nodeData === d) {
        //       return 1
        //     } else if (areNodesConnected(nodeData , d)) {
        //       return 1
        //     } else {
        //       return 0.1
        //     }
        //   })

        // Transition to reduce the opacity of links that are not directly connected
        link
          .transition()
          .duration(400)
          .attr("stroke-opacity", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return 1; // Opacity of links directly connected to the hovered node
            } else {
              return 0.1; // Opacity of other links
            }
          });



        // console.log("Hovered Nodes:", hoveredNodes);
      }

      function handleMouseOut(this: any, d: any) {
        // console.log('d to check', d)
        // console.log('d', d.fromElement.getAttribute("id"))
        // let tempMouseOverNode = d.fromElement.getAttribute("id")
        let tempMouseOverNode
        const nodeData = d.fromElement.__data__;

        // if (d.fromElement) {
        //   tempMouseOverNode = d.fromElement.getAttribute("id");
        // } else {
        //   tempMouseOverNode = d.target.getAttribute("id");
        // }

        if (nodeData && nodeData.id) {
          tempMouseOverNode = nodeData.id;
        } else if (d.target) {
          // For non-Firefox browsers or when __data__ is not available
          tempMouseOverNode = d.target.getAttribute("id");
        } else if (d.relatedTarget) {
          // For Firefox
          tempMouseOverNode = d.relatedTarget.getAttribute("id");
        }

        // console.log('tempmouseovernode', tempMouseOverNode)
        const nodeObject = { id: tempMouseOverNode.replace("node-", "") };

        // console.log('nodeobject', nodeObject)

        d3.select(this)
          // .attr("fill", nodeFill) // Reset to the original node color
          // .attr("r", calculateNodeRadius(nodeObject)) // Reset to the original node size
          .transition()
          .duration(400)
          .attr("fill-opacity", 1); // Reset opacity


        d3.select(this)
          .select('circle') // Select the nested circle element
          .transition()
          .duration(400)
          .attr("r", calculateNodeRadius(nodeObject));

        d3.select(this)
          .select('text')
          .transition()
          .duration(400)
          .style('opacity', 1)
          .style("font-size", `${nodeTextSize}px`)
          .attr("dy", function (d: any, i: number) {
            return nodeRadius + 10 + "px"
          })



        // Reset the color and opacity of all links to their original values with a transition
        link
          .transition()
          .duration(400)
          .attr("stroke", linkStroke)
          .attr("stroke-opacity", linkStrokeOpacity);

        // Reset the opacity of all nodes to their original value with a transition
        node
          .transition()
          .duration(200)
          .attr("fill-opacity", 1);

        // nodeText
        // .transition()
        // .duration(200)
        // .style('opacity', 1)
        // .style('font-size', `${nodeTextSize}px`)

      }

      function areNodesConnected(node1: any, node2: any) {
        return links.some((linkData: any) => {
          return (
            (linkData.source === node1 && linkData.target === node2) ||
            (linkData.source === node2 && linkData.target === node1)
          );
        });
      }

      function drag(simulation: any) {


        function dragstarted(event: any) {

          if (!event.active) simulation.alphaTarget(0.1).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
          nodes.forEach((node: any) => {
            node.fx = null;
            node.fy = null;
          });
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

      function calculateNodeRadius(d: any) {
        const linkCount = links.filter((link: any) => link.source.id === d.id).length;
        if (linkCount <= 4) {
          return nodeRadius;
        } else {
          let checkLinkCount = linkCount - 4
          let onePercentOfCheckLinkCount = 0.12 * checkLinkCount;

          return onePercentOfCheckLinkCount + 4;
        }
      }

      function hasLinks(node: any) {
        // Assuming links is your array of links
        // Replace links with your actual links data structure
        const links: any = [];  // Replace this with your actual links data

        // Check if the node's ID is present in any link's source or target
        return links.some((link: any) => link.source.id === node.id || link.target.id === node.id);
      }


      // console.log("nodes ", nodes);
      const customNodes: any = nodes;

      const simulation = d3
        .forceSimulation(customNodes)
        .force("link", forceLink)
        .force("charge", d3.forceManyBody().strength(sliderValue))
        .force("center", d3.forceCenter().strength(centerForceValue))
        .force("forceX", d3.forceX(0).strength(function (d) { return hasLinks(d) ? 0 : 0.05; }))
        .force("forceY", d3.forceY(0).strength(function (d) { return hasLinks(d) ? 0 : 0.05; }))
        .force('collide', d3.forceCollide((d) => {
          let radius = calculateNodeRadius(d)
          return radius + 15
        }))
        .on("tick", () => {
          debouncedUpdate();
        });




      let svgContainer;

      if (window.innerWidth <= 575) {
        svgContainer = d3.select('#graph-div-mobile');
      } else {
        svgContainer = d3.select('#graph-div');
      }
      
      const gElement = svgContainer.select('svg');
      const svg = gElement.select('g');

      const container = svg

      container.select("#links-g-tag").remove();
      const link = container.append("g")
        .attr("id", "links-g-tag")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr(
          "stroke-width",
          typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null
        )
        .attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .data(links)
        .join("line");




      container.select("#nodes-g-tag").remove();
      const node = container.append("g")
        .attr("id", "nodes-g-tag")
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
        // .selectAll("circle")
        .selectAll("g")
        .data(nodes)
        // .join("circle")
        .join("g")
        .attr("id", (d: any) => `node-${d.id}`)
        // .attr("r", calculateNodeRadius)
        .attr("fill", (d: any) => {
          const color = getColorByTag(d.tag);
          return color;
        })
        .on("mouseover", handleMouseOver) // Add mouseover event listener
        .on("mouseout", handleMouseOut)
        .on("click", handleNodeClick)
        .classed("node-pointer", true)
        .call(drag(simulation) as any, drag(simulation));

      node.append("circle")
        .attr("r", (d: any) => {
          const radius = calculateNodeRadius(d)
          return radius;
        })

      node.append("text")
        .text(function (d: any, i: number) {
          return T[i];
        })
        .attr("dy", function (d: any, i: number) {
          return nodeRadius + 10 + "px"
        })
        .attr("text-anchor", "middle")
        .attr("font-size", nodeTextSize)
        .attr("fill", textColorForNode)
        .style("pointer-events", "none")


      // // Append text labels to the container, positioned near the nodes
      // container.select("#text-g-tag").remove();
      // const nodeText = container
      //   .append("g")
      //   .attr("id", "text-g-tag")
      //   .selectAll("title")
      //   .data(nodes)
      //   .join("text")
      //   // .attr("x", (d) => d.x + 12) // Adjust the x-coordinate based on your preference
      //   // .attr("y", (d) => d.y) // Adjust the y-coordinate based on your preference
      //   .attr("x", (d: any) => d.x) // Keep the x-coordinate the same as the node
      //   .attr("y", (d: any) => d.y + nodeRadius + 12)
      //   .attr("dy", ".35em") // Adjust the vertical alignment based on your preference
      //   .attr("font-size", nodeTextSize) // Adjust the font size based on your preference
      //   .style("pointer-events", "none")
      //   .text((d: any) => d.id)
      //   .attr('fill', textColorForNode);

      // container.select("#titles-g-tag").remove();
      // const nodeTitles = container
      //   .append("g")
      //   .attr("id", "titles-g-tag")
      //   .selectAll("title")
      //   .data(nodes)
      //   .join("title")
      //   .text((d: any) => d.id);


      const zoom: any = d3.zoom().on("zoom", zoomed);
      svgContainer.call(zoom);

      document.addEventListener("click", hideNodeInfo);

      const initialZoomLevel = calculateInitialZoom(nodes.length, width, height);
      svgContainer.call(zoom.transform, d3.zoomIdentity.scale(initialZoomLevel));

      function calculateInitialZoom(nodeCount: any, width: any, height: any) {
        const desiredNodeCountForFit = 10;
        const minimumScale = 1;
        const scale = Math.max(minimumScale, Math.min(3, Math.sqrt(desiredNodeCountForFit / nodeCount)));
        return scale;
      }


      // // In the ticked function, update the positions of text and title elements

      // if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
      // if (L) link.attr("stroke", ({ index: i }) => L[i]);
      if (W) link.attr("stroke-width", (d: any, i: any) => `${W[i]}`);
      if (L) link.attr("stroke", (d: any, i: any) => `${L[i]}`);
      // if (G && color) {
      //   node.attr("fill", (_:any, i:any) => color(G[i]));
      // }
      // if (T) {
      //   node.append("title").text((d: any, i: any) => String(T[i]));
      // }

      if (invalidation != null) {
        (invalidation as Promise<void>).then(() => {
          // Handle invalidation here
          simulation.stop();
        });
      }


      const svgElement = svg.node() as SVGSVGElement;
      const result = {
        svg: svgElement,
      };




      const previousNodes = [...nodes]
      const previousLinks = [...links]

      setPreviousGraphData({ nodes: previousNodes, links: previousLinks })

      return result;
    }

    const options: any = {
      nodeFill: "#808080",
      nodeStroke: "#808080",
      width: graphWidth,
      height: graphHeight,
    };

    let svgResult: any
    if (checkGraphStatus) {
      svgResult = WanderGraph(graphNewData, options)
    } else {
      svgResult = ForceGraph(graphNewData, options);
      if (element) {
        element.appendChild(svgResult.svg);
      } else {
        let graphDiv: any;
        if (window.innerWidth <= 575) {
          graphDiv = document.getElementById("graph-div-mobile");
        } else {
          graphDiv = document.getElementById("graph-div");
        }
        graphDiv.appendChild(svgResult.svg);
      }
    }

  };


  const makeGraphFromGraphResults = (graphNewData: any) => {
    let element: any;

    if (window.innerWidth <= 575) { // Adjust the threshold according to your design
      element = document.getElementById("graph-div-mobile");
    } else {
      element = document.getElementById("graph-div");
    }

    let graphWidth = element.offsetWidth;
    let graphHeight = element.offsetHeight;


    function ForceGraph(
      { nodes, links }: { nodes: any; links: any },
      {
        nodeId = (d: any) => d.id, // given d in nodes, returns a unique identifier (string)
        nodeGroup = null, // given d in nodes, returns an (ordinal) value for color
        nodeGroups = null as any[] | null, // an array of ordinal values representing the node groups
        nodeTitle, // given d in nodes, a title string
        nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
        nodeStroke = "#fff", // node stroke color
        nodeStrokeWidth = 0, // node stroke width, in pixels
        nodeStrokeOpacity = 1, // node stroke opacity
        nodeRadius = 4, // node radius, in pixels
        nodeStrength = -30,
        linkSource = ({ source }: { source: string }) => source, // Specify the type as string
        linkTarget = ({ target }: { target: string }) => target, // Specify the type as string
        linkStroke = graphLinkColor, // link stroke color
        linkStrokeOpacity = 1, // link stroke opacity
        linkStrokeWidth = 0.5, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength = 0.3,
        colors = d3.schemeTableau10, // an array of color strings, for the node groups
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        invalidation = undefined, // when this promise resolves, stop the simulation
      }: {
        nodeId?: (d: any) => string;
        nodeGroup?: ((node: any) => string) | null;
        nodeGroups?: any[] | null;
        nodeTitle?: ((node: any, index: number) => string) | null;
        nodeFill?: string;
        nodeStroke?: string;
        nodeStrokeWidth?: number;
        nodeStrokeOpacity?: number;
        nodeRadius?: number;
        nodeStrength?: number;
        linkSource?: (d: any) => string;
        linkTarget?: (d: any) => string;
        linkStroke?: string;
        linkStrokeOpacity?: number;
        linkStrokeWidth?: number;
        linkStrokeLinecap?: string;
        linkStrength?: number;
        colors?: any;
        width?: number;
        height?: number;
        invalidation?: any;
      } = {}
    ) {
      // Compute values.
      const N = d3.map(nodes, nodeId).map(intern);
      const LS = d3.map(links, linkSource).map(intern);
      const LT = d3.map(links, linkTarget).map(intern);
      if (nodeTitle === undefined) nodeTitle = (_: any, i: any) => N[i];
      const T: any = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
      const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
      const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
      const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

      // Replace the input nodes and links with mutable objects for the simulation.
      nodes = d3.map(nodes, (_, i) => ({ id: N[i], tag: nodes[i].tag }));
      links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

      // console.log("nodes", nodes);

      // Compute default domains.
      if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

      // Construct the scales.
      const color = nodeGroup === null ? null : d3.scaleOrdinal(nodeGroups!, colors);

      // Construct the forces.
      const forceNode = d3.forceManyBody();
      const forceLink = d3.forceLink(links).id(({ index: i = 0 }) => N[i]);
      if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
      if (linkStrength !== undefined) forceLink.strength(linkForceValue);

      // console.log("nodes ", nodes);
      const customNodes: any = nodes;
      // console.log('nodes in force' , nodes)

      console.log('in makeGraphFromGraphResults>force graph')


      function ticked() {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);


        node.attr("transform", (d: any) => `translate(${d.x} ${d.y})`);

        // node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);


        // nodeText.attr("x", (d: any) => d.x + 12).attr("y", (d: any) => d.y);


        // if (tickCount % 5 === 0) {
        //   nodeText.attr("x", (d: any) => d.x - (getNodeTextWidth(d) / 4.5)).attr("y", (d: any) => d.y + 12);
        // }

        // tickCount++;

        // nodeTitles.text((d: any) => d.id);
      }

      function zoomed(event: any) {
        container.attr("transform", event.transform);
      }

      function getColorByTag(tag: string) {
        const themeBasedColors = themeChangericon ? showAddGraphNodeColor.find((group: any) => group.mode === "light mode") : showAddGraphNodeColor.find((group: any) => group.mode === "dark mode");

        const tagColors: Record<string, string> = {};
        themeBasedColors.data.forEach((colorGroup: any) => {
          const tag = colorGroup.tag;
          tagColors[tag] = colorGroup.color;
        });


        for (const word of tag) {
          if (tagColors[word]) {
            return tagColors[word];
          }
        }

        return nodeFill;
      }

      function handleNodeClick(event: any, d: any) {
        // console.log(event, d);
        setFileOpenedFromGraph(d);
        // Get the div element and set its content based on the clicked node
        const nodeInfoDiv: any = document.getElementById("nodeInfo");
        // nodeInfoDiv.innerHTML = `<strong>ID:</strong> ${d.id}<br><strong>Tag:</strong> ${d.tag}`;

        // Position the div over the clicked node
        nodeInfoDiv.style.left = `${event.pageX - 30}px`;
        nodeInfoDiv.style.top = `${event.pageY - 35}px`;



        // Show the div
        nodeInfoDiv.style.display = "flex";

        // Prevent the click event from propagating further (e.g., to zoom or drag)
        event.stopPropagation();
      }

      function hideNodeInfo() {
        const nodeInfoDiv: any = document.getElementById("nodeInfo");
        if (nodeInfoDiv) {
          nodeInfoDiv.style.display = "none";
        }
      }

      function intern(value: any) {
        // console.log('hello intern')
        return value !== null && typeof value === "object" ? value.valueOf() : value;
      }

      function getNodeTextWidth(d: any) {
        // Create a hidden div to measure the text width
        const tempDiv: any = d3.select('body')
          .append('div')
          .attr('class', 'temp-text-container')
          .style('position', 'absolute')
          .style('visibility', 'hidden')
          .text(d.id);

        // Get the width of the hidden div
        const textWidth = tempDiv.node().getBoundingClientRect().width;

        // Remove the temporary div from the DOM
        tempDiv.remove();

        return textWidth;
      }


      function handleMouseOver(this: any, event: any, d: any) {
        // console.log('hello mouseover')
        // Set the initial state before transitioning
        d3.select(this as SVGElement)
          // .attr("fill", "red") // Change to your desired color
          // .attr("r", calculateNodeRadius(d) * 1.1) // Optionally, increase the node size
          .transition()
          .duration(400)
          .attr("fill-opacity", 1); // Set initial opacity to 1

        // Initialize the links with their original stroke color and opacity
        link
          .attr("stroke", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return linkStroke; // Original link color
            } else {
              return linkStroke;
            }
          })
          .attr("stroke-opacity", linkStrokeOpacity);

        // Initialize the nodes with their original fill color and opacity
        node
          .attr("fill-opacity", (nodeData) => {
            if (nodeData === d) {
              return 1; // Opacity of the hovered node
            } else if (areNodesConnected(nodeData, d)) {
              return 1; // Opacity of directly connected nodes
            } else {
              return 0.1; // Opacity of other nodes
            }
          });

        // nodeText
        //   .transition().duration(300)
        //   .style('opacity', (nodeData: any) => {
        //     if (nodeData === d) {
        //       return 1
        //     } else if (areNodesConnected(nodeData, d)) {
        //       return 1
        //     } else {
        //       return 0.1
        //     }
        //   })
        //   .style("font-size", (nodeData: any) => {
        //     return nodeData === d ? '12px' : nodeTextSize
        //   })

        // Start the transition
        d3.select(this)
          .select('circle') // Select the nested circle element
          .transition()
          .duration(400)
          .attr("r", calculateNodeRadius(d) * 1.2);

        d3.select(this)
          .select('text')
          .transition()
          .duration(400)
          .style("font-size", (nodeData: any) => {
            return nodeData.id === d.id ? '12px' : nodeTextSize
          })
          .attr("dy", function (d: any, i: number) {
            return nodeRadius + 20 + "px"
          })

        // Change the color of the links directly connected to the hovered node
        link
          .transition()
          .duration(400)
          .attr("stroke", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return linkStroke; // Change to your desired link color
            } else {
              return linkStroke;
            }
          });

        // Transition to reduce the opacity of nodes that are not directly connected
        node
          .transition()
          .duration(400)
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
          .duration(400)
          .attr("stroke-opacity", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return 1; // Opacity of links directly connected to the hovered node
            } else {
              return 0.1; // Opacity of other links
            }
          });

        // console.log("Hovered Nodes:", hoveredNodes);
      }


      function handleMouseOut(this: any, d: any) {
        let tempMouseOverNode

        // if (d.fromElement) {
        //   tempMouseOverNode = d.fromElement.getAttribute("id");
        // } else {
        //   tempMouseOverNode = d.target.getAttribute("id");
        // }

        const nodeData = d.fromElement.__data__;

        if (nodeData && nodeData.id) {
          tempMouseOverNode = nodeData.id;
        } else if (d.target) {
          // For non-Firefox browsers or when __data__ is not available
          tempMouseOverNode = d.target.getAttribute("id");
        } else if (d.relatedTarget) {
          // For Firefox
          tempMouseOverNode = d.relatedTarget.getAttribute("id");
        }

        const nodeObject = { id: tempMouseOverNode.replace("node-", "") };

        d3.select(this)
          // .attr("r", calculateNodeRadius(nodeObject))
          .transition()
          .duration(400)
          .attr("fill-opacity", 1);

        d3.select(this)
          .select('circle') // Select the nested circle element
          .transition()
          .duration(400)
          .attr("r", calculateNodeRadius(nodeObject));

        d3.select(this)
          .select('text')
          .transition()
          .duration(400)
          .style('opacity', 1)
          .style("font-size", `${nodeTextSize}px`)
          .attr("dy", function (d: any, i: number) {
            return nodeRadius + 10 + "px"
          })


        // Reset the color and opacity of all links to their original values with a transition
        link
          .transition()
          .duration(400)
          .attr("stroke", linkStroke)
          .attr("stroke-opacity", linkStrokeOpacity);

        // Reset the opacity of all nodes to their original value with a transition
        node
          .transition()
          .duration(200)
          .attr("fill-opacity", 1);

        // nodeText.transition().duration(200).style('opacity', 1).style('font-size', `${nodeTextSize}px`)
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
          if (!event.active) simulation.alphaTarget(0.1).restart();
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

      function calculateNodeRadius(d: any) {
        // console.log('d' , d)
        const linkCount = links.filter((link: any) => link.source.id === d.id).length;
        // console.log('linkcount' , linkCount)
        if (linkCount <= 4) {
          // console.log('less than 4')
          return nodeRadius;
        } else {
          let checkLinkCount = linkCount - 4
          let onePercentOfCheckLinkCount = 0.12 * checkLinkCount;
          // console.log(d.id , onePercentOfCheckLinkCount , 'radius to return' , onePercentOfCheckLinkCount+ 4);

          return onePercentOfCheckLinkCount + 4;
        }
      }

      function hasLinks(node: any) {
        // Assuming links is your array of links
        // Replace links with your actual links data structure
        // const links:any = [];  // Replace this with your actual links data

        // Check if the node's ID is present in any link's source or target
        return links.some((link: any) => link.source.id === node.id || link.target.id === node.id);
      }


      const simulation = d3.forceSimulation(customNodes).force("link", forceLink)
        .force("charge", d3.forceManyBody().strength(sliderValue))
        .force("center", d3.forceCenter().strength(centerForceValue))
        .force("forceX", d3.forceX(0).strength(function (d) { return hasLinks(d) ? 0 : 0.05; }))
        .force("forceY", d3.forceY(0).strength(function (d) { return hasLinks(d) ? 0 : 0.05; }))
        .force('collide', d3.forceCollide((d) => {
          let radius = calculateNodeRadius(d)
          // console.log('node radius' , radius)
          return radius + 15
        }))
        .on("tick", ticked);

      const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .style("transition", "fill-opacity 0.2s, stroke-opacity 0.2s");

      const container = svg.append("g");

      const link = container.append("g").attr("id", "links-g-tag")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
        .attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .data(links)
        .join("line");

      const zoom: any = d3.zoom().on("zoom", zoomed);
      svg.call(zoom);

      document.addEventListener("click", hideNodeInfo);
      // console.log('nodes' , nodes)

      // console.log('links' , links)

      const node = container.append("g")
        .attr("id", 'nodes-g-tag')
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
        // .selectAll("circle")
        .selectAll("g")
        .data(nodes)
        .join("circle")
        .join("g")
        // .attr("r", (d: any) => {
        //   const radius = calculateNodeRadius(d)
        //   return radius;
        // })
        .attr("id", function (d: any) {
          return "node-" + d.id
        })
        .attr("fill", (d: any) => {
          const color = getColorByTag(d.tag);
          return color;
        })
        .on("mouseover", handleMouseOver) // Add mouseover event listener
        .on("mouseout", handleMouseOut)
        .on("click", handleNodeClick)
        .classed("node-pointer", true)
        .call(drag(simulation) as any, drag(simulation));


      node.append("circle")
        .attr("r", (d: any) => {
          const radius = calculateNodeRadius(d)
          return radius;
        })


      node.append("text")
        .text(function (d: any, i: number) {
          return T[i];
        })
        .attr("dy", function (d: any, i: number) {
          return nodeRadius + 10 + "px"
        })
        .attr("text-anchor", "middle")
        .attr("font-size", nodeTextSize)
        .attr("fill", textColorForNode)
        .style("pointer-events", "none")




      // Append text labels to the container, positioned near the nodes
      // const nodeText = container
      //   .append("g")
      //   .attr("id", "text-g-tag")
      //   .selectAll("title")
      //   .data(nodes)
      //   .join("text")
      //   // .attr("x", (d) => d.x + 12) // Adjust the x-coordinate based on your preference
      //   // .attr("y", (d) => d.y) // Adjust the y-coordinate based on your preference
      //   .attr("x", (d: any) => d.x) // Keep the x-coordinate the same as the node
      //   .attr("y", (d: any) => d.y + nodeRadius + 12)
      //   .attr("dy", ".35em") // Adjust the vertical alignment based on your preference
      //   .attr("font-size", nodeTextSize) // Adjust the font size based on your preference
      //   .style("pointer-events", "none")
      //   .text((d: any) => d.id)
      //   .attr('fill', textColorForNode);

      // const nodeTitles = container
      //   .append("g")
      //   .attr("id", "titles-g-tag")
      //   .selectAll("title")
      //   .data(nodes)
      //   .join("title")
      //   .text((d: any) => d.id);

      const initialZoomLevel = calculateInitialZoom(nodes.length, width, height);
      svg.call(zoom.transform, d3.zoomIdentity.scale(initialZoomLevel));

      function calculateInitialZoom(nodeCount: any, width: any, height: any) {
        const desiredNodeCountForFit = 10;
        const minimumScale = 1;
        const scale = Math.max(minimumScale, Math.min(3, Math.sqrt(desiredNodeCountForFit / nodeCount)));
        return scale;
      }

      // In the ticked function, update the positions of text and title elements

      // if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
      // if (L) link.attr("stroke", ({ index: i }) => L[i]);
      if (W) link.attr("stroke-width", (d: any, i: any) => `${W[i]}`);
      if (L) link.attr("stroke", (d: any, i: any) => `${L[i]}`);
      // if (G && color) {
      //   node.attr("fill", (_, i) => color(G[i]));
      // }
      // if (T) {
      //   node.append("title").text((d: any, i: any) => String(T[i]));
      // }

      if (invalidation != null) {
        // invalidation.then(() => {
        //   // Handle invalidation here
        //   simulation.stop();
        // });
      }

      const svgElement = svg.node() as SVGSVGElement;
      const result = {
        scales: { color },
        svg: svgElement,
      };

      setCheckGraphStatus(true)
      const previousNodes = [...nodes]
      const previousLinks = [...links]

      setPreviousGraphData({ nodes: previousNodes, links: previousLinks })


      return result;

      // return Object.assign(svg.node(), { scales: { color } });
    }

    function WanderGraph(
      { nodes, links }: { nodes: any; links: any },
      {
        nodeId = (d: any) => d.id, // given d in nodes, returns a unique identifier (string)
        nodeGroup = null, // given d in nodes, returns an (ordinal) value for color
        nodeGroups = null as any[] | null, // an array of ordinal values representing the node groups
        nodeTitle, // given d in nodes, a title string
        nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
        nodeStroke = "#fff", // node stroke color
        nodeStrokeWidth = 0, // node stroke width, in pixels
        nodeStrokeOpacity = 1, // node stroke opacity
        nodeRadius = 4, // node radius, in pixels
        nodeStrength = -30,
        linkSource = ({ source }: { source: string }) => source, // Specify the type as string
        linkTarget = ({ target }: { target: string }) => target, // Specify the type as string
        linkStroke = graphLinkColor, // link stroke color
        linkStrokeOpacity = 1, // link stroke opacity
        linkStrokeWidth = 0.5, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength = 0.3,
        colors = d3.schemeTableau10, // an array of color strings, for the node groups
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        invalidation = undefined // when this promise resolves, stop the simulation
      }: {
        nodeId?: (d: any) => string;
        nodeGroup?: ((node: any) => string) | null;
        nodeGroups?: any[] | null;
        nodeTitle?: ((node: any, index: number) => string) | null;
        nodeFill?: string;
        nodeStroke?: string;
        nodeStrokeWidth?: number;
        nodeStrokeOpacity?: number;
        nodeRadius?: number;
        nodeStrength?: number;
        linkSource?: (d: any) => string;
        linkTarget?: (d: any) => string;
        linkStroke?: string;
        linkStrokeOpacity?: number;
        linkStrokeWidth?: number;
        linkStrokeLinecap?: string;
        linkStrength?: number;
        colors?: any;
        width?: number;
        height?: number;
        invalidation?: any;
      } = {}
    ) {

      console.log('in makeGraphFromGraphResults>wander graph now')

      // Compute values.
      const N = d3.map(nodes, nodeId).map(intern);
      const LS = d3.map(links, linkSource).map(intern);
      const LT = d3.map(links, linkTarget).map(intern);
      if (nodeTitle === undefined) nodeTitle = (_: any, i: any) => N[i];

      const T: any = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
      const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
      const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
      const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

      // Replace the input nodes and links with mutable objects for the simulation.


      let formattingNodes: any = []
      let notFoundNodes: any = []

      nodes.forEach((eachNode: any) => {
        const matchingNodeIndex = previousGraphData.nodes.findIndex((prevNode: any) => prevNode.id === eachNode.id);

        if (matchingNodeIndex !== -1) {
          formattingNodes.push(previousGraphData.nodes[matchingNodeIndex]);
        } else {
          notFoundNodes.push(eachNode)
        }
      });

      // console.log('formattingNodes ', formattingNodes)
      // console.log('notFoundNodes ', notFoundNodes)


      nodes = d3.map(nodes, (_, i) => ({ id: N[i], tag: nodes[i].tag }));
      links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));
      // const linksCopy = _.cloneDeep(links)

      // const formattingNodesMap:any = new Map(formattingNodes.map((node:any) => [node.id, node]));
      let formattingNodeCopy = formattingNodes;

      nodes.forEach((node: any, index: any) => {
        const nodeReplacement = formattingNodeCopy.find((eachnode: any) => eachnode.id === node.id);
        if (nodeReplacement) {
          // console.log('nodeReplacement',nodeReplacement)
          nodeReplacement.fx = nodeReplacement.x;
          nodeReplacement.fy = nodeReplacement.y;

          // Update the node in the nodes array
          nodes[index] = nodeReplacement;
        }
      })


      links.forEach((link: any, index: any) => {
        if (typeof link.source === 'string') {
          const sourceObject = formattingNodeCopy.find((node: any) => node.id === link.source);
          if (sourceObject) {
            links[index].source = sourceObject
          }
        }

        // Check if target is a string, and convert it to an object if needed
        if (typeof link.target === 'string') {
          const targetObject = formattingNodeCopy.find((node: any) => node.id === link.target);
          if (targetObject) {
            links[index].target = targetObject
          }
        }
      });

      // console.log('formattingNodeCopy',formattingNodeCopy)


      // Compute default domains.
      // if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);



      // Construct the forces.
      const forceNode = d3.forceManyBody();
      const forceLink = d3.forceLink(links).id(({ index: i = 0 }) => N[i]);
      if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
      if (linkStrength !== undefined) forceLink.strength(linkForceValue);


      function ticked() {

        link
          .attr("x1", (d: any) => {
            const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
              return checkEachNode.id === d.source.id
            })
            if (xmark) {
              return xmark.x
            }
            else {
              // console.log('d',d)
              if (nodes) {
                const sourceXMark = nodes.find((checkEachNode: any) => {
                  return checkEachNode.id === d.source.id
                })
                if (sourceXMark) {
                  return sourceXMark.x
                }
              }
            }
          })
          .attr("y1", (d: any) => {
            const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
              return checkEachNode.id === d.source.id
            })
            if (xmark) {
              return xmark.y
            }
            else {
              // console.log('d',d)
              if (nodes) {
                const sourceXMark = nodes.find((checkEachNode: any) => {
                  return checkEachNode.id === d.source.id
                })
                if (sourceXMark) {
                  return sourceXMark.y
                }
              }
            }
          })
          .attr("x2", (d: any) => {
            return d.target.x
          })
          .attr("y2", (d: any) => {
            return d.target.y
          });


        node.attr("transform", (d: any) => `translate(${d.x} ${d.y})`);



        // node
        //   .attr('cx', (d: any) => d.x)
        //   .attr('cy', (d: any) => d.y)

        // .attr("cx", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.x
        //   }
        //   else {
        //     return d.x
        //   }
        // })
        // .attr("x", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.x
        //   }
        //   else {
        //     return d.x
        //   }
        // })
        // .attr("y", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.y
        //   }
        //   else {
        //     return d.y
        //   }
        // })
        // .attr("cy", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.y
        //   }
        //   else {
        //     return d.y
        //   }
        // });


        // if (tickCount % 5 === 0) {
        //   nodeText
        //     .attr("x", (d: any) => {
        //       const xmark = formattingNodeCopy.find((checkEachNode: any) => checkEachNode.id === d.id);
        //       return xmark ? xmark.x - (getNodeTextWidth(d) / 4.5) : d.x - (getNodeTextWidth(d) / 4.5);
        //     })
        //     .attr("y", (d: any) => {
        //       const xmark = formattingNodeCopy.find((checkEachNode: any) => checkEachNode.id === d.id)
        //       return xmark ? xmark.y + 12 : d.y + 12;
        //     });
        // }

        // tickCount++





        // nodeTitles
        //   .text((d: any) => {
        //     const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
        //       return checkEachNode.id === d.id
        //     })
        //     if (xmark) {
        //       return xmark.id
        //     }
        //     else {
        //       return d.id
        //     }
        //   });

        formattingNodes = []
        formattingNodeCopy = []


        // console.log('link',link)
      }


      function zoomed(event: any) {
        container.attr("transform", event.transform);
      }

      function getColorByTag(tag: string) {
        const themeBasedColors = themeChangericon ? showAddGraphNodeColor.find((group: any) => group.mode === "light mode") : showAddGraphNodeColor.find((group: any) => group.mode === "dark mode");

        const tagColors: Record<string, string> = {};
        themeBasedColors.data.forEach((colorGroup: any) => {
          const tag = colorGroup.tag;
          tagColors[tag] = colorGroup.color;
        });


        for (const word of tag) {
          if (tagColors[word]) {
            return tagColors[word];
          }
        }

        return nodeFill;
      }

      function handleNodeClick(event: any, d: any) {
        // console.log(event, d);
        setFileOpenedFromGraph(d);
        // Get the div element and set its content based on the clicked node
        const nodeInfoDiv: any = document.getElementById("nodeInfo");
        // nodeInfoDiv.innerHTML = `<strong>ID:</strong> ${d.id}<br><strong>Tag:</strong> ${d.tag}`;

        // Position the div over the clicked node
        nodeInfoDiv.style.left = `${event.pageX - 30}px`;
        nodeInfoDiv.style.top = `${event.pageY - 35}px`;



        // Show the div
        nodeInfoDiv.style.display = "flex";

        // Prevent the click event from propagating further (e.g., to zoom or drag)
        event.stopPropagation();
      }

      function hideNodeInfo() {
        const nodeInfoDiv: any = document.getElementById("nodeInfo");
        if (nodeInfoDiv) {
          nodeInfoDiv.style.display = "none";
        }
      }

      function intern(value: any) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
      }

      function getNodeTextWidth(d: any) {
        // Create a hidden div to measure the text width
        const tempDiv: any = d3.select('body')
          .append('div')
          .attr('class', 'temp-text-container')
          .style('position', 'absolute')
          .style('visibility', 'hidden')
          .text(d.id);

        // Get the width of the hidden div
        const textWidth = tempDiv.node().getBoundingClientRect().width;

        // Remove the temporary div from the DOM
        tempDiv.remove();

        return textWidth;
      }

      function handleMouseOver(this: any, event: any, d: any) {

        // console.log('event' , event, 'nodes' , nodes)

        // Set the initial state before transitioning
        d3.select(this as SVGElement)
          // .attr("fill", "red") // Change to your desired color
          .transition()
          .duration(400)
          // .attr("r", calculateNodeRadius(d) * 1.1) // Optionally, increase the node size
          .attr("fill-opacity", 1); // Set initial opacity to 1

        // Initialize the links with their original stroke color and opacity
        link
          .attr("stroke", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return linkStroke; // Original link color
            } else {
              return linkStroke;
            }
          })
          .attr("stroke-opacity", linkStrokeOpacity);

        // Initialize the nodes with their original fill color and opacity
        node
          .attr("fill-opacity", (nodeData: any) => {
            if (nodeData === d) {
              return 1; // Opacity of the hovered node
            } else if (areNodesConnected(nodeData, d)) {
              return 1; // Opacity of directly connected nodes
            } else {
              return 0.1; // Opacity of other nodes
            }
          });

        // nodeText
        //   .transition().duration(300)
        //   .style('opacity', (nodeData: any) => {
        //     if (nodeData === d) {
        //       return 1
        //     } else if (areNodesConnected(nodeData, d)) {
        //       return 1
        //     } else {
        //       return 0.1
        //     }
        //   })
        //   .style("font-size", (nodeData: any) => {
        //     return nodeData === d ? '12px' : nodeTextSize
        //   })

        // Start the transition
        d3.select(this as SVGElement)
          .select('circle')
          .transition()
          .duration(400) // Transition duration in milliseconds
          .attr("r", calculateNodeRadius(d) * 1.2); // Optionally, increase the node size


        d3.select(this)
          .select('text')
          .transition()
          .duration(400)
          .style("font-size", (nodeData: any) => {
            return nodeData.id === d.id ? '12px' : nodeTextSize
          })
          .attr("dy", function (d: any, i: number) {
            return nodeRadius + 20 + "px"
          })

        // Change the color of the links directly connected to the hovered node
        link
          .transition()
          .duration(400)
          .attr("stroke", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return linkStroke; // Change to your desired link color
            } else {
              return linkStroke;
            }
          });

        // Transition to reduce the opacity of nodes that are not directly connected
        node
          .transition()
          .duration(400)
          .attr("fill-opacity", (nodeData: any) => {
            if (nodeData === d) {
              return 1; // Opacity of the hovered node
            } else if (areNodesConnected(nodeData, d)) {
              return 1; // Opacity of directly connected nodes
            } else {
              return 0.1; // Opacity of other nodes
            }
          });

        // nodeText
        //   .transition()
        //   .duration(600)
        //   .style('opacity' , (nodeData:any) => {
        //     if (nodeData === d) {
        //       return 1
        //     } else if (areNodesConnected(nodeData , d)) {
        //       return 1
        //     } else {
        //       return 0.1
        //     }
        //   })

        // Transition to reduce the opacity of links that are not directly connected
        link
          .transition()
          .duration(600)
          .attr("stroke-opacity", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return 1; // Opacity of links directly connected to the hovered node
            } else {
              return 0.1; // Opacity of other links
            }
          });



        // console.log("Hovered Nodes:", hoveredNodes);
      }

      function handleMouseOut(this: any, d: any) {
        let tempMouseOverNode

        const nodeData = d.fromElement.__data__;

        if (nodeData && nodeData.id) {
          tempMouseOverNode = nodeData.id;
        } else if (d.target) {
          // For non-Firefox browsers or when __data__ is not available
          tempMouseOverNode = d.target.getAttribute("id");
        } else if (d.relatedTarget) {
          // For Firefox
          tempMouseOverNode = d.relatedTarget.getAttribute("id");
        }

        // if (d.fromElement) {
        //   tempMouseOverNode = d.fromElement.getAttribute("id");
        // } else {
        //   tempMouseOverNode = d.target.getAttribute("id");
        // }
        const nodeObject = { id: tempMouseOverNode.replace("node-", "") };

        d3.select(this)
          // .attr("fill", nodeFill) // Reset to the original node color
          // .attr("r", calculateNodeRadius(nodeObject)) // Reset to the original node size
          .transition()
          .duration(400)
          .attr("fill-opacity", 1); // Reset opacity


        d3.select(this)
          .select('circle') // Select the nested circle element
          .transition()
          .duration(400)
          .attr("r", calculateNodeRadius(nodeObject));

        d3.select(this)
          .select('text')
          .transition()
          .duration(400)
          .style('opacity', 1)
          .style("font-size", `${nodeTextSize}px`)
          .attr("dy", function (d: any, i: number) {
            return nodeRadius + 10 + "px"
          })


        // Reset the color and opacity of all links to their original values with a transition
        link
          .transition()
          .duration(400)
          .attr("stroke", linkStroke)
          .attr("stroke-opacity", linkStrokeOpacity);

        // Reset the opacity of all nodes to their original value with a transition
        node
          .transition()
          .duration(200)
          .attr("fill-opacity", 1);

        // nodeText.transition().duration(200).style('opacity', 1).style('font-size', `${nodeTextSize}px`)

      }

      function areNodesConnected(node1: any, node2: any) {
        return links.some((linkData: any) => {
          return (
            (linkData.source === node1 && linkData.target === node2) ||
            (linkData.source === node2 && linkData.target === node1)
          );
        });
      }

      function drag(simulation: any) {


        function dragstarted(event: any) {

          if (!event.active) simulation.alphaTarget(0.1).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
          nodes.forEach((node: any) => {
            node.fx = null;
            node.fy = null;
          });
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

      function calculateNodeRadius(d: any) {
        const linkCount = links.filter((link: any) => link.source.id === d.id).length;
        if (linkCount <= 4) {
          return nodeRadius;
        } else {
          let checkLinkCount = linkCount - 4
          let onePercentOfCheckLinkCount = 0.12 * checkLinkCount;

          return onePercentOfCheckLinkCount + 4;
        }
      }


      function hasLinks(node: any) {
        // Assuming links is your array of links
        // Replace links with your actual links data structure
        // const links:any = [];  // Replace this with your actual links data


        // Check if the node's ID is present in any link's source or target
        return links.some((link: any) => link.source.id === node.id || link.target.id === node.id);
      }



      // console.log("nodes ", nodes);
      const customNodes: any = nodes;

      const simulation = d3.forceSimulation(customNodes)
        .force("link", forceLink)
        .force("charge", d3.forceManyBody().strength(sliderValue))
        .force("center", d3.forceCenter().strength(centerForceValue))
        .force("forceX", d3.forceX(0).strength(function (d) { return hasLinks(d) ? 0 : 0.05; }))
        .force("forceY", d3.forceY(0).strength(function (d) { return hasLinks(d) ? 0 : 0.05; }))
        .force('collide', d3.forceCollide((d) => {
          let radius = calculateNodeRadius(d)
          return radius + 15
        }))
        .on("tick", ticked);


      // const svg = d3
      // .create("svg")
      // .attr("width", width)
      // .attr("height", height)
      // .attr("viewBox", [-width / 2, -height / 2, width, height])
      // .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      // .style("transition", "fill-opacity 0.2s, stroke-opacity 0.2s");


      let svgContainer;

      if (window.innerWidth <= 575) {
        svgContainer = d3.select('#graph-div-mobile');
      } else {
        svgContainer = d3.select('#graph-div');
      }
      const gElement = svgContainer.select('svg');
      const svg = gElement.select('g');

      const container = svg

      container.select("#links-g-tag").remove();
      const link = container
        .append("g")
        .attr("id", "links-g-tag")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr(
          "stroke-width",
          typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null
        )
        .attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .data(links)
        .join("line");




      container.select("#nodes-g-tag").remove();
      const node = container.append("g")
        .attr("id", "nodes-g-tag")
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
        // .selectAll("circle")
        .selectAll("g")
        .data(nodes)
        // .join("circle")
        .join("g")
        .attr("id", (d: any) => `node-${d.id}`)
        // .attr("r", calculateNodeRadius)
        .attr("fill", (d: any) => {
          const color = getColorByTag(d.tag);
          return color;
        })
        .on("mouseover", handleMouseOver) // Add mouseover event listener
        .on("mouseout", handleMouseOut)
        .on("click", handleNodeClick)
        .classed("node-pointer", true)
        .call(drag(simulation) as any, drag(simulation));


      node.append("circle")
        .attr("r", (d: any) => {
          const radius = calculateNodeRadius(d)
          return radius;
        })

      node.append("text")
        .text(function (d: any, i: number) {
          return T[i];
        })
        .attr("dy", function (d: any, i: number) {
          return nodeRadius + 10 + "px"
        })
        .attr("text-anchor", "middle")
        .attr("font-size", nodeTextSize)
        .attr("fill", textColorForNode)
        .style("pointer-events", "none")


      // // Append text labels to the container, positioned near the nodes
      // container.select("#text-g-tag").remove();
      // const nodeText = container
      //   .append("g")
      //   .attr("id", "text-g-tag")
      //   .selectAll("title")
      //   .data(nodes)
      //   .join("text")
      //   // .attr("x", (d) => d.x + 12) // Adjust the x-coordinate based on your preference
      //   // .attr("y", (d) => d.y) // Adjust the y-coordinate based on your preference
      //   .attr("x", (d: any) => d.x) // Keep the x-coordinate the same as the node
      //   .attr("y", (d: any) => d.y + nodeRadius + 12)
      //   .attr("dy", ".35em") // Adjust the vertical alignment based on your preference
      //   .attr("font-size", nodeTextSize) // Adjust the font size based on your preference
      //   .style("pointer-events", "none")
      //   .text((d: any) => d.id)
      //   .attr('fill', textColorForNode);

      // container.select("#titles-g-tag").remove();
      // const nodeTitles = container
      //   .append("g")
      //   .attr("id", "titles-g-tag")
      //   .selectAll("title")
      //   .data(nodes)
      //   .join("title")
      //   .text((d: any) => d.id);


      const zoom: any = d3.zoom().on("zoom", zoomed);
      svgContainer.call(zoom);

      document.addEventListener("click", hideNodeInfo);



      // // In the ticked function, update the positions of text and title elements

      // if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
      // if (L) link.attr("stroke", ({ index: i }) => L[i]);
      if (W) link.attr("stroke-width", (d: any, i: any) => `${W[i]}`);
      if (L) link.attr("stroke", (d: any, i: any) => `${L[i]}`);
      // if (G && color) {
      //   node.attr("fill", (_:any, i:any) => color(G[i]));
      // }
      // if (T) {
      //   node.append("title").text((d: any, i: any) => String(T[i]));
      // }

      if (invalidation != null) {
        (invalidation as Promise<void>).then(() => {
          // Handle invalidation here
          simulation.stop();
        });
      }


      const svgElement = svg.node() as SVGSVGElement;
      const result = {
        // scales: { color },
        svg: svgElement,
      };




      const previousNodes = [...nodes]
      const previousLinks = [...links]

      setPreviousGraphData({ nodes: previousNodes, links: previousLinks })

      return result;
    }

    const options: any = {
      nodeFill: "#808080",
      nodeStroke: "#808080",
      width: graphWidth,
      height: graphHeight,
    };

    let svgResult: any
    if (checkGraphStatus) {
      // WanderGraph(graphNewData , options)
      svgResult = WanderGraph(graphNewData, options)

    } else {
      svgResult = ForceGraph(graphNewData, options);
      if (element) {
        element.appendChild(svgResult.svg);
      } else {
        let graphDiv: any;

        if (window.innerWidth <= 575) {
          graphDiv = document.getElementById("graph-div-mobile");
        } else {
          graphDiv = document.getElementById("graph-div");
        }
        graphDiv.appendChild(svgResult.svg);
      }
    }

  };


  const handleGraphForces = async (graphNewData: any, makingFrom: any) => {
    let element: any;

    if (window.innerWidth <= 575) {
      element = document.getElementById("graph-div-mobile");
    } else {
      element = document.getElementById("graph-div");
    }
    let graphWidth = element.offsetWidth;
    let graphHeight = element.offsetHeight;

    function WanderGraph(
      { nodes, links }: { nodes: any; links: any },
      {
        nodeId = (d: any) => d.id, // given d in nodes, returns a unique identifier (string)
        nodeGroup = null, // given d in nodes, returns an (ordinal) value for color
        nodeGroups = null as any[] | null, // an array of ordinal values representing the node groups
        nodeTitle, // given d in nodes, a title string
        nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
        nodeStroke = "#fff", // node stroke color
        nodeStrokeWidth = 0, // node stroke width, in pixels
        nodeStrokeOpacity = 1, // node stroke opacity
        nodeRadius = 4, // node radius, in pixels
        nodeStrength = -30,
        linkSource = ({ source }: { source: string }) => source, // Specify the type as string
        linkTarget = ({ target }: { target: string }) => target, // Specify the type as string
        linkStroke = graphLinkColor, // link stroke color
        linkStrokeOpacity = 1, // link stroke opacity
        linkStrokeWidth = 0.5, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength = 0.3,
        colors = d3.schemeTableau10, // an array of color strings, for the node groups
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        invalidation = undefined // when this promise resolves, stop the simulation
      }: {
        nodeId?: (d: any) => string;
        nodeGroup?: ((node: any) => string) | null;
        nodeGroups?: any[] | null;
        nodeTitle?: ((node: any, index: number) => string) | null;
        nodeFill?: string;
        nodeStroke?: string;
        nodeStrokeWidth?: number;
        nodeStrokeOpacity?: number;
        nodeRadius?: number;
        nodeStrength?: number;
        linkSource?: (d: any) => string;
        linkTarget?: (d: any) => string;
        linkStroke?: string;
        linkStrokeOpacity?: number;
        linkStrokeWidth?: number;
        linkStrokeLinecap?: string;
        linkStrength?: number;
        colors?: any;
        width?: number;
        height?: number;
        invalidation?: any;
      } = {}
    ) {
      // Compute values.
      const N = d3.map(nodes, nodeId).map(intern);
      const LS = d3.map(links, linkSource).map(intern);
      const LT = d3.map(links, linkTarget).map(intern);
      if (nodeTitle === undefined) nodeTitle = (_: any, i: any) => N[i];

      const T: any = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
      const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
      const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
      const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);


      console.log('In handleGraphForces>WanderGraph')




      let formattingNodes: any = []
      let notFoundNodes: any = []

      nodes.forEach((eachNode: any) => {
        const matchingNodeIndex = previousGraphData.nodes.findIndex((prevNode: any) => prevNode.id === eachNode.id);

        if (matchingNodeIndex !== -1) {
          formattingNodes.push(previousGraphData.nodes[matchingNodeIndex]);
        } else {
          notFoundNodes.push(eachNode)
          // const nodeArray = Object.entries(eachNode).map(([key, value]) => ({ [key]: value }));
          // console.log('nodeArray' , nodeArray)
          // currentNodeMap = d3.map(nodes, (_, i) => ({ id: N[i], tag: nodes[i].tag }));
          // const currentNodeMap = d3.map(nodeArray, (_, i) => ({ id: N[i], tag: nodeArray[i].tag }));
          // console.log('currentNodeMap',currentNodeMap)
        }
      });

      // setPreviousGraphData({})

      // const notFoundNodesMap = d3.map(notFoundNodes, (_, i) => ({ id: N[i], tag: notFoundNodes[i].tag }));
      // const allNodes = formattingNodes.concat(notFoundNodesMap);
      // nodes = [...allNodes]

      nodes = d3.map(nodes, (_, i) => ({ id: N[i], tag: nodes[i].tag }));
      links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));
      // const linksCopy = _.cloneDeep(links)
      // console.log('nodes' , nodes,'links' , links)

      // const formattingNodesMap:any = new Map(formattingNodes.map((node:any) => [node.id, node]));
      let formattingNodeCopy = formattingNodes;

      nodes.forEach((node: any, index: any) => {
        const nodeReplacement = formattingNodeCopy.find((eachnode: any) => eachnode.id === node.id);
        if (nodeReplacement) {
          nodeReplacement.fx = nodeReplacement.x;
          nodeReplacement.fy = nodeReplacement.y;

          // Update the node in the nodes array
          nodes[index] = nodeReplacement;
        }
      })

      // console.log('inside graph checker' , graphResizeChecker)
      if (!graphResizeChecker) {
        nodes.forEach((node: any) => {
          node.fx = null;
          node.fy = null;
        });
      }


      links.forEach((link: any, index: any) => {
        if (typeof link.source === 'string') {
          const sourceObject = formattingNodeCopy.find((node: any) => node.id === link.source);
          if (sourceObject) {
            links[index].source = sourceObject
          }
        }

        // Check if target is a string, and convert it to an object if needed
        if (typeof link.target === 'string') {
          const targetObject = formattingNodeCopy.find((node: any) => node.id === link.target);
          if (targetObject) {
            links[index].target = targetObject
          }
        }
      });


      // Compute default domains.
      // if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

      // Construct the scales.
      // const color = nodeGroup === null ? null : d3.scaleOrdinal(nodeGroups!, colors);

      // Construct the forces.
      const forceNode = d3.forceManyBody();
      const forceLink = d3.forceLink(links).id(({ index: i = 0 }) => N[i]);
      if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
      if (linkStrength !== undefined) forceLink.strength(linkForceValue);


      function ticked() {

        // console.log('ticked')

        link
          .attr("x1", (d: any) => {
            const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
              return checkEachNode.id === d.source.id
            })
            if (xmark) {
              return xmark.x
            }
            else {
              // console.log('d',d)
              if (nodes) {
                const sourceXMark = nodes.find((checkEachNode: any) => {
                  return checkEachNode.id === d.source.id
                })
                if (sourceXMark) {
                  return sourceXMark.x
                }
              }
            }
          })
          .attr("y1", (d: any) => {
            const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
              return checkEachNode.id === d.source.id
            })
            if (xmark) {
              return xmark.y
            }
            else {
              // console.log('d',d)
              if (nodes) {
                const sourceXMark = nodes.find((checkEachNode: any) => {
                  return checkEachNode.id === d.source.id
                })
                if (sourceXMark) {
                  return sourceXMark.y
                }
              }
            }
          })
          .attr("x2", (d: any) => {
            return d.target.x
          })
          .attr("y2", (d: any) => {
            return d.target.y
          });


        node
          .attr("transform", (d: any) => `translate(${d.x} ${d.y})`);



        // node
        //   .attr('cx', (d: any) => d.x)
        //   .attr('cy', (d: any) => d.y)

        // .attr("cx", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.x
        //   }
        //   else {
        //     return d.x
        //   }
        // })
        // .attr("x", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.x
        //   }
        //   else {
        //     return d.x
        //   }
        // })
        // .attr("y", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.y
        //   }
        //   else {
        //     return d.y
        //   }
        // })
        // .attr("cy", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.y
        //   }
        //   else {
        //     return d.y
        //   }
        // });


        // if (tickCount % 5 === 0) {
        //   nodeText
        //     .attr("x", (d: any) => {
        //       const xmark = formattingNodeCopy.find((checkEachNode: any) => checkEachNode.id === d.id);
        //       return xmark ? xmark.x - (getNodeTextWidth(d) / 4.5) : d.x - (getNodeTextWidth(d) / 4.5);
        //     })
        //     .attr("y", (d: any) => {
        //       const xmark = formattingNodeCopy.find((checkEachNode: any) => checkEachNode.id === d.id)
        //       return xmark ? xmark.y + 12 : d.y + 12;
        //     });
        // }

        // tickCount++


        // nodeTitles
        //   .text((d: any) => {
        //     const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
        //       return checkEachNode.id === d.id
        //     })
        //     if (xmark) {
        //       return xmark.id
        //     }
        //     else {
        //       return d.id
        //     }
        //   });

        formattingNodes = []
        formattingNodeCopy = []
      }

      function zoomed(event: any) {
        container.attr("transform", event.transform);
      }

      function getColorByTag(tag: string) {

        const themeBasedColors = themeChangericon ? showAddGraphNodeColor.find((group: any) => group.mode === "light mode") : showAddGraphNodeColor.find((group: any) => group.mode === "dark mode");

        const tagColors: Record<string, string> = {};
        themeBasedColors.data.forEach((colorGroup: any) => {
          const tag = colorGroup.tag;
          tagColors[tag] = colorGroup.color;
        });


        for (const word of tag) {
          if (tagColors[word]) {
            return tagColors[word];
          }
        }

        return nodeFill;
      }

      function handleNodeClick(event: any, d: any) {
        // console.log(event, d);
        setFileOpenedFromGraph(d);
        // Get the div element and set its content based on the clicked node
        const nodeInfoDiv: any = document.getElementById("nodeInfo");
        // nodeInfoDiv.innerHTML = `<strong>ID:</strong> ${d.id}<br><strong>Tag:</strong> ${d.tag}`;

        // Position the div over the clicked node
        nodeInfoDiv.style.left = `${event.pageX - 30}px`;
        nodeInfoDiv.style.top = `${event.pageY - 35}px`;



        // Show the div
        nodeInfoDiv.style.display = "flex";

        // Prevent the click event from propagating further (e.g., to zoom or drag)
        event.stopPropagation();
      }

      function hideNodeInfo() {
        const nodeInfoDiv: any = document.getElementById("nodeInfo");
        if (nodeInfoDiv) {
          nodeInfoDiv.style.display = "none";
        }
      }

      function intern(value: any) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
      }

      function getNodeTextWidth(d: any) {
        // Create a hidden div to measure the text width
        const tempDiv: any = d3.select('body')
          .append('div')
          .attr('class', 'temp-text-container')
          .style('position', 'absolute')
          .style('visibility', 'hidden')
          .text(d.id);

        // Get the width of the hidden div
        const textWidth = tempDiv.node().getBoundingClientRect().width;

        // Remove the temporary div from the DOM
        tempDiv.remove();

        return textWidth;
      }

      function handleMouseOver(this: any, event: any, d: any) {

        // console.log('event' , event, 'nodes' , nodes)

        // Set the initial state before transitioning
        d3.select(this as SVGElement)
          // .attr("fill", "red") // Change to your desired color
          // .attr("r", calculateNodeRadius(d) * 1.1) // Optionally, increase the node size
          .transition()
          .duration(400)
          .attr("fill-opacity", 1); // Set initial opacity to 1

        // Initialize the links with their original stroke color and opacity
        link
          .attr("stroke", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return linkStroke; // Original link color
            } else {
              return linkStroke;
            }
          })
          .attr("stroke-opacity", linkStrokeOpacity);

        // Initialize the nodes with their original fill color and opacity
        node
          .attr("fill-opacity", (nodeData: any) => {
            if (nodeData === d) {
              return 1; // Opacity of the hovered node
            } else if (areNodesConnected(nodeData, d)) {
              return 1; // Opacity of directly connected nodes
            } else {
              return 0.1; // Opacity of other nodes
            }
          });

        // nodeText
        //   .transition().duration(300)
        //   .style('opacity', (nodeData: any) => {
        //     if (nodeData === d) {
        //       return 1
        //     } else if (areNodesConnected(nodeData, d)) {
        //       return 1
        //     } else {
        //       return 0.1
        //     }
        //   })
        //   .style("font-size", (nodeData: any) => {
        //     return nodeData === d ? '12px' : nodeTextSize
        //   })

        // Start the transition
        d3.select(this as SVGElement)
          .select('circle')
          .transition()
          .duration(400) // Transition duration in milliseconds
          .attr("r", calculateNodeRadius(d) * 1.2); // Optionally, increase the node size


        d3.select(this)
          .select('text')
          .transition()
          .duration(400)
          .style("font-size", (nodeData: any) => {
            return nodeData.id === d.id ? '12px' : nodeTextSize
          })
          .attr("dy", function (d: any, i: number) {
            return nodeRadius + 20 + "px"
          })

        // Change the color of the links directly connected to the hovered node
        link
          .transition()
          .duration(400)
          .attr("stroke", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return linkStroke; // Change to your desired link color
            } else {
              return linkStroke;
            }
          });

        // Transition to reduce the opacity of nodes that are not directly connected
        node
          .transition()
          .duration(400)
          .attr("fill-opacity", (nodeData: any) => {
            if (nodeData === d) {
              return 1; // Opacity of the hovered node
            } else if (areNodesConnected(nodeData, d)) {
              return 1; // Opacity of directly connected nodes
            } else {
              return 0.1; // Opacity of other nodes
            }
          });

        // nodeText
        //   .transition()
        //   .duration(600)
        //   .style('opacity' , (nodeData:any) => {
        //     if (nodeData === d) {
        //       return 1
        //     } else if (areNodesConnected(nodeData , d)) {
        //       return 1
        //     } else {
        //       return 0.1
        //     }
        //   })

        // Transition to reduce the opacity of links that are not directly connected
        link
          .transition()
          .duration(600)
          .attr("stroke-opacity", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return 1; // Opacity of links directly connected to the hovered node
            } else {
              return 0.1; // Opacity of other links
            }
          });



        // console.log("Hovered Nodes:", hoveredNodes);
      }

      function handleMouseOut(this: any, d: any) {

        let tempMouseOverNode
        const nodeData = d.fromElement.__data__;

        // if (d.fromElement) {
        //   tempMouseOverNode = d.fromElement.getAttribute("id");
        // } else {
        //   tempMouseOverNode = d.target.getAttribute("id");
        // }

        if (nodeData && nodeData.id) {
          tempMouseOverNode = nodeData.id;
        } else if (d.target) {
          // For non-Firefox browsers or when __data__ is not available
          tempMouseOverNode = d.target.getAttribute("id");
        } else if (d.relatedTarget) {
          // For Firefox
          tempMouseOverNode = d.relatedTarget.getAttribute("id");
        }

        const nodeObject = { id: tempMouseOverNode.replace("node-", "") };

        d3.select(this)
          // .attr("fill", nodeFill) // Reset to the original node color
          // .attr("r", calculateNodeRadius(nodeObject)) // Reset to the original node size
          .transition()
          .duration(400)
          .attr("fill-opacity", 1);


        d3.select(this)
          .select('circle') // Select the nested circle element
          .transition()
          .duration(400)
          .attr("r", calculateNodeRadius(nodeObject));

        d3.select(this)
          .select('text')
          .transition()
          .duration(400)
          .style('opacity', 1)
          .style("font-size", `${nodeTextSize}px`)
          .attr("dy", function (d: any, i: number) {
            return nodeRadius + 10 + "px"
          })


        // Reset the color and opacity of all links to their original values with a transition
        link
          .transition()
          .duration(400)
          .attr("stroke", linkStroke)
          .attr("stroke-opacity", linkStrokeOpacity);

        // Reset the opacity of all nodes to their original value with a transition
        node
          .transition()
          .duration(200)
          .attr("fill-opacity", 1);

        // nodeText
        // .transition()
        // .duration(200)
        //   .style('opacity', 1)
        //   .style('font-size', `${nodeTextSize}px`)

      }

      function areNodesConnected(node1: any, node2: any) {
        return links.some((linkData: any) => {
          return (
            (linkData.source === node1 && linkData.target === node2) ||
            (linkData.source === node2 && linkData.target === node1)
          );
        });
      }

      function drag(simulation: any) {
        function dragstarted(event: any) {

          if (!event.active) simulation.alphaTarget(0.1).restart();
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

      function calculateNodeRadius(d: any) {
        const linkCount = links.filter((link: any) => link.source.id === d.id).length;
        if (linkCount <= 4) {
          return nodeRadius;
        } else {
          let checkLinkCount = linkCount - 4
          let onePercentOfCheckLinkCount = 0.12 * checkLinkCount;

          return onePercentOfCheckLinkCount + 4;
        }
      }

      function hasLinks(node: any) {
        // Assuming links is your array of links
        // Replace links with your actual links data structure
        // const links:any = [];  // Replace this with your actual links data

        // Check if the node's ID is present in any link's source or target
        return links.some((link: any) => link.source.id === node.id || link.target.id === node.id);
      }

      const customNodes: any = nodes;


      const simulation = d3
        .forceSimulation(customNodes)
        .force("link", forceLink)
        .force("charge", d3.forceManyBody().strength(sliderValue))
        .force("center", d3.forceCenter().strength(centerForceValue))
        .force("forceX", d3.forceX(0).strength(function (d) { return hasLinks(d) ? 0 : 0.05; }))
        .force("forceY", d3.forceY(0).strength(function (d) { return hasLinks(d) ? 0 : 0.05; }))
        .force('collide', d3.forceCollide((d) => {
          let radius = calculateNodeRadius(d)
          return radius + 15
        }))
        .on("tick", ticked);

      // const svg = d3
      // .create("svg")
      // .attr("width", graphSize.width)
      // .attr("height", graphSize.height)
      // .attr("viewBox", [-graphSize.width / 2, -graphSize.height / 2, graphSize.width, graphSize.height])
      // .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      // .style("transition", "fill-opacity 0.2s, stroke-opacity 0.2s");


      // const svg:any = document.querySelector("#graph-div svg");
      let svgContainer;

      if (window.innerWidth <= 575) {
        svgContainer = d3.select('#graph-div-mobile');
      } else {
        svgContainer = d3.select('#graph-div');
      }
      const gElement = svgContainer.select('svg');
      const svg = gElement.select('g');

      // console.log('graphsize now ' , graphSize)
      gElement.attr('width', graphSize.width).attr('height', graphSize.height)
      gElement.attr('viewBox', [-graphSize.width / 2, -graphSize.height / 2, graphSize.width, graphSize.height])

      const container = svg

      container.select("#links-g-tag").remove();
      const link = container.append("g")
        .attr("id", "links-g-tag")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr(
          "stroke-width",
          typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null
        )
        .attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .data(links)
        .join("line");


      container.select("#nodes-g-tag").remove();
      const node = container.append("g")
        .attr("id", "nodes-g-tag")
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
        // .selectAll("circle")
        .selectAll("g")
        .data(nodes)
        // .join("circle")
        .join("g")
        .attr("id", (d: any) => `node-${d.id}`)
        .attr("r", function (d) {
          return calculateNodeRadius(d);
        })
        .attr("fill", (d: any) => {
          const color = getColorByTag(d.tag);
          return color;
        })
        .on("mouseover", handleMouseOver) // Add mouseover event listener
        .on("mouseout", handleMouseOut)
        .on("click", handleNodeClick)
        .classed("node-pointer", true)
        .call(drag(simulation) as any, drag(simulation));


      node.append("circle")
        .attr("r", (d: any) => {
          const radius = calculateNodeRadius(d)
          return radius;
        })

      node.append("text")
        .text(function (d: any, i: number) {
          return T[i];
        })
        .attr("dy", function (d: any, i: number) {
          return nodeRadius + 10 + "px"
        })
        .attr("text-anchor", "middle")
        .attr("font-size", nodeTextSize)
        .attr("fill", textColorForNode)
        .style("pointer-events", "none")


      // // Append text labels to the container, positioned near the nodes
      // container.select("#text-g-tag").remove();
      // const nodeText = container
      //   .append("g")
      //   .attr("id", "text-g-tag")
      //   .selectAll("title")
      //   .data(nodes)
      //   .join("text")
      //   // .attr("x", (d) => d.x + 12) // Adjust the x-coordinate based on your preference
      //   // .attr("y", (d) => d.y) // Adjust the y-coordinate based on your preference
      //   .attr("x", (d: any) => d.x) // Keep the x-coordinate the same as the node
      //   .attr("y", (d: any) => d.y + nodeRadius + 12)
      //   .attr("dy", ".35em") // Adjust the vertical alignment based on your preference
      //   .attr("font-size", nodeTextSize) // Adjust the font size based on your preference
      //   .style("pointer-events", "none")
      //   .text((d: any) => d.id)
      //   .attr('fill', textColorForNode);

      // container.select("#titles-g-tag").remove();
      // const nodeTitles = container
      //   .append("g")
      //   .attr("id", "titles-g-tag")
      //   .selectAll("title")
      //   .data(nodes)
      //   .join("title")
      //   .text((d: any) => d.id);


      const zoom: any = d3.zoom().on("zoom", zoomed);
      svgContainer.call(zoom);

      document.addEventListener("click", hideNodeInfo);



      // // In the ticked function, update the positions of text and title elements

      // if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
      // if (L) link.attr("stroke", ({ index: i }) => L[i]);
      if (W) link.attr("stroke-width", (d: any, i: any) => `${W[i]}`);
      if (L) link.attr("stroke", (d: any, i: any) => `${L[i]}`);
      // if (G && color) {
      //   node.attr("fill", (_:any, i:any) => color(G[i]));
      // }
      // if (T) {
      //   node.append("title").text((d: any, i: any) => String(T[i]));
      // }

      if (invalidation != null) {
        (invalidation as Promise<void>).then(() => {
          // Handle invalidation here
          simulation.stop();
        });
      }

      const svgElement = svg.node() as SVGSVGElement;
      const result = {
        // scales: { color },
        svg: svgElement,
      };




      const previousNodes = [...nodes]
      const previousLinks = [...links]

      setPreviousGraphData({ nodes: previousNodes, links: previousLinks })

      // console.log('check graph data')  

      return result;

      // return Object.assign(svg.node(), { scales: { color } });
    }

    function slidersGraph(
      { nodes, links }: { nodes: any; links: any },
      {
        nodeId = (d: any) => d.id, // given d in nodes, returns a unique identifier (string)
        nodeGroup = null, // given d in nodes, returns an (ordinal) value for color
        nodeGroups = null as any[] | null, // an array of ordinal values representing the node groups
        nodeTitle, // given d in nodes, a title string
        nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
        nodeStroke = "#fff", // node stroke color
        nodeStrokeWidth = 0, // node stroke width, in pixels
        nodeStrokeOpacity = 1, // node stroke opacity
        nodeRadius = 4, // node radius, in pixels
        nodeStrength = -30,
        linkSource = ({ source }: { source: string }) => source, // Specify the type as string
        linkTarget = ({ target }: { target: string }) => target, // Specify the type as string
        linkStroke = graphLinkColor, // link stroke color
        linkStrokeOpacity = 1, // link stroke opacity
        linkStrokeWidth = 0.5, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength = 0.3,
        colors = d3.schemeTableau10, // an array of color strings, for the node groups
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        invalidation = undefined // when this promise resolves, stop the simulation
      }: {
        nodeId?: (d: any) => string;
        nodeGroup?: ((node: any) => string) | null;
        nodeGroups?: any[] | null;
        nodeTitle?: ((node: any, index: number) => string) | null;
        nodeFill?: string;
        nodeStroke?: string;
        nodeStrokeWidth?: number;
        nodeStrokeOpacity?: number;
        nodeRadius?: number;
        nodeStrength?: number;
        linkSource?: (d: any) => string;
        linkTarget?: (d: any) => string;
        linkStroke?: string;
        linkStrokeOpacity?: number;
        linkStrokeWidth?: number;
        linkStrokeLinecap?: string;
        linkStrength?: number;
        colors?: any;
        width?: number;
        height?: number;
        invalidation?: any;
      } = {}
    ) {
      // Compute values.
      const N = d3.map(nodes, nodeId).map(intern);
      const LS = d3.map(links, linkSource).map(intern);
      const LT = d3.map(links, linkTarget).map(intern);
      if (nodeTitle === undefined) nodeTitle = (_: any, i: any) => N[i];

      const T: any = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
      const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
      const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
      const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

      // Replace the input nodes and links with mutable objects for the simulation.

      console.log('In handleGraphForces>sliderGraph')




      let formattingNodes: any = []
      let notFoundNodes: any = []

      nodes.forEach((eachNode: any) => {
        const matchingNodeIndex = previousGraphData.nodes.findIndex((prevNode: any) => prevNode.id === eachNode.id);

        if (matchingNodeIndex !== -1) {
          formattingNodes.push(previousGraphData.nodes[matchingNodeIndex]);
        } else {
          notFoundNodes.push(eachNode)
          // const nodeArray = Object.entries(eachNode).map(([key, value]) => ({ [key]: value }));
          // console.log('nodeArray' , nodeArray)
          // currentNodeMap = d3.map(nodes, (_, i) => ({ id: N[i], tag: nodes[i].tag }));
          // const currentNodeMap = d3.map(nodeArray, (_, i) => ({ id: N[i], tag: nodeArray[i].tag }));
          // console.log('currentNodeMap',currentNodeMap)
        }
      });

      nodes = d3.map(nodes, (_, i) => ({ id: N[i], tag: nodes[i].tag }));
      links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));
      // const linksCopy = _.cloneDeep(links)
      // console.log('nodes' , nodes,'links' , links)

      // const formattingNodesMap:any = new Map(formattingNodes.map((node:any) => [node.id, node]));
      let formattingNodeCopy = formattingNodes;

      nodes.forEach((node: any, index: any) => {
        const nodeReplacement = formattingNodeCopy.find((eachnode: any) => eachnode.id === node.id);
        if (nodeReplacement) {
          nodeReplacement.fx = nodeReplacement.x;
          nodeReplacement.fy = nodeReplacement.y;

          // Update the node in the nodes array
          nodes[index] = nodeReplacement;
        }
      })

      // console.log('inside graph checker' , graphResizeChecker)
      if (!graphResizeChecker && nodeSizeChangeChecker) {
        nodes.forEach((node: any) => {
          node.fx = null;
          node.fy = null;
        });
      }


      links.forEach((link: any, index: any) => {
        if (typeof link.source === 'string') {
          const sourceObject = formattingNodeCopy.find((node: any) => node.id === link.source);
          if (sourceObject) {
            links[index].source = sourceObject
          }
        }

        // Check if target is a string, and convert it to an object if needed
        if (typeof link.target === 'string') {
          const targetObject = formattingNodeCopy.find((node: any) => node.id === link.target);
          if (targetObject) {
            links[index].target = targetObject
          }
        }
      });


      // Compute default domains.
      // if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

      // Construct the scales.
      // const color = nodeGroup === null ? null : d3.scaleOrdinal(nodeGroups!, colors);

      // Construct the forces.
      const forceNode = d3.forceManyBody();
      const forceLink = d3.forceLink(links).id(({ index: i = 0 }) => N[i]);
      if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
      if (linkStrength !== undefined) forceLink.strength(linkForceValue);



      function ticked() {


        link
          .attr("x1", (d: any) => {
            const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
              return checkEachNode.id === d.source.id
            })
            if (xmark) {
              return xmark.x
            }
            else {
              // console.log('d',d)
              if (nodes) {
                const sourceXMark = nodes.find((checkEachNode: any) => {
                  return checkEachNode.id === d.source.id
                })
                if (sourceXMark) {
                  return sourceXMark.x
                }
              }
            }
          })
          .attr("y1", (d: any) => {
            const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
              return checkEachNode.id === d.source.id
            })
            if (xmark) {
              return xmark.y
            }
            else {
              // console.log('d',d)
              if (nodes) {
                const sourceXMark = nodes.find((checkEachNode: any) => {
                  return checkEachNode.id === d.source.id
                })
                if (sourceXMark) {
                  return sourceXMark.y
                }
              }
            }
          })
          .attr("x2", (d: any) => {
            return d.target.x
          })
          .attr("y2", (d: any) => {
            return d.target.y
          });

        node.attr("transform", (d: any) => `translate(${d.x} ${d.y})`);


        // node
        //   .attr('cx', (d: any) => d.x)
        //   .attr('cy', (d: any) => d.y)
        // .attr("cx", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.x
        //   }
        //   else {
        //     return d.x
        //   }
        // })
        // .attr("x", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.x
        //   }
        //   else {
        //     return d.x
        //   }
        // })
        // .attr("y", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.y
        //   }
        //   else {
        //     return d.y
        //   }
        // })
        // .attr("cy", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.y
        //   }
        //   else {
        //     return d.y
        //   }
        // });


        // if (tickCount % 5 === 0) {
        //   nodeText
        //     .attr("x", (d: any) => {
        //       const xmark = formattingNodeCopy.find((checkEachNode: any) => checkEachNode.id === d.id);
        //       return xmark ? xmark.x - (getNodeTextWidth(d) / 4.5) : d.x - (getNodeTextWidth(d) / 4.5);
        //     })
        //     .attr("y", (d: any) => {
        //       const xmark = formattingNodeCopy.find((checkEachNode: any) => checkEachNode.id === d.id)
        //       return xmark ? xmark.y + 12 : d.y + 12;
        //     });
        // }

        // tickCount++


        // nodeTitles
        //   .text((d: any) => {
        //     const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
        //       return checkEachNode.id === d.id
        //     })
        //     if (xmark) {
        //       return xmark.id
        //     }
        //     else {
        //       return d.id
        //     }
        //   });

        formattingNodes = []
        formattingNodeCopy = []


        // console.log('link',link)
      }

      function zoomed(event: any) {
        container.attr("transform", event.transform);
      }

      function getColorByTag(tag: string) {

        const themeBasedColors = themeChangericon ? showAddGraphNodeColor.find((group: any) => group.mode === "light mode") : showAddGraphNodeColor.find((group: any) => group.mode === "dark mode");

        const tagColors: Record<string, string> = {};
        themeBasedColors.data.forEach((colorGroup: any) => {
          const tag = colorGroup.tag;
          tagColors[tag] = colorGroup.color;
        });


        for (const word of tag) {
          if (tagColors[word]) {
            return tagColors[word];
          }
        }

        return nodeFill;
      }

      function handleNodeClick(event: any, d: any) {
        // console.log(event, d);
        setFileOpenedFromGraph(d);
        // Get the div element and set its content based on the clicked node
        const nodeInfoDiv: any = document.getElementById("nodeInfo");
        // nodeInfoDiv.innerHTML = `<strong>ID:</strong> ${d.id}<br><strong>Tag:</strong> ${d.tag}`;

        // Position the div over the clicked node
        nodeInfoDiv.style.left = `${event.pageX - 30}px`;
        nodeInfoDiv.style.top = `${event.pageY - 35}px`;



        // Show the div
        nodeInfoDiv.style.display = "flex";

        // Prevent the click event from propagating further (e.g., to zoom or drag)
        event.stopPropagation();
      }

      function hideNodeInfo() {
        const nodeInfoDiv: any = document.getElementById("nodeInfo");
        if (nodeInfoDiv) {
          nodeInfoDiv.style.display = "none";
        }
      }

      function intern(value: any) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
      }

      function getNodeTextWidth(d: any) {
        // Create a hidden div to measure the text width
        const tempDiv: any = d3.select('body')
          .append('div')
          .attr('class', 'temp-text-container')
          .style('position', 'absolute')
          .style('visibility', 'hidden')
          .text(d.id);

        // Get the width of the hidden div
        const textWidth = tempDiv.node().getBoundingClientRect().width;

        // Remove the temporary div from the DOM
        tempDiv.remove();

        return textWidth;
      }

      function handleMouseOver(this: any, event: any, d: any) {

        // Set the initial state before transitioning
        d3.select(this as SVGElement)
          .transition()
          .duration(400)
          // .attr("fill", "red") // Change to your desired color
          // .attr("r", calculateNodeRadius(d) * 1.1) // Optionally, increase the node size
          .attr("fill-opacity", 1); // Set initial opacity to 1

        // Initialize the links with their original stroke color and opacity
        link
          .attr("stroke", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return linkStroke; // Original link color
            } else {
              return linkStroke;
            }
          })
          .attr("stroke-opacity", linkStrokeOpacity);

        // Initialize the nodes with their original fill color and opacity
        node
          .attr("fill-opacity", (nodeData: any) => {
            if (nodeData === d) {
              return 1; // Opacity of the hovered node
            } else if (areNodesConnected(nodeData, d)) {
              return 1; // Opacity of directly connected nodes
            } else {
              return 0.1; // Opacity of other nodes
            }
          });

        // nodeText
        //   .transition().duration(300)
        //   .style('opacity', (nodeData: any) => {
        //     if (nodeData === d) {
        //       return 1
        //     } else if (areNodesConnected(nodeData, d)) {
        //       return 1
        //     } else {
        //       return 0.1
        //     }
        //   })
        //   .style("font-size", (nodeData: any) => {
        //     return nodeData === d ? '12px' : nodeTextSize
        //   })

        // Start the transition
        d3.select(this as SVGElement)
          .select('circle')
          .transition()
          .duration(400)
          .attr("r", calculateNodeRadius(d) * 1.2);


        d3.select(this)
          .select('text')
          .transition()
          .duration(400)
          .style("font-size", (nodeData: any) => {
            return nodeData.id === d.id ? '12px' : nodeTextSize
          })
          .attr("dy", function (d: any, i: number) {
            return nodeRadius + 20 + "px"
          })

        // Change the color of the links directly connected to the hovered node
        link
          .transition()
          .duration(400)
          .attr("stroke", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return linkStroke; // Change to your desired link color
            } else {
              return linkStroke;
            }
          });

        // Transition to reduce the opacity of nodes that are not directly connected
        node
          .transition()
          .duration(400)
          .attr("fill-opacity", (nodeData: any) => {
            if (nodeData === d) {
              return 1; // Opacity of the hovered node
            } else if (areNodesConnected(nodeData, d)) {
              return 1; // Opacity of directly connected nodes
            } else {
              return 0.1; // Opacity of other nodes
            }
          });

        // nodeText
        //   .transition()
        //   .duration(600)
        //   .style('opacity' , (nodeData:any) => {
        //     if (nodeData === d) {
        //       return 1
        //     } else if (areNodesConnected(nodeData , d)) {
        //       return 1
        //     } else {
        //       return 0.1
        //     }
        //   })

        // Transition to reduce the opacity of links that are not directly connected
        link
          .transition()
          .duration(400)
          .attr("stroke-opacity", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return 1; // Opacity of links directly connected to the hovered node
            } else {
              return 0.1; // Opacity of other links
            }
          });



        // console.log("Hovered Nodes:", hoveredNodes);
      }

      function handleMouseOut(this: any, d: any) {
        let tempMouseOverNode
        const nodeData = d.fromElement.__data__;

        // if (d.fromElement) {
        //   tempMouseOverNode = d.fromElement.getAttribute("id");
        // } else {
        //   tempMouseOverNode = d.target.getAttribute("id");
        // }



        if (nodeData && nodeData.id) {
          tempMouseOverNode = nodeData.id;
        } else if (d.target) {
          // For non-Firefox browsers or when __data__ is not available
          tempMouseOverNode = d.target.getAttribute("id");
        } else if (d.relatedTarget) {
          // For Firefox
          tempMouseOverNode = d.relatedTarget.getAttribute("id");
        }

        const nodeObject = { id: tempMouseOverNode.replace("node-", "") };

        d3.select(this)
          // .attr("fill", nodeFill) // Reset to the original node color
          // .attr("r", calculateNodeRadius(nodeObject)) // Reset to the original node size
          .transition()
          .duration(400)
          .attr("fill-opacity", 1);

        d3.select(this)
          .select('circle') // Select the nested circle element
          .transition()
          .duration(400)
          .attr("r", calculateNodeRadius(nodeObject));

        d3.select(this)
          .select('text')
          .transition()
          .duration(400)
          .style('opacity', 1)
          .style("font-size", `${nodeTextSize}px`)
          .attr("dy", function (d: any, i: number) {
            return nodeRadius + 10 + "px"
          })

        // Reset the color and opacity of all links to their original values with a transition
        link
          .transition()
          .duration(400)
          .attr("stroke", linkStroke)
          .attr("stroke-opacity", linkStrokeOpacity);

        // Reset the opacity of all nodes to their original value with a transition
        node.transition()
          .duration(200)
          .attr("fill-opacity", 1);



        // nodeText.transition().duration(200)
        //   .style('opacity', 1)
        //   .style("font-size", (nodeData: any) => {
        //     let orginalNodeSize = nodeTextSize + 'px'
        //     return orginalNodeSize
        //   })

      }

      function areNodesConnected(node1: any, node2: any) {
        return links.some((linkData: any) => {
          return (
            (linkData.source === node1 && linkData.target === node2) ||
            (linkData.source === node2 && linkData.target === node1)
          );
        });
      }

      function drag(simulation: any) {
        function dragstarted(event: any) {

          if (!event.active) simulation.alphaTarget(0.1).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
          nodes.forEach((node: any) => {
            node.fx = null;
            node.fy = null;
          });
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

      function calculateNodeRadius(d: any) {
        const linkCount = links.filter((link: any) => link.source.id === d.id).length;
        if (linkCount <= 4) {
          return nodeRadius;
        } else {
          let checkLinkCount = linkCount - 4
          let onePercentOfCheckLinkCount = 0.12 * checkLinkCount;

          return onePercentOfCheckLinkCount + 4;
        }
      }

      function hasLinks(node: any) {

        // Check if the node's ID is present in any link's source or target
        return links.some((link: any) => link.source.id === node.id || link.target.id === node.id);
      }

      const customNodes: any = nodes;


      const simulation = d3
        .forceSimulation(customNodes)
        .force("link", forceLink)
        .force("charge", d3.forceManyBody().strength(sliderValue))
        .force("center", d3.forceCenter().strength(centerForceValue))
        .force("forceX", d3.forceX(0).strength(function (d) { return hasLinks(d) ? 0.02 : 0.05; }))
        .force("forceY", d3.forceY(0).strength(function (d) { return hasLinks(d) ? 0.02 : 0.05; }))
        .force('collide', d3.forceCollide((d) => {
          let radius = calculateNodeRadius(d)
          return radius + 15
        }))
        .on("tick", ticked);

      // const svg = d3
      // .create("svg")
      // .attr("width", graphSize.width)
      // .attr("height", graphSize.height)
      // .attr("viewBox", [-graphSize.width / 2, -graphSize.height / 2, graphSize.width, graphSize.height])
      // .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      // .style("transition", "fill-opacity 0.2s, stroke-opacity 0.2s");


      // const svg:any = document.querySelector("#graph-div svg");
      let svgContainer;

      if (window.innerWidth <= 575) {
        svgContainer = d3.select('#graph-div-mobile');
      } else {
        svgContainer = d3.select('#graph-div');
      }
      const gElement = svgContainer.select('svg');
      const svg = gElement.select('g');

      gElement.attr('width', width).attr('height', height)
      gElement.attr('viewBox', [-width / 2, -height / 2, width, height])

      const container = svg

      container.select("#links-g-tag").remove();
      const link = container
        .append("g")
        .attr("id", "links-g-tag")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr(
          "stroke-width",
          typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null
        )
        .attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .data(links)
        .join("line");




      container.select("#nodes-g-tag").remove();
      const node = container
        .append("g")
        .attr("id", "nodes-g-tag")
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
        // .selectAll("circle")
        .selectAll("g")
        .data(nodes)
        // .join("circle")
        .join("g")
        .attr("id", (d: any) => `node-${d.id}`)
        // .attr("r", function (d) {
        //   return calculateNodeRadius(d);
        // })
        .attr("fill", (d: any) => {
          const color = getColorByTag(d.tag);
          return color;
        })
        .on("mouseover", handleMouseOver) // Add mouseover event listener
        .on("mouseout", handleMouseOut)
        .on("click", handleNodeClick)
        .classed("node-pointer", true)
        .call(drag(simulation) as any, drag(simulation));


      node.append("circle")
        .attr("r", (d: any) => {
          const radius = calculateNodeRadius(d)
          return radius;
        })

      node.append("text")
        .text(function (d: any, i: number) {
          return T[i];
        })
        .attr("dy", function (d: any, i: number) {
          return nodeRadius + 10 + "px"
        })
        .attr("text-anchor", "middle")
        .attr("font-size", nodeTextSize)
        .attr("fill", textColorForNode)
        .style("pointer-events", "none")


      // // Append text labels to the container, positioned near the nodes
      // container.select("#text-g-tag").remove();
      // const nodeText = container
      //   .append("g")
      //   .attr("id", "text-g-tag")
      //   .selectAll("title")
      //   .data(nodes)
      //   .join("text")
      //   // .attr("x", (d) => d.x + 12) // Adjust the x-coordinate based on your preference
      //   // .attr("y", (d) => d.y) // Adjust the y-coordinate based on your preference
      //   .attr("x", (d: any) => d.x) // Keep the x-coordinate the same as the node
      //   .attr("y", (d: any) => d.y + nodeRadius + 12)
      //   .attr("dy", ".35em") // Adjust the vertical alignment based on your preference
      //   .attr("font-size", nodeTextSize) // Adjust the font size based on your preference
      //   .style("pointer-events", "none")
      //   .text((d: any) => d.id)
      //   .attr('fill', textColorForNode);

      // container.select("#titles-g-tag").remove();
      // const nodeTitles = container
      //   .append("g")
      //   .attr("id", "titles-g-tag")
      //   .selectAll("title")
      //   .data(nodes)
      //   .join("title")
      //   .text((d: any) => d.id);


      const zoom: any = d3.zoom().on("zoom", zoomed);
      svgContainer.call(zoom);

      document.addEventListener("click", hideNodeInfo);



      // // In the ticked function, update the positions of text and title elements

      // if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
      // if (L) link.attr("stroke", ({ index: i }) => L[i]);
      if (W) link.attr("stroke-width", (d: any, i: any) => `${W[i]}`);
      if (L) link.attr("stroke", (d: any, i: any) => `${L[i]}`);
      // if (G && color) {
      //   node.attr("fill", (_:any, i:any) => color(G[i]));
      // }
      // if (T) {
      //   node.append("title").text((d: any, i: any) => String(T[i]));
      // }

      if (invalidation != null) {
        (invalidation as Promise<void>).then(() => {
          simulation.stop();
        });
      }

      const svgElement = svg.node() as SVGSVGElement;
      const result = {
        // scales: { color },
        svg: svgElement,
      };




      const previousNodes = [...nodes]
      const previousLinks = [...links]

      setPreviousGraphData({ nodes: previousNodes, links: previousLinks })

      return result;

      // return Object.assign(svg.node(), { scales: { color } });
    }

    function nodeTextChangeGraph(
      { nodes, links }: { nodes: any; links: any },
      {
        nodeId = (d: any) => d.id, // given d in nodes, returns a unique identifier (string)
        nodeGroup = null, // given d in nodes, returns an (ordinal) value for color
        nodeGroups = null as any[] | null, // an array of ordinal values representing the node groups
        nodeTitle, // given d in nodes, a title string
        nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
        nodeStroke = "#fff", // node stroke color
        nodeStrokeWidth = 0, // node stroke width, in pixels
        nodeStrokeOpacity = 1, // node stroke opacity
        nodeRadius = 4, // node radius, in pixels
        nodeStrength = -30,
        linkSource = ({ source }: { source: string }) => source, // Specify the type as string
        linkTarget = ({ target }: { target: string }) => target, // Specify the type as string
        linkStroke = graphLinkColor, // link stroke color
        linkStrokeOpacity = 1, // link stroke opacity
        linkStrokeWidth = 0.5, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength = 0.3,
        colors = d3.schemeTableau10, // an array of color strings, for the node groups
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        invalidation = undefined // when this promise resolves, stop the simulation
      }: {
        nodeId?: (d: any) => string;
        nodeGroup?: ((node: any) => string) | null;
        nodeGroups?: any[] | null;
        nodeTitle?: ((node: any, index: number) => string) | null;
        nodeFill?: string;
        nodeStroke?: string;
        nodeStrokeWidth?: number;
        nodeStrokeOpacity?: number;
        nodeRadius?: number;
        nodeStrength?: number;
        linkSource?: (d: any) => string;
        linkTarget?: (d: any) => string;
        linkStroke?: string;
        linkStrokeOpacity?: number;
        linkStrokeWidth?: number;
        linkStrokeLinecap?: string;
        linkStrength?: number;
        colors?: any;
        width?: number;
        height?: number;
        invalidation?: any;
      } = {}
    ) {
      // Compute values.
      const N = d3.map(nodes, nodeId).map(intern);
      const LS = d3.map(links, linkSource).map(intern);
      const LT = d3.map(links, linkTarget).map(intern);
      if (nodeTitle === undefined) nodeTitle = (_: any, i: any) => N[i];
      const T: any = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
      const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
      const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
      const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

      console.log('In handleGraphForces>nodeTextChangeGraph')




      let formattingNodes: any = []
      let notFoundNodes: any = []

      nodes.forEach((eachNode: any) => {
        const matchingNodeIndex = previousGraphData.nodes.findIndex((prevNode: any) => prevNode.id === eachNode.id);

        if (matchingNodeIndex !== -1) {
          formattingNodes.push(previousGraphData.nodes[matchingNodeIndex]);
        } else {
          notFoundNodes.push(eachNode)
          // const nodeArray = Object.entries(eachNode).map(([key, value]) => ({ [key]: value }));
          // console.log('nodeArray' , nodeArray)
          // currentNodeMap = d3.map(nodes, (_, i) => ({ id: N[i], tag: nodes[i].tag }));
          // const currentNodeMap = d3.map(nodeArray, (_, i) => ({ id: N[i], tag: nodeArray[i].tag }));
          // console.log('currentNodeMap',currentNodeMap)
        }
      });

      nodes = d3.map(nodes, (_, i) => ({ id: N[i], tag: nodes[i].tag }));
      links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));
      // const linksCopy = _.cloneDeep(links)
      // console.log('nodes' , nodes,'links' , links)

      // const formattingNodesMap:any = new Map(formattingNodes.map((node:any) => [node.id, node]));
      let formattingNodeCopy = formattingNodes;

      nodes.forEach((node: any, index: any) => {
        const nodeReplacement = formattingNodeCopy.find((eachnode: any) => eachnode.id === node.id);
        if (nodeReplacement) {
          nodeReplacement.fx = nodeReplacement.x;
          nodeReplacement.fy = nodeReplacement.y;

          // Update the node in the nodes array
          nodes[index] = nodeReplacement;
        }
      })

      // console.log('inside graph checker', graphResizeChecker, nodeSizeChangeChecker)
      // if (!graphResizeChecker && nodeSizeChangeChecker) {
      //   nodes.forEach((node: any) => {
      //     node.fx = null;
      //     node.fy = null;
      //   });
      // }


      links.forEach((link: any, index: any) => {
        if (typeof link.source === 'string') {
          const sourceObject = formattingNodeCopy.find((node: any) => node.id === link.source);
          if (sourceObject) {
            links[index].source = sourceObject
          }
        }

        // Check if target is a string, and convert it to an object if needed
        if (typeof link.target === 'string') {
          const targetObject = formattingNodeCopy.find((node: any) => node.id === link.target);
          if (targetObject) {
            links[index].target = targetObject
          }
        }
      });


      // Compute default domains.
      // if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

      // Construct the scales.
      // const color = nodeGroup === null ? null : d3.scaleOrdinal(nodeGroups!, colors);

      // Construct the forces.
      const forceNode = d3.forceManyBody();
      const forceLink = d3.forceLink(links).id(({ index: i = 0 }) => N[i]);
      if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
      if (linkStrength !== undefined) forceLink.strength(linkForceValue);


      function ticked() {
        link
          .attr("x1", (d: any) => {
            const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
              return checkEachNode.id === d.source.id
            })
            if (xmark) {
              return xmark.x
            }
            else {
              // console.log('d',d)
              if (nodes) {
                const sourceXMark = nodes.find((checkEachNode: any) => {
                  return checkEachNode.id === d.source.id
                })
                if (sourceXMark) {
                  return sourceXMark.x
                }
              }
            }
          })
          .attr("y1", (d: any) => {
            const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
              return checkEachNode.id === d.source.id
            })
            if (xmark) {
              return xmark.y
            }
            else {
              // console.log('d',d)
              if (nodes) {
                const sourceXMark = nodes.find((checkEachNode: any) => {
                  return checkEachNode.id === d.source.id
                })
                if (sourceXMark) {
                  return sourceXMark.y
                }
              }
            }
          })
          .attr("x2", (d: any) => {
            return d.target.x
          })
          .attr("y2", (d: any) => {
            return d.target.y
          });

        node.attr("transform", (d: any) => `translate(${d.x} ${d.y})`);


        // .attr("cx", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.x
        //   }
        //   else {
        //     return d.x
        //   }
        // })
        // .attr("x", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.x
        //   }
        //   else {
        //     return d.x
        //   }
        // })
        // .attr("y", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.y
        //   }
        //   else {
        //     return d.y
        //   }
        // })
        // .attr("cy", (d: any) => {
        //   const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
        //     return checkEachNode.id === d.id
        //   })
        //   if(xmark) {
        //     return xmark.y
        //   }
        //   else {
        //     return d.y
        //   }
        // });

        // nodeTitles
        //   .text((d: any) => {
        //     const xmark: any = formattingNodeCopy.find((checkEachNode: any) => {
        //       return checkEachNode.id === d.id
        //     })
        //     if (xmark) {
        //       return xmark.id
        //     }
        //     else {
        //       return d.id
        //     }
        //   });

        formattingNodes = []
        formattingNodeCopy = []


        // console.log('link',link)
      }

      function zoomed(event: any) {
        container.attr("transform", event.transform);
      }

      function getColorByTag(tag: string) {

        const themeBasedColors = themeChangericon ? showAddGraphNodeColor.find((group: any) => group.mode === "light mode") : showAddGraphNodeColor.find((group: any) => group.mode === "dark mode");

        const tagColors: Record<string, string> = {};
        themeBasedColors.data.forEach((colorGroup: any) => {
          const tag = colorGroup.tag;
          tagColors[tag] = colorGroup.color;
        });


        for (const word of tag) {
          if (tagColors[word]) {
            return tagColors[word];
          }
        }

        return nodeFill;
      }

      function handleNodeClick(event: any, d: any) {
        // console.log(event, d);
        setFileOpenedFromGraph(d);
        // Get the div element and set its content based on the clicked node
        const nodeInfoDiv: any = document.getElementById("nodeInfo");
        // nodeInfoDiv.innerHTML = `<strong>ID:</strong> ${d.id}<br><strong>Tag:</strong> ${d.tag}`;

        // Position the div over the clicked node
        nodeInfoDiv.style.left = `${event.pageX - 30}px`;
        nodeInfoDiv.style.top = `${event.pageY - 35}px`;



        // Show the div
        nodeInfoDiv.style.display = "flex";

        // Prevent the click event from propagating further (e.g., to zoom or drag)
        event.stopPropagation();
      }

      function hideNodeInfo() {
        const nodeInfoDiv: any = document.getElementById("nodeInfo");
        if (nodeInfoDiv) {
          nodeInfoDiv.style.display = "none";
        }
      }

      function intern(value: any) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
      }

      function getNodeTextWidth(d: any) {
        // Create a hidden div to measure the text width
        const tempDiv: any = d3.select('body')
          .append('div')
          .attr('class', 'temp-text-container')
          .style('position', 'absolute')
          .style('visibility', 'hidden')
          .text(d.id);

        // Get the width of the hidden div
        const textWidth = tempDiv.node().getBoundingClientRect().width;

        // Remove the temporary div from the DOM
        tempDiv.remove();

        return textWidth;
      }

      function handleMouseOver(this: any, event: any, d: any) {

        // Set the initial state before transitioning
        d3.select(this as SVGElement)
          .transition()
          .duration(400)
          // .attr("fill", "red") // Change to your desired color
          // .attr("r", calculateNodeRadius(d) * 1.1) // Optionally, increase the node size
          .attr("fill-opacity", 1);


        // Initialize the links with their original stroke color and opacity
        link
          .attr("stroke", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return linkStroke; // Original link color
            } else {
              return linkStroke;
            }
          })
          .attr("stroke-opacity", linkStrokeOpacity);

        // Initialize the nodes with their original fill color and opacity
        node
          .attr("fill-opacity", (nodeData: any) => {
            if (nodeData === d) {
              return 1; // Opacity of the hovered node
            } else if (areNodesConnected(nodeData, d)) {
              return 1; // Opacity of directly connected nodes
            } else {
              return 0.1; // Opacity of other nodes
            }
          });

        // nodeText
        //   .transition().duration(300)
        //   .style('opacity', (nodeData: any) => {
        //     if (nodeData === d) {
        //       return 1
        //     } else if (areNodesConnected(nodeData, d)) {
        //       return 1
        //     } else {
        //       return 0.1
        //     }
        //   })
        //   .style("font-size", (nodeData: any) => {
        //     return nodeData === d ? '12px' : nodeTextSize
        //   })

        // Start the transition
        d3.select(this as SVGElement)
          .select('circle')
          .transition()
          .duration(400) // Transition duration in milliseconds
          .attr("r", calculateNodeRadius(d) * 1.2); // Optionally, increase the node size


        d3.select(this)
          .select('text')
          .transition()
          .duration(400)
          .style("font-size", (nodeData: any) => {
            return nodeData.id === d.id ? '12px' : nodeTextSize
          })
          .attr("dy", function (d: any, i: number) {
            return nodeRadius + 20 + "px"
          })


        // Change the color of the links directly connected to the hovered node
        link
          .transition()
          .duration(400)
          .attr("stroke", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return linkStroke; // Change to your desired link color
            } else {
              return linkStroke;
            }
          });

        // Transition to reduce the opacity of nodes that are not directly connected
        node
          .transition()
          .duration(400)
          .attr("fill-opacity", (nodeData: any) => {
            if (nodeData === d) {
              return 1; // Opacity of the hovered node
            } else if (areNodesConnected(nodeData, d)) {
              return 1; // Opacity of directly connected nodes
            } else {
              return 0.1; // Opacity of other nodes
            }
          });

        // nodeText
        //   .transition()
        //   .duration(600)
        //   .style('opacity' , (nodeData:any) => {
        //     if (nodeData === d) {
        //       return 1
        //     } else if (areNodesConnected(nodeData , d)) {
        //       return 1
        //     } else {
        //       return 0.1
        //     }
        //   })

        // Transition to reduce the opacity of links that are not directly connected
        link
          .transition()
          .duration(400)
          .attr("stroke-opacity", (linkData: any) => {
            if (linkData.source === d || linkData.target === d) {
              return 1; // Opacity of links directly connected to the hovered node
            } else {
              return 0.1; // Opacity of other links
            }
          });



        // console.log("Hovered Nodes:", hoveredNodes);
      }

      function handleMouseOut(this: any, d: any) {
        let tempMouseOverNode
        const nodeData = d.fromElement.__data__;

        // if (d.fromElement) {
        //   tempMouseOverNode = d.fromElement.getAttribute("id");
        // } else {
        //   tempMouseOverNode = d.target.getAttribute("id");
        // }

        if (nodeData && nodeData.id) {
          tempMouseOverNode = nodeData.id;
        } else if (d.target) {
          // For non-Firefox browsers or when __data__ is not available
          tempMouseOverNode = d.target.getAttribute("id");
        } else if (d.relatedTarget) {
          // For Firefox
          tempMouseOverNode = d.relatedTarget.getAttribute("id");
        }

        const nodeObject = { id: tempMouseOverNode.replace("node-", "") };

        d3.select(this)
          // .attr("fill", nodeFill) // Reset to the original node color
          // .attr("r", calculateNodeRadius(nodeObject)) // Reset to the original node size
          .transition()
          .duration(400)
          .attr("fill-opacity", 1); // Reset opacity


        d3.select(this)
          .select('circle') // Select the nested circle element
          .transition()
          .duration(400)
          .attr("r", calculateNodeRadius(nodeObject));

        d3.select(this)
          .select('text')
          .transition()
          .duration(400)
          .style('opacity', 1)
          .style("font-size", `${nodeTextSize}px`)
          .attr("dy", function (d: any, i: number) {
            return nodeRadius + 10 + "px"
          })

        // Reset the color and opacity of all links to their original values with a transition
        link
          .transition()
          .duration(400)
          .attr("stroke", linkStroke)
          .attr("stroke-opacity", linkStrokeOpacity);

        // Reset the opacity of all nodes to their original value with a transition
        node
          .transition()
          .duration(200)
          .attr("fill-opacity", 1);



        // nodeText.transition().duration(200)
        //   .style('opacity', 1)
        //   .style("font-size", (nodeData: any) => {
        //     let orginalNodeSize = nodeTextSize + 'px'
        //     return orginalNodeSize
        //   })

      }

      function areNodesConnected(node1: any, node2: any) {
        return links.some((linkData: any) => {
          return (
            (linkData.source === node1 && linkData.target === node2) ||
            (linkData.source === node2 && linkData.target === node1)
          );
        });
      }

      function drag(simulation: any) {
        function dragstarted(event: any) {

          if (!event.active) simulation.alphaTarget(0.1).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
          nodes.forEach((node: any) => {
            node.fx = null;
            node.fy = null;
          });
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

      function calculateNodeRadius(d: any) {
        const linkCount = links.filter((link: any) => link.source.id === d.id).length;
        if (linkCount <= 4) {
          return nodeRadius;
        } else {
          let checkLinkCount = linkCount - 4
          let onePercentOfCheckLinkCount = 0.12 * checkLinkCount;

          return onePercentOfCheckLinkCount + 4;
        }
      }

      function hasLinks(node: any) {

        // Check if the node's ID is present in any link's source or target
        return links.some((link: any) => link.source.id === node.id || link.target.id === node.id);
      }

      const customNodes: any = nodes;


      const simulation = d3
        .forceSimulation(customNodes)
        .force("link", forceLink)
        .force("charge", d3.forceManyBody().strength(sliderValue))
        .force("center", d3.forceCenter().strength(centerForceValue))
        .force("forceX", d3.forceX(0).strength(function (d) { return hasLinks(d) ? 0 : 0.05; }))
        .force("forceY", d3.forceY(0).strength(function (d) { return hasLinks(d) ? 0 : 0.05; }))
        .force('collide', d3.forceCollide((d) => {
          let radius = calculateNodeRadius(d)
          return radius + 15
        }))
        .on("tick", ticked);

      // const svg = d3
      // .create("svg")
      // .attr("width", graphSize.width)
      // .attr("height", graphSize.height)
      // .attr("viewBox", [-graphSize.width / 2, -graphSize.height / 2, graphSize.width, graphSize.height])
      // .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      // .style("transition", "fill-opacity 0.2s, stroke-opacity 0.2s");


      // const svg:any = document.querySelector("#graph-div svg");
      let svgContainer;

      if (window.innerWidth <= 575) {
        svgContainer = d3.select('#graph-div-mobile');
      } else {
        svgContainer = d3.select('#graph-div');
      }
      const gElement = svgContainer.select('svg');
      const svg = gElement.select('g');

      gElement.attr('width', width).attr('height', height)
      gElement.attr('viewBox', [-width / 2, -height / 2, width, height])

      const container = svg

      container.select("#links-g-tag").remove();
      const link = container
        .append("g")
        .attr("id", "links-g-tag")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr(
          "stroke-width",
          typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null
        )
        .attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .data(links)
        .join("line");




      container.select("#nodes-g-tag").remove();
      const node = container.append("g")
        .attr("id", "nodes-g-tag")
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
        // .selectAll("circle")
        .selectAll("g")
        .data(nodes)
        // .join("circle")
        .join("g")
        .attr("id", (d: any) => `node-${d.id}`)
        // .attr("r", function (d) {
        //   return calculateNodeRadius(d);
        // })
        .attr("fill", (d: any) => {
          const color = getColorByTag(d.tag);
          return color;
        })
        .on("mouseover", handleMouseOver) // Add mouseover event listener
        .on("mouseout", handleMouseOut)
        .on("click", handleNodeClick)
        .classed("node-pointer", true)
        .call(drag(simulation) as any, drag(simulation));

      node.append("circle")
        .attr("r", (d: any) => {
          const radius = calculateNodeRadius(d)
          return radius;
        })

      node.append("text")
        .text(function (d: any, i: number) {
          return T[i];
        })
        .attr("dy", function (d: any, i: number) {
          return nodeRadius + 10 + "px"
        })
        .attr("text-anchor", "middle")
        .attr("font-size", nodeTextSize)
        .attr("fill", textColorForNode)
        .style("pointer-events", "none")


      // // Append text labels to the container, positioned near the nodes
      // container.select("#text-g-tag").remove();
      // const nodeText = container
      //   .append("g")
      //   .attr("id", "text-g-tag")
      //   .selectAll("title")
      //   .data(nodes)
      //   .join("text")
      //   // .attr("x", (d) => d.x + 12) // Adjust the x-coordinate based on your preference
      //   // .attr("y", (d) => d.y) // Adjust the y-coordinate based on your preference
      //   .attr("x", (d: any) => d.x) // Keep the x-coordinate the same as the node
      //   .attr("y", (d: any) => d.y + nodeRadius + 12)
      //   .attr("dy", ".35em") // Adjust the vertical alignment based on your preference
      //   .attr("font-size", nodeTextSize) // Adjust the font size based on your preference
      //   .style("pointer-events", "none")
      //   .text((d: any) => d.id)
      //   .attr('fill', textColorForNode);

      // container.select("#titles-g-tag").remove();
      // const nodeTitles = container
      //   .append("g")
      //   .attr("id", "titles-g-tag")
      //   .selectAll("title")
      //   .data(nodes)
      //   .join("title")
      //   .text((d: any) => d.id);


      const zoom: any = d3.zoom().on("zoom", zoomed);
      svgContainer.call(zoom);

      document.addEventListener("click", hideNodeInfo);



      // // In the ticked function, update the positions of text and title elements

      // if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
      // if (L) link.attr("stroke", ({ index: i }) => L[i]);
      if (W) link.attr("stroke-width", (d: any, i: any) => `${W[i]}`);
      if (L) link.attr("stroke", (d: any, i: any) => `${L[i]}`);
      // if (G && color) {
      //   node.attr("fill", (_:any, i:any) => color(G[i]));
      // }
      // if (T) {
      //   node.append("title").text((d: any, i: any) => String(T[i]));
      // }

      if (invalidation != null) {
        (invalidation as Promise<void>).then(() => {
          // Handle invalidation here
          simulation.stop();
        });
      }

      const svgElement = svg.node() as SVGSVGElement;
      const result = {
        // scales: { color },
        svg: svgElement,
      };




      const previousNodes = [...nodes]
      const previousLinks = [...links]

      setPreviousGraphData({ nodes: previousNodes, links: previousLinks })

      return result;

      // return Object.assign(svg.node(), { scales: { color } });
    }

    const options: any = {
      nodeFill: "#808080",
      nodeStroke: "#808080",
      width: graphWidth,
      height: graphHeight,
    };

    let svgResult: any

    if (makingFrom === 'themeChange' || makingFrom === 'resizeScreen') {
      svgResult = WanderGraph(graphNewData, options)
    } else if (makingFrom === 'nodeTextChange') {
      svgResult = nodeTextChangeGraph(graphNewData, options)
    } else if (makingFrom === 'sliderChange') {
      svgResult = slidersGraph(graphNewData, options)
    }
  }


  const openSearchResult = (resultToOpen: any) => {

    const copySearchResults = _.cloneDeep(rawSearchResults);

    let matchingFile: any = copySearchResults.find((file: any) => file.fileName === resultToOpen.fileName);


    // console.log('matchingFile', matchingFile)

    marked.setOptions({ breaks: true });

    let editedResult = matchingFile.content.replace(/\n(?=\n)/g, "\n\n<br/>\n")
    matchingFile.content = marked(editedResult);
    // console.log("markedContent", matchingFile);

    const regex = /\[\[([^[\]]+)\]\]/g;
    const hashtagParagraphRegex = /#\S+/g;

    if (matchingFile) {
      const contentWithoutHashtags = matchingFile.content.replace(hashtagParagraphRegex, "");

      const contentWithStyledWords = contentWithoutHashtags.replace(regex, (match: any, word: any) =>
        `<span style="text-decoration: underline; cursor: pointer;">${word}</span>`
      );

      const updatedResultToOpen = {
        ...resultToOpen,
        content: contentWithStyledWords,
        openedFromResults: true,
      };

      const doesExist = openedResults.some((result) => result.fileName === updatedResultToOpen.fileName);



      if (!doesExist) {
        const updatedOpenedResults = [...openedResults, updatedResultToOpen];
        setOpenedResultsRawData(updatedOpenedResults)
        setOpenedResults(updatedOpenedResults);
      } else {
        console.log("An object with the same fileName already exists in openedResults.");
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
          });
        });
      }, 10);

    } else {
      console.log('no matching file found')
    }
  };


  const graphResultExpand = (resultToOpen: any) => {
    let element: any;

    if (window.innerWidth <= 575) { // Adjust the threshold according to your design
      element = document.getElementById("graph-div-mobile");
    } else {
      element = document.getElementById("graph-div");
    }

    if (element && element.querySelector('svg')) {
      // console.log('The "graph-div" contains an SVG element.');

      // const { nodes } = graphData;
      // const nodeFilenames = nodes.map((node: any) => node.id);

      // console.log('nodefilenames' , nodeFilenames)
      // console.log('graphdatanow' , graphData)
      // console.log('openedresult' , openedResults)





      let matchingFile: any = resultToOpen;
      marked.setOptions({
        breaks: true,
      });

      let editedResult = matchingFile.content.replace(/\n(?=\n)/g, "\n\n<br/>\n")
      matchingFile.content = marked(editedResult);

      const regex = /\[\[([^[\]]+)\]\]/g;
      const hashtagParagraphRegex = /#\S+/g;
      if (matchingFile) {
        // console.log('matching file: ' , matchingFile)
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

        // console.log('openedresults' , openedResults)
        // console.log('updatedresulttoopen' , updatedResultToOpen)
        // const doesExist = openedResults.some(
        //   (result) => result.fileName === updatedResultToOpen.fileName
        // );
        const doesExist = openedResults.some((result: any) =>
          result.fileName === updatedResultToOpen.fileName
        );

        if (!doesExist) {
          const resultArray = [...openedResults, updatedResultToOpen];

          // console.log('resultArray',resultArray)

          generateGraphfromGraphResult(resultArray);
          // updatedOpenedResults.push(updatedResultToOpen); // Add the updated object to the copy
        } else {
          console.log("An object with the same fileName already exists.");
        }
      }



      // const filteredResults = searchResults.filter((result: any) =>
      // nodeFilenames.includes(result.fileName))

      // console.log('filteredResults' , filteredResults)


    } else {
      console.log('The "graph-div" does not contain an SVG element.');
      const resultArray = [resultToOpen];
      generateGraphfromSearch(resultArray);
    }

  }


  const removeSearchResult = (resultToRemove: any) => {
    // console.log("search Results: ", searchResults, resultToRemove);
    const newResult = searchResults.filter(
      (result) => result.fileName !== resultToRemove.fileName
    );
    // console.log("newResult:  ", newResult);
    setSearchResults(newResult);
  };


  const collapseOpenedResult = (resultToCollapse: any) => {
    const collapsedResult = openedResults.filter((item: any) => item.fileName !== resultToCollapse.fileName);

    setOpenedResultsRawData(collapsedResult)
    setOpenedResults(collapsedResult);
  };


  const removeBothSearchResults = (resultToRemove: any) => {
    // console.log("resultToRemove", resultToRemove);
    collapseOpenedResult(resultToRemove);
    removeSearchResult(resultToRemove);
    // console.log("searchValue: ", searchValue);

    let updatedSearchValue: any

    if (graphOrTextView) {
      console.log('in text view', searchValue)
      updatedSearchValue = `${searchValue} -"${resultToRemove.fileName}"`;
      setSearchValue(updatedSearchValue);
      const syntheticEvent = {
        target: { value: updatedSearchValue },
      };

      handleSearch(syntheticEvent);

    } else {
      console.log('in graph view', graphSearchValue)
      updatedSearchValue = `${graphSearchValue} -"${resultToRemove.fileName}"`;
      setGraphSearchValue(updatedSearchValue);

      const syntheticEvent = {
        target: { value: updatedSearchValue },
      };

      handleGraphSearch(syntheticEvent);
    }





  };


  const handleLinkClick = async (linkClickedFromFile: any, linkClicked: any, result: any) => {
    console.log(linkClickedFromFile, linkClicked, linkClickFromFile)
    setLinkClickFromFile(linkClicked)
    // console.log("linkClickedFromFile: ", linkClickedFromFile);
    // console.log("linkClicked: ", linkClicked);
    // console.log('result' , result.id)
    setLinkClickedId(result.id)

    setLinkClickLoader(true)
    try {
      const tableNamesStr = userAccessVaults.join(',');
      const response = await fetch(`/api/linkFile?q=${linkClicked}&av=${tableNamesStr}`);
      // console.log('response' , response)
      const linkFile = await response.json();

      if (linkFile.hasOwnProperty("message")) {

        const showToast = () => {
          toast(
            <div className="contact-support-message">
              <p>{linkFile.message}</p>
              {!showContactSupportToast && (
                <p>Please contact: <a href="mailto:support@tcmweaver.com">support@tcmweaver.com</a></p>


                // <button className="contact-support-button" onClick={() => setShowContactSupportToast(true)}>Contact Support</button>
              )}
            </div>,
            {
              position: "top-right",
              autoClose: 2500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              type: "error",
              theme: "light",
            }
          );
        };

        showToast()
      }

      // console.log('linkFile', linkFile)


      const newDataObject = _.cloneDeep(linkFile)
      console.log('newdataobject', newDataObject)

      let textToConvert = newDataObject.content;
      const regexForRemovedBrackets = /\[\[([^[\]]+)\]\]/g;

      const contentWithRemovedBrackets = textToConvert.replace(regexForRemovedBrackets, (match: any, word: any) => `${word} `);
      newDataObject.contentWithRemovedBrackets = contentWithRemovedBrackets;

      marked.setOptions({ breaks: true, });

      let editedResult = newDataObject.content.replace(/\n(?=\n)/g, "\n\n<br/>\n")

      // newDataObject.contentWithRemovedBrackets = marked(editedResult);
      newDataObject.content = marked(editedResult);


      const regex = /\[\[([^[\]]+)\]\]/g;
      const hashtagParagraphRegex = /#\S+/g;
      if (newDataObject) {
        // console.log("newDataObject", newDataObject);
        const contentWithoutHashtags = newDataObject.content.replace(hashtagParagraphRegex, "");

        // console.log('contentWithoutHashtags', contentWithoutHashtags)

        const contentWithStyledWords = contentWithoutHashtags.replace(regex,
          (match: any, word: any) => `<span style = "text-decoration: underline; cursor: pointer;"> ${word}</ > `
        );

        // console.log('contentWithStyledWords', contentWithStyledWords)


        // console.log("contentwithstyledword", contentWithStyledWords);
        // console.log('openedresults' , openedResults)
        const index = openedResults.findIndex((item: any) => item.fileName === linkClickedFromFile);
        // console.log('index' , index)

        if (index !== -1) {
          const updatedResults = {
            ...newDataObject,
            content: contentWithStyledWords,
            openedFromResults: false
          };

          const doesExist = openedResults.some((result) => result.fileName === updatedResults.fileName);

          if (!doesExist) {
            // console.log('found')
            // Create a copy of the openedResults array
            const updatedOpenedResults = [...openedResults];

            // Insert the updatedResults object at index + 1
            updatedOpenedResults.splice(index + 1, 0, updatedResults);

            // console.log("updatedOpenedResults", updatedOpenedResults);

            // Update the state with the new array
            setOpenedResults(updatedOpenedResults);
            setOpenedResultsRawData(updatedOpenedResults)
            setLinkClickLoader(false)
          } else {
            // console.log('not found')
            const resultsWithRemovedLink = openedResults.filter((item: any) => item.fileName !== updatedResults.fileName);
            const index = resultsWithRemovedLink.findIndex((item: any) => item.fileName === linkClickedFromFile);

            const updatedOpenedResults = [...resultsWithRemovedLink];

            // Insert the updatedResults object at index + 1
            updatedOpenedResults.splice(index + 1, 0, updatedResults);

            // Update the state with the new array
            setOpenedResults(updatedOpenedResults);
            setOpenedResultsRawData(updatedOpenedResults)
            setLinkClickLoader(false)
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
                  h4.classList.add("highlighted-heading");
                  h4.scrollIntoView({ behavior: "smooth", block: "start", inline: "center", });

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
      setLinkClickLoader(false)
    }
  };


  const handleCopyText = () => {
    const textarea = document.createElement("textarea");
    if (graphOrTextView) {
      textarea.value = searchValue;
    } else {
      textarea.value = graphSearchValue
    }

    document.body.appendChild(textarea);

    textarea.select();
    textarea.setSelectionRange(0, 99999);

    document.execCommand("copy");

    document.body.removeChild(textarea);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };


  const showNodeClickedFile = async () => {
    // console.log("fileOpenedFromGraph now", fileOpenedFromGraph);
    const matchingResult: any = openedResults.find(
      (result: any) => result.fileName === fileOpenedFromGraph.id
    );

    if (matchingResult) {
      // console.log("Matching Result:", matchingResult);

      if (graphNodeOpened.length === 0 || matchingResult.fileName !== graphNodeOpened[0].fileName) {
        // Update the array only if the fileName is different
        setGraphNodeOpened((prevGraphNodeOpened: any) => [matchingResult, ...prevGraphNodeOpened]);
      }
    } else {
      // Now does not come in this else
      console.log('should not come in this else : showNodeClickedFile')
      try {
        const response = await fetch(`/api/linkFile?q=${fileOpenedFromGraph.id}`);
        const newDataObject = await response.json();
        // console.log("responseJson: ", responseJson);

        marked.setOptions({
          breaks: true,
        });

        newDataObject.content = marked(newDataObject.content);
        newDataObject.contentWithRemovedBrackets = marked(
          newDataObject.content
        );

        const regex = /\[\[([^[\]]+)\]\]/g;
        const hashtagParagraphRegex = /#\S+/g;
        newDataObject.content = newDataObject.content.replace(
          hashtagParagraphRegex,
          ""
        );

        newDataObject.content = newDataObject.content.replace(
          regex,
          (match: any, word: any) =>
            `< span style = "text-decoration: underline; cursor: pointer;" > ${word}</span > `
        );
        console.log("newDataObject", newDataObject);

        setGraphNodeOpened(newDataObject);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }

    setAnimationKey((prevKey) => prevKey + 1);
    sethideFiltersForPreview(false);
  };


  const collapseExpandedNode = () => {
    sethideFiltersForPreview(true);
    setGraphNodeOpened([]);
  };


  const removeNodeAndConnected = (graphData: any, nodeId: any) => {

    const updatedGraphData = { ...graphData };

    // Find the index of the node to remove
    const nodeIndexToRemove = updatedGraphData.nodes.findIndex(
      (node: any) => node.id === nodeId
    );
    // console.log("nodeIndexToRemove", nodeIndexToRemove);

    if (nodeIndexToRemove !== -1) {
      // Get the ID of the node to be removed
      const nodeToRemove = updatedGraphData.nodes[nodeIndexToRemove].id;
      // console.log("nodeToRemove", nodeToRemove);

      // Find links connected to the node to remove
      const connectedLinks = updatedGraphData.links.filter(
        (link: any) =>
          link.source === nodeToRemove || link.target === nodeToRemove
      );

      // console.log("connectedLinks", connectedLinks);

      // // Remove the node and connected links from the graphData object
      updatedGraphData.nodes.splice(nodeIndexToRemove, 1);
      // console.log("updatedGraphData", updatedGraphData);

      // // Create a set to keep track of nodes that should not be removed
      const nodesToKeep = new Set();

      // // Iterate over connected links
      // connectedLinks.forEach((link: any) => {
      //   // Check if the connected nodes are not connected to any other nodes
      //   const sourceLinks = updatedGraphData.links.filter(
      //     (l: any) => l.source === link.source
      //   );
      //   const targetLinks = updatedGraphData.links.filter(
      //     (l: any) => l.target === link.target
      //   );

      //   // Check if the source node is not connected to any other nodes
      //   if (sourceLinks.length === 1) {
      //     nodesToKeep.add(link.source);
      //   }

      //   // Check if the target node is not connected to any other nodes
      //   if (targetLinks.length === 1) {
      //     nodesToKeep.add(link.target);
      //   }
      // });

      const nodesToKeepUpdate = updatedGraphData.nodes.filter(
        (node: any) => !nodesToKeep.has(node.id)
      );

      // console.log("nodesToKeep", nodesToKeepUpdate);
      updatedGraphData.links = updatedGraphData.links.filter(
        (link: any) => link.source !== nodeId && link.target !== nodeId
      );
      updatedGraphData.nodes = nodesToKeepUpdate;
      // console.log("updatedGraphData", updatedGraphData);

      // // Remove nodes that are not in the nodesToKeep set
      // updatedGraphData.nodes = updatedGraphData.nodes.filter((node) =>
      //   nodesToKeep.has(node.id)
      // );
    }

    // setGraphData(updatedGraphData);

    return updatedGraphData;
  };


  const removeClickedNode = async (event: any) => {

    const updatedGraphData = await removeNodeAndConnected(
      graphData,
      fileOpenedFromGraph.id
    );

    setGraphData(updatedGraphData)

    let graphDataCopy: any = { ...updatedGraphData }




    let filteredGraphData: any = []

    // Step 1: Find items with status "exclude" in updatedCheckboxes
    const excludedValues: any = [];
    graphTagFilters.forEach((category: any) => {
      category.items.forEach((item: any) => {
        if (item.status === "exclude") {
          excludedValues.push(item.value.substring(1));
        }
      });
    });

    // console.log('excluded' , excludedValues)

    // Step 2: Find corresponding node ids in graphDataCopy
    const excludedNodeIds: any = [];

    if (graphDataCopy.nodes.length > 0) {
      graphDataCopy.nodes.forEach((node: any) => {
        const tag = node.tag.map((tagCheck: any) => tagCheck.toLowerCase().replace(/^#/, ''));

        //     // Check if any of the tags exist in the excludedValues array
        if (tag.some((tagCheck: any) => excludedValues.includes(tagCheck))) {
          excludedNodeIds.push(node.id);
        }
      });




      console.log('excluded ids', excludedNodeIds)


      // Step 3: Remove links with source or target matching excluded node ids
      filteredGraphData.links = graphDataCopy.links.filter((link: any) => {
        return !excludedNodeIds.includes(link.source) && !excludedNodeIds.includes(link.target);
      });

      // Step 4: Remove nodes with ids in excludedNodeIds
      filteredGraphData.nodes = graphDataCopy.nodes.filter((node: any) => !excludedNodeIds.includes(node.id));

      // Now, graphDataCopy is updated with the desired changes.
      // console.log('filteredGraphData: ', filteredGraphData);

      setGraphDataAfterFilters(filteredGraphData)
      makeGraph(filteredGraphData)

    } else {
      console.log('No graph data found , handleGraphFilters')
    }

    // console.log("updatedGraphData", updatedGraphData);
    // console.log("graphData: ", graphData);

    // makeGraph(updatedGraphData);

    removeBothSearchResults({ fileName: fileOpenedFromGraph.id });
  }


  const previewNodeLink = (node: any) => {
    setPreviewNodeLinkLoader(true)



    const matchingResult: any = openedResults.find((result: any) => result.fileName === node);
    // console.log('matching result', matchingResult)

    if (matchingResult) {
      // console.log('true')
      setPreviewNodeLinkLoader(false)
      if (graphNodeOpened.length === 0 || matchingResult.fileName !== graphNodeOpened[0].fileName) {
        // Update the array only if the fileName is different
        setGraphNodeOpened((prevGraphNodeOpened: any) => [matchingResult, ...prevGraphNodeOpened]);
        setAnimationKey((prevKey) => prevKey + 1);
      }
    } else {
      // console.log('false')
      const tableNamesStr = userAccessVaults.join(',');
      // console.log(tableNamesStr)
      axios.post(`/api/linkFile?q=${node}&av=${tableNamesStr}`)
        .then((res) => {
          let newDataObject = res.data;

          newDataObject.content = newDataObject.content.replace(/\n(?=\n)/g, "\n\n<br/>\n")

          marked.setOptions({ breaks: true, });

          newDataObject.content = marked(newDataObject.content);
          newDataObject.contentWithRemovedBrackets = marked(newDataObject.content);

          const regex = /\[\[([^[\]]+)\]\]/g;
          const hashtagParagraphRegex = /#\S+/g;
          newDataObject.content = newDataObject.content.replace(hashtagParagraphRegex, "");

          newDataObject.content = newDataObject.content.replace(
            regex, (match: any, word: any) =>
            `<span style="text-decoration: underline; cursor: pointer;">${word}</span>`
          );

          if (graphNodeOpened.length === 0 || newDataObject.fileName !== graphNodeOpened[0].fileName) {
            setGraphNodeOpened((prevGraphNodeOpened: any) => [newDataObject, ...prevGraphNodeOpened]);
          }

          // setGraphNodeOpened(newDataObject);
          setPreviewNodeLinkLoader(false)
          setAnimationKey((prevKey) => prevKey + 1);
        })
        .catch((err) => {
          console.log("err=", err);
          setPreviewNodeLinkLoader(false)
        });


    }

  };


  const wanderClickedNode = async () => {
    const updatedGraphData: any = { ...graphData };
    const matchingResult = openedResults.find((result) => result.fileName === fileOpenedFromGraph.id);
    // console.log('matching result' , matchingResult)

    const nodeExists = (id: any) => { return updatedGraphData.nodes.some((node: any) => node.id === id) };

    if (matchingResult) {
      const underlinedWords: any = matchingResult.content.match(/<span[^>]*>(.*?)<\/span>/g);

      let wordsArray
      if (underlinedWords) {
        wordsArray = underlinedWords.map((span: any) => {
          const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
          return match ? match[1] : "";
        });
      } else if (underlinedWords === null) {
        wordsArray = [matchingResult.fileName];
      }

      // console.log('graphSearchWordsArray',graphSearchWordsArray)

      // console.log('hello')
      try {
        setGraphSearchLoader(true)
        const tableNamesStr = userAccessVaults.join(',');
        const encodedWords = encodeURIComponent(wordsArray.join(","));
        // responseJson = await axios.get(`/ api / search ? q = ${ encodedWords }& AccessVaults=${ tableNamesStr } `);
        const response = await axios.get(`/api/wanderNode?q=${encodedWords}&av=${tableNamesStr}&sa=${graphSearchWordsArray}&bl=${fileOpenedFromGraph.id}`)
        // console.log('response from wander api', response)
        if (response) {

          function removeDoubleBrackets(content: any) {
            const regex = /\[\[([^[\]]+)\]\]/g;
            return content.replace(regex, (match: any, word: any) => `${word} `);
          }


          // Process updatedObjects
          response.data.updatedObjects.forEach((entry: any) => {
            entry.contentWithRemovedBrackets = removeDoubleBrackets(entry.content);
          });

          // Process updatedObjectsForBacklinks
          response.data.updatedObjectsForBacklinks.forEach((entry: any) => {
            entry.contentWithRemovedBrackets = removeDoubleBrackets(entry.content);
          });


          // console.log('response', response.data)

          type YourObjectType = { fileName: any; tag: any };

          function generateLinkTags(objects: Record<string, YourObjectType>): { name: any; category: any }[] {
            return Object.values(objects).map(({ fileName, tag }: YourObjectType) => ({ name: fileName, category: tag }));
          }

          const linkTags = generateLinkTags(response.data.updatedObjects);
          const linkTagsForBacklinks = generateLinkTags(response.data.updatedObjectsForBacklinks);

          // console.log('linkTags', linkTags)
          // console.log('linkTagsForBacklinks', linkTagsForBacklinks)


          const searchWords = (searchValue.match(/(-?)"([^"]*)"|\S+/g) || [])
            .map((match: any) => match.replace(/^(-?)"([^"]*)"$/, "$1$2"));

          console.log('searchWords', searchWords)

          // Use filter to remove objects that match any word in searchWords with a hyphen
          const filteredData = linkTags.filter((item: any) => !searchWords.includes(`- ${item.name} `));

          const filteredDataForBacklinks = linkTagsForBacklinks.filter((item: any) => {
            return !searchWords.includes(`-${item.name} `);
          });

          // console.log('filteredData', filteredData)
          // console.log('filteredDataForBacklinks', filteredDataForBacklinks)


          filteredData.forEach((word: any) => {
            if (!nodeExists(word.name)) {
              updatedGraphData.nodes.push({ id: word.name, tag: word.category });

              openedResults.forEach((result) => {
                const pattern = new RegExp(`<span[^>]*>${word.name}<\\/span>`, 'gi');
                if (pattern.test(result.content)) {
                  updatedGraphData.links.push({ source: result.fileName, target: word.name });
                }
              });

              response.data.updatedObjects.forEach((result: any) => {
                const wordName = word.name;
                const wordNamePattern = `\\[\\[(${wordName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\]\\]`;
                const regex = new RegExp(wordNamePattern, 'g');
                if (regex.test(result.content)) {
                  updatedGraphData.links.push({ source: result.fileName, target: word.name });
                }
              })

            } else {
              console.log(`wander node already exists: (${word.name})`)
              openedResults.forEach((result) => {
                const pattern = new RegExp(`<span[^>]*>${word.name}<\\/span>`, 'gi');
                if (pattern.test(result.content)) {
                  updatedGraphData.links.push({ source: result.fileName, target: word.name });
                }
              });

              response.data.updatedObjects.forEach((result: any) => {
                const wordName = word.name;
                const wordNamePattern = `\\[\\[(${wordName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\]\\]`;
                const regex = new RegExp(wordNamePattern, 'g');
                if (regex.test(result.content)) {
                  updatedGraphData.links.push({ source: result.fileName, target: word.name });
                }
              })
            }



          });

          filteredDataForBacklinks.forEach((word: any) => {
            if (!nodeExists(word.name)) {
              updatedGraphData.nodes.push({ id: word.name, tag: word.category });

              // openedResults.forEach((result) => {

              const pattern = new RegExp(`<span[^>]*>${word.name}<\\/span>`, 'gi');

              // if (pattern.test(result.content)) {
              // Add a link to newLinks
              updatedGraphData.links.push({ source: word.name, target: fileOpenedFromGraph.id });
              // }
              // });
              // console.log("nodes:", nodes);
            } else {
              console.log(`wander node already exists (${word.name})`)
              updatedGraphData.links.push({ source: word.name, target: fileOpenedFromGraph.id });


            }
          })

          // console.log('updatedGraphData',updatedGraphData)
          let filteredGraphData: any = []

          // Step 1: Find items with status "exclude" in updatedCheckboxes
          const excludedValues: any = [];
          graphTagFilters.forEach((category: any) => {
            category.items.forEach((item: any) => {
              if (item.status === "exclude") {
                excludedValues.push(item.value.substring(1));
              }
            });
          });

          // Step 2: Find corresponding node ids in graphDataCopy
          const excludedNodeIds: any = [];
          // updatedGraphData.nodes.forEach((node:any) => {
          //   if (excludedValues.includes(node.tag)) {
          //     excludedNodeIds.push(node.id);
          //   }
          // });
          //   updatedGraphData.nodes.forEach((node:any) => {
          //     const tags = node.tag.map((tagCheck:any) => tagCheck.toLowerCase().replace(/^#/, ''));

          //     // Check if any of the tags exist in the excludedValues array
          //     if (tags.some((tagCheck:any) => excludedValues.includes(tagCheck))) {
          //         excludedNodeIds.push(node.id);
          //     }
          // });

          // console.log('updatedgraphdata' , updatedGraphData)

          updatedGraphData.nodes.forEach((node: any) => {
            const tag = node.tag.map((tagCheck: any) => tagCheck.toLowerCase().replace(/^#/, ''));

            // Check if any of the tags exist in the excludedValues array
            if (tag.some((tagCheck: any) => excludedValues.includes(tagCheck))) {
              excludedNodeIds.push(node.id);
            }
          });

          // console.log('excludedNodeIds',excludedNodeIds)

          // Step 3: Remove links with source or target matching excluded node ids
          filteredGraphData.links = updatedGraphData.links.filter((link: any) => {
            return !excludedNodeIds.includes(link.source) && !excludedNodeIds.includes(link.target);
          });

          // Step 4: Remove nodes with ids in excludedNodeIds
          filteredGraphData.nodes = updatedGraphData.nodes.filter((node: any) => !excludedNodeIds.includes(node.id));

          // Now, graphDataCopy is updated with the desired changes.
          // console.log('filteredGraphData: ', filteredGraphData);

          // makeGraph(filteredGraphData)

          // console.log("updatedGraphData: ", updatedGraphData);
          // let graphNewData = resultData;

          // console.log('updatedGraphData', updatedGraphData, 'filteredGraphData', filteredGraphData)
          setGraphData(updatedGraphData);
          setGraphDataAfterFilters(filteredGraphData)
          makeGraph(filteredGraphData);
          setGraphSearchLoader(false)

          // console.log('response again', response)

          const originalArray = response.data.updatedObjects;
          const originalArrayForBacklinks = response.data.updatedObjectsForBacklinks
          const copiedArrayRaw = _.cloneDeep(originalArray);
          const copiedArrayForBacklinksRaw = _.cloneDeep(originalArrayForBacklinks);

          // console.log('copiedArraybefore', copiedArrayRaw)
          // console.log('copiedArrayForBacklinksbefore', copiedArrayForBacklinksRaw)


          // const removeDuplicates = (arr: any) => {
          //   return arr.filter((obj: any, index: any, self: any) =>
          //     index === self.findIndex((o: any) => o.filename === obj.filename)
          //   );
          // };

          let uniqueFileNames: any = {};

          const removeDuplicates = (arr: any) => {
            return arr.filter((obj: any) => {
              if (!uniqueFileNames[obj.fileName]) {
                uniqueFileNames[obj.fileName] = true;
                return true;
              }
              return false;
            });
          }

          const copiedArray = removeDuplicates(copiedArrayRaw);
          uniqueFileNames = {}
          const copiedArrayForBacklinks = removeDuplicates(copiedArrayForBacklinksRaw);

          // console.log('copiedArray', copiedArray)
          // console.log('copiedArrayForBacklinks', copiedArrayForBacklinks)


          let updatedOpenedResults: any = [];

          copiedArray.forEach((result: any) => {

            let matchingFile: any = result;

            marked.setOptions({ breaks: true, });

            matchingFile.content = matchingFile.content.replace(/\n(?=\n)/g, "\n\n<br/>\n")
            matchingFile.content = marked(matchingFile.content);

            const hashtagParagraphRegex = /#\S+/g;
            const regex = /\[\[([^[\]]+)\]\]/g;

            const contentWithoutHashtags = matchingFile.content.replace(hashtagParagraphRegex, "");
            // console.log("contentWithoutHashtags", contentWithoutHashtags);


            const contentWithStyledWords = contentWithoutHashtags.replace(regex, (match: any, word: any) =>
              `<span style="text-decoration: underline; cursor: pointer;">${word}</span>`
            );
            // console.log("contentwithstyledwords", contentWithStyledWords);

            matchingFile.content = contentWithStyledWords;

            updatedOpenedResults.push({
              ...matchingFile,
              openedFromResults: true,
            });
          })

          copiedArrayForBacklinks.forEach((result: any) => {

            let matchingFile: any = result;

            marked.setOptions({ breaks: true, });

            matchingFile.content = matchingFile.content.replace(/\n(?=\n)/g, "\n\n<br/>\n")
            matchingFile.content = marked(matchingFile.content);

            const hashtagParagraphRegex = /#\S+/g;
            const regex = /\[\[([^[\]]+)\]\]/g;

            const contentWithoutHashtags = matchingFile.content.replace(hashtagParagraphRegex, "");
            // console.log("contentWithoutHashtags", contentWithoutHashtags);


            const contentWithStyledWords = contentWithoutHashtags.replace(regex, (match: any, word: any) =>
              `<span style="text-decoration: underline; cursor: pointer;">${word}</span>`
            );
            // console.log("contentwithstyledwords", contentWithStyledWords);

            matchingFile.content = contentWithStyledWords;

            updatedOpenedResults.push({
              ...matchingFile,
              openedFromResults: true,
            });
          })

          // console.log('updatedOpenedResults', updatedOpenedResults)

          const newOpenedResults = [...openedResults];
          // console.log('newOpenedResults', newOpenedResults)
          const filteredUpdatedResults = updatedOpenedResults.filter((updatedObj: any) => (
            !newOpenedResults.some((existingObj: any) => existingObj.fileName === updatedObj.fileName)
          ));

          // console.log('filteredupdatedresults', filteredUpdatedResults)


          const indexToInsertAfter = openedResults.findIndex((obj: any) => obj.fileName === fileOpenedFromGraph.id);
          // console.log('indexToInsertAfter', indexToInsertAfter)
          if (indexToInsertAfter !== -1) {

            const insertionIndex = indexToInsertAfter + 1;

            const updatedResults = [
              ...openedResults.slice(0, insertionIndex),
              ...filteredUpdatedResults,
              ...openedResults.slice(insertionIndex),
            ];
            // console.log('updatedResults', updatedResults)
            setOpenedResults(updatedResults)
            setOpenedResultsRawData(updatedResults)

          }
        }
      } catch (error) {
        setGraphSearchLoader(false)
        console.log("Error getting wander node files:", error);
      }

    } else {
      console.log('should not be here. wanderClickedNode>else')
      setGraphSearchLoader(true)
      console.log("No matching result found.");
      axios.post(`/api/search?q=${fileOpenedFromGraph.id}`)
        .then((response) => {
          console.log("response:", response.data);
          // console.log("searchValue", searchValue);
          const searchWords = (searchValue.match(/(-?)"([^"]*)"|\S+/g) || []).map(
            (match: any) => match.replace(/^(-?)"([^"]*)"$/, "$1$2")
          );
          // console.log("searchWords", searchWords);

          // Use filter to remove objects that match any word in searchWords with a hyphen
          const filteredData = response.data.filter((item: any) => {
            return !searchWords.includes(`-${item.fileName}`);
          });

          // console.log("filteredData", filteredData);
          filteredData.forEach((result: any) => {
            result.contentWithRemovedBrackets = marked(result.content);
            const match = result.contentWithRemovedBrackets.match(/#(\w+)/);
            const nodeTag = match ? match[0] : null;
            // console.log("nodeTag", nodeTag, result.fileName);

            let count = 0;
            let finalCount = 1;

            // Check if fileName is not present in updatedGraphData.nodes
            if (!nodeExists(result.fileName)) {
              // Add fileName to nodes
              // console.log("filename to add: ", result.fileName);
              updatedGraphData.nodes.push({
                id: result.fileName,
                tag: nodeTag, // You may set the tag value if needed
              });

              // console.log("updatedGraphData: ", updatedGraphData);
              // console.log(result.content);
              const regex = /\[\[([^[\]]+)\]\]/g;
              const styledContent = result.content.replace(
                regex,
                (match: any, word: any) =>
                  `<span style="text-decoration: underline; cursor: pointer;">${word}</span>`
              );

              const underlinedWords: any = styledContent.match(
                /<span[^>]*>(.*?)<\/span>/g
              );
              let wordsArray
              if (underlinedWords) {
                wordsArray = underlinedWords.map((span: any) => {
                  // Use a regular expression to extract the text content between the <span> tags
                  const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
                  // Check if a match was found and return the extracted text, or an empty string if not
                  return match ? match[1] : "";
                });
              } else if (underlinedWords === null) {
                wordsArray = [result.fileName]
              }
              // console.log("wordsArray: ", wordsArray);

              try {
                // console.log("wordsArray", wordsArray);
                axios.post("/api/getTags?q=" + wordsArray.join(","))
                  .then((response) => {
                    // console.log("res", response);
                    // Handle the response data here

                    count = count + 1;
                    const linkTags = Object.keys(response.data).map((key) => {
                      return {
                        name: key,
                        category: response.data[key],
                      };
                    });

                    const isExcluded = (name: any, searchValue: any) => {
                      // console.log('name' , name , 'searchvalue= ' , searchValue)
                      // console.log( searchValue.includes(`-${name}`) ||
                      // searchValue.includes(`"-${name}"`))
                      return (
                        searchValue.includes(`-${name}`) ||
                        searchValue.includes(`"-${name}"`)
                      );
                    };
                    // let nodeArray = [];
                    // console.log("linkTags", linkTags);
                    linkTags.forEach((word: any) => {
                      // Remove HTML tags from underlined word
                      // console.log("word", word);
                      if (!nodeExists(word.name)) {
                        // console.log('search bar=' , graphSearchValue)
                        updatedGraphData.nodes.push({
                          id: word.name,
                          tag: word.category,
                        });
                        // console.log("nodes:", updatedGraphData.nodes);
                      }
                      console.log("nodes", updatedGraphData);
                      // Create a link between fileName and underlined word

                      // Create a link between fileName and underlined word
                      updatedGraphData.links.push({
                        source: result.fileName,
                        target: word.name,
                        value: 1,
                      });

                    });

                    // console.log("finalCount", finalCount);
                    // console.log("count", count);
                    if (finalCount == count) {

                      let filteredGraphData: any = []

                      // Step 1: Find items with status "exclude" in updatedCheckboxes
                      const excludedValues: any = [];
                      graphTagFilters.forEach((category: any) => {
                        category.items.forEach((item: any) => {
                          if (item.status === "exclude") {
                            excludedValues.push(item.value.substring(1));
                          }
                        });
                      });

                      // Step 2: Find corresponding node ids in graphDataCopy
                      const excludedNodeIds: any = [];
                      updatedGraphData.nodes.forEach((node: any) => {
                        if (excludedValues.includes(node.tag)) {
                          excludedNodeIds.push(node.id);
                        }
                      });

                      // console.log('excludedNodeIds',excludedNodeIds)

                      // Step 3: Remove links with source or target matching excluded node ids
                      filteredGraphData.links = updatedGraphData.links.filter((link: any) => {
                        return !excludedNodeIds.includes(link.source) && !excludedNodeIds.includes(link.target);
                      });

                      // Step 4: Remove nodes with ids in excludedNodeIds
                      filteredGraphData.nodes = updatedGraphData.nodes.filter((node: any) => !excludedNodeIds.includes(node.id));

                      // Now, graphDataCopy is updated with the desired changes.
                      console.log('filteredGraphData: ', filteredGraphData);

                      // makeGraph(filteredGraphData)
                      // let graphNewData = resultData;
                      setGraphData(updatedGraphData);
                      setGraphDataAfterFilters(filteredGraphData)
                      makeGraph(filteredGraphData);
                      setGraphSearchLoader(false)
                      // console.log("match count");
                    }
                  });
              } catch (error) {
                // Handle errors here
                setGraphSearchLoader(false)
                console.log("Error:", error);
              }
            }
          });
          // console.log("response", response.data);
          const updatedOpenedResults = [...openedResults];

          // Iterate through response.data
          filteredData.forEach((item: any) => {
            // Check if the item's fileName is not already in openedResults and its content contains #sandwich
            const isNotPresentInOpenedResults = !updatedOpenedResults.some(
              (result) => result.fileName === item.fileName
            );
            const hasSandwichInContent = item.content.includes("#sandwich");

            if (isNotPresentInOpenedResults && hasSandwichInContent) {
              // Add the item to updatedOpenedResults
              marked.setOptions({
                breaks: true,
              });

              item.content = item.content.replace(/\n(?=\n)/g, "\n\n<br/>\n")
              item.content = marked(item.content);
              // console.log("markedContent", matchingFile);

              const regex = /\[\[([^[\]]+)\]\]/g;
              const hashtagParagraphRegex = /<p>#.*?<\/p>/g;

              const contentWithoutHashtags = item.content.replace(
                hashtagParagraphRegex,
                ""
              );
              // console.log("contentWithoutHashtags", contentWithoutHashtags);

              const contentWithStyledWords = contentWithoutHashtags.replace(
                regex,
                (match: any, word: any) =>
                  `<span style="text-decoration: underline; cursor: pointer;">${word}</span>`
              );
              const updatedResultToOpen = {
                ...item,
                content: contentWithStyledWords,
                openedFromResults: true,
              };

              updatedOpenedResults.push(updatedResultToOpen);
            }
          });

          // Update the openedResults state with the new array
          setOpenedResults(updatedOpenedResults);
          setOpenedResultsRawData(updatedOpenedResults)

          // console.log("Updated openedResults:", openedResults);
        });
    }
  };


  const handleNodeTextSizeCommitted = (event: any, newValue: any) => {
    setNodeTextSize(newValue)
  }


  const handleCenterForceCommitted = (event: any, newValue: any) => {
    setCenterForceValue(newValue)
  };


  const handleLinkForceCommitted = (event: any, newValue: any) => {
    setLinkForceValue(newValue)
  }


  const handleLinkDistaneCommitted = (event: any, newValue: any) => {
    const mappedValue = mapValueToState(newValue, 0, 1, -30, -300);
    console.log('newValue', newValue)
    console.log('mappedValue', mappedValue)

    setSliderValue(mappedValue)
  };


  const mapValueToState = (value: any, min1: any, max1: any, min2: any, max2: any) => {
    return (value - min1) * (max2 - min2) / (max1 - min1) + min2;
  };


  const mapSliderValueToReal = (value: any, min1: any, max1: any, min2: any, max2: any) => {
    return (value - min2) * (max1 - min1) / (max2 - min2) + min1;
  }


  const handleCloseDialog = () => {
    setSyncPopup(false);
  };


  const synchronizeFiles = async () => {

    axios.get("/api/googleDriveFiles")
      .then((res) => {
        // console.log('res: ' , res)
        if (res.data && res.data.authUrl) {
          // Redirect the user to the Google OAuth authorization page
          window.location.href = res.data.authUrl;
        } else {
          console.error("No 'authUrl' found in the response.");
        }

        // setBtnLoading(false);
        // Helpers.setAccessToken(res.data.token)
        // Helpers.setUser(res.data.user)
        // router.push("/?dashboard");
      })
      .catch((err) => {
        console.log("err=", err.response);
      })
  }


  const handlerFolderPopupClose = async () => {
    setFoldersPopup(false)
  }


  const handleFolderSelection = (folder: any) => {
    console.log(folder)

    if (folder.id) {

      axios.get("api/downloadFiles", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          folderId: folder.id,
        },
      }).then((res) => {
        // console.log('res: ' ,res.data)

      }).catch((err) => {

      })

      // axios.get('https://www.googleapis.com/drive/v3/files', {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      //   params: {
      //     q: `'${folder.id}' in parents  and fileExtension='md'`,
      //   },
      // }).then((response) => {
      //   // Handle the list of files and subfolders within the selected folder
      //   console.log('Contents of selected folder:', response);
      //   // response.data.files.forEach((file:any) => {
      //   //   // Save each file to the 'public' directory
      //   //   const fileStream = fs.createWriteStream(`./public/${file.name}`);
      //   //   response.data.pipe(fileStream);

      //   //   fileStream.on('finish', () => {
      //   //     console.log(`File ${file.name} downloaded and saved.`);
      //   //   });
      //   // });
      // })
      // .catch((error) => {
      //   console.error('Error fetching folder contents:', error.response);
      // });
    }

    // setFoldersPopup(false)
  };


  const toggleAccountOptions = () => {
    setShowAccountOptions(!showAccountOptions);
  };


  const handleUserManagementClick = (itemName: any) => {
    const queryParams = { usermanagement: itemName };

    router.push({
      pathname: "/dashboard",
      query: queryParams,
    });
  };


  const handleUserOptions = (itemName: any) => {  
    if (itemName === 'profile') {
      // console.log('getuser' , getUser)
      setFormData((prevData) => ({
        ...prevData,
        email: getUser.user.email,
        fullName: getUser.user.full_name,
        role: getUser.user_role,
        status: getUser.user.status,
        image: getUser.user.image

      }));
      setShowEditUserDialog(true)
    }
    if (itemName === 'changepassword') {
      setShowChangePasswordDialog(true)

    }
    if (itemName === 'billing') {
      setBillingLoader(true);
      axios.post(`/api/stripe-billing?customer_id=${getUser.user.stripe_customer_id}`)
        .then((res: any) => {
          window.location.href = res.data.url;
        })
        .catch((err: any) => {
          console.log('err from stripe billing', err)
          setBillingLoader(false);
        })
    }
    if (itemName === 'logout') {
      setUserLogoutPopup(true)
    }
  }


  const handleUserLogoutPopupClose = () => {
    toggleAccountOptions()
    setUserLogoutPopup(false)
  }


  const userLogout = async () => {
    await Helpers.logout()
    router.push('/login')

  }


  const closeEditUserDailog = () => {
    setShowEditUserDialog(false)
    setShowAccountOptions(false)
    setFormData({ fullName: '', email: '', role: '', status: '', image: '' });
  }


  const handleUserProfileChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, });
  }


  const handleEditUser = async () => {
    setEditUserLoader(true)
    await axios.post('/api/editUser', {
      email: getUser.user.email,
      data: formData
    })
      .then(async (res) => {
        console.log('user updated successfully', res.data);
        // await fetchUsers()
        // setOriginalUsers(res.data.allUsers);
        // setSearchedUsers(res.data.allUsers)
        // closeAddUserDialog()
        setShowEditUserDialog(false)
        toggleAccountOptions()
        setEditUserLoader(false)
        toast.success('Account updated successfully!');
        setFormData({ fullName: '', email: '', role: '', status: '', image: '' });

        dispatch(stAccessTokenVerify({
          user: res.data.allUsers[0],
          user_permssions: res.data.getPermissions,
          user_role: res.data.getRole,
          user_package: getUser.user_package
        }))

        setUser(res.data.allUsers[0])
        setPermissions(res.data.getPermissions)
        setUserAccessVaults(res.data.vaultsAccess)
      })
      .catch((error: any) => {
        console.log('Error calling editUser api:', error);
        setEditUserLoader(false)
        // setIsLoading(false);
        toast.error('Failed to updated account data');
      })
  }


  const closeSetPasswordDialog = () => {
    setShowChangePasswordDialog(false)
    setNewPasswordData({ newPassword: '', confirmPassword: '' });
    setShowAccountOptions(false)
    setShowSetPasswordToggle(false)
    setShowConfirmPasswordToggle(false)
  }


  const handleSetNewPasswordToggle = (e: any) => {
    const { name, value } = e.target;
    setNewPasswordData({
      ...newPasswordData,
      [name]: value,
    });
  }


  const handleSetPassword = async () => {
    // const emailToUpdatePassword:any = originalUsers[indexToChangePassword].email;
    if (newPasswordData.newPassword.trim() === '' || newPasswordData.confirmPassword.trim() === '') {
      toast.error('Password fields cannot be empty!', { autoClose: 2000 });
    } else if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      toast.error('Passwords do not match!', { autoClose: 2000 });
    } else {
      setUpdatePasswordLoader(true)
      // console.log('getuser' , getUser.user.email)
      await axios.post('/api/updatePassword', {
        email: getUser.user.email,
        password: newPasswordData.newPassword
      })
        .then((res) => {
          console.log('set password successfully', res.data);
          // closeAddUserDialog()
          // setShowSetPassword(false)
          setShowChangePasswordDialog(false)
          toggleAccountOptions()
          setUpdatePasswordLoader(false)
          toast.success('Password updated successfully!', { autoClose: 1500 });
          setNewPasswordData({
            newPassword: '',
            confirmPassword: '',
          });


        })
        .catch((error: any) => {
          console.log('Error calling addUser api:', error);
          setUpdatePasswordLoader(false)
          toast.error('Failed to set password');
        })
    }




    //clear fields after updating password


  }


  const handleEditProfilePicture = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      image: '',
    }));
  }


  const handleFileChange = (event: any) => {
    const selectedProfilePicture = event.target.files[0];
    const previews: any = [];
    const reader = new FileReader();
    reader.onload = () => {
      previews.push(reader.result);
      if (previews.length) {
        setFormData({
          ...formData,
          image: previews[0],
        });
      }
    };

    reader.readAsDataURL(selectedProfilePicture);


  };


  const handleChooseFile = () => {
    fileInputRef.current.click();
  };


  const handleLeftArrowForPreviousFile = () => {
    setPreviewNodeLinkLoader(true)
    const newArray = graphNodeOpened.slice(1);
    setGraphNodeOpened(newArray);
    setAnimationKey((prevKey) => prevKey + 1);
    setPreviewNodeLinkLoader(false)
  }


  const moveResult = (fromIndex: any, toIndex: any) => {
    const updatedResults = [...openedResults];
    const [movedResult] = updatedResults.splice(fromIndex, 1);
    updatedResults.splice(toIndex, 0, movedResult);

    setOpenedResults(updatedResults);
    setOpenedResultsRawData(updatedResults)
  };


  const handleFiltersClose = () => {
    setShouldShowFilters(true)
  }


  const handleMobileWorkspace = () => {
    const searchResultsInnerContainer: any = document.querySelector('.search-results-inner-container');
    const mobileWorkspaceContainer: any = document.querySelector('.mobile-workspace-container');
    const mobileHomepageVideo: any = document.querySelector('.mobile-homepage-video');
    const sidebarWorkspaceIcon: any = document.querySelector('.sidebar-workspace-icon')
    const mobileTextWorkspaceIcon: any = document.querySelector('.mobile-text-workspace-icons')
    const menuBtn: any = document.querySelector('.menuBtn')
    const searchResultsFound: any = document.querySelector('.search-results-found')
    const menus: any = document.querySelector('.menus')
    const searchResults: any = document.querySelector('.search-results');


    // console.log(searchResultsInnerContainer, mobileWorkspaceContainer)

    if (searchResultsInnerContainer && getComputedStyle(searchResultsInnerContainer).display === 'block') {
      searchResultsInnerContainer.style.display = 'none';
      sidebarWorkspaceIcon.style.display = 'none'
      menuBtn.style.display = 'none'
      searchResultsFound.style.display = 'none'
      menus.style.display = 'none'
      mobileTextWorkspaceIcon.style.display = 'flex'
      mobileWorkspaceContainer.style.display = 'block';
      searchResults.classList.add('mobile-text-workspace-view');
    } else if (mobileWorkspaceContainer) {
      mobileWorkspaceContainer.style.display = 'none';
      mobileTextWorkspaceIcon.style.display = 'none'
      sidebarWorkspaceIcon.style.display = 'flex'
      menuBtn.style.display = 'flex'
      searchResultsFound.style.display = 'flex'
      menus.style.display = 'flex'
      searchResultsInnerContainer.style.display = 'block';
      searchResults.classList.remove('mobile-text-workspace-view');
    } else if (mobileHomepageVideo) {
      mobileHomepageVideo.style.display = 'block';
    }
  }


  const handleMobileGraphSearch = () => {

    const mobileTextWorkspaceIcon: any = document.querySelector('.mobile-text-workspace-icons')
    const sidebarWorkspaceIcon: any = document.querySelector('.sidebar-workspace-icon')
    const menuBtn: any = document.querySelector('.menuBtn')
    const searchResultsFound: any = document.querySelector('.search-results-found')



    if (mobileTextWorkspaceIcon) {
      mobileTextWorkspaceIcon.style.display = 'none'
      sidebarWorkspaceIcon.style.display = 'flex'
      menuBtn.style.display = 'flex'
      searchResultsFound.style.display = 'flex'

    }

    handleGraphOrTextView()
  }


  const handleMobileGraphText = () => {

    handleGraphOrTextView()

    setTimeout(() => {
      const searchResults: any = document.querySelector('.search-results');
      const searchResultsInnerContainer: any = document.querySelector('.search-results-inner-container');
      const mobileWorkspaceContainer: any = document.querySelector('.mobile-workspace-container');
      const menus: any = document.querySelector('.menus');

      if (searchResultsInnerContainer) {
        searchResultsInnerContainer.style.display = 'none'
        menus.style.display = 'none'
        searchResults.classList.add('mobile-text-workspace-view');
        mobileWorkspaceContainer.style.display = 'block'
      } else {
        console.log('ehhhhhhl')
      }


    }, 100);


  }


  const handleMobileGraphTextIcon = () => {
    handleGraphOrTextView()


    setTimeout(() => {
      const searchResults: any = document.querySelector('.search-results');

      const sidebarWorkspaceIcon: any = document.querySelector('.sidebar-workspace-icon')
      const mobileTextWorkspaceIcon: any = document.querySelector('.mobile-text-workspace-icons')
      const searchResultsInnerContainer: any = document.querySelector('.search-results-inner-container');
      const mobileWorkspaceContainer: any = document.querySelector('.mobile-workspace-container');
      const menus: any = document.querySelector('.menus');

      if (searchResultsInnerContainer) {

        searchResultsInnerContainer.style.display = 'none'
        sidebarWorkspaceIcon.style.display = 'none'
        searchResults.classList.add('mobile-text-workspace-view');
        mobileWorkspaceContainer.style.display = 'block'
        mobileTextWorkspaceIcon.style.display = 'flex'
        menus.style.display = 'none'


      }
    }, 50);
  }


  const viewNodeClickedFile = async () => {
    // console.log("fileOpenedFromGraph", fileOpenedFromGraph);
    const matchingResult: any = openedResults.find((result: any) => result.fileName === fileOpenedFromGraph.id);

    if (matchingResult) {
      // console.log("Matching Result:", matchingResult);

      if (graphNodeOpened.length === 0 || matchingResult.fileName !== graphNodeOpened[0].fileName) {
        // Update the array only if the fileName is different
        setGraphNodeOpened((prevGraphNodeOpened: any) => [matchingResult, ...prevGraphNodeOpened]);
      }
    } else {
      // Now does not come in this else
      console.log('should not come in this else : showNodeClickedFile')
      try {
        const response = await fetch(`/api/linkFile?q=${fileOpenedFromGraph.id}`);
        const newDataObject = await response.json();
        // console.log("responseJson: ", responseJson);

        marked.setOptions({
          breaks: true,
        });

        newDataObject.content = marked(newDataObject.content);
        newDataObject.contentWithRemovedBrackets = marked(
          newDataObject.content
        );

        const regex = /\[\[([^[\]]+)\]\]/g;
        const hashtagParagraphRegex = /#\S+/g;
        newDataObject.content = newDataObject.content.replace(
          hashtagParagraphRegex,
          ""
        );

        newDataObject.content = newDataObject.content.replace(
          regex,
          (match: any, word: any) =>
            `<span style="text-decoration: underline; cursor: pointer;">${word}</span>`
        );
        console.log("newDataObject", newDataObject);

        setGraphNodeOpened(newDataObject);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }


    const graphSearchResultsDiv: any = document.querySelector('.graph-search-results');


    if (graphSearchResultsDiv) {
      graphSearchResultsDiv.style.display = 'none';

      setTimeout(() => {
        const mobileNodePreview: any = document.querySelector('.mobile-node-preview');
        mobileNodePreview.style.display = 'block'
      }, 200);
    }

    setAnimationKey((prevKey) => prevKey + 1);
    // sethideFiltersForPreview(false);


  }


  const collapseMobileExpandedNode = () => {
    const mobileNodePreview: any = document.querySelector('.mobile-node-preview');


    if (mobileNodePreview) {


      setTimeout(() => {
        const graphSearchResultsDiv: any = document.querySelector('.graph-search-results');
        mobileNodePreview.style.display = 'none'
        graphSearchResultsDiv.style.display = 'block';
      }, 200);
    }

    setGraphNodeOpened([]);
  };


  const handleMobileGraphIcon = () => {

    const searchResultsFound: any = document.querySelector('.search-results-found')
    const menuBtn: any = document.querySelector('.menuBtn')

    if (menuBtn && getComputedStyle(menuBtn).display === 'flex') {
      console.log('found')
      menuBtn.style.display = 'none'
      searchResultsFound.style.display = 'none'
    } else {
      console.log('not found')
      menuBtn.style.display = 'flex'
      searchResultsFound.style.display = 'flex'
    }

    handleGraphOrTextView()
  }

  const hanndleCloseContactSupportPopup = () => {
    setShowContactSupportToast(false)
  }

  const handleContactSupportMessage = async () => {
    setContactSupportLoader(true)
    // console.log('linkclickedid', linkedClickFromFile)
    try {
      // Assuming contactSupportMessage is a state variable
      const response = await axios.post('/api/contactSupport', {
        message: contactSupportMessage,
        file: linkClickFromFile,
      });

      setContactSupportLoader(false)
      setShowContactSupportToast(false)
      setLinkClickFromFile('')
      setContactSupportMessage('')
      toast(`${response.data.message}`, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: "success",
        theme: "light",
      }
      );




      // You can add further logic here based on the API response
    } catch (error: any) {
      setContactSupportLoader(false)
      // Handle any errors that occurred during the API request
      console.error('Error sending message:', error.message);
    }

  }


  return (

    <div className="homepage-container">
      <div className={`side-nav ${themeChangericon ? '' : 'night-mode'}`}>
        <div className={"logoVc"}>

          <div className="site-name" onClick={handleSiteNameClick}>
            <p>TCM Weaver</p>
          </div>

          {/* ================Top Icons && Popups==================== */}
          <div className={"icon-profile"}>

            {/* ==============Theme Change==========================  */}
            <div className="themeChanger mobile-icon">
              {themeChangericon ? (
                <img src="/dark-mode.png" alt="img" onClick={handleThemeChangerClick} />
              ) : (
                <img src="/light-modenew.svg" alt="img" onClick={handleThemeChangerClick} />
              )}
            </div>

            {/* =============Graph or Text View=======================*/}
            <div className="mobile-icon">
              {graphOrTextView ? (
                <div className="simple-icon">
                  {themeChangericon ? (
                    <img src="/graph-logo-light.png" alt="img" onClick={() => { handleGraphOrTextView() }} />
                  ) : (
                    <img src="/graph-logo-dark.png" alt="img" onClick={() => { handleGraphOrTextView() }} />
                  )}
                </div>
              ) : (
                <div className={"note-icon"}>
                  {themeChangericon ? (
                    <img src="/text-logo.png" alt="img" onClick={() => { handleGraphOrTextView() }} />
                  ) : (
                    <img src="/text-logo-night.png" alt="img" onClick={() => { handleGraphOrTextView() }} />
                  )}
                </div>
              )}
            </div>

            {/* =============Users Options=========================== */}
            <div className="sidebar-user-div mobile-icon">
              {themeChangericon ? (
                <img src="/users.svg" alt="img" onClick={toggleAccountOptions} style={{ cursor: "pointer" }} ref={usersIconRef} />
              ) : (
                <img src="/users-dark.svg" alt="img" onClick={toggleAccountOptions} style={{ cursor: "pointer" }} ref={usersIconRef} />
              )}

              {showAccountOptions && (
                <div className="account-options-container" ref={accountOptionsRef}>
                  <List>
                    {_.every(['vault_management'], value => _.includes(getPermissions, value)) && (
                      <ListItem button onClick={() => handleUserManagementClick("vaultmanagement")} dense>
                        <ListItemText primary="Vault Management" />
                      </ListItem>
                    )}
                    {_.every(['user_management'], value => _.includes(getPermissions, value)) && (
                      <ListItem button onClick={() => handleUserManagementClick("usermanagement")} dense>
                        <ListItemText primary="User Management" />
                      </ListItem>
                    )}

                    {getUser.user_role === 'User' && (
                      <>
                        <ListItem button onClick={() => handleUserOptions("profile")} dense>
                          <ListItemText primary="Profile" />
                        </ListItem>
                        <ListItem button onClick={() => handleUserOptions("changepassword")} dense>
                          <ListItemText primary="Change Password" />
                        </ListItem>
                        {getUser.user_package.length > 0 && (
                          <ListItem button onClick={() => handleUserOptions("billing")} dense>
                            <ListItemText primary="Billing" />
                            {billingLoader && <CircularProgress size={17} style={{ color: 'grey' }} />}
                          </ListItem>
                        )}
                      </>
                    )}

                    <ListItem button onClick={() => handleUserOptions("logout")} dense>
                      <ListItemText primary="Logout" />
                    </ListItem>
                  </List>
                </div>
              )}
            </div>

            {/* =============Mobile Graph Loader======================*/}
            {graphSearchLoader && (
              <div className="mobile-graph-loader-container">
                <CircularProgress size={13} style={{ color: 'black' }} />
              </div>
            )}



            {/* =============Workspace Icon========================== */}
            <div className="sidebar-workspace-icon">
              {graphOrTextView ? (
                <>
                  {themeChangericon ? (
                    <>
                      <img src="/text-logo.png" alt="img" onClick={handleMobileWorkspace} />
                      <img src="/graph-logo-light.png" alt="img" onClick={handleMobileGraphIcon} />
                      <div className="mobile-workspace-count-badge">{openedResults.length}</div>
                    </>
                  ) : (
                    <>
                      <img src="/text-logo-night.png" alt="img" onClick={handleMobileWorkspace} />
                      <img src="/graph-logo-dark.png" alt="img" onClick={handleMobileGraphIcon} />
                      <div className="mobile-workspace-count-badge">{openedResults.length}</div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {themeChangericon ? (
                    <>
                      <img src="/search-light.svg" alt="img" onClick={handleMobileGraphIcon} />
                      <img src="/text-logo.png" alt="img" onClick={handleMobileGraphTextIcon} />
                    </>
                  ) : (
                    <>
                      <img src="/search-dark.svg" alt="img" onClick={handleMobileGraphIcon} />
                      <img src="/text-logo-night.png" alt="img" onClick={handleMobileGraphTextIcon} />
                    </>
                  )}
                </>
              )}
            </div>

            <div className="mobile-text-workspace-icons">
              {graphOrTextView ? (
                <>
                  {themeChangericon ? (
                    <>
                      <img src="/search-light.svg" alt="img" onClick={handleMobileWorkspace} />
                      <img src="/graph-logo-light.png" alt="img" onClick={handleGraphOrTextView} />

                      {/* <div className="mobile-workspace-count-badge">{openedResults.length}</div> */}


                    </>
                  ) : (
                    <>
                      <img src="/search-dark.svg" alt="img" onClick={handleMobileWorkspace} />
                      <img src="/graph-logo-dark.png" alt="img" onClick={handleGraphOrTextView} />

                      {/* <div className="mobile-workspace-count-badge">{openedResults.length}</div> */}


                    </>
                  )}
                </>
              ) : (
                <>
                  {themeChangericon ? (
                    <>
                      <img src="/search-light.svg" alt="img" onClick={handleMobileGraphSearch} />
                      <img src="/text-logo.png" alt="img" onClick={handleMobileGraphText} />
                    </>
                  ) : (
                    <>
                      <img src="/search-dark.svg" alt="img" onClick={handleMobileGraphSearch} />
                      <img src="/text-logo-night.png" alt="img" onClick={handleMobileGraphText} />
                    </>
                  )}
                </>

              )}

            </div>




            <TemporaryDrawer themeChangeIcon={themeChangericon} textOrGraphView={graphOrTextView}
              handleThemeChange={handleThemeChangerClick} handleGraphOrTextView={handleGraphOrTextView}
              handleUserOptions={handleUserOptions} getPermissions={getPermissions}
              handleUserManagementClick={handleUserManagementClick} getUser={getUser} billingLoader={billingLoader} />


            {syncPopup && (
              <div>
                <Dialog open={syncPopup} onClose={handleCloseDialog}>
                  <DialogTitle>Authorization Required</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      You will be redirected to the Google consent page to grant this app access to your Google Drive
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={synchronizeFiles} color="primary">
                      Proceed
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            )}

            {foldersPopup && (
              <Dialog open={foldersPopup} onClose={handlerFolderPopupClose}>
                <DialogTitle>Select a Folder</DialogTitle>
                <DialogContent>
                  <List>
                    {folders.map((folder: any) => (
                      <ListItem button key={folder.id} onClick={() => handleFolderSelection(folder)}>
                        <ListItemText primary={folder.name} />
                      </ListItem>
                    ))}
                  </List>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handlerFolderPopupClose} color="primary">
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            {userLogoutPopup && (
              <div >
                <Dialog open={userLogoutPopup} onClose={handleUserLogoutPopupClose} className="user-logout-div">
                  <DialogTitle>Are you sure you want to logout?</DialogTitle>
                  <DialogActions>
                    <Button onClick={handleUserLogoutPopupClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={userLogout} color="primary">
                      Logout
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            )}

            {showEditUserDialog && (
              <Dialog open={showEditUserDialog} onClose={closeEditUserDailog} sx={{ width: 550, margin: 'auto' }} className="edit-user-dialog">
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>

                  <DialogContentText>
                    Please enter the details:
                  </DialogContentText>

                  <Grid container spacing={2} sx={{ paddingTop: 1 }}>
                    <Grid item xs={12}>
                      <div className="edit-profile-div edit-profile-div-homepage">
                        <div className="edit-profile-image-div">
                          {formData.image && formData.image !== null && formData.image !== '' ? (
                            <img src={formData.image}
                              style={{ borderRadius: '50%', width: '100%', height: '100%', objectFit: 'contain' }}
                              alt="Profile Picture"
                            />
                          ) : (
                            <img src='/profile-avatar.webp'
                              style={{ borderRadius: '50%', width: '100%', height: '100%', objectFit: 'contain' }}
                              alt="Profile Picture"
                            />
                          )}
                        </div>

                        <div className="edit-profile-button-div">
                          <button onClick={handleChooseFile} >Change picture</button>
                          <button onClick={handleEditProfilePicture}>Remove</button>
                          <input type="file" ref={fileInputRef} style={{ display: 'none' }}
                            onChange={handleFileChange}
                          />
                        </div>

                      </div>


                      <TextField
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleUserProfileChange}
                        fullWidth
                        margin="normal"
                        size='small'
                      />

                      <TextField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleUserProfileChange}
                        fullWidth
                        margin="normal"
                        size='small'
                      />

                    </Grid>
                  </Grid>
                </DialogContent>

                <DialogActions>
                  <Button onClick={closeEditUserDailog} color="primary">
                    Cancel
                  </Button>
                  <Button color="primary" onClick={handleEditUser} disabled={editUserLoader}>
                    {editUserLoader ? 'Saving...' : 'Save'}
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            {showChangePasswordDialog && (
              <Dialog open={showChangePasswordDialog} onClose={closeSetPasswordDialog}>
                <DialogTitle>Set Password</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please enter the new password:
                  </DialogContentText>
                  <TextField
                    type={showSetPasswordToggle ? 'text' : 'password'}
                    label="New Password"
                    name="newPassword"
                    value={newPasswordData.newPassword}
                    onChange={handleSetNewPasswordToggle}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowSetPasswordToggle(!showSetPasswordToggle)}
                            edge="end"
                          >
                            {showSetPasswordToggle ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    type={showConfirmPasswordToggle ? 'text' : 'password'}
                    label="Confirm Password"
                    name="confirmPassword"
                    value={newPasswordData.confirmPassword}
                    onChange={handleSetNewPasswordToggle}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPasswordToggle(!showConfirmPasswordToggle)}
                            edge="end"
                          >
                            {showConfirmPasswordToggle ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeSetPasswordDialog} color="primary">
                    Cancel
                  </Button>
                  <Button color="primary" onClick={handleSetPassword} disabled={isLoading}>
                    {updatePasswordLoader ? 'Saving...' : 'Save'}
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            {showLockedVaultPopup && (
              <Dialog open={showLockedVaultPopup} onClose={() => setShowLockedVaultPopup(false)}>
                <DialogTitle>Subscription</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Only Basic Vault is free. Buy Subscription to get full access.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowLockedVaultPopup(false)} color="primary">
                    Cancel
                  </Button>
                  {/* <Button color="primary" onClick={handleVaultCheckout} disabled={isLoading}>
                      {updatePasswordLoader ? 'Saving...' : 'Buy Now'}
                    </Button> */}

                  {/* <Button color="primary">
                      {updatePasswordLoader ? (
                          <>
                            Please Wait {" "}
                            <span
                              className="spinner-grow spinner-grow-sm ml-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          </>
                        ) : (
                          <>buy now</>
                        )}
                    </Button> */}
                </DialogActions>
              </Dialog>
            )}

            {showContactSupportToast && (
              <Dialog open={showContactSupportToast} onClose={hanndleCloseContactSupportPopup}>
                <DialogTitle>Contact Support</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please enter the message:
                  </DialogContentText>
                  <UnstyledTextareaIntroduction setContactSupportMessage={setContactSupportMessage} linkClickFromFile={linkClickFromFile} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={hanndleCloseContactSupportPopup} color="primary">
                    Cancel
                  </Button>
                  <Button color="primary" onClick={handleContactSupportMessage} disabled={isLoading}>
                    {contactSupportLoader ? 'Sending...' : 'Send Message'}
                  </Button>
                </DialogActions>
              </Dialog>
            )}

          </div>

        </div>

        {/* =======================Search Bar=======================================  */}
        <div className={"menuBtn"}>
          {graphOrTextView ? (
            <>
              <input type="text" className={"formControl"} placeholder=" Smart search" value={searchValue}
                onChange={handleSearch}
              />
            </>
          ) : (
            <>
              <input type="text" className={"formControl"} placeholder=" Graph search" value={graphSearchValue}
                onChange={handleGraphSearch}
              />
            </>
          )}


          <div className="copy-icon">
            {textSearchLoader || graphSearchLoader ? (
              <CircularProgress size={16} style={{ color: 'black' }} />
            ) : (
              <div onClick={handleCopyText} style={{ cursor: 'pointer' }}>
                {themeChangericon ? (
                  <img src="/copy-content.png" alt="img" />
                ) : (
                  <img src="/copy-content-dark.png" alt="img" />
                )}
              </div>
            )}

            {isCopied && <div className="copy-tooltip">Copied!</div>}
          </div>
        </div>

        <div className="search-results-found">
          {(searchValue.length > 0 || graphSearchValue.length > 0) && (
            <>
              {searchResults.length > 0 ? (
                <>
                  {showSearchResultsFound && (
                    <p>{searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'}</p>
                  )}
                </>
              ) : (
                <>
                  {showSearchResultsFound && (
                    <p>{searchResults.length} results found</p>
                  )}
                </>
              )}
            </>
          )}
        </div>


        {/* =======================Search Results & Graph Node Options==============  */}
        {graphOrTextView ? (
          <div className={`search-results ${!shouldShowFilters ? "results-height" : ""}`} >

            {searchValue.length > 0 || openedResults.length > 0 ? (
              <>
                <div className="search-results-inner-container">
                  {searchResults.map((result, index) => (
                    <div className="filter-data" key={index}>
                      <div className="set set-1">
                        <div>
                          <div className="results-title">
                            <span>{(result as { wordOccurence: number }).wordOccurence}</span>

                            <h1
                              dangerouslySetInnerHTML={{ __html: (result as { fileNameWithHighlightedWords: string; }).fileNameWithHighlightedWords, }}
                            // onClick={() => handleFileClick(result["item"])}
                            />
                          </div>

                          {themeChangericon ? (
                            <img src="/xmarknew.png" alt="img" className="remove-search-result" onClick={() => removeBothSearchResults(result)} />
                          ) : (
                            <img src="/xmark-dark.png" alt="img" className="remove-search-result" onClick={() => removeBothSearchResults(result)} />
                          )}
                        </div>

                        <div className="search-result-description">
                          <div className="note">
                            <p
                              dangerouslySetInnerHTML={{ __html: (result as { totalMarkedData: string; }).totalMarkedData, }}
                            />
                          </div>
                          <div>
                            {themeChangericon ? (
                              <img src="/arrow-rightnew.png" alt="img" className="remove-search-result" onClick={() => openSearchResult(result)} />
                            ) : (
                              <img src="/arrow-right-dark.png" alt="img" className="remove-search-result" onClick={() => openSearchResult(result)} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mobile-workspace-container ">
                  <div className='main'>
                    {openedResults.length > 0 ? (
                      openedResults.map((result, index) => (
                        <WorkspaceContent key={index} result={result} index={index} moveResult={moveResult}
                          handleLinkClick={handleLinkClick} themeChangericon={themeChangericon}
                          collapseOpenedResult={collapseOpenedResult} removeBothSearchResults={removeBothSearchResults}
                          linkClickLoader={linkClickLoader} linkClickedId={linkClickedId}>
                        </WorkspaceContent>
                      ))
                    ) : (
                      <>
                        <p style={{ paddingTop: '10px' }}>No files open in workspace</p>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mobile-homepage-video">
                  <div className="mobile-homepage-content-container">
                    {homepageFile && (
                      <p dangerouslySetInnerHTML={{ __html: filtersData ? homepageFile.content : '', }}
                        className="opened-result-description"
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {!hideFiltersForPreview ? (
              <div key={animationKey} className="node-preview">
                <div className="node-preview-title">
                  <div className="graph-show-node">
                    {graphNodeOpened.length === 1 ? (
                      <div>
                        {themeChangericon ? (
                          <img src="/arrow-leftnew.png" alt="img" className="graph-node-backarrow-single" />
                        ) : (
                          <img src="/arrow-left-new-disabled.svg" alt="img" className="graph-node-backarrow-single" />
                        )}
                        {/* <ArrowBackIcon sx={{ color: themeChangericon ? '#9e9d99' : '#616161' }} fontSize="small" 
                            className="graph-node-backarrow-single">
                          </ArrowBackIcon> */}
                      </div>
                    ) : (
                      <div onClick={handleLeftArrowForPreviousFile}>
                        {themeChangericon ? (
                          <img src="/arrow-leftnew.png" alt="img" className="graph-node-backarrow-single" />
                        ) : (
                          <img src="/arrow-left-dark.png" alt="img" className="graph-node-backarrow-single" />
                        )}
                        {/* <ArrowBackIcon fontSize="small" sx={{color: themeChangericon ? '#000': '#FFF'}}
                            className="graph-node-backarrow">
                          </ArrowBackIcon> */}
                      </div>
                    )}
                    <h4>{graphNodeOpened[0].fileName.toUpperCase()}</h4>
                  </div>


                  <div className="preview-node-loader">
                    {previewNodeLinkLoader ? (
                      <CircularProgress size={16} style={{ color: 'black' }} />
                    ) : (
                      <div>
                        {themeChangericon ? (
                          <img src="/collapsenew.png" alt="img" onClick={() => collapseExpandedNode()} className="link-collapse-icon" />
                        ) : (
                          <img src="/collapse-dark.png" alt="img" onClick={() => collapseExpandedNode()} className="link-collapse-icon" />
                        )}
                      </div>

                    )}

                  </div>
                </div>

                <div className="node-preview-detail">
                  <p dangerouslySetInnerHTML={{ __html: graphNodeOpened[0].content }}
                    className="opened-result-description"
                    onClick={(e: any) => {
                      if (e.target.tagName === "SPAN" && e.target.style.textDecoration === "underline") {
                        const clickedWord = e.target.textContent;
                        previewNodeLink(clickedWord);
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className={`graph-search-results`} >
                  {graphSearchValue.length >= 0 && (
                    <>
                      <div className="graph-search-results-container">
                        {searchResults.map((result, index) => (
                          <div className="filter-data" key={index}>
                            <div className="set set-1">
                              <div>
                                <div className="results-title">
                                  <span> {(result as { wordOccurence: number }).wordOccurence} </span>

                                  <h1
                                    dangerouslySetInnerHTML={{
                                      __html: (result as { fileNameWithHighlightedWords: string; }
                                      ).fileNameWithHighlightedWords,
                                    }}
                                  // onClick={() => handleFileClick(result["item"])}
                                  />
                                </div>

                                {themeChangericon ? (
                                  <img src="/xmarknew.png" alt="img" className="remove-search-result" onClick={() => removeSearchResult(result)} />
                                ) : (
                                  <img src="/xmark-dark.png" alt="img" className="remove-search-result" onClick={() => removeSearchResult(result)} />
                                )}
                              </div>

                              <div className="search-result-description">
                                <div className="note">
                                  <p dangerouslySetInnerHTML={{
                                    __html: (result as { totalMarkedData: string; }).totalMarkedData,
                                  }}
                                  />
                                </div>
                                <div>
                                  {themeChangericon ? (
                                    <img src="/arrow-rightnew.png" alt="img" className="remove-search-result" onClick={() => graphResultExpand(result)} />
                                  ) : (
                                    <img src="/arrow-right-dark.png" alt="img" className="remove-search-result" onClick={() => graphResultExpand(result)} />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="graph-mobile-workspace-container">
                        <div className="graph-container">
                          <div id="graph-div-mobile" className="graph-div"></div>


                          {/* ==============================Filters=============================== */}
                          <div>
                            {showGraphFilters ? (
                              <>
                                <div className="graph-color-setting">

                                  <div className="graph-color-setting-close-div">
                                    <h5>Graph Filters</h5>
                                    <button onClick={() => setShowGraphFilters(false)}>
                                      {themeChangericon ? (
                                        <img src='/xmarknew.png' alt='filter-icon' />

                                      ) : (
                                        <img src='/xmark-dark.png' alt='filter-icon' />
                                      )}
                                    </button>
                                  </div>

                                  <div>
                                    <Accordion>
                                      {graphTagFilters.map((category: any, index: any) => (
                                        <div key={index}>
                                          <>
                                            <Accordion.Item eventKey={index.toString()} key={category.category}
                                              title={category.category} className="accordion-item">
                                              <Accordion.Header className="accordion-header">{category.category}</Accordion.Header>
                                              <Accordion.Body className="accordion-body">
                                                <div className="form-check form-check-inline">
                                                  {category.items.map((item: any) => (
                                                    <div className="form-check form-check-inline" key={item.id}>
                                                      <input className={`form-check-input ${category.items[item.id - 1]["status"] === "exclude"
                                                        ? "customCheckBackground" : ""
                                                        }`}
                                                        type="checkbox" id={`checkbox${category.category}-${item.id}`}
                                                        checked={item.state === "checked"} value={item.value}
                                                        onChange={() => handleGraphFilters(category.category, item.id, item.value)}
                                                      />
                                                      <label className="form-check-label" htmlFor={`checkbox${category.category}-${item.id}`}>
                                                        {item.value}
                                                        {item.category}
                                                      </label>
                                                    </div>
                                                  ))}
                                                </div>
                                              </Accordion.Body>
                                            </Accordion.Item>
                                          </>
                                        </div>
                                      ))}
                                    </Accordion>
                                  </div>

                                  {/* =======================Mobile Sliders============================ */}

                                  <div className="text-filters-div">
                                    <h5>Forces</h5>
                                    <div className="graph-forces-container">
                                      <div>
                                        <p style={{ margin: '0px' }}>Text Size</p>
                                        <Slider style={{ padding: '8px 0px' }} defaultValue={nodeTextSize} size="small" step={0.1}
                                          min={4} max={12} aria-label="Small" valueLabelDisplay="auto" onChangeCommitted={handleNodeTextSizeCommitted}
                                          classes={{ track: 'custom-slider-track', thumb: 'custom-slider-thumb', rail: 'custom-slider-rail', }}
                                        />
                                      </div>

                                      <div>
                                        <p style={{ margin: '0px' }}>Center force</p>
                                        <Slider style={{ padding: '8px 0px' }} defaultValue={centerForceValue} size="small" step={0.01}
                                          min={0} max={1} aria-label="Small" valueLabelDisplay="auto" onChangeCommitted={handleCenterForceCommitted}
                                          classes={{ track: 'custom-slider-track', thumb: 'custom-slider-thumb', rail: 'custom-slider-rail', }}
                                        />
                                      </div>

                                      <div>
                                        <p style={{ margin: '0px' }}>Link force</p>
                                        <Slider style={{ padding: '8px 0px' }} size="small" min={0} max={1} defaultValue={linkForceValue}
                                          step={0.01} aria-label="Small" valueLabelDisplay="auto" onChangeCommitted={handleLinkForceCommitted}
                                          classes={{ track: 'custom-slider-track', thumb: 'custom-slider-thumb', rail: 'custom-slider-rail', }}
                                        />
                                      </div>

                                      <div>
                                        <p style={{ margin: '0px' }}>Link distance</p>
                                        <Slider defaultValue={mapSliderValueToReal(sliderValue, 0, 1, -30, -300)} valueLabelDisplay="auto"
                                          style={{ padding: '8px 0px' }} size="small" min={0} max={1} step={0.01} aria-label="Small"
                                          onChangeCommitted={handleLinkDistaneCommitted}
                                          classes={{ track: 'custom-slider-track', thumb: 'custom-slider-thumb', rail: 'custom-slider-rail', }}
                                        />
                                      </div>

                                    </div>
                                  </div>


                                  {/* =======================Text Filters==============================  */}
                                  {/* <div className="text-filters-div">
                                  <h5>Text Filters</h5>

                                  {!graphOrTextView && (
                                    <div className={`${graphOrTextView ? '' : 'text-filters-screen'}`}>
                                      <div className="menus-link">
                                        <div className="sub-accordion">
                                          <Accordion>
                                            {allCheckboxes.map((category: any, index: any) => (
                                              <div key={index}>
                                                {graphOrTextView ? (
                                                  <>
                                                    <Accordion.Item eventKey={index.toString()} key={category.category}
                                                      title={category.category} className="accordion-item"
                                                    >
                                                      <Accordion.Header className="accordion-header">
                                                        {category.category}
                                                      </Accordion.Header>
                                                      <Accordion.Body className="accordion-body">
                                                        <div className="form-check form-check-inline">
                                                          {category.items.map((item: any) => (
                                                            <div className="form-check form-check-inline" key={item.id}>
                                                              <input className={`form-check-input ${category.items[item.id - 1]["status"] ===
                                                                "exclude" ? "customCheckBackground" : ""
                                                                }`} id={`checkbox${category.category}-${item.id}`}
                                                                type="checkbox" checked={item.state === "checked"} value={item.value}
                                                                onChange={() => handleCheckboxClick(category.category, item.id)}
                                                              />
                                                              <label className="form-check-label" htmlFor={`checkbox${category.category}-${item.id}`}>
                                                                {item.value}
                                                                {item.category}
                                                              </label>
                                                            </div>
                                                          ))}
                                                        </div>
                                                      </Accordion.Body>
                                                    </Accordion.Item>
                                                  </>
                                                ) : (
                                                  <>
                                                    {!graphFiltersName.includes(category.category) && (
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
                                                                  className={`form-check-input ${category.items[item.id - 1]["status"] ===
                                                                    "exclude"
                                                                    ? "customCheckBackground"
                                                                    : ""
                                                                    }`}
                                                                  type="checkbox"
                                                                  id={`checkbox${category.category}-${item.id}`}
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
                                                                  htmlFor={`checkbox${category.category}-${item.id}`}
                                                                >
                                                                  {item.value}
                                                                  {item.category}
                                                                </label>
                                                              </div>
                                                            ))}
                                                          </div>
                                                        </Accordion.Body>
                                                      </Accordion.Item>
                                                    )}
                                                  </>
                                                )}
                                              </div>

                                            ))}
                                          </Accordion>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div> */}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="graph-color-setting-icon">
                                  <button onClick={() => setShowGraphFilters(true)}>
                                    {themeChangericon ? (
                                      <img src='/filter-icon-light.svg' alt='filter-icon' />

                                    ) : (
                                      <img src='/filter-icon-dark.svg' alt='filter-icon' />
                                    )}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                      </div>
                    </>
                  )}
                </div>

                {graphNodeOpened && graphNodeOpened.length > 0 && (
                  <div key={animationKey} className="mobile-node-preview">
                    <div className="node-preview-title">
                      <div className="graph-show-node">
                        {graphNodeOpened.length === 1 ? (
                          <div>
                            {themeChangericon ? (
                              <img src="/arrow-leftnew.png" alt="img" className="graph-node-backarrow-single" />
                            ) : (
                              <img src="/arrow-left-new-disabled.svg" alt="img" className="graph-node-backarrow-single" />
                            )}
                            {/* <ArrowBackIcon sx={{ color: themeChangericon ? '#9e9d99' : '#616161' }} fontSize="small" 
                            className="graph-node-backarrow-single">
                          </ArrowBackIcon> */}
                          </div>
                        ) : (
                          <div onClick={handleLeftArrowForPreviousFile}>
                            {themeChangericon ? (
                              <img src="/arrow-leftnew.png" alt="img" className="graph-node-backarrow-single" />
                            ) : (
                              <img src="/arrow-left-dark.png" alt="img" className="graph-node-backarrow-single" />
                            )}
                          </div>
                        )}
                        <h4>{graphNodeOpened[0].fileName.toUpperCase()}</h4>
                      </div>


                      <div className="preview-node-loader">
                        {previewNodeLinkLoader ? (
                          <CircularProgress size={16} style={{ color: 'black' }} />
                        ) : (
                          <div>
                            {themeChangericon ? (
                              <img src="/collapsenew.png" alt="img" onClick={() => collapseMobileExpandedNode()} className="link-collapse-icon" />
                            ) : (
                              <img src="/collapse-dark.png" alt="img" onClick={() => collapseMobileExpandedNode()} className="link-collapse-icon" />
                            )}
                          </div>

                        )}

                      </div>
                    </div>

                    <div className="node-preview-detail">
                      <p dangerouslySetInnerHTML={{ __html: graphNodeOpened[0].content, }}
                        className="opened-result-description"
                        onClick={(e: any) => {
                          if (e.target.tagName === "SPAN" && e.target.style.textDecoration === "underline") {
                            const clickedWord = e.target.textContent;
                            previewNodeLink(clickedWord);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div id="nodeInfo" className="node-click-options">
              {themeChangericon ? (
                <img src="/xmark-light.png" alt="img" className="node-remove-icon" onClick={removeClickedNode} />
              ) : (
                <img src="/xmarkNode-dark.png" alt="img" className="node-remove-icon" onClick={removeClickedNode} />
              )}

              {themeChangericon ? (
                <>
                  <img src="/node-text-light.svg" alt="img" className="node-text-icon" onClick={showNodeClickedFile} />
                  <img src="/node-text.svg-light" alt="img" className="node-text-icon-mobile" onClick={viewNodeClickedFile} />
                </>
              ) : (
                <>
                  <img src="/node-text-dark.svg" alt="img" className="node-text-icon" onClick={showNodeClickedFile} />
                  <img src="/node-text-dark.svg" alt="img" className="node-text-icon-mobile" onClick={viewNodeClickedFile} />
                </>
              )}

              {themeChangericon ? (
                <img src="/wander-light-new.svg" alt="img" className="node-wander-icon" onClick={wanderClickedNode} />
              ) : (
                <img src="/wander-dark.svg" alt="img" className="node-wander-icon" onClick={wanderClickedNode} />
              )}
            </div>
          </>
        )}

        {/* =====Filters =========================================  */}
        {graphOrTextView && (
          <div className={`${!shouldShowFilters ? 'menus-filters-visible' : 'menus'} ${graphOrTextView ? '' : 'filters-graph-screen'}`}>
            <div className="menus-link">
              {!shouldShowFilters ? (
                <>
                  {hideFiltersForPreview && (
                    <div className="sub-accordion">
                      <div className="filters-collapse-div">
                        <div onClick={handleFiltersClose}>
                          <p>Collapse</p>
                          <img src="/collapse-dark.png" alt="collapse filter" className="filters-collapse-icon" />

                        </div>
                      </div>


                      <div className="filters-scroll">
                        <Accordion>
                          {allCheckboxes.map((category: any, index: any) => (
                            <div key={index}>
                              {graphOrTextView ? (
                                <>
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
                                              className={`form-check-input ${category.items[item.id - 1]["status"] ===
                                                "exclude"
                                                ? "customCheckBackground"
                                                : ""
                                                }`}
                                              type="checkbox" id={`checkbox${category.category}-${item.id}`}
                                              checked={item.state === "checked"} value={item.value}
                                              onChange={() => handleCheckboxClick(category.category, item.id)}
                                            />
                                            <label className="form-check-label" htmlFor={`checkbox${category.category}-${item.id}`}>
                                              {item.value}
                                              {item.category}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    </Accordion.Body>
                                  </Accordion.Item>
                                </>
                              ) : (
                                <>
                                  {!graphFiltersName.includes(category.category) && (
                                    <Accordion.Item eventKey={index.toString()} key={category.category}
                                      title={category.category} className="accordion-item"
                                    >
                                      <Accordion.Header className="accordion-header">
                                        {category.category}
                                      </Accordion.Header>
                                      <Accordion.Body className="accordion-body">
                                        <div className="form-check form-check-inline">
                                          {category.items.map((item: any) => (
                                            <div className="form-check form-check-inline" key={item.id} >
                                              <input
                                                className={`form-check-input ${category.items[item.id - 1]["status"] ===
                                                  "exclude" ? "customCheckBackground" : ""
                                                  }`} type="checkbox"
                                                id={`checkbox${category.category}-${item.id}`}
                                                checked={item.state === "checked"} value={item.value}
                                                onChange={() => handleCheckboxClick(category.category, item.id)}
                                              />
                                              <label
                                                className="form-check-label"
                                                htmlFor={`checkbox${category.category}-${item.id}`}
                                              >
                                                {item.value}
                                                {item.category}
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                      </Accordion.Body>
                                    </Accordion.Item>
                                  )}
                                </>
                              )}
                            </div>

                          ))}
                        </Accordion>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="filter-accordion">
                  <Accordion>
                    <Accordion.Item eventKey="0" key="0" title="filter" className="accordion-item">
                      <Accordion.Header className="accordion-header" onClick={handleAccordionClick}>
                        Filters
                      </Accordion.Header>
                    </Accordion.Item>
                  </Accordion>
                </div>
              )}

            </div>
          </div>
        )}

        {/* =====Graph Sliders====================================  */}
        {graphOrTextView ? (<></>) : (
          hideFiltersForPreview && (
            <>
              <div className="forces-container">
                <div>
                  <p style={{ margin: '0px' }}>Text Size</p>
                  <Slider style={{ padding: '8px 0px' }} defaultValue={nodeTextSize} size="small" step={0.1}
                    min={4} max={12} aria-label="Small" valueLabelDisplay="auto" onChangeCommitted={handleNodeTextSizeCommitted}
                    classes={{ track: 'custom-slider-track', thumb: 'custom-slider-thumb', rail: 'custom-slider-rail', }}
                  />
                </div>

                <div>
                  <p style={{ margin: '0px' }}>Center force</p>
                  <Slider style={{ padding: '8px 0px' }} defaultValue={centerForceValue} size="small" step={0.01}
                    min={0} max={1} aria-label="Small" valueLabelDisplay="auto" onChangeCommitted={handleCenterForceCommitted}
                    classes={{ track: 'custom-slider-track', thumb: 'custom-slider-thumb', rail: 'custom-slider-rail', }}
                  />
                </div>

                <div>
                  <p style={{ margin: '0px' }}>Link force</p>
                  <Slider style={{ padding: '8px 0px' }} size="small" min={0.01} max={1} defaultValue={linkForceValue}
                    step={0.01} aria-label="Small" valueLabelDisplay="auto" onChangeCommitted={handleLinkForceCommitted}
                    classes={{ track: 'custom-slider-track', thumb: 'custom-slider-thumb', rail: 'custom-slider-rail', }}
                  />
                </div>

                <div>
                  <p style={{ margin: '0px' }}>Link distance</p>
                  <Slider defaultValue={mapSliderValueToReal(sliderValue, 0, 1, -30, -300)} valueLabelDisplay="auto"
                    style={{ padding: '8px 0px' }} size="small" min={0} max={1} step={0.01} aria-label="Small"
                    onChangeCommitted={handleLinkDistaneCommitted}
                    classes={{ track: 'custom-slider-track', thumb: 'custom-slider-thumb', rail: 'custom-slider-rail', }}
                  />
                </div>

              </div>
            </>
          )
        )}

      </div>

      <div className={`workspace-content ${themeChangericon ? '' : 'night-mode'}`}>
        {graphOrTextView ? (
          <div className={`${openedResults.length === 0 ? 'main-homepage' : 'main'}`}>
            {openedResults.length > 0 ? (
              openedResults.map((result, index) => (
                <WorkspaceContent key={index} result={result} index={index} moveResult={moveResult}
                  handleLinkClick={handleLinkClick} themeChangericon={themeChangericon}
                  collapseOpenedResult={collapseOpenedResult} removeBothSearchResults={removeBothSearchResults}
                  linkClickLoader={linkClickLoader} linkClickedId={linkClickedId}>
                </WorkspaceContent>
              ))
            ) : (
              <div className="homepage-opened-file">
                <div className="homepage-content-container">
                  {homepageFile.length != 0 && (
                    <p
                      dangerouslySetInnerHTML={{ __html: filtersData ? homepageFile.content : '', }}
                      className="opened-result-description"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="graph-container">
            <div id="graph-div" className="graph-div"></div>


            {/* ==============================Settings=============================== */}
            <div>
              {showGraphFilters ? (
                <>
                  <div className="graph-color-setting">

                    <div className="graph-color-setting-close-div">
                      <h5>Graph Filters</h5>
                      <button onClick={() => setShowGraphFilters(false)}>
                        {themeChangericon ? (
                          <img src='/xmarknew.png' alt='filter-icon' />
                        ) : (
                          <img src='/xmark-dark.png' alt='filter-icon' />
                        )}
                      </button>
                    </div>

                    {/*=======================Graph Filters==============================*/}
                    <div>
                      <Accordion>
                        {graphTagFilters.map((category: any, index: any) => (
                          <div key={index}>
                            <>
                              <Accordion.Item eventKey={index.toString()} key={category.category}
                                title={category.category} className="accordion-item">
                                <Accordion.Header className="accordion-header">{category.category}</Accordion.Header>
                                <Accordion.Body className="accordion-body">
                                  <div className="form-check form-check-inline">
                                    {category.items.map((item: any) => (
                                      <div className="form-check form-check-inline" key={item.id}>
                                        <input className={`form-check-input ${category.items[item.id - 1]["status"] === "exclude"
                                          ? "customCheckBackground" : ""
                                          }`}
                                          type="checkbox" id={`checkbox${category.category}-${item.id}`}
                                          checked={item.state === "checked"} value={item.value}
                                          onChange={() => handleGraphFilters(category.category, item.id, item.value)}
                                        />
                                        <label className="form-check-label" htmlFor={`checkbox${category.category}-${item.id}`}>
                                          {item.value}
                                          {item.category}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            </>
                          </div>
                        ))}
                      </Accordion>
                    </div>


                    {/*=======================Text Filters===============================*/}
                    <div className="text-filters-div">
                      <h5>Text Filters</h5>

                      {!graphOrTextView && (
                        <div className={`${graphOrTextView ? '' : 'text-filters-screen'}`}>
                          <div className="menus-link">
                            <div className="sub-accordion">
                              <Accordion>
                                {allCheckboxes.map((category: any, index: any) => (
                                  <div key={index}>
                                    {graphOrTextView ? (
                                      <>
                                        <Accordion.Item eventKey={index.toString()} key={category.category}
                                          title={category.category} className="accordion-item"
                                        >
                                          <Accordion.Header className="accordion-header">
                                            {category.category}
                                          </Accordion.Header>
                                          <Accordion.Body className="accordion-body">
                                            <div className="form-check form-check-inline">
                                              {category.items.map((item: any) => (
                                                <div className="form-check form-check-inline" key={item.id}>
                                                  <input className={`form-check-input ${category.items[item.id - 1]["status"] ===
                                                    "exclude" ? "customCheckBackground" : ""
                                                    }`} id={`checkbox${category.category}-${item.id}`}
                                                    type="checkbox" checked={item.state === "checked"} value={item.value}
                                                    onChange={() => handleCheckboxClick(category.category, item.id)}
                                                  />
                                                  <label className="form-check-label" htmlFor={`checkbox${category.category}-${item.id}`}>
                                                    {item.value}
                                                    {item.category}
                                                  </label>
                                                </div>
                                              ))}
                                            </div>
                                          </Accordion.Body>
                                        </Accordion.Item>
                                      </>
                                    ) : (
                                      <>
                                        {!graphFiltersName.includes(category.category) && (
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
                                                      className={`form-check-input ${category.items[item.id - 1]["status"] ===
                                                        "exclude"
                                                        ? "customCheckBackground"
                                                        : ""
                                                        }`}
                                                      type="checkbox"
                                                      id={`checkbox${category.category}-${item.id}`}
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
                                                      htmlFor={`checkbox${category.category}-${item.id}`}
                                                    >
                                                      {item.value}
                                                      {item.category}
                                                    </label>
                                                  </div>
                                                ))}
                                              </div>
                                            </Accordion.Body>
                                          </Accordion.Item>
                                        )}
                                      </>
                                    )}
                                  </div>

                                ))}
                              </Accordion>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </>
              ) : (
                <>
                  <div className="graph-color-setting-icon">
                    <button onClick={() => setShowGraphFilters(true)}>
                      {themeChangericon ? (
                        <img src='/filter-icon-light.svg' alt='filter-icon' />
                      ) : (
                        <img src='/filter-icon-dark.svg' alt='filter-icon' />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>

      <ToastContainer />
    </div>

  );
};



export default Sidebar;