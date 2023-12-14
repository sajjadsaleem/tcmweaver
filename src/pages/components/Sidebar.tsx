import React, { useEffect, useRef, useState } from "react";
import { Fzf, FzfOptions, byLengthAsc } from "fzf";
import _, { replace, result, update } from "lodash";
import Accordion from "react-bootstrap/Accordion";
import { marked } from "marked";
import * as d3 from "d3";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import ContentCopySharpIcon from "@mui/icons-material/ContentCopySharp";
import axios from "axios";
import { FormControl, Grid, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemText, MenuItem, Select, Slider, TextField } from "@mui/material";
import * as Helpers from '../../util/Helpers'
import Link from "next/link";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux'
import {stAccessTokenVerify} from '../../store/apps/auth'
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from '@mui/material/CircularProgress';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


var internalId:any = 0
// let searchRequest = 0
// let cancelToken:any
let controller:any




const Sidebar = () => {
  
  const dispatch = useDispatch()
  const getStAuth = useSelector((state:any) => state.stAuth)

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

  // interface Node {
  //   id: string;
  //   tag: string;
  //   // Add other properties here as needed
  // }


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
  const [checkboxes, setCheckboxes] = useState([]);
  const [allCheckboxes, setAllCheckboxes] = useState([]);
  const [shouldShowFilters, setShouldShowFilters] = useState(true);
  const [themeChangericon, setThemeChangerIcon] = useState<any>()
  const [graphOrTextView, setgraphOrTextView] = useState(true);
  const [openedResults, setOpenedResults] = useState<OpenedResult[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [filtersData, setFiltersData] = useState<any>([]);
  const [graphData, setGraphData] = useState<any>([]);
  const [fileOpenedFromGraph, setFileOpenedFromGraph] = useState<any>({});
  const [hideFiltersForPreview, sethideFiltersForPreview] = useState(true);
  const [graphNodeOpened, setGraphNodeOpened] = useState<any>([]);
  const [textColorForNode , setTextColorForNode] = useState<any>()
  const [graphLinkColor , setGraphLinkColor] = useState<any>()
  const [centerForceValue , setCenterForceValue] = useState(1)
  const [sliderValue, setSliderValue] = useState(-40)
  const [linkForceValue , setLinkForceValue] = useState(0.2)
  const [accessToken, setAccessToken] = useState('');
  const [syncPopup, setSyncPopup] = useState(false);
  const [folders, setFolders] = useState([]);
  const [foldersPopup, setFoldersPopup] = useState(false);
  const [showAccountOptions, setShowAccountOptions] = useState(false);
  const [getUser, setUser] = useState<any>({})
  const [getPermissions , setPermissions] = useState([])
  const [userLogoutPopup , setUserLogoutPopup] = useState(false)
  const [showEditUserDialog , setShowEditUserDialog] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'User',
    status: '',
    image: ''
  });
  const [editUserLoader , setEditUserLoader] = useState(false)
  const [showChangePasswordDialog , setShowChangePasswordDialog] = useState(false)
  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: '',
    confirmPassword:''
  });
  const [showSetPasswordToggle , setShowSetPasswordToggle] = useState(false)
  const [showConfirmPasswordToggle , setShowConfirmPasswordToggle] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [updatePasswordLoader , setUpdatePasswordLoader] = useState<any>(false)
  const [homepageFile , setHomepageFile] = useState<any>([])
  const [getPackage , setPackage] = useState([])
  const [selectedVaultOption, setSelectedVaultOption] = useState('Basic Vault');
  const [showLockedVaultPopup , setShowLockedVaultPopup] = useState(false)
  const [clickedVault , setClickedVault] = useState('')
  const [userAccessVaults , setUserAccessVaults] = useState<any>([])
  const accountOptionsRef = useRef<any>(null);
  const usersIconRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);
  const [billingLoader, setBillingLoader] = useState(false)
  const [previewNodeLinkLoader , setPreviewNodeLinkLoader] = useState<any>(false)
  const [animationKey, setAnimationKey] = useState(0);
  const [showColorSetting , setShowColorSetting] = useState(false)
  const [showAddGraphNodeColor , setShowAddGraphNodeColor] = useState<any>([])
  const [nodeColorRemoveCheck , setNodeColorRemoveCheck] = useState<any>('')
  const [nodeTagsColors , setNodeTagsColors] = useState<any>([])
  const [rawSearchResults , setRawSearchResults] = useState<any>([])
  const [textSearchLoader , setTextSearchLoader] = useState<any>(false)
  const [graphSearchLoader , setGraphSearchLoader] = useState<any>(false)
  const [graphSize, setGraphSize] = useState({ width: 640, height: 400 });
  const [checkGraphStatus , setCheckGraphStatus] = useState<any>(false)
  const [previousGraphData , setPreviousGraphData] = useState<any>({})
  const [graphSearchWordsArray , setGraphSearchWordsArray] = useState<any>([])
  const [graphResizeChecker , setGraphResizeChecker] = useState<any>(false)
  
  

  // console.log("filesData: ", filesData);
  // console.log("filters file data: ", filtersFileData);
  // console.log("checkboxes: ", checkboxes);
  // console.log("searchResults", searchResults);
  // console.log("allCheckboxes: ", allCheckboxes);
  // console.log('themeChangeicon' , themeChangericon)
  // console.log("openedResults: ", openedResults);
  // console.log("filtersData: ", filtersData);
  // console.log("graphData: ", graphData);
  // console.log("searchValue: ", searchValue);
  // console.log("fileopenedfromgraph", fileOpenedFromGraph);
  // console.log("graphNodeOpened", graphNodeOpened);
  // console.log('userEmail ', userEmail)
  // console.log('getUser' , getUser)
  // console.log('allVaults' , allVaults)
  // console.log('getpackage' , getPackage)
  // console.log('clickedvault' , clickedVault)
  // console.log('homepagefile' , homepageFile)
  // console.log('useraccessvaults' , userAccessVaults)
  // console.log('showaddgraphnodecolor' , showAddGraphNodeColor)
  // console.log('slidervalue' , sliderValue)
  // console.log('shouldShowFilters' , shouldShowFilters)
  // console.log('searchResults' , searchResults)
  // console.log(textColorForNode)
  // console.log('previousGraphData' , previousGraphData)
  // console.log('checkGraphStatus', checkGraphStatus)
  // console.log('graphsize' , graphSize)


  // Check to see if this is a redirect back from Checkout
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if(query){
      const sessionId = query.get('session_id');
      // console.log('sessionid' , sessionId)
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


  useEffect(() => {
    let element: any = document.getElementById("graph-div");
    if (element && element.children) {
      const hasSvg = Array.from(element.children).some((child:any) => child.tagName.toLowerCase() === 'svg');
    console.log('fist if')
      if (hasSvg) {
        console.log('inner if')
        handleGraphForces(graphData)
      }
    }

  } , [graphLinkColor])


  useEffect(()=> {
    if(!graphOrTextView){
      if(graphData && typeof graphData === 'object' && !Array.isArray(graphData)) {
        handleGraphForces(graphData)
      }
    }
  }, [graphSize])


  // set graph width and height
  useEffect(() => {
    const updateGraphSize = () => {
      const element = document.getElementById('graph-div');
      if (element) {
        const newWidth = element.offsetWidth;
        const newHeight = element.offsetHeight;
        setGraphResizeChecker(true)
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


  // setting theme icon, text color for node, graph link color on theme change
  useEffect(() => {
    const storedTheme:any = localStorage.getItem('theme');
    const checkTheme = JSON.parse(storedTheme)
    setThemeChangerIcon(storedTheme ? JSON.parse(storedTheme) : false);
    setTextColorForNode(checkTheme ? '#6C655C' : '#B3B3B5')
    setGraphLinkColor(checkTheme ? '#CFCCC7' : '#565959')
  }, []);


  // close user options dropdown
  useEffect(() => {
    const handleOutsideClick = (event:any) => {
      // console.log('event' , event)
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

      setUserAccessVaults(userVaultsAccess.map((vault:any) => vault.tableName));

      // console.log('stAccessTokenVerify1=',getStAuth.stAccessTokenVerify.user_vaultsAccess)
    }

    getInit()
  }, [getUser, getPermissions, getStAuth]);


  // Api Call to get home, filters, nodeColors , synonyms
  useEffect(() => {
    const fetchFilesData = async () => {
      try {
        const response = await fetch("/api");
        if (!response.ok) {
          throw new Error("Failed to fetch filters, home , nodeColors , synonyms");
        } else {
          let data = await response.json();
          // console.log('data' , data)

          // const modifiedData = data.map((item: any) => {
          //   return {
          //     ...item,
          //     fileName: item.fileName.split(".").slice(0, -1).join("."),
          //   };
          // });

          // setFiltersData(modifiedData);

          // remove .md extension from Filenames
          // data = data.map((item: any) => {
          //   if (item.fileName) {
          //     const fileNameWithoutExtension = item.fileName.split(".")[0];
          //     return {
          //       ...item,
          //       fileName: fileNameWithoutExtension,
          //     };
          //   }
          //   return item; // Return the item unchanged if fileName is missing.
          // });

          marked.setOptions({
            breaks: true,
            headerIds: false,
            mangle: false
          });
          // console.log('data' , data)
          let homepageFile = _.cloneDeep(data); // Deep clone the array
          // console.log(homepageFile)

          // console.log('homepagefile' , homepageFile[2])
          // homepageFile[2].content = marked(homepageFile[2].content);
          const markedHomeObjects = homepageFile.homeObjects.map((obj:any) => ({
            ...obj,
            content: marked(obj.content),
          }));

          // console.log(markedHomeObjects[0].content)

          setHomepageFile(markedHomeObjects[0])


          const markedFilterObjects = homepageFile.filterObjects.map((obj:any) => ({
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
          let filteredData = data.filterObjects.filter((obj:any) => obj.filename.toLowerCase().includes('filter'));

          filteredData = filteredData[0].content
            .split("\n")
            .filter((word: any) => word.trim() !== "");


          const trimmedData = filteredData.map((item:any) => item.trim());


          setFiltersFileData(trimmedData);

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
        }
      } catch (error) {
        console.error("Error fetching files data:", error);
      }
    };

    const fetchNodeColors = async () => {
      await axios.get(`/api/nodeColors`)
      .then((res:any) => {
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
      .catch((err:any) => {
        console.log('Error fetching node colors' , err)
      })

    }

    fetchFilesData()
    fetchNodeColors()

  }, []);


  useEffect(()=> {
    if(!graphOrTextView){
      if(graphData && typeof graphData === 'object' && !Array.isArray(graphData)) {    
        handleGraphForces(graphData)
      }
    }
  }, [centerForceValue])


  useEffect(()=> {
    if(!graphOrTextView){
      if(graphData && typeof graphData === 'object' && !Array.isArray(graphData)) {   
        handleGraphForces(graphData)
      }
    }
  }, [linkForceValue])


  useEffect(()=> {
    if(!graphOrTextView){
      if(graphData && typeof graphData === 'object' && !Array.isArray(graphData)) {
        handleGraphForces(graphData)
      }
    }
  }, [sliderValue])


  useEffect(() => {
    if(nodeColorRemoveCheck !== '') {
      // console.log(nodeColorRemoveCheck)
      // console.log('now' , showAddGraphNodeColor)

      const tagExists = graphData.nodes.some((node:any) => node.tag === nodeColorRemoveCheck);

    if (tagExists) {
      makeGraph(graphData);
    }
      
      // makeGraph(graphData)
    }
    setNodeColorRemoveCheck('')
    // if (showAddGraphNodeColor.source === 'handleRemoveNodeColor') {
    //   console.log('Updated showAddGraphNodeColor:', showAddGraphNodeColor);
    // }
    // Perform any additional actions or checks here
  
    // Call makeGraph whenever showAddGraphNodeColor changes
    // makeGraph(graphData);
  }, [showAddGraphNodeColor]);


  const handleGraphForces = async (graphNewData: any) => {
    let element: any = document.getElementById("graph-div");
    let graphWidth = element.offsetWidth;
    let graphHeight = element.offsetHeight;

    function WanderGraph(
      { nodes, links }: { nodes: any; links: any },
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
        linkStroke = graphLinkColor, // link stroke color
        linkStrokeOpacity = 1, // link stroke opacity
        linkStrokeWidth = 1, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength = 0.3,
        colors = d3.schemeTableau10, // an array of color strings, for the node groups
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        invalidation = undefined // when this promise resolves, stop the simulation
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
        const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
        const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
        const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

        // Replace the input nodes and links with mutable objects for the simulation.

        


        let formattingNodes:any = []
        let notFoundNodes:any = []

        nodes.forEach((eachNode:any) => {
          const matchingNodeIndex = previousGraphData.nodes.findIndex((prevNode:any) => prevNode.id === eachNode.id);

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

        nodes.forEach((node:any , index:any) => {
          const nodeReplacement = formattingNodeCopy.find((eachnode:any) => eachnode.id === node.id);
          if(nodeReplacement) {
            nodeReplacement.fx = nodeReplacement.x;
            nodeReplacement.fy = nodeReplacement.y;
        
            // Update the node in the nodes array
            nodes[index] = nodeReplacement;
          }
        })

        nodes.forEach((node:any) => {
          node.fx = null;
          node.fy = null;
        });
        

        links.forEach((link:any , index:any) => {
          if (typeof link.source === 'string') {
            const sourceObject = formattingNodeCopy.find((node:any) => node.id === link.source);
            if (sourceObject) {
              links[index].source = sourceObject
            }
          }
        
          // Check if target is a string, and convert it to an object if needed
          if (typeof link.target === 'string') {
            const targetObject = formattingNodeCopy.find((node:any) => node.id === link.target);
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
              const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
                return checkEachNode.id === d.source.id
              })
              if(xmark) {
                return xmark.x
              }
              else {
                // console.log('d',d)
                if(nodes) {
                  const sourceXMark = nodes.find((checkEachNode:any) => {
                    return checkEachNode.id === d.source.id
                  })
                  if(sourceXMark) {
                    return sourceXMark.x
                  }
                } 
              }
            })
            .attr("y1", (d: any) => {
              const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
                return checkEachNode.id === d.source.id
              })
              if(xmark) {
                return xmark.y
              }
              else {
                // console.log('d',d)
                if(nodes) {
                  const sourceXMark = nodes.find((checkEachNode:any) => {
                    return checkEachNode.id === d.source.id
                  })
                  if(sourceXMark) {
                    return sourceXMark.y
                  }
                } 
              }
            })
            .attr("x2", (d: any) => {
              return d.target.x
            })
            .attr("y2", (d: any) => {
              return  d.target.y
            });
            
          node
            .attr('cx' , (d:any) => d.x)
            .attr('cy' , (d:any) => d.y)
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

          nodeText
          .attr("x", (d: any) => {
            const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
              return checkEachNode.id === d.id
            })
            if(xmark) {
              return xmark.x - (getNodeTextWidth(d) / 4.5)
            }
            else {
              return d.x - (getNodeTextWidth(d) / 4.5)
            }
            
          })
          .attr("y", (d: any) => {
            const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
              return checkEachNode.id === d.id
            })
            if(xmark) {
              return xmark.y + 12
            }
            else {
              return d.y + 12
            }
            
          });


          nodeTitles
          .text((d:any) => {
            const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
              return checkEachNode.id === d.id
            })
            if(xmark) {
              return xmark.id
            }
            else {
              return d.id
            }
          });

          formattingNodes = []
          formattingNodeCopy = []


          // console.log('link',link)
        }

        function zoomed(event: any) {
          container.attr("transform", event.transform);
        }

        function getColorByTag(tag: string) {
          const tagColors: Record<string, string> = {};
          const themeBasedColors = themeChangericon ? showAddGraphNodeColor.find((group:any) => group.mode === "light mode") : showAddGraphNodeColor.find((group:any) => group.mode === "dark mode");

          themeBasedColors.data.forEach((colorGroup:any) => {
            const tag = colorGroup.tag;
            tagColors[tag] = colorGroup.color;
          });

          return tagColors[tag] || nodeFill;
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
          const tempDiv:any = d3.select('body')
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
          nodes.forEach((node:any) => {
            node.fx = null;
            node.fy = null;
          });
          // console.log('event' , event, 'nodes' , nodes)
          
          // Set the initial state before transitioning
          d3.select(this as SVGElement)
            // .attr("fill", "red") // Change to your desired color
            .attr("r", nodeRadius * 1.2) // Optionally, increase the node size
            .attr("fill-opacity", 1); // Set initial opacity to 1

          // Initialize the links with their original stroke color and opacity
          link
            .attr("stroke", (linkData:any) => {
              if (linkData.source === d || linkData.target === d) {
                return linkStroke; // Original link color
              } else {
                return linkStroke;
              }
            })
            .attr("stroke-opacity", linkStrokeOpacity);

          // Initialize the nodes with their original fill color and opacity
          node
            .attr("fill-opacity", (nodeData:any) => {
              if (nodeData === d) {
                return 1; // Opacity of the hovered node
              } else if (areNodesConnected(nodeData, d)) {
                return 1; // Opacity of directly connected nodes
              } else {
                return 0.1; // Opacity of other nodes
              }
            });
          
          nodeText
            .transition().duration(300)
            .style('opacity' , (nodeData:any) => {
              if (nodeData === d) {
                return 1
              } else if (areNodesConnected(nodeData , d)) {
                return 1
              } else {
                return 0.1
              }
            })
            .style("font-size", (nodeData:any) => {
              return nodeData === d ? '12px' : '8px'
            })

          // Start the transition
          d3.select(this as SVGElement)
            .transition()
            .duration(400) // Transition duration in milliseconds
            .attr("r", nodeRadius); // Optionally, increase the node size

          // Change the color of the links directly connected to the hovered node
          link
            .transition()
            .duration(400)
            .attr("stroke", (linkData:any) => {
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
            .attr("fill-opacity", (nodeData:any) => {
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
            .attr("stroke-opacity", (linkData:any) => {
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
            // .attr("fill", nodeFill) // Reset to the original node color
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
          nodeText.transition().duration(200)
            .style('opacity' , 1)
            .style('font-size', '8px')
            
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

        const customNodes: any = nodes;


        const simulation = d3
          .forceSimulation(customNodes)
          .force("link", forceLink)
          .force("charge", d3.forceManyBody().strength(sliderValue))
          .force("center", d3.forceCenter().strength(centerForceValue))
          .on("tick", ticked);

          // const svg = d3
          // .create("svg")
          // .attr("width", graphSize.width)
          // .attr("height", graphSize.height)
          // .attr("viewBox", [-graphSize.width / 2, -graphSize.height / 2, graphSize.width, graphSize.height])
          // .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
          // .style("transition", "fill-opacity 0.2s, stroke-opacity 0.2s");

        
        // const svg:any = document.querySelector("#graph-div svg");
        const svgContainer = d3.select('#graph-div');
        const gElement = svgContainer.select('svg');
        const svg = gElement.select('g');

        
        gElement.attr('width' , graphSize.width).attr('height' , graphSize.height)
        gElement.attr('viewBox' , [-graphSize.width / 2, -graphSize.height / 2, graphSize.width, graphSize.height])

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
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("id", (d:any) => `node-${d.id}`)
          .attr("r", nodeRadius)
          .attr("fill", (d: any) => {
            const color = getColorByTag(d.tag);
            return color;
          })
          .on("mouseover", handleMouseOver) // Add mouseover event listener
          .on("mouseout", handleMouseOut)
          .on("click", handleNodeClick)
          .classed("node-pointer", true)
          .call(drag(simulation) as any, drag(simulation));

        // // Append text labels to the container, positioned near the nodes
        container.select("#text-g-tag").remove();
        const nodeText = container
          .append("g")
          .attr("id", "text-g-tag")
          .selectAll("title")
          .data(nodes)
          .join("text")
          // .attr("x", (d) => d.x + 12) // Adjust the x-coordinate based on your preference
          // .attr("y", (d) => d.y) // Adjust the y-coordinate based on your preference
          .attr("x", (d: any) => d.x) // Keep the x-coordinate the same as the node
          .attr("y", (d: any) => d.y + nodeRadius + 12)
          .attr("dy", ".35em") // Adjust the vertical alignment based on your preference
          .style("font-size", "8px") // Adjust the font size based on your preference
          .text((d:any) => d.id)
          .attr('fill' , textColorForNode);

        container.select("#titles-g-tag").remove();
        const nodeTitles = container
          .append("g")
          .attr("id", "titles-g-tag")
          .selectAll("title")
          .data(nodes)
          .join("title")
          .text((d:any) => d.id);


        const zoom: any = d3.zoom().on("zoom", zoomed);
        svg.call(zoom);

        document.addEventListener("click", hideNodeInfo);

        // // In the ticked function, update the positions of text and title elements

        // if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
        // if (L) link.attr("stroke", ({ index: i }) => L[i]);
        if (W) link.attr("stroke-width", (d: any, i: any) => `${W[i]}`);
        if (L) link.attr("stroke", (d: any, i: any) => `${L[i]}`);
        // if (G && color) {
        //   node.attr("fill", (_:any, i:any) => color(G[i]));
        // }
        if (T) {
          node.append("title").text((d: any, i: any) => String(T[i]));
        }

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

        console.log('check graph data')
        return result;

        // return Object.assign(svg.node(), { scales: { color } });
    }

    const options: any = {
      nodeFill: "#808080",
      nodeStroke: "#808080",
      width: graphWidth,
      height: graphHeight,
    };

    let svgResult:any
      svgResult = WanderGraph(graphNewData, options)
      
  }


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

    const wordsArray = (wordToSearch.match(/(-?)"([^"]*)"|\S+/g) || []).map(
      (match: any) => match.replace(/^(-?)"([^"]*)"$/, "$1$2")
    );
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

    if(internalId)
      {
          clearTimeout(internalId);
      }

      // if (typeof cancelToken != typeof undefined) {
      //   cancelToken.cancel("Operation canceled due to new request.")
      // }

      if(typeof controller != typeof undefined) {
        controller.abort()
      }

      // cancelToken = axios.CancelToken.source()
      controller = new AbortController()
            
      internalId = setTimeout(async() => {
        try {

          setTextSearchLoader(true)
          // searchRequest += 1;
          // const currentRequest = searchRequest;
          
          // searchRequest +=1
          // console.log('searchRequest' , searchRequest)
          const tableNamesStr = userAccessVaults.join(',');
          const encodedWords = encodeURIComponent(wordsArray.join(","));
          responseJson = await axios.get(`/api/search?q=${encodedWords}&AccessVaults=${tableNamesStr}`, {
            signal: controller.signal,
          });

        
          const copySearchResults = _.cloneDeep(responseJson.data);
          setRawSearchResults(copySearchResults);

          newEntries = _.cloneDeep(responseJson.data)
          // console.log('newentries' , newEntries)

          // Remove Brackets and Calculate Occurence of Words
          removeBrackets(newEntries, wordToSearch);

          highlightSearchWord(newEntries, wordToSearch);

          markAllData(newEntries , wordToSearch)



          newEntries = newEntries.slice().sort((a: any, b: any) => b.wordOccurence - a.wordOccurence);

          console.log("newEntries: ", newEntries.length);

          setSearchResults(newEntries);
          setTextSearchLoader(false)

          // console.log(responseJson.data);
          // console.log('responseJson' , responseJson)
          // responseJson = await response.json();
          // console.log("responseJson: ", responseJson);
        } catch (error) {
          setTextSearchLoader(false)
          console.log("Error fetching search results:", error);
        }
      }, 300);
        
  };


  const handleSearchFromFilters = async (event: any) => {

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

    const wordsArray = (wordToSearch.match(/(-?)"([^"]*)"|\S+/g) || []).map(
      (match: any) => match.replace(/^(-?)"([^"]*)"$/, "$1$2")
    );
    console.log("words array: ", wordsArray);

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

    if(internalId)
      {
          clearTimeout(internalId);
      }

      // if (typeof cancelToken != typeof undefined) {
      //   cancelToken.cancel("Operation canceled due to new request.")
      // }

      if(typeof controller != typeof undefined) {
        controller.abort()
      }

      // cancelToken = axios.CancelToken.source()
      controller = new AbortController()
            
      internalId = setTimeout(async() => {
        try {
          setTextSearchLoader(true)
          const tableNamesStr = userAccessVaults.join(',');
          const encodedWords = encodeURIComponent(wordsArray.join(","));
          responseJson = await axios.get(`/api/search?q=${encodedWords}&AccessVaults=${tableNamesStr}`, {
            signal: controller.signal,
          });

        
          const copySearchResults = _.cloneDeep(responseJson.data);
          setRawSearchResults(copySearchResults);

          newEntries = _.cloneDeep(responseJson.data)
          // console.log('newentries' , newEntries)

          // Remove Brackets and Calculate Occurence of Words
          removeBrackets(newEntries, wordToSearch);

          highlightSearchWord(newEntries, wordToSearch);

          markAllData(newEntries , wordToSearch)



          newEntries = newEntries.slice().sort((a: any, b: any) => b.wordOccurence - a.wordOccurence);

          console.log("newEntries: ", newEntries);
          setSearchResults(newEntries);
          setTextSearchLoader(false)

          // console.log(responseJson.data);
          // console.log('responseJson' , responseJson)
          // responseJson = await response.json();
          // console.log("responseJson: ", responseJson);
        } catch (error) {
          console.log("Error fetching search results:", error);
        }

        
      }, 300);
        
  };


  const handleGraphSearch = async (event: any) => {
    // console.log("graph search", event.target.value);
    const inputValue = event.target.value;
    setGraphSearchValue(inputValue);
    // setSearchValue(inputValue)

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

    if(internalId){
        clearTimeout(internalId);
    }
    internalId = setTimeout(async() => {

      if(typeof controller != typeof undefined) {
        controller.abort()
      }

      // cancelToken = axios.CancelToken.source()
      controller = new AbortController()

      try {
        setGraphSearchLoader(true)
        const tableNamesStr = userAccessVaults.join(',');
        const encodedWords = encodeURIComponent(wordsArray.join(","));
        setGraphSearchWordsArray(encodedWords)
        const response = await fetch(`/api/search?q=${encodedWords}&AccessVaults=${tableNamesStr}`, {
          signal: controller.signal,
        });
        responseJson = await response.json();
        // console.log("responseJson: ", responseJson);
         // console.log('response' , responseJson)

      newEntries = responseJson;

      removeBrackets(newEntries, wordToSearch);

      highlightSearchWord(newEntries, wordToSearch);

      markAllData(newEntries , wordToSearch)

      newEntries = newEntries
        .slice()
        .sort((a: any, b: any) => b.wordOccurence - a.wordOccurence);

      // console.log("newEntries: ", newEntries);

      setSearchResults(newEntries);
      setGraphSearchLoader(false)
      generateGraphfromSearch(newEntries , inputValue);
      } catch (error) {
        setGraphSearchLoader(false)
        console.error("Error fetching search results:", error);
      }
     
    }, 300);
  };


  const handleGraphSearchFromFilters = async (event: any) => {
    // console.log("graph search", event.target.value);
    const inputValue = event.target.value;
    setGraphSearchValue(inputValue);
    // setSearchValue(inputValue)

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

    if(internalId){
        clearTimeout(internalId);
    }
    internalId = setTimeout(async() => {

      if(typeof controller != typeof undefined) {
        controller.abort()
      }

      controller = new AbortController()

      try {
        setGraphSearchLoader(true)
        const tableNamesStr = userAccessVaults.join(',');
        const encodedWords = encodeURIComponent(wordsArray.join(","));
        setGraphSearchWordsArray(encodedWords)
        const response = await fetch(`/api/search?q=${encodedWords}&AccessVaults=${tableNamesStr}`, {
          signal: controller.signal,
        });
        responseJson = await response.json();
        // console.log("responseJson: ", responseJson);

        newEntries = responseJson;

        removeBrackets(newEntries, wordToSearch);
  
        highlightSearchWord(newEntries, wordToSearch);
  
        markAllData(newEntries , wordToSearch)
  
        newEntries = newEntries
          .slice()
          .sort((a: any, b: any) => b.wordOccurence - a.wordOccurence);
  
        console.log("newEntries: ", newEntries);
        console.log('graphdata' , graphData)
  
        setSearchResults(newEntries);
        generateGraphfromSearch(newEntries , inputValue);
        setGraphSearchLoader(false)
      } catch (error) {
        console.error("Error fetching search results:", error);
      }

    }, 300);
  };


  const handleSiteNameClick = () => {
    if(typeof controller != typeof undefined) {
      controller.abort()
    }

    setSearchValue("");
    setGraphSearchValue("")
    setSearchResults([]);
    setOpenedResults([]);
    
    sethideFiltersForPreview(true);
    setGraphNodeOpened([])
    setCheckGraphStatus(false)
    setPreviousGraphData([])
    setGraphData([])
    setTextSearchLoader(false)
    setGraphSearchLoader(false)

    if(graphOrTextView){
      setShouldShowFilters(true);
    }

    const updatedCheckboxes :any = allCheckboxes.map((eachCategory: any) => ({
      ...eachCategory,
      items: eachCategory.items.map((eachItem: any) => ({
        ...eachItem,
        state: "unchecked",
        status: "neutral",
      })),
    }));
    setAllCheckboxes(updatedCheckboxes)
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


  function markAllData (newentries:any , wordToSearch:any) {
    // console.log('wordtosearch' , wordToSearch)
    // console.log(newentries)

    for (const entry of newentries) {

      let matchingFile: any = {}

      marked.setOptions({
        breaks: true,
      });

      // matchingFile.content = marked(entry.content);

      function stripHtml(html:any) {
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
      while ((match = pattern.exec(plainTextWithoutBrackets)) !== null) {matches.push(match[0])}

      const result = matches.join('\n');
      // console.log(result);

      const highlightedResult = result.replace(new RegExp(`(${wordToSearch.join('|')})`, 'ig'),
        (match) => `<span>${match}</span>`
      );
      

      if(highlightedResult !== null && highlightedResult !== '') {
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
      .filter(line => wordToSearch.some((word:any) => line.toLowerCase().includes(word.toLowerCase())));
      const result = linesToKeep.join('\n');

      const highlightedResult = result.replace(new RegExp(`(${wordToSearch.join('|')})`, 'ig'),
        (match) => `<span>${match}</span>`
      );
      // console.log(highlightedResult)
      if(highlightedResult !== '') {
        entry.totalMarkedData  = highlightedResult
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

   
    if(!themeChangericon){
      setTextColorForNode('#6C655C')
      setGraphLinkColor('#CFCCC7')
    } else {
      setTextColorForNode('#B3B3B5')
      setGraphLinkColor('#565959')      
    }

    const currentTheme = !themeChangericon
    setThemeChangerIcon(!themeChangericon);
    const changeTheme = JSON.stringify(currentTheme)
    // console.log(changeTheme)

    localStorage.setItem('theme', changeTheme);

    const sideNav:any = document.querySelector(`.${"side-nav"}`);
    const workspacePanel:any = document.querySelector(`.${"workspace-content"}`); 
   
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

    if(graphOrTextView) {
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

      if(graphOrTextView) {
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
  

  const handleAccordionClick = () => {
    setShouldShowFilters(!shouldShowFilters);
    sethideFiltersForPreview(true)
  };


  const handleGraphOrTextView = () => {
    setgraphOrTextView(!graphOrTextView);
    if(graphNodeOpened.length > 0) {
      sethideFiltersForPreview(false)
    }

    if (graphOrTextView) {
      setGraphSearchValue(searchValue)
      setShouldShowFilters(false);
      const nodes: any = [];
      const links: any = [];
      let count = 0;
      let finalCount = 0;

      const nodeExists = (id: any) => {
        return nodes.some((node: any) => node.id === id);
      };

      // Iterate through each object
      if (openedResults.length > 0) {
        // If files are open in workspace
        finalCount = openedResults.length;

         // add all nodes
        openedResults.forEach(async (result) => {
          // Create a node for the fileName
          const nodeId = result.fileName;
          const match = result.contentWithRemovedBrackets.match(/#(\w+)/);
          // console.log('match' , match)
          let nodeTag:any = match ? match[0] : null;
          let cleanedTag
          
          if(nodeTag === null){
            cleanedTag = 'tagnotfound'
          } else {
            cleanedTag = nodeTag.substring(1);
          }
          if (!nodeExists(nodeId)) {
            nodes.push({ id: nodeId, tag: cleanedTag });
          }
          
        })

        openedResults.map((result:any)=> {
          const nodeId = result.fileName

          const underlinedWords: any = result.content.match(
            /<span[^>]*>(.*?)<\/span>/g
          );
          // console.log("underlinedWords", underlinedWords);
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

          wordsArray.forEach((word:any) => {
            const nodeWithWord = nodes.find((node:any) => node.id === word);
          
            if (nodeWithWord) {
              if(nodeId !== nodeWithWord.id){
                // Node with the word exists, update its tag
                links.push({ source: nodeId, target: nodeWithWord.id });
              }
            }
          });

        })

        const resultData:any = {nodes , links}

        setTimeout(()=> {

          setGraphData(resultData);
          makeGraph(resultData);
        }, 200)

        // openedResults.forEach(async (result) => {
        //   // Create a node for the fileName
        //   const nodeId = result.fileName;
        //   const match = result.contentWithRemovedBrackets.match(/#(\w+)/);
        //   const nodeTag:any = match ? match[1] : null;
        //   const cleanedTag = nodeTag.substring(1);
        //   if (!nodeExists(nodeId)) {
        //     nodes.push({ id: nodeId, tag: cleanedTag });
        //   }

        //   // Parse the content to extract underlined words
        //   // const underlinedWords: any = result.content.match(
        //   //   /<span[^>]*>(.*?)<\/span>/g
        //   // );
        //   // // console.log("underlinedWords", underlinedWords);
        //   // let wordsArray: any = [];
        //   // if (underlinedWords && Array.isArray(underlinedWords)) {
        //   //   wordsArray = underlinedWords.map((span: any) => {
        //   //     // Use a regular expression to extract the text content between the <span> tags
        //   //     const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
        //   //     // Check if a match was found and return the extracted text, or an empty string if not
        //   //     return match ? match[1] : "";
        //   //   });

        //   //   // Now you can use wordsArray safely
        //   // }
        //   // console.log("wordsArray: ", wordsArray);

        //   const tableNamesStr = userAccessVaults.join(',');
        //   await axios.post(`/api/getTags?q=${wordsArray.join(",")}&av=${tableNamesStr}`)
        //     .then((res:any) => {
        //       // console.log(res.data);
        //       count = count + 1;
        //       const linkTags = Object.keys(res.data).map((key) => {
        //         return {
        //           name: key,
        //           category: res.data[key],
        //         };
        //       });
        //       if (res) {
        //         // console.log("linkTags", linkTags);
        //         linkTags.forEach((word: any) => {
        //           // Remove HTML tags from underlined word
        //           // console.log("word", word);
        //           if (!nodeExists(word.name)) {
        //             nodes.push({ id: word.name, group: 2, tag: word.category });
        //           }

        //           // Create a link between fileName and underlined word
        //           links.push({ source: nodeId, target: word.name, value: 1 });
        //         });
        //       }
        //       // console.log("finalCount", finalCount);
        //       // console.log("count", count);
        //       if (finalCount == count) {
        //         const resultData: any = { nodes, links };
        //         setGraphData(resultData);
        //         // console.log('data for graph from text: ' , resultData)
        //         makeGraph(resultData);
        //         // console.log("match count");
        //       }
        //     })
        //     .catch((err) => {
        //       console.log("err getting tags:", err);
        //     });
        // });
      } else {
        const updatedOpenedResults: any = openedResults.slice();

        searchResults.forEach((result) => {
          let matchingFile: any = result;
          marked.setOptions({
            breaks: true,
          });


          matchingFile.content = marked(matchingFile.content);
          // console.log("markedContent", matchingFile);

          const regex = /\[\[([^[\]]+)\]\]/g;
          const hashtagParagraphRegex = /<p>#.*?<\/p>/g;
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

        finalCount = updatedOpenedResults.length;
        // console.log("updatedOpenedResults: ", updatedOpenedResults);

        // add all nodes
        updatedOpenedResults.forEach(async (result: any) => {
          const nodeId = result.fileName;
          const match = result.contentWithRemovedBrackets.match(/#(\w+)/);
          const nodeTag = match ? match[0] : null;
          const cleanedTag = nodeTag.substring(1);
          if (!nodeExists(nodeId)) {
            nodes.push({ id: nodeId, tag: cleanedTag });
          }
        })

        

        updatedOpenedResults.map((node:any) => {
          const nodeId = node.fileName;
          const underlinedWords = node.content.match(
            /<span[^>]*>(.*?)<\/span>/g
          );

          let wordsArray

          if(underlinedWords){
            wordsArray = underlinedWords.map((span: any) => {
              const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
              return match ? match[1] : "";
            });
          } else if (underlinedWords === null) {
            wordsArray = [node.fileName];
          }

          // console.log('wordsarray' , wordsArray)

          wordsArray.forEach((word:any) => {
            const nodeWithWord = nodes.find((node:any) => node.id === word);
          
            if (nodeWithWord) {
              if(nodeId !== nodeWithWord.id){
                // Node with the word exists, update its tag
                links.push({ source: nodeId, target: nodeWithWord.id });
              }
            }
          });
        })


        // updatedOpenedResults.forEach(async (result: any) => {
        //   console.log('result' , result)
        //   // Create a node for the fileName
        //   // const nodeId = result.fileName;
        //   // const match = result.contentWithRemovedBrackets.match(/#(\w+)/);
        //   // const nodeTag = match ? match[0] : null;
        //   // const cleanedTag = nodeTag.substring(1);
        //   // if (!nodeExists(nodeId)) {
        //   //   nodes.push({ id: nodeId, tag: cleanedTag });
        //   // }

        //   // Parse the content to extract underlined words
          
          
        //   // if (existingNodeIndex !== -1) {
        //   //   // Node already exists, update its tag
        //   //   
        //   // }
          
        //   // console.log("wordsArray: ", result , wordsArray);

        //   try {
        //     // console.log("wordsArray", wordsArray);
        //     // const tableNamesStr = userAccessVaults.join(',');
        //     // const response = await axios.post(`/api/getTags?q=${wordsArray.join(",")}&av=${tableNamesStr}`);
        //     // console.log("response from getTags", response.data);

        //     // if (response) {
        //     //   count = count + 1;
        //     //   const linkTags = Object.keys(response.data).map((key) => {
        //     //     return {
        //     //       name: key,
        //     //       category: response.data[key],
        //     //     };
        //     //   });
        //     //   // console.log("linkTags", linkTags);

        //     //   // linkTags.forEach((word: any) => {
        //     //   //   const existingNodeIndex = nodes.findIndex((node:any) => node.id === word.name);
        //     //   //   if (existingNodeIndex !== -1) {
        //     //   //     // Node already exists, update its tag
        //     //   //     nodes[existingNodeIndex].tag = word.category;
        //     //   //   } else {
        //     //   //     // Node doesn't exist, create a new one
        //     //   //     nodes.push({ id: word.name, tag: word.category });
        //     //   //   }
        //     //   //   // Create a link between fileName and underlined word
        //     //   //   links.push({ source: nodeId, target: word.name, value: 1 });
        //     //   // });
        //     // }
        //     // console.log("finalCount", finalCount);
        //     // console.log("count", count);
        //     // if (finalCount == count) {
        //       // const resultData: any = { nodes, links };
        //       // // let graphNewData = resultData;
        //       // setGraphData(resultData);
        //       // makeGraph(resultData);
        //       // console.log("match count");
        //     // }
        //   } catch (error) {
        //     // Handle errors here
        //     console.log("Error getting tags for node:", error);
        //   }
        // });

        const resultData: any = { nodes, links };
        // console.log('resultData' , resultData)

        setTimeout(() => {
          if(resultData.nodes.length === 0 ) {

          } else {
            setGraphData(resultData);
            makeGraph(resultData);
            setOpenedResults(updatedOpenedResults);
          }
          
        }, 200);
      }

    } else {
      setCheckGraphStatus(false)
      const graphDiv:any = document.getElementById('graph-div');
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
    let element: any = document.getElementById("graph-div");

    let graphWidth = element.offsetWidth;
    let graphHeight = element.offsetHeight;
    

    function ForceGraph(
      { nodes, links }: { nodes: any; links: any },
      {
        nodeId = (d: any) => d.id, // given d in nodes, returns a unique identifier (string)
        nodeGroup = null, // given d in nodes, returns an (ordinal) value for color
        nodeGroups = null as any[] | null, // an array of ordinal values representing the node groups
        nodeTitle = null, // given d in nodes, a title string
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
        linkStrokeWidth = 1, // given d in links, returns a stroke width in pixels
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

        

        function zoomed(event: any) {
          container.attr("transform", event.transform);
        }

        function getColorByTag(tag: string) {
          // Define a mapping of tags to colors
          const tagColors: Record<string, string> = {};

          const themeBasedColors = themeChangericon ? showAddGraphNodeColor.find((group:any) => group.mode === "light mode") : showAddGraphNodeColor.find((group:any) => group.mode === "dark mode");

          // console.log(showAddGraphNodeColor)
          themeBasedColors.data.forEach((colorGroup:any) => {
            const tag = colorGroup.tag;
            tagColors[tag] = colorGroup.color;
          });
          
          return tagColors[tag] || nodeFill;
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
          const tempDiv:any = d3.select('body')
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
        
        function ticked() {
          link
            .attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y);

          node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
          // nodeText.attr("x", (d: any) => d.x + 12).attr("y", (d: any) => d.y);
          nodeText.attr("x", (d: any) => d.x - (getNodeTextWidth(d) / 4.5)).attr("y", (d: any) => d.y + 12);
          nodeTitles.text((d:any) => d.id);
        }

        function handleMouseOver(this: any, event: any, d: any) {
          // console.log('hello mouseover')
          // Set the initial state before transitioning
          d3.select(this as SVGElement)
            // .attr("fill", "red") // Change to your desired color
            .attr("r", nodeRadius * 1.2) // Optionally, increase the node size
            .attr("fill-opacity", 1); // Set initial opacity to 1

          // Initialize the links with their original stroke color and opacity
          link
            .attr("stroke", (linkData:any) => {
              if (linkData.source === d || linkData.target === d) {
                return linkStroke; // Original link color
              } else {
                return linkStroke;
              }
            })
            .attr("stroke-opacity", linkStrokeOpacity);

          // Initialize the nodes with their original fill color and opacity
          node.attr("fill-opacity", (nodeData) => {
              if (nodeData === d) {
                return 1; // Opacity of the hovered node
              } else if (areNodesConnected(nodeData, d)) {
                return 1; // Opacity of directly connected nodes
              } else {
                return 0.1; // Opacity of other nodes
              }
            });

            nodeText
            .transition().duration(300)
            .style('opacity' , (nodeData:any) => {
              if (nodeData === d) {
                return 1
              } else if (areNodesConnected(nodeData , d)) {
                return 1
              } else {
                return 0.1
              }
            })
            .style("font-size", (nodeData:any) => {
              return nodeData === d ? '12px' : '8px'
            })

          // Start the transition
          d3.select(this as SVGElement)
            .transition()
            .duration(400) // Transition duration in milliseconds
            .attr("r", nodeRadius); // Optionally, increase the node size

          // Change the color of the links directly connected to the hovered node
          link
            .transition()
            .duration(400)
            .attr("stroke", (linkData:any) => {
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
            .attr("stroke-opacity", (linkData:any) => {
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
            // .attr("fill", nodeFill) // Reset to the original node color
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

          nodeText.transition().duration(200)
            .style('opacity' , 1)
            .style('font-size', '8px')
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

        function calculateNodeRadius(d:any) {
          // console.log('d' , d , links)
          const linkCount = links.filter((link:any) => link.source.id === d.id).length;
          if(linkCount <= 4) {
            return nodeRadius;
          } else {
            let checkLinkCount = linkCount - 4
            let onePercentOfCheckLinkCount = 0.10 * checkLinkCount;
            console.log(onePercentOfCheckLinkCount , 'radius to return' , onePercentOfCheckLinkCount+ 4);

            return onePercentOfCheckLinkCount + 4;
          }
        }



        const simulation = d3.forceSimulation(customNodes).force("link", forceLink)
          .force("charge", d3.forceManyBody().strength(sliderValue))
          .force("center", d3.forceCenter().strength(centerForceValue))
          .force('collide' , d3.forceCollide().strength(0)).on("tick", ticked);

        const svg = d3.create("svg").attr("width", width).attr("height", height)
          .attr("viewBox", [-width / 2, -height / 2, width, height])
          .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
          .style("transition", "fill-opacity 0.2s, stroke-opacity 0.2s");

        const container = svg.append("g");

        const link = container.append("g").attr("id", "links-g-tag")
          .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
          .attr("stroke-opacity", linkStrokeOpacity)
          .attr("stroke-width",typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
          .attr("stroke-linecap", linkStrokeLinecap)
          .selectAll("line")
          .data(links)
          .join("line");

        const zoom: any = d3.zoom().on("zoom", zoomed);
        svg.call(zoom);

        document.addEventListener("click", hideNodeInfo);

        const node = container
          .append("g")
          .attr("id", "nodes-g-tag")
          .attr("fill", nodeFill)
          .attr("stroke", nodeStroke)
          .attr("stroke-opacity", nodeStrokeOpacity)
          .attr("stroke-width", nodeStrokeWidth)
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("r", calculateNodeRadius)
          .attr("fill", (d: any) => {
            const color = getColorByTag(d.tag);
            return color;
          })
          .on("mouseover", handleMouseOver) // Add mouseover event listener
          .on("mouseout", handleMouseOut)
          .on("click", handleNodeClick)
          .classed("node-pointer", true)
          .call(drag(simulation) as any, drag(simulation));

        // Append text labels to the container, positioned near the nodes
        const nodeText = container
          .append("g")
          .attr("id", "text-g-tag")
          .selectAll("title")
          .data(nodes)
          .join("text")
          // .attr("x", (d) => d.x + 12) // Adjust the x-coordinate based on your preference
          // .attr("y", (d) => d.y) // Adjust the y-coordinate based on your preference
          .attr("x", (d: any) => d.x) // Keep the x-coordinate the same as the node
          .attr("y", (d: any) => d.y + nodeRadius + 12)
          .attr("dy", ".35em") // Adjust the vertical alignment based on your preference
          .style("font-size", "8px") // Adjust the font size based on your preference
          .text((d:any) => d.id)
          .attr('fill' , textColorForNode);

        const nodeTitles = container
          .append("g")
          .attr("id", "titles-g-tag")
          .selectAll("title")
          .data(nodes)
          .join("title")
          .text((d:any) => d.id);

        // In the ticked function, update the positions of text and title elements

        // if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
        // if (L) link.attr("stroke", ({ index: i }) => L[i]);
        if (W) link.attr("stroke-width", (d: any, i: any) => `${W[i]}`);
        if (L) link.attr("stroke", (d: any, i: any) => `${L[i]}`);
        if (G && color) {
          node.attr("fill", (_, i) => color(G[i]));
        }
        if (T) {
          node.append("title").text((d: any, i: any) => String(T[i]));
        }

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
        nodeTitle = null, // given d in nodes, a title string
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
        linkStrokeWidth = 1, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength = 0.3,
        colors = d3.schemeTableau10, // an array of color strings, for the node groups
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        invalidation = undefined // when this promise resolves, stop the simulation
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
        const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
        const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
        const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

        // Replace the input nodes and links with mutable objects for the simulation.


        let formattingNodes:any = []
        let notFoundNodes:any = []

        nodes.forEach((eachNode:any) => {
          const matchingNodeIndex = previousGraphData.nodes.findIndex((prevNode:any) => prevNode.id === eachNode.id);

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

        
        // console.log('nodes' , nodes)
        nodes = d3.map(nodes, (_, i) => ({ id: N[i], tag: nodes[i].tag }));
        links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));
        // const linksCopy = _.cloneDeep(links)

        // const formattingNodesMap:any = new Map(formattingNodes.map((node:any) => [node.id, node]));
        let formattingNodeCopy = formattingNodes;

        nodes.forEach((node:any , index:any) => {
          const nodeReplacement = formattingNodeCopy.find((eachnode:any) => eachnode.id === node.id);
          if(nodeReplacement) {
            nodeReplacement.fx = nodeReplacement.x;
            nodeReplacement.fy = nodeReplacement.y;
        
            // Update the node in the nodes array
            nodes[index] = nodeReplacement;
          }
        })
        

        links.forEach((link:any , index:any) => {
          if (typeof link.source === 'string') {
            const sourceObject = formattingNodeCopy.find((node:any) => node.id === link.source);
            if (sourceObject) {
              links[index].source = sourceObject
            }
          }
        
          // Check if target is a string, and convert it to an object if needed
          if (typeof link.target === 'string') {
            const targetObject = formattingNodeCopy.find((node:any) => node.id === link.target);
            if (targetObject) {
              links[index].target = targetObject
            }
          }
        });

        // console.log('formattingNodeCopy',formattingNodeCopy)


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

          // console.log('helllllo')
        
          link
            .attr("x1", (d: any) => {
              const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
                return checkEachNode.id === d.source.id
              })
              if(xmark) {
                return xmark.x
              }
              else {
                // console.log('d',d)
                if(nodes) {
                  const sourceXMark = nodes.find((checkEachNode:any) => {
                    return checkEachNode.id === d.source.id
                  })
                  if(sourceXMark) {
                    return sourceXMark.x
                  }
                } 
              }
            })
            .attr("y1", (d: any) => {
              const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
                return checkEachNode.id === d.source.id
              })
              if(xmark) {
                return xmark.y
              }
              else {
                // console.log('d',d)
                if(nodes) {
                  const sourceXMark = nodes.find((checkEachNode:any) => {
                    return checkEachNode.id === d.source.id
                  })
                  if(sourceXMark) {
                    return sourceXMark.y
                  }
                } 
              }
            })
            .attr("x2", (d: any) => {
              return d.target.x
            })
            .attr("y2", (d: any) => {
              return  d.target.y
            });


          
            
          node
            .attr('cx' , (d:any) => d.x)
            .attr('cy' , (d:any) => d.y)
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

          nodeText
          .attr("x", (d: any) => {
            const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
              return checkEachNode.id === d.id
            })
            if(xmark) {
              return xmark.x - (getNodeTextWidth(d) / 4.5)
            }
            else {
              return d.x - (getNodeTextWidth(d) / 4.5)
            }
            
          })
          .attr("y", (d: any) => {
            const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
              return checkEachNode.id === d.id
            })
            if(xmark) {
              return xmark.y + 12
            }
            else {
              return d.y + 12
            }
            
          });


          nodeTitles
          .text((d:any) => {
            const xmark:any = formattingNodeCopy.find((checkEachNode:any) => {
              return checkEachNode.id === d.id
            })
            if(xmark) {
              return xmark.id
            }
            else {
              return d.id
            }
          });

          formattingNodes = []
          formattingNodeCopy = []


          // console.log('link',link)
        }

        function zoomed(event: any) {
          container.attr("transform", event.transform);
        }

        function getColorByTag(tag: string) {
          const tagColors: Record<string, string> = {};
          const themeBasedColors = themeChangericon ? showAddGraphNodeColor.find((group:any) => group.mode === "light mode") : showAddGraphNodeColor.find((group:any) => group.mode === "dark mode");

          themeBasedColors.data.forEach((colorGroup:any) => {
            const tag = colorGroup.tag;
            tagColors[tag] = colorGroup.color;
          });

          return tagColors[tag] || nodeFill;
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
          const tempDiv:any = d3.select('body')
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
          nodes.forEach((node:any) => {
            node.fx = null;
            node.fy = null;
          });
          // console.log('event' , event, 'nodes' , nodes)
          
          // Set the initial state before transitioning
          d3.select(this as SVGElement)
            // .attr("fill", "red") // Change to your desired color
            .attr("r", calculateNodeRadius(d) * 1.1) // Optionally, increase the node size
            .attr("fill-opacity", 1); // Set initial opacity to 1

          // Initialize the links with their original stroke color and opacity
          link
            .attr("stroke", (linkData:any) => {
              if (linkData.source === d || linkData.target === d) {
                return linkStroke; // Original link color
              } else {
                return linkStroke;
              }
            })
            .attr("stroke-opacity", linkStrokeOpacity);

          // Initialize the nodes with their original fill color and opacity
          node
            .attr("fill-opacity", (nodeData:any) => {
              if (nodeData === d) {
                return 1; // Opacity of the hovered node
              } else if (areNodesConnected(nodeData, d)) {
                return 1; // Opacity of directly connected nodes
              } else {
                return 0.1; // Opacity of other nodes
              }
            });
          
          nodeText
            .transition().duration(300)
            .style('opacity' , (nodeData:any) => {
              if (nodeData === d) {
                return 1
              } else if (areNodesConnected(nodeData , d)) {
                return 1
              } else {
                return 0.1
              }
            })
            .style("font-size", (nodeData:any) => {
              return nodeData === d ? '12px' : '8px'
            })

          // Start the transition
          d3.select(this as SVGElement)
            .transition()
            .duration(400) // Transition duration in milliseconds
            .attr("r", nodeRadius); // Optionally, increase the node size

          // Change the color of the links directly connected to the hovered node
          link
            .transition()
            .duration(400)
            .attr("stroke", (linkData:any) => {
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
            .attr("fill-opacity", (nodeData:any) => {
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
            .attr("stroke-opacity", (linkData:any) => {
              if (linkData.source === d || linkData.target === d) {
                return 1; // Opacity of links directly connected to the hovered node
              } else {
                return 0; // Opacity of other links
              }
            });



          // console.log("Hovered Nodes:", hoveredNodes);
        }

        function handleMouseOut(this: any, d:any) {
          // console.log('d', d.fromElement.getAttribute("id"))
          let tempMouseOverNode = d.fromElement.getAttribute("id")
          const nodeObject = { id: tempMouseOverNode.replace("node-", "")};
          
          d3.select(this)
            // .attr("fill", nodeFill) // Reset to the original node color
            .attr("r", calculateNodeRadius(nodeObject)) // Reset to the original node size
            .transition().duration(400).attr("fill-opacity", 1); // Reset opacity

          // Reset the color and opacity of all links to their original values with a transition
          link
            .transition().duration(400).attr("stroke", linkStroke).attr("stroke-opacity", linkStrokeOpacity);

          // Reset the opacity of all nodes to their original value with a transition
          node.transition().duration(200).attr("fill-opacity", 1);

          nodeText.transition().duration(200).style('opacity' , 1).style('font-size', '8px')
            
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

        function calculateNodeRadius(d:any) {
          const linkCount = links.filter((link:any) => link.source.id === d.id).length;
          if(linkCount <= 4) {
            return nodeRadius;
          } else {
            let checkLinkCount = linkCount - 4
            let onePercentOfCheckLinkCount = 0.12 * checkLinkCount;

            return onePercentOfCheckLinkCount + 4;
          }
        }
      
        

        // console.log("nodes ", nodes);
        const customNodes: any = nodes;

        const simulation = d3
          .forceSimulation(customNodes)
          .force("link", forceLink)
          .force("charge", d3.forceManyBody().strength(sliderValue))
          .force("center", d3.forceCenter().strength(centerForceValue))
          .on("tick", ticked);


        // const svg = d3
        // .create("svg")
        // .attr("width", width)
        // .attr("height", height)
        // .attr("viewBox", [-width / 2, -height / 2, width, height])
        // .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        // .style("transition", "fill-opacity 0.2s, stroke-opacity 0.2s");


        const svgContainer = d3.select('#graph-div');
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
        const node = container
          .append("g")
          .attr("id", "nodes-g-tag")
          .attr("fill", nodeFill)
          .attr("stroke", nodeStroke)
          .attr("stroke-opacity", nodeStrokeOpacity)
          .attr("stroke-width", nodeStrokeWidth)
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("id", (d:any) => `node-${d.id}`)
          .attr("r", calculateNodeRadius)
          .attr("fill", (d: any) => {
            const color = getColorByTag(d.tag);
            return color;
          })
          .on("mouseover", handleMouseOver) // Add mouseover event listener
          .on("mouseout", handleMouseOut)
          .on("click", handleNodeClick)
          .classed("node-pointer", true)
          .call(drag(simulation) as any, drag(simulation));

        // // Append text labels to the container, positioned near the nodes
        container.select("#text-g-tag").remove();
        const nodeText = container
          .append("g")
          .attr("id", "text-g-tag")
          .selectAll("title")
          .data(nodes)
          .join("text")
          // .attr("x", (d) => d.x + 12) // Adjust the x-coordinate based on your preference
          // .attr("y", (d) => d.y) // Adjust the y-coordinate based on your preference
          .attr("x", (d: any) => d.x) // Keep the x-coordinate the same as the node
          .attr("y", (d: any) => d.y + nodeRadius + 12)
          .attr("dy", ".35em") // Adjust the vertical alignment based on your preference
          .style("font-size", "8px") // Adjust the font size based on your preference
          .text((d:any) => d.id)
          .attr('fill' , textColorForNode);

        container.select("#titles-g-tag").remove();
        const nodeTitles = container
          .append("g")
          .attr("id", "titles-g-tag")
          .selectAll("title")
          .data(nodes)
          .join("title")
          .text((d:any) => d.id);


        const zoom: any = d3.zoom().on("zoom", zoomed);
        svg.call(zoom);

        document.addEventListener("click", hideNodeInfo);

        // // In the ticked function, update the positions of text and title elements

        // if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
        // if (L) link.attr("stroke", ({ index: i }) => L[i]);
        if (W) link.attr("stroke-width", (d: any, i: any) => `${W[i]}`);
        if (L) link.attr("stroke", (d: any, i: any) => `${L[i]}`);
        // if (G && color) {
        //   node.attr("fill", (_:any, i:any) => color(G[i]));
        // }
        if (T) {
          node.append("title").text((d: any, i: any) => String(T[i]));
        }

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

    let svgResult:any
    if(checkGraphStatus) {
      // WanderGraph(graphNewData , options)
      svgResult = WanderGraph(graphNewData, options)
      
    } else {
      svgResult = ForceGraph(graphNewData, options);
      if(element) {
        element.appendChild(svgResult.svg);
      } else {
        const graphDiv:any = document.getElementById("graph-div");
          graphDiv.appendChild(svgResult.svg);
      }
    }

  };


  const openSearchResult = (resultToOpen: any) => {
    const copySearchResults = _.cloneDeep(rawSearchResults);
    // console.log(copySearchResults)

    let matchingFile: any = copySearchResults.find(
      (file: any) => file.fileName === resultToOpen.fileName
    );

    marked.setOptions({
      breaks: true,
    });

    let editedResult = matchingFile.content.replace(/\n(?=\n)/g, "\n\n<br/>\n")
    matchingFile.content = marked(editedResult);
    // console.log("markedContent", matchingFile);

    const regex = /\[\[([^[\]]+)\]\]/g;
    const hashtagParagraphRegex = /<p>#.*?<\/p>/g;
    if (matchingFile) {
      const contentWithoutHashtags = matchingFile.content.replace(
        hashtagParagraphRegex,
        ""
      );

      const contentWithStyledWords = contentWithoutHashtags.replace(
        regex,
        (match: any, word: any) =>
          `<span style="text-decoration: underline; cursor: pointer;">${word}</span>`
      );

      // console.log(contentWithStyledWords)

      // let markedData = marked(contentWithStyledWords);

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
          });
        });
      }, 10);
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


  const collapseOpenedResult = (resultToCollapse: any) => {
    // console.log("resultToCollapse", resultToCollapse);
    const collapsedResult = openedResults.filter(
      (item: any) => item.fileName !== resultToCollapse.fileName
    );
    setOpenedResults(collapsedResult);
  };


  const removeBothSearchResults = (resultToRemove: any) => {
    // console.log("resultToRemove", resultToRemove);
    collapseOpenedResult(resultToRemove);
    removeSearchResult(resultToRemove);
    // console.log("searchValue: ", searchValue);

    const updatedSearchValue = `${searchValue} -"${resultToRemove.fileName}"`;

    setSearchValue(updatedSearchValue);

    const syntheticEvent = {
      target: { value: updatedSearchValue },
    };
    
    handleSearch(syntheticEvent);
  };


  const handleLinkClick = async (linkClickedFromFile: any, linkClicked: any) => {
    // console.log("linkClickedFromFile: ", linkClickedFromFile);
    // console.log("linkClicked: ", linkClicked);
    try {
      const tableNamesStr = userAccessVaults.join(',');
      const response = await fetch(`/api/linkFile?q=${linkClicked}&av=${tableNamesStr}`);
      const newDataObject = await response.json();
      // console.log("responseJson: ", responseJson);

      // console.log("newDataObject", newDataObject);
      marked.setOptions({
        breaks: true,
      });

      newDataObject.content = marked(newDataObject.content);
      newDataObject.contentWithRemovedBrackets = marked(newDataObject.content);

      const regex = /\[\[([^[\]]+)\]\]/g;
      const hashtagParagraphRegex = /<p>#.*?<\/p>/g;
      if (newDataObject) {
        // console.log("newDataObject", newDataObject);
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

            // console.log("updatedOpenedResults", updatedOpenedResults);

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


  const handleCopyText = () => {
    const textarea = document.createElement("textarea");
    if(graphOrTextView) {
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
    // console.log("fileOpenedFromGraph", fileOpenedFromGraph);
    const matchingResult: any = openedResults.find(
      (result: any) => result.fileName === fileOpenedFromGraph.id
    );

    if (matchingResult) {
      // console.log("Matching Result:", matchingResult);
      
      if (graphNodeOpened.length === 0 || matchingResult.fileName !== graphNodeOpened[0].fileName) {
        // Update the array only if the fileName is different
        setGraphNodeOpened((prevGraphNodeOpened:any) => [matchingResult, ...prevGraphNodeOpened]);
      }
    } else {
      // Now does not come in this else
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
        const hashtagParagraphRegex = /<p>#.*?<\/p>/g;
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

    setAnimationKey((prevKey) => prevKey + 1);
    sethideFiltersForPreview(false);
  };


  const collapseExpandedNode = () => {
    sethideFiltersForPreview(true);
    setGraphNodeOpened([]);
  };


  const removeClickedNode = (event: any) => {
    // console.log("fileOpenedFromGraph", fileOpenedFromGraph);
    // console.log("graphData: ", graphData);
    // console.log("openedResults", openedResults);

    // removeing nodes
    // Usage:
    const updatedGraphData = removeNodeAndConnected(
      graphData,
      fileOpenedFromGraph.id
    );
    // console.log("updatedGraphData", updatedGraphData);
    // console.log("graphData: ", graphData);
    setGraphData(updatedGraphData)
    makeGraph(updatedGraphData);

    removeBothSearchResults({ fileName: fileOpenedFromGraph.id });
  };


  const removeNodeAndConnected = (graphData: any, nodeId: any) => {
    // Create a copy of the graphData object
    const updatedGraphData = { ...graphData };
    // console.log("updatedGraphData", updatedGraphData);

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

      console.log("connectedLinks", connectedLinks);

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
    setGraphData(updatedGraphData);

    return updatedGraphData;
  };


  const previewNodeLink = (node: any) => {
    setPreviewNodeLinkLoader(true)

    const matchingResult: any = openedResults.find(
      (result: any) => result.fileName === node
    );

    if (matchingResult) {
      setPreviewNodeLinkLoader(false)
      if (graphNodeOpened.length === 0 || matchingResult.fileName !== graphNodeOpened[0].fileName) {
        // Update the array only if the fileName is different
        setGraphNodeOpened((prevGraphNodeOpened:any) => [matchingResult, ...prevGraphNodeOpened]);
        setAnimationKey((prevKey) => prevKey + 1);
      }
    } else {
      const tableNamesStr = userAccessVaults.join(',');
      // console.log(tableNamesStr)
      axios.post(`/api/linkFile?q=${node}&av=${tableNamesStr}`)
      .then((res) => {
        const newDataObject = res.data;

        marked.setOptions({
          breaks: true,
        });

        newDataObject.content = marked(newDataObject.content);
        newDataObject.contentWithRemovedBrackets = marked(
          newDataObject.content
        );

        const regex = /\[\[([^[\]]+)\]\]/g;
        const hashtagParagraphRegex = /<p>#.*?<\/p>/g;
        newDataObject.content = newDataObject.content.replace(
          hashtagParagraphRegex,
          ""
        );

        newDataObject.content = newDataObject.content.replace(
          regex,
          (match: any, word: any) =>
            `<span style="text-decoration: underline; cursor: pointer;">${word}</span>`
        );
        
        if (graphNodeOpened.length === 0 || newDataObject.fileName !== graphNodeOpened[0].fileName) {
          setGraphNodeOpened((prevGraphNodeOpened:any) => [newDataObject, ...prevGraphNodeOpened]);
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
    // console.log('rawsearchresults' , rawSearchResults)
    const matchingResult = openedResults.find((result) => result.fileName === fileOpenedFromGraph.id);
    // console.log('matching result' , matchingResult)

    const nodeExists = (id: any) => {
      return updatedGraphData.nodes.some((node: any) => node.id === id);
    };

    if (matchingResult) {
      // console.log("Matching result found:", matchingResult);
      // console.log("updatedGraphData: ", updatedGraphData);
      const underlinedWords: any = matchingResult.content.match(/<span[^>]*>(.*?)<\/span>/g);


      // let count = 0;
      // let finalCount = 1;
      let wordsArray
      if(underlinedWords){
        wordsArray = underlinedWords.map((span: any) => {
          const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
          return match ? match[1] : "";
        });
      } else if(underlinedWords === null){
        wordsArray = [matchingResult.fileName];
      }

      // console.log('graphSearchWordsArray',graphSearchWordsArray)
      
      try {
        setGraphSearchLoader(true)
        const tableNamesStr = userAccessVaults.join(',');
          const encodedWords = encodeURIComponent(wordsArray.join(","));
          // responseJson = await axios.get(`/api/search?q=${encodedWords}&AccessVaults=${tableNamesStr}`);
        const response = await axios.get(`/api/wanderNode?q=${encodedWords}&av=${tableNamesStr}&sa=${graphSearchWordsArray}`)
        if(response) {

          for (const entry of response.data) {
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
          }

          console.log('response' , response.data)


          const linkTags = Object.keys(response.data).map((key) => {
            return {
              name: response.data[key].fileName,
              category: response.data[key].tag,
            };
          });

          const searchWords = (searchValue.match(/(-?)"([^"]*)"|\S+/g) || [])
          .map((match: any) => match.replace(/^(-?)"([^"]*)"$/, "$1$2"));

          // Use filter to remove objects that match any word in searchWords with a hyphen
          const filteredData = linkTags.filter((item: any) => {
            return !searchWords.includes(`-${item.name}`);
          });

          filteredData.forEach((word: any) => {
            if (!nodeExists(word.name)) {
              updatedGraphData.nodes.push({
                id: word.name,
                tag: word.category,
              });
              openedResults.forEach((result) => {
                // Check if the name exists in the content
                if (result.content.includes(word.name)) {
                  // Add a link to newLinks
                  updatedGraphData.links.push({
                    source: result.fileName,
                    target: word.name,
                  });
                }
              });
              // console.log("nodes:", nodes);
            }
          });

          // console.log("updatedGraphData: ", updatedGraphData);
            // let graphNewData = resultData;
          setGraphData(updatedGraphData);
          makeGraph(updatedGraphData);
          setGraphSearchLoader(false)
          // console.log("match count");
          // Remove HTML tags from underlined word

          const originalArray = response.data;
          const copiedArray = _.cloneDeep(originalArray);
          // console.log('copiedArray',copiedArray)

          let updatedOpenedResults:any = [];
          copiedArray.forEach((result:any) => {
            let matchingFile: any = result;
            marked.setOptions({
              breaks: true,
            });

            matchingFile.content = matchingFile.content.replace(/\n(?=\n)/g, "\n\n<br/>\n")
            matchingFile.content = marked(matchingFile.content);

            const hashtagParagraphRegex = /<p>#.*?<\/p>/g;
            const regex = /\[\[([^[\]]+)\]\]/g;

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

            matchingFile.content = contentWithStyledWords;

            updatedOpenedResults.push({
              ...matchingFile,
              openedFromResults: true,
            });
          })

          const newOpenedResults = [...openedResults];
          const filteredUpdatedResults = newOpenedResults.filter((updatedObj:any) => (
            !updatedOpenedResults.some((existingObj:any) => existingObj.fileName === updatedObj.fileName)
          ));

          // console.log('filteredupdatedresults' , filteredUpdatedResults)


          const indexToInsertAfter  = filteredUpdatedResults.findIndex((obj) => obj.fileName === fileOpenedFromGraph.id);
          if (indexToInsertAfter !== -1) {
            
            const insertionIndex = indexToInsertAfter + 1;
            
            filteredUpdatedResults.splice(insertionIndex, 0, ...updatedOpenedResults);
            // console.log('filteredUpdatedResults' , filteredUpdatedResults)
            setOpenedResults(filteredUpdatedResults)

          
            // Log the updated array to verify the changes
            // console.log('newOpenedResults:', newOpenedResults);
            // setOpenedResults(newOpenedResults)
          }          
        }
      } catch (error) {
        setGraphSearchLoader(false)
        console.log("Error getting wander node files:", error);
      }

    } else {
      setGraphSearchLoader(true)
      console.log("No matching result found.");
      axios.post(`/api/search?q=${fileOpenedFromGraph.id}`).then((response) => {
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
        console.log("filteredData", filteredData);
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
            } else if (underlinedWords === null){
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

                  const isExcluded = (name:any, searchValue:any) => {
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
                    // let graphNewData = resultData;
                    setGraphData(updatedGraphData);
                    makeGraph(updatedGraphData);
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

        // console.log("Updated openedResults:", openedResults);
      });
    }
  };


  const generateGraphfromSearch = (searchResultsForGraph: any , searchValueForGraph: any) => {
    // console.log('searchResultsforGraph' , searchResultsForGraph)

    // Graph Search including links
    if (!graphOrTextView && searchResultsForGraph.length>0) {
      setShouldShowFilters(false);
      const nodes: any = [];
      const links: any = [];
      let tempNodes: any = []
      let count = 0;
      let finalCount = 0;
      const nodeExists = (id: any) => {
        return nodes.some((node: any) => node.id === id);
      };

      // Iterate through each object
      if (searchResultsForGraph.length > 0 ) {
        // console.log("search results for graph: ", searchResultsForGraph);
        // If search bar has words
        
        // If files are not open in workspace
        // console.log("search Results", searchResults);

        const updatedOpenedResults: any = []
        // console.log('updatedOpenedResults ', updatedOpenedResults)
  
        searchResultsForGraph.forEach((result:any) => {
          let matchingFile: any = result;
          marked.setOptions({
            breaks: true,
          });

          matchingFile.content = marked(matchingFile.content);
          // console.log("markedContent", matchingFile);

          const regex = /\[\[([^[\]]+)\]\]/g;
          const hashtagParagraphRegex = /<p>#.*?<\/p>/g;
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

        updatedOpenedResults.forEach(async (result:any) => {
          const nodeId = result.fileName
          const match = result.contentWithRemovedBrackets.match(/#(\w+)/);
          const nodeTag = match ? match[0] : null;
          const cleanedTag = nodeTag.substring(1);
          if (!nodeExists(nodeId)) {
                nodes.push({ id: nodeId, tag: cleanedTag});
          }
        })

        updatedOpenedResults.map((result:any) => {
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

          wordsArray.forEach((word:any) => {
            const nodeWithWord = nodes.find((node:any) => node.id === word);
          
            if (nodeWithWord) {
              if(nodeId !== nodeWithWord.id){
                // Node with the word exists, update its tag
                links.push({ source: nodeId, target: nodeWithWord.id });
              }
            }
          });
        })

        const resultData:any = {nodes , links}

        setTimeout(()=> {
          setOpenedResults(updatedOpenedResults)
          setGraphData(resultData);
          makeGraph(resultData);
        }, 200)

        // updatedOpenedResults.forEach(async (result: any) => {
        //   // Create a node for the fileName
        //   const nodeId = result.fileName;
        //   const match = result.contentWithRemovedBrackets.match(/#(\w+)/);
        //   const nodeTag = match ? match[0] : null;
        //   if (!nodeExists(nodeId)) {
        //     nodes.push({ id: nodeId, tag: nodeTag });
        //   }
        //   let wordsArray = []
        //   let underlinedWords = null

        //   if (new RegExp(searchValueForGraph, 'i').test(nodeId)) {

        //   // Parse the content to extract underlined words
        //     underlinedWords = result.content.match(
        //       /<span[^>]*>(.*?)<\/span>/g
        //     );
        //     // console.log("result" , result.fileName , "underlinedWords1 ", underlinedWords);
            
        //     if(underlinedWords){
        //       wordsArray = underlinedWords.map((span: any) => {
        //         // Use a regular expression to extract the text content between the <span> tags
        //         const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
        //         // Check if a match was found and return the extracted text, or an empty string if not
        //         return match ? match[1] : "";
        //       });
        //     } else if (underlinedWords === null) {
        //       wordsArray = [result.fileName];
    
        //       // Handle the case where underlinedWords is null or undefined
        //     }
        //     for (const word of wordsArray) {
        //       // Check if the word is not already in tempNodes
        //       if (!tempNodes.includes(word)) {
        //         // Add the word to tempNodes
        //         tempNodes.push(word);
        //       }
        //     }
        //   } else {
        //     underlinedWords = result.content.match(
        //       /<span[^>]*>(.*?)<\/span>/g
        //     );
        //     // console.log("result" , result.fileName , "underlinedWords2 ", underlinedWords);
            
        //     if(underlinedWords){
        //       wordsArray = underlinedWords.map((span: any) => {
        //         // Use a regular expression to extract the text content between the <span> tags
        //         const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
        //         // Check if a match was found and return the extracted text, or an empty string if not
        //         return match ? match[1] : "";
        //       });
        //       // console.log('wordsarray now' , wordsArray)
        //       wordsArray= wordsArray.filter((word:any) => {
        //         // Check if the word matches searchValueForGraph or if it's in the nodes array
        //         const matchesSearch = new RegExp(searchValueForGraph, "i").test(word);
        //         // console.log('matchesSearch' , matchesSearch)
        //         const inNodesArray = tempNodes.some((node:any) => {
        //           // Check if any node in tempNodes meets a specific condition
        //           return node === word; // Adjust the condition as needed
        //       });
        //         // console.log('inNodesArray' , inNodesArray)
        //         return matchesSearch || inNodesArray;
        //       });
        //       // console.log('wordsarraynowafter' , wordsArray)
        //     } else if (underlinedWords === null) {
        //       wordsArray = [result.fileName];
    
        //       // Handle the case where underlinedWords is null or undefined
        //     }
        //     for (const word of wordsArray) {
        //       // Check if the word is not already in tempNodes
        //       if (!tempNodes.includes(word)) {
        //         // Add the word to tempNodes
        //         tempNodes.push(word);
        //       }
        //     }

        //   }
          
        //   // console.log("wordsArray: ", wordsArray);

        //   try {
        //     // console.log('nodes' , nodes)
        //     // console.log("wordsArray", wordsArray);
        //     const tableNamesStr = userAccessVaults.join(',');
        //     const response = await axios.post(
        //       `/api/getTags?q=${wordsArray.join(",")}&av=${tableNamesStr}`
        //     );
        //     console.log("res", response);
        //     // Handle the response data here

        //     if (response) {
        //       count = count + 1;
        //       const linkTags = Object.keys(response.data).map((key) => {
        //         return {
        //           name: key,
        //           category: response.data[key],
        //         };
        //       });
        //       // let nodeArray = [];
        //       // console.log("linkTags", linkTags);
        //       linkTags.forEach((word: any) => {
        //         const existingNodeIndex = nodes.findIndex((node:any) => node.id === word.name);
        //         if (existingNodeIndex !== -1) {
        //           // Node already exists, update its tag
        //           nodes[existingNodeIndex].tag = word.category;
        //         } else {
        //           // Node doesn't exist, create a new one
        //           nodes.push({ id: word.name, tag: word.category });
        //         }
        //         // Create a link between fileName and underlined word
        //         links.push({ source: nodeId, target: word.name, value: 1 });
        //       });
        //     }
        //     // console.log("finalCount", finalCount);
        //     // console.log("count", count);
        //     if (finalCount == count) {
        //       const resultData: any = { nodes, links };
        //       // let graphNewData = resultData;
        //       setGraphData(resultData);
        //       makeGraph(resultData);
        //       // console.log("match count");
        //     }
        //   } catch (error) {
        //     // Handle errors here
        //     console.log("Error:", error);
        //   }
        // });
        // setOpenedResults(updatedOpenedResults);
        
      } 
      // else {
      //   // If files are not open in workspace
      //   // console.log("search Results", searchResults);
      //   console.log('no words in search')

      //   const updatedOpenedResults: any = searchResultsForGraph.slice();

      //   updatedOpenedResults.forEach((result:any) => {
      //     let matchingFile: any = result;
      //     marked.setOptions({
      //       breaks: true,
      //     });

      //     matchingFile.content = marked(matchingFile.content);
      //     // console.log("markedContent", matchingFile);

      //     const regex = /\[\[([^[\]]+)\]\]/g;
      //     const hashtagParagraphRegex = /<p>#.*?<\/p>/g;
      //     if (matchingFile) {
      //       const contentWithoutHashtags = matchingFile.content.replace(
      //         hashtagParagraphRegex,
      //         ""
      //       );
      //       // console.log("contentWithoutHashtags", contentWithoutHashtags);

      //       const contentWithStyledWords = contentWithoutHashtags.replace(
      //         regex,
      //         (match: any, word: any) =>
      //           `<span style="text-decoration: underline; cursor: pointer;">${word}</span>`
      //       );
      //       // console.log("contentwithstyledwords", contentWithStyledWords);

      //       const updatedResultToOpen = {
      //         ...result,
      //         content: contentWithStyledWords,
      //         openedFromResults: true,
      //       };

      //       // const doesExist = openedResults.some(
      //       //   (result) => result.fileName === updatedResultToOpen.fileName
      //       // );
      //       const doesExist = updatedOpenedResults.some(
      //         (result: any) => result.fileName === updatedResultToOpen.fileName
      //       );

      //       if (!doesExist) {
      //         updatedOpenedResults.push(updatedResultToOpen); // Add the updated object to the copy
      //       } else {
      //         console.log("An object with the same fileName already exists.");
      //       }
      //     }
      //   });
      //   finalCount = updatedOpenedResults.length;
      //   // console.log("updatedOpenedResults: ", updatedOpenedResults);
      //   updatedOpenedResults.forEach(async (result: any) => {
      //     // Create a node for the fileName
      //     const nodeId = result.fileName;
      //     const match = result.contentWithRemovedBrackets.match(/#(\w+)/);
      //     const nodeTag = match ? match[0] : null;
      //     if (!nodeExists(nodeId)) {
      //       nodes.push({ id: nodeId, group: 1, tag: nodeTag });
      //     }

      //     // Parse the content to extract underlined words
      //     const underlinedWords = result.content.match(
      //       /<span[^>]*>(.*?)<\/span>/g
      //     );
      //     console.log("underlinedWords", underlinedWords);
      //     let wordsArray
      //     if(underlinedWords){
      //       wordsArray = underlinedWords.map((span: any) => {
      //         // Use a regular expression to extract the text content between the <span> tags
      //         const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
      //         // Check if a match was found and return the extracted text, or an empty string if not
      //         return match ? match[1] : "";
      //       });
      //     } else if (underlinedWords === null) {
      //       wordsArray = [result.fileName];
  
      //       // Handle the case where underlinedWords is null or undefined
      //     }
          
      //     // console.log("wordsArray: ", wordsArray);

      //     try {
      //       // console.log("wordsArray", wordsArray);
      //       const tableNamesStr = userAccessVaults.join(',');
      //       const response = await axios.post(
      //         `/api/getTags?q=${wordsArray.join(",")}&av=${tableNamesStr}`
      //       );
      //       // console.log("res", response);
      //       // Handle the response data here

      //       if (response) {
      //         count = count + 1;
      //         const linkTags = Object.keys(response.data).map((key) => {
      //           return {
      //             name: key,
      //             category: response.data[key],
      //           };
      //         });
      //         // let nodeArray = [];
      //         // console.log("linkTags", linkTags);
      //         linkTags.forEach((word: any) => {
      //           const existingNodeIndex = nodes.findIndex((node:any) => node.id === word.name);
      //           if (existingNodeIndex !== -1) {
      //             // Node already exists, update its tag
      //             nodes[existingNodeIndex].tag = word.category;
      //           } else {
      //             // Node doesn't exist, create a new one
      //             nodes.push({ id: word.name, tag: word.category });
      //           }
      //           // Create a link between fileName and underlined word
      //           links.push({ source: nodeId, target: word.name, value: 1 });
      //         });
      //       }
      //       // console.log("finalCount", finalCount);
      //       // console.log("count", count);
      //       if (finalCount == count) {
      //         const resultData: any = { nodes, links };
      //         // let graphNewData = resultData;
      //         setGraphData(resultData);
      //         makeGraph(resultData);
      //         // console.log("match count");
      //       }
      //     } catch (error) {
      //       // Handle errors here
      //       console.log("Error:", error);
      //     }
      //   });
      //   setOpenedResults(updatedOpenedResults);
      // }

      // Create the final object in the desired format

      // setTimeout(() => {}, 400);
    } else {
      setShouldShowFilters(false);
      const nodes: any = [];
      const links: any = [];
      const resultData: any = { nodes, links };
        // console.log('resultData: ' , resultData)
        // let graphNewData = resultData;
      setGraphData(resultData);
      const graphDiv:any = document.getElementById('graph-div');
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
      setOpenedResults(searchResultsForGraph);
        // makeGraph(resultData);
    }

    // Graph Search like Obsidian code
    // if (!graphOrTextView && searchResultsForGraph.length>0) {
    //   setShouldShowFilters(false);

    //   const nodes: any = [];
    //   const links: any = [];
    //   let count = 0;
    //   let finalCount = 0;
    //   const nodeExists = (id: any) => {
    //     return nodes.some((node: any) => node.id === id);
    //   };

    //   // Iterate through each object
    //   // if (openedResults.length > 0) {
    //   //   console.log("hellllllo");
    //   //   // If files are open in workspace
    //   //   finalCount = openedResults.length;
    //   //   openedResults.forEach((result) => {
    //   //     // Create a node for the fileName
    //   //     const nodeId = result.fileName;
    //   //     // console.log("result", result);
    //   //     const match = result.contentWithRemovedBrackets.match(/#(\w+)/);
    //   //     const nodeTag = match ? match[1] : null;
    //   //     if (!nodeExists(nodeId)) {
    //   //       nodes.push({ id: nodeId, group: 1, tag: nodeTag });
    //   //     }

    //   //     // Parse the content to extract underlined words
    //   //     const underlinedWords: any = result.content.match(
    //   //       /<span[^>]*>(.*?)<\/span>/g
    //   //     );
    //   //     // console.log("underlinedWords", underlinedWords);
    //   //     let wordsArray: any = [];
    //   //     if (underlinedWords && Array.isArray(underlinedWords)) {
    //   //       wordsArray = underlinedWords.map((span: any) => {
    //   //         // Use a regular expression to extract the text content between the <span> tags
    //   //         const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
    //   //         // Check if a match was found and return the extracted text, or an empty string if not
    //   //         return match ? match[1] : "";
    //   //       });

    //   //       // Now you can use wordsArray safely
    //   //     } else {
    //   //       // Handle the case where underlinedWords is null or undefined
    //   //       console.log("underlinedWords is null or undefined");
    //   //     }
    //   //     // console.log("wordsArray: ", wordsArray);
    //   //     axios
    //   //       .post("/api/getTags?q=" + wordsArray.join(","))
    //   //       .then((res) => {
    //   //         // console.log(res.data);
    //   //         count = count + 1;
    //   //         const linkTags = Object.keys(res.data).map((key) => {
    //   //           return {
    //   //             name: key,
    //   //             category: res.data[key],
    //   //           };
    //   //         });
    //   //         if (res) {
    //   //           // console.log("linkTags", linkTags);
    //   //           linkTags.forEach((word: any) => {
    //   //             // Remove HTML tags from underlined word
    //   //             // console.log("word", word);
    //   //             if (!nodeExists(word.name)) {
    //   //               nodes.push({ id: word.name, group: 2, tag: word.category });
    //   //             }

    //   //             // Create a link between fileName and underlined word
    //   //             links.push({ source: nodeId, target: word.name, value: 1 });
    //   //           });
    //   //         }
    //   //         // console.log("finalCount", finalCount);
    //   //         // console.log("count", count);
    //   //         if (finalCount == count) {
    //   //           const resultData: any = { nodes, links };
    //   //           setGraphData(resultData);
    //   //           makeGraph(resultData);
    //   //           // console.log("match count");
    //   //         }
    //   //       })
    //   //       .catch((err) => {
    //   //         console.log("err=", err);
    //   //       });
    //   //   });
    //   // }

    //   // If files are not open in workspace
    //   // console.log("search Results now", searchResultsForGraph);

    //   // const updatedOpenedResults: any = openedResults.slice();
    //   searchResultsForGraph.forEach((result: any) => {
    //     let matchingFile: any = result;
    //     marked.setOptions({
    //       breaks: true,
    //     });

    //     matchingFile.content = marked(matchingFile.content);
    //     // console.log("markedContent", matchingFile);

    //     const regex = /\[\[([^[\]]+)\]\]/g;
    //     const hashtagParagraphRegex = /<p>#.*?<\/p>/g;
    //     if (matchingFile) {
    //       const contentWithoutHashtags = matchingFile.content.replace(
    //         hashtagParagraphRegex,
    //         ""
    //       );
    //       // console.log("contentWithoutHashtags", contentWithoutHashtags);

    //       const contentWithStyledWords = contentWithoutHashtags.replace(
    //         regex,
    //         (match: any, word: any) =>
    //           `<span style="text-decoration: underline; cursor: pointer;">${word}</span>`
    //       );
    //       // console.log("contentwithstyledwords", contentWithStyledWords);

    //       const updatedResultToOpen = {
    //         ...result,
    //         content: contentWithStyledWords,
    //         openedFromResults: true,
    //       };

    //       // const doesExist = openedResults.some(
    //       //   (result) => result.fileName === updatedResultToOpen.fileName
    //       // );
    //       const doesExist = searchResultsForGraph.some(
    //         (item: any, index: any) => {
    //           if (item.fileName === updatedResultToOpen.fileName) {
    //             searchResultsForGraph[index] = updatedResultToOpen; // Replace the existing object
    //             return true; // Set doesExist to true
    //           }
    //           return false; // Continue searching
    //         }
    //       );

    //       if (!doesExist) {
    //         searchResultsForGraph.push(updatedResultToOpen); // Add the updated object to the copy
    //       }
    //     }
    //   });
    //   finalCount = searchResultsForGraph.length;
    //   // console.log("updatedOpenedResults: ", searchResultsForGraph);
    //   searchResultsForGraph.forEach(async (result: any) => {
    //     // Create a node for the fileName
    //     const nodeId = result.fileName;
    //     const match = result.contentWithRemovedBrackets.match(/#(\w+)/);
    //     const nodeTag = match ? match[0] : null;
    //     if (!nodeExists(nodeId)) {
    //       nodes.push({ id: nodeId, group: 1, tag: nodeTag });
    //     }

    //     // Parse the content to extract underlined words
    //     const underlinedWords = result.content.match(
    //       /<span[^>]*>(.*?)<\/span>/g
    //     );
    //     // console.log("underlinedWords", underlinedWords);
    //     let wordsArray;

    //     if (underlinedWords) {
    //       wordsArray = underlinedWords.map((span: any) => {
    //         // Use a regular expression to extract the text content between the <span> tags
    //         const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
    //         // Check if a match was found and return the extracted text, or an empty string if not
    //         return match ? match[1] : "";
    //       });
    //       // Now you can use wordsArray
    //     } else if (underlinedWords === null) {
    //       wordsArray = [result.fileName];

    //       // Handle the case where underlinedWords is null or undefined
    //     }

    //     // console.log("wordsArray: ", wordsArray);

    //     try {
    //       // console.log("wordsArray", wordsArray);
    //       const response = await axios.post(
    //         "/api/getTags?q=" + wordsArray.join(",")
    //       );
    //       // console.log("res", response);
    //       // Handle the response data here

    //       if (response) {
    //         // console.log("response.data----------", response.data);
    //         count = count + 1;
    //         const linkTags = Object.keys(response.data).map((key) => {
    //           return {
    //             name: key,
    //             category: response.data[key],
    //           };
    //         });
    //         let nodeArray = [];
    //         const filteredLinkTags = linkTags.filter((word) =>
    //           searchResultsForGraph.some(
    //             (result: any) => result.fileName === word.name
    //           )
    //         );
    //         // console.log("linkTags", linkTags);
    //         filteredLinkTags.forEach((word: any) => {
    //           // Remove HTML tags from underlined word
    //           // console.log("word", word);
    //           const existingNode = nodes.find(
    //             (node: any) => node.id === word.name
    //           );
    //           if (existingNode) {
    //             existingNode.tag = word.category; // Update the tag of the existing node
    //           } else {
    //             // Node doesn't exist, create a new one
    //             nodes.push({ id: word.name, tag: word.category });
    //           }
    //           // Create a link between fileName and underlined word
    //           links.push({ source: nodeId, target: word.name, value: 1 });
    //         });
    //       }
    //       // console.log("finalCount", finalCount);
    //       // console.log("count", count);

    //       // console.log("count", count);
    //       if (finalCount == count) {
    //         const resultData: any = { nodes, links };
    //         // console.log('resultData: ' , resultData)
    //         // let graphNewData = resultData;
    //         setGraphData(resultData);
    //         makeGraph(resultData);
    //         // console.log("match count");
    //       }
    //     } catch (error) {
    //       // Handle errors here
    //       console.log("Error:", error);
    //     }
    //   });
    //   console.log('searchresultsforgraph: ' , searchResultsForGraph)
    //   setOpenedResults(searchResultsForGraph);

    // } else {
    //     setShouldShowFilters(false);
    //     const nodes: any = [];
    //     const links: any = [];
    //     const resultData: any = { nodes, links };
    //     // console.log('resultData: ' , resultData)
    //     // let graphNewData = resultData;
    //     setGraphData(resultData);
    //     const graphDiv:any = document.getElementById('graph-div');
    //     const svgElement = graphDiv.querySelector('svg');
    //     graphDiv.removeChild(svgElement);
    //     // makeGraph(resultData);
    //     setOpenedResults(searchResultsForGraph);

    // }
  };


  const handleCenterForceCommitted = (event: any, newValue: any) => {
    setCenterForceValue(newValue)
  };


  const handleLinkForceCommitted = (event:any , newValue:any) => {
    setLinkForceValue(newValue)
  }


  const handleSliderChangeCommitted = (event: any, newValue: any) => {
    const mappedValue = mapValueToState(newValue , 0 , 1 , -300 , -50);

    setSliderValue(mappedValue)
  };

  
  const sliderNewGraph = () => {
    // console.log('graphdata' , graphData)
    if (!graphOrTextView) {
      setShouldShowFilters(false);
      const nodes: any = [];
      const links: any = [];
      let count = 0;
      let finalCount = 0;
      const nodeExists = (id: any) => {
        return nodes.some((node: any) => node.id === id);
      };

      // Iterate through each object
      if (openedResults.length > 0) {
        // If files are open in workspace
        finalCount = openedResults.length;
        openedResults.forEach((result) => {
          // Create a node for the fileName
          const nodeId = result.fileName;
          // console.log("result", result);
          const match = result.contentWithRemovedBrackets.match(/#(\w+)/);
          const nodeTag = match ? match[1] : null;
          if (!nodeExists(nodeId)) {
            nodes.push({ id: nodeId, group: 1, tag: nodeTag });
          }

          // Parse the content to extract underlined words
          const underlinedWords: any = result.content.match(
            /<span[^>]*>(.*?)<\/span>/g
          );
          // console.log("underlinedWords", underlinedWords);
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
          // console.log("wordsArray: ", wordsArray);
          axios
            .post("/api/getTags?q=" + wordsArray.join(","))
            .then((res) => {
              // console.log(res.data);
              count = count + 1;
              const linkTags = Object.keys(res.data).map((key) => {
                return {
                  name: key,
                  category: res.data[key],
                };
              });
              if (res) {
                // console.log("linkTags", linkTags);
                linkTags.forEach((word: any) => {
                  // Remove HTML tags from underlined word
                  // console.log("word", word);
                  if (!nodeExists(word.name)) {
                    nodes.push({ id: word.name, group: 2, tag: word.category });
                  }

                  // Create a link between fileName and underlined word
                  links.push({ source: nodeId, target: word.name, value: 1 });
                });
              }
              // console.log("finalCount", finalCount);
              // console.log("count", count);
              if (finalCount == count) {
                const resultData: any = { nodes, links };
                setGraphData(resultData);
                makeGraph(resultData);
                // console.log("match count");
              }
            })
            .catch((err) => {
              console.log("err=", err);
            });
        });
      } else {
        // If files are not open in workspace
        // console.log("search Results", searchResults);

        const updatedOpenedResults: any = openedResults.slice();

        searchResults.forEach((result) => {
          let matchingFile: any = result;
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
            }
          }
        });
        finalCount = updatedOpenedResults.length;
        // console.log("updatedOpenedResults: ", updatedOpenedResults);
        updatedOpenedResults.forEach(async (result: any) => {
          // Create a node for the fileName
          const nodeId = result.fileName;
          const match = result.contentWithRemovedBrackets.match(/#(\w+)/);
          const nodeTag = match ? match[0] : null;
          if (!nodeExists(nodeId)) {
            nodes.push({ id: nodeId, group: 1, tag: nodeTag });
          }

          // Parse the content to extract underlined words
          const underlinedWords = result.content.match(
            /<span[^>]*>(.*?)<\/span>/g
          );
          // console.log("underlinedWords", underlinedWords);
          let wordsArray
          if(underlinedWords){
            wordsArray = underlinedWords.map((span: any) => {
              // Use a regular expression to extract the text content between the <span> tags
              const match = /<span[^>]*>(.*?)<\/span>/.exec(span);
              // Check if a match was found and return the extracted text, or an empty string if not
              return match ? match[1] : "";
            });
          } else if (underlinedWords === null) {
            wordsArray = [result.fileName];
  
            // Handle the case where underlinedWords is null or undefined
          }
          
          // console.log("wordsArray: ", wordsArray);

          try {
            // console.log("wordsArray", wordsArray);
            const response = await axios.post(
              "/api/getTags?q=" + wordsArray.join(",")
            );
            // console.log("res", response);
            // Handle the response data here

            if (response) {
              count = count + 1;
              const linkTags = Object.keys(response.data).map((key) => {
                return {
                  name: key,
                  category: response.data[key],
                };
              });
              // let nodeArray = [];
              // console.log("linkTags", linkTags);
              linkTags.forEach((word: any) => {
                const existingNodeIndex = nodes.findIndex((node:any) => node.id === word.name);
                if (existingNodeIndex !== -1) {
                  // Node already exists, update its tag
                  nodes[existingNodeIndex].tag = word.category;
                } else {
                  // Node doesn't exist, create a new one
                  nodes.push({ id: word.name, tag: word.category });
                }
                // Create a link between fileName and underlined word
                links.push({ source: nodeId, target: word.name, value: 1 });
              });
            }
            // console.log("finalCount", finalCount);
            // console.log("count", count);
            if (finalCount == count) {
              const resultData: any = { nodes, links };
              // let graphNewData = resultData;
              setGraphData(resultData);
              makeGraph(resultData);
              // console.log("match count");
            }
          } catch (error) {
            // Handle errors here
            console.log("Error:", error);
          }
        });
        setOpenedResults(updatedOpenedResults);
      }

      // Create the final object in the desired format

      // setTimeout(() => {}, 400);
    } else {
      setShouldShowFilters(true);
    }
  };


  const mapValueToState = (value:any , min1:any , max1:any , min2:any , max2:any) => {
    return (value - min1) * (max2 - min2) / (max1 - min1) + min2;
  };


  const mapSliderValueToReal = (value:any, min1:any, max1:any, min2:any, max2:any) => {
    return (value - min2) * (max1 - min1) / (max2 - min2) + min1;
  }


  const handleLogout = () => {
    Helpers.logout()
  }


  const openSyncDialog = () => {
    setSyncPopup(true)
  }


  const handleCloseDialog = () => {
    setSyncPopup(false);
  };


  const synchronizeFiles = async () => {

    axios
      .get("/api/googleDriveFiles")
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


  const handleFolderSelection = (folder:any) => {
    console.log(folder)

    if (folder.id) {

      axios.get("api/downloadFiles", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          folderId: folder.id,
        },
      }).then((res)=> {
        // console.log('res: ' ,res.data)

      }).catch((err)=> {

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


  const handleUserManagementClick = (itemName:any) => {
    const queryParams = { usermanagement: itemName };
    
    router.push({
      pathname: "/dashboard",
      query: queryParams,
    });
  };


  const handleUserOptions = (itemName:any)=>{
    if(itemName === 'profile'){
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
    if(itemName === 'changepassword'){
      setShowChangePasswordDialog(true)

    }
    if(itemName === 'billing'){
      setBillingLoader(true);
      axios.post(`/api/stripe-billing?customer_id=${getUser.user.stripe_customer_id}`)
      .then((res:any)=>{
        window.location.href = res.data.url;
      })
      .catch((err:any)=>{
        console.log('err from stripe billing' , err)
        setBillingLoader(false);
      })
    }
    if(itemName === 'logout'){
      setUserLogoutPopup(true)
    }
  }


  const handleUserLogoutPopupClose = () => {
    toggleAccountOptions()
    setUserLogoutPopup(false)
  }


  const userLogout = () => {
      Helpers.logout()
    router.push('/login')

  }


  const closeEditUserDailog = () => {
    setShowEditUserDialog(false)
    setShowAccountOptions(false)
    setFormData({
      fullName: '',
      email: '',
      role: '',
      status: '',
      image: ''
    });
  }


  const handleUserProfileChange = (e:any) => {
    const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
  }


  const handleEditUser = async () => {
    setEditUserLoader(true)
    await axios.post('/api/editUser', {
      email: getUser.user.email,
      data: formData
    })
    .then(async (res)=>{
      console.log('user updated successfully' , res.data);
      // await fetchUsers()
      // setOriginalUsers(res.data.allUsers);
      // setSearchedUsers(res.data.allUsers)
      // closeAddUserDialog()
      setShowEditUserDialog(false)
      toggleAccountOptions()
      setEditUserLoader(false)
      toast.success('Account updated successfully!');
      setFormData({
        fullName: '',
        email: '',
        role: '',
        status: '',
        image: ''
      });

      dispatch(stAccessTokenVerify({
        user: res.data.allUsers[0],
        user_permssions: res.data.getPermissions ,
        user_role: res.data.getRole,
        user_package: getUser.user_package
      }))
      
    setUser(res.data.allUsers[0])
    setPermissions(res.data.getPermissions)
    setUserAccessVaults(res.data.vaultsAccess)
    })
    .catch((error:any)=>{
      console.log('Error calling editUser api:', error);
      setEditUserLoader(false)
      // setIsLoading(false);
      toast.error('Failed to updated account data');
    })
  }


  const closeSetPasswordDialog = () => {
    setShowChangePasswordDialog(false)
    setNewPasswordData({
      newPassword: '',
      confirmPassword:''
    });
    setShowAccountOptions(false)
    setShowSetPasswordToggle(false)
    setShowConfirmPasswordToggle(false)

  }


  const handleSetNewPasswordToggle = (e:any) =>{
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
      .then((res)=>{
        console.log('set password successfully' , res.data);
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
      .catch((error:any)=>{
        console.log('Error calling addUser api:', error);
        setUpdatePasswordLoader(false)
        toast.error('Failed to set password');
      })
    }




    //clear fields after updating password
    

  }


  const handleVaultChange = (event:any) => {
    const selectedValue = event.target.value;
    // console.log('selectedvauule' , selectedValue)
    const isOptionAvailable = getPackage.some((item:any) => `${item.packageName} Vault` === selectedValue);

    if (isOptionAvailable) {
      setSelectedVaultOption(selectedValue);
    } else {
      setShowLockedVaultPopup(true)
      

      setClickedVault(selectedValue)
      
    }
  };


  const handleEditProfilePicture = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      image: '',
    }));
  }


  const handleFileChange = (event:any) => {
    const selectedProfilePicture = event.target.files[0];
    const previews:any = [];
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


  const getRandomColor = () => {
    const randomHexColor = () => {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    };

    let newColor;
    const existingColors = showAddGraphNodeColor.map((group:any) => group.color);

    do {
        newColor = randomHexColor();
    } while (existingColors.includes(newColor));

    return newColor;
  };


  const handleAddNewColor = () => {
    const newGroup = {
      id: Math.floor(Math.random() * 900) + 100, 
      tag: '',
      color: getRandomColor(),
    };

    setShowAddGraphNodeColor((prevGroups:any) => [...prevGroups, newGroup]);
  }


  const handleRemoveNodeColor = async (e:any) => {
    const updatedArray = showAddGraphNodeColor.filter((item: any) => item.id !== e.id);
    setNodeColorRemoveCheck(e.tag)
    setShowAddGraphNodeColor(updatedArray);


  }


  const handleNodeColorTagChange = (index:any, newTag:any) => {
    const updatedArray = [...showAddGraphNodeColor];

    const itemIndex = updatedArray.findIndex((item: any) => item.id === index.id);

    if (itemIndex !== -1) {
      // Update the tag property
      updatedArray[itemIndex].tag = newTag;
      
      // Update the state with the modified array
      setShowAddGraphNodeColor(updatedArray);
    }
    // updatedArray[index].tag = newTag;
    // setShowAddGraphNodeColor(updatedArray);
    const tagExists = graphData.nodes.some((node:any) => node.tag === index.tag);

    if (tagExists) {
      makeGraph(graphData);
    }
  }


  const handleNodeColorChange = (e:any , newColor:any) => {
    console.log(e , newColor)
    const updatedColors = [...showAddGraphNodeColor];
    updatedColors[e].color = newColor
    setShowAddGraphNodeColor(updatedColors);
  };


  const handleColorInputBlur = (e:any, newColor:any , group:any) => {
    const tagExists = graphData.nodes.some((node:any) => node.tag === group.tag);

    if (tagExists) {
      makeGraph(graphData);
    }
  };


  const handleLeftArrowForPreviousFile = () => {
    setPreviewNodeLinkLoader(true)
    const newArray = graphNodeOpened.slice(1);
    setGraphNodeOpened(newArray);
    setAnimationKey((prevKey) => prevKey + 1);
    setPreviewNodeLinkLoader(false)
  }
 

  return (
    <div className="homepage-container">
      <div className={`side-nav ${themeChangericon ? '': 'night-mode'}`}>
        <div className={"logoVc"}>

          <div className="site-name" onClick={handleSiteNameClick}>
            <p>TCM Weaver</p>
          </div>

          {/* ================Top Icons && Popups==================== */}
          <div className={"icon-profile"}>

            {/* ==============Theme Change==========================  */}
            <div className="themeChanger">
              {themeChangericon ? (
                <img src="/dark-mode.png" alt="img" onClick={handleThemeChangerClick} />
              ) : (
                <img src="/light-modenew.svg" alt="img" onClick={handleThemeChangerClick} />
              )}
            </div>

            {/* =============Graph or Text View=======================*/}
            <div>
              {graphOrTextView ? (
                <div className="simple-icon">
                  {themeChangericon ? (
                    <img src="/graph-logo-light.png" alt="img" onClick={() => {handleGraphOrTextView()}} />
                    ) : (
                    <img src="/graph-logo-dark.png" alt="img" onClick={() => {handleGraphOrTextView()}} />
                  )}
                </div>
              ) : (
                <div className={"note-icon"}>
                  {themeChangericon ? (
                    <img src="/text-logo.png" alt="img" onClick={() => {handleGraphOrTextView()}} />
                    ) : (
                    <img src="/text-logo-night.png" alt="img" onClick={() => {handleGraphOrTextView()}} />
                  )}
                </div>
              )}
            </div>
            
            {/* =============Users Options=========================== */}
            <div className="sidebar-user-div">
              {themeChangericon ? (
                  <img src="/users.svg" alt="img" onClick={toggleAccountOptions} style={{ cursor: "pointer" }} ref={usersIconRef}/>
                ) : (
                  <img src="/users-dark.svg" alt="img" onClick={toggleAccountOptions} style={{ cursor: "pointer" }} ref={usersIconRef}/>
              )}
              {/* <img src="/users.png" alt="img" onClick={toggleAccountOptions} style={{ cursor: "pointer" }} ref={usersIconRef}/> */}
              {showAccountOptions && (
                <div className="account-options-container" ref={accountOptionsRef}>
                  <List>
                    {
                      _.every(['vault_management'], value => _.includes(getPermissions, value)) && (
                        <ListItem button onClick={() => handleUserManagementClick("vaultmanagement")} dense>
                          <ListItemText primary="Vault Management" />
                        </ListItem>
                      )
                    }
                    {
                      _.every(['user_management'], value => _.includes(getPermissions, value)) && (
                        <ListItem button onClick={() => handleUserManagementClick("usermanagement")} dense>
                          <ListItemText primary="User Management" />
                        </ListItem>
                      )
                    }
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
                            {billingLoader && <CircularProgress size={17} style={{color: 'grey'}} />}
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

            {syncPopup ? (
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
              </div>): (<></>
            )}
            
            {foldersPopup && (
              <Dialog open={foldersPopup} onClose={handlerFolderPopupClose}>
              <DialogTitle>Select a Folder</DialogTitle>
              <DialogContent>
                <List>
                  {folders.map((folder:any) => (
                    <ListItem button key={folder.id} onClick={() => handleFolderSelection(folder)}>
                      <ListItemText primary={folder.name} />
                    </ListItem>
                  ))}
                </List>
              </DialogContent>
              <DialogActions>
                <Button onClick={ handlerFolderPopupClose} color="primary">
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
              <Dialog open={showEditUserDialog} onClose={closeEditUserDailog} sx={{ width: 550 , margin: 'auto' }} >
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>

                  <DialogContentText>
                    Please enter the details:
                  </DialogContentText>

                  <Grid container spacing={2} sx={{paddingTop:1}}>
                    <Grid item xs={12}>
                      <div className="edit-profile-div">
                        <div className="edit-profile-image-div">
                          {formData.image && formData.image !== null && formData.image !== '' ? (
                            <img src={formData.image}
                              style={{ borderRadius: '50%', width: '100%', height: '100%' , objectFit: 'contain' }}
                              alt="Profile Picture"
                            />
                          ):(
                            <img src='/profile-avatar.webp'
                            style={{ borderRadius: '50%', width: '100%', height: '100%' , objectFit: 'contain' }}
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

          </div>

        </div>


        {/* =====Search Bar=======================================  */}
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
              <CircularProgress size={16} style={{color: 'black'}}/>
            ):(
              <div onClick={handleCopyText} style={{cursor: 'pointer'}}>
                {themeChangericon ? (
                  <img src="/copy-content.png" alt="img" />
                ) : (
                  <img src="/copy-content-dark.png" alt="img" />
                )}
              </div>
            )}
            {/* <img src="/copy-content.png" alt="img" onClick={handleCopyText}/> */}
            {isCopied && <div className="copy-tooltip">Copied!</div>}
          </div>
        </div>


        {/* =====Search Results & Graph Node Preview==============  */}
        {graphOrTextView ? (
          <div className={`search-results ${!shouldShowFilters ? "results-height" : "" }`} >
            {searchValue.length > 0 && (
              <div>
                {searchResults.map((result, index) => (
                  <div className="filter-data" key={index}>
                    <div className="set set-1">
                      <div>
                        <div className="results-title">
                          <span>
                            {
                              (result as { wordOccurence: number })
                                .wordOccurence
                            }
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

                        {themeChangericon ? (
                        <img src="/xmarknew.png" alt="img" className="remove-search-result" onClick={() => removeBothSearchResults(result)} />
                         ) : (
                        <img src="/xmark-dark.png" alt="img" className="remove-search-result" onClick={() => removeBothSearchResults(result)} />
                        )}
                      </div>

                      <div>
                        <div>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: (
                                result as {
                                  totalMarkedData: string;
                                }
                              ).totalMarkedData,
                            }}
                            className="note"
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
            )}
          </div>
        ) : (
          <>
            {!hideFiltersForPreview && (
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
                    ):(
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
                      <CircularProgress size={16} style={{color: 'black'}} />
                    ):(
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
                  <p
                    dangerouslySetInnerHTML={{
                      __html: graphNodeOpened[0].content,
                    }}
                    className="opened-result-description"
                    onClick={(e: any) => {
                      if (
                        e.target.tagName === "SPAN" &&
                        e.target.style.textDecoration === "underline"
                      ) {
                        const clickedWord = e.target.textContent;
                        previewNodeLink(clickedWord);
                      }
                    }}
                  />
                </div>
              </div>
            )}

            <div id="nodeInfo" className="node-click-options">
              {themeChangericon ? (
                <img src="/xmarknew.png" alt="img" className="node-remove-icon" onClick={removeClickedNode} />
              ) : (
                <img src="/xmark-dark.png" alt="img" className="node-remove-icon" onClick={removeClickedNode} />
              )}
              
              {/* <img
                src="xmark.png"
                alt="img"
                className="node-remove-icon"
                onClick={removeClickedNode}
              /> */}

              {themeChangericon ? (
                <img src="/node-text.svg" alt="img" className="node-text-icon" onClick={showNodeClickedFile} />
              ) : (
                <img src="/node-text-dark.svg" alt="img" className="node-text-icon" onClick={showNodeClickedFile} />
              )}

              {/* <img
                src="node-text.svg"
                alt="img"
                className="node-text-icon"
                onClick={showNodeClickedFile}
              /> */}

              {themeChangericon ? (
                <img src="/wander-light.svg" alt="img" className="node-wander-icon" onClick={wanderClickedNode} />
              ) : (
                <img src="/wander-dark.svg" alt="img" className="node-wander-icon" onClick={wanderClickedNode} />
              )}
            </div>
          </>
        )}

        {/* =====Filters =========================================  */}
        <div className={`${!shouldShowFilters ? 'menus-filters-visible' : 'menus'} ${graphOrTextView ? '' : 'filters-graph-screen'}`}>
          <div className="menus-link">
            {!shouldShowFilters ? (
              <>
                {hideFiltersForPreview && (
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
                      ))}
                    </Accordion>
                  </div>
                )}
              </>
            ):(
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


        {/* =====Graph Sliders====================================  */}
        {graphOrTextView ? (<></>):(
          <>
            <div className="forces-container">

              <div>
                <p style={{margin: '0px'}}>Center force</p>
                <Slider
                  style={{padding: '8px 0px'}}
                  size="small"
                  min={0}
                  max={1}
                  step={0.01}
                  defaultValue={centerForceValue}
                  aria-label="Small"
                  valueLabelDisplay="auto"
                  onChangeCommitted={handleCenterForceCommitted}
                  classes={{ track: 'custom-slider-track',
                            thumb: 'custom-slider-thumb',
                            rail: 'custom-slider-rail', }}
                />
              </div>

              <div>
                <p style={{margin: '0px'}}>Link force</p>
                <Slider
                  style={{padding: '8px 0px'}}
                  size="small"
                  min={0}
                  max={1}
                  step={0.01}
                  defaultValue={linkForceValue}
                  aria-label="Small"
                  valueLabelDisplay="auto"
                  onChangeCommitted={handleLinkForceCommitted}
                  classes={{ track: 'custom-slider-track',
                            thumb: 'custom-slider-thumb',
                            rail: 'custom-slider-rail', }}
                />
              </div>

              <div>
                <p style={{margin: '0px'}}>Link distance</p>
                <Slider
                  style={{padding: '8px 0px'}}
                  size="small"
                  min={0}
                  max={1}
                  step={0.01}
                  defaultValue={mapSliderValueToReal(sliderValue, 0, 1, -300, -50)}
                  aria-label="Small"
                  valueLabelDisplay="auto"
                  onChangeCommitted={handleSliderChangeCommitted}
                  classes={{ track: 'custom-slider-track',
                            thumb: 'custom-slider-thumb',
                            rail: 'custom-slider-rail', }}
                />
              </div>

            </div>
          </>
        )}

      </div>


      <div className={`workspace-content ${themeChangericon ? '': 'night-mode'}`}>
        {graphOrTextView ? (
          <div className={`${openedResults.length === 0 ? 'main-homepage' : 'main'}`}>
            {openedResults.length > 0 ? (
              openedResults.map((result, index) => (
                <div key={index} className="opened-results">
                  <div className="view-panel-title">
                    <h4>{result.fileName.toUpperCase()}</h4>
                    {result.openedFromResults ? (
                      <div className="view-panel-title-icons">
                        {themeChangericon ? (
                            <img src="/arrow-leftnew.png" alt="img" onClick={() => collapseOpenedResult(result)} />
                          ) : (
                            <img src="/arrow-left-dark.png" alt="img" onClick={() => collapseOpenedResult(result)} />
                        )}

                        {themeChangericon ? (
                            <img src="/xmarknew.png" alt="img" onClick={() => removeBothSearchResults(result)} />
                          ) : (
                            <img src="/xmark-dark.png" alt="img" onClick={() => removeBothSearchResults(result)} />
                        )}
                      </div>
                    ) : (
                      <div>
                        <img
                          src="/collapsenew.png"
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
                          const clickedWord = e.target.textContent;
                          handleLinkClick(result.fileName, clickedWord);
                        }
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="homepage-opened-file">
                <div className="view-panel-title">
                  <h3>Homepage</h3>
                </div>
                <div className="opened-result-detail">
                  {homepageFile.length === 0 ? (
                    <p className="opened-result-description">Home.md not found</p>
                  ) : (
                    <p
                      dangerouslySetInnerHTML={{
                        __html: filtersData ? homepageFile.content : '',
                      }}
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

            {/* <div>
              {showColorSetting ? (
                <>
                  <div className="graph-color-setting">

                    <div className="graph-color-setting-close-div">
                      <h5>Groups</h5>
                      <button onClick={() => setShowColorSetting(false)}>
                        <CloseIcon></CloseIcon>
                      </button>
                    </div>

                    {showAddGraphNodeColor.length > 0 && (
                      <div>
                        {showAddGraphNodeColor.map((group:any, index:any) => (
                          <div key={index} className="graph-node-new-color">
                            <input type="text"
                              placeholder="Enter tag"
                              className="node-new-color-text"
                              value={group.tag}
                              onChange={(e) => handleNodeColorTagChange(group, e.target.value)}
                            />
                            <div className="color-input-wrapper">
                              <input type='color'
                                value={group.color}
                                onChange={(e) => handleNodeColorChange(index, e.target.value)}
                                onBlur={(e) => handleColorInputBlur(index, e.target.value , group)}
                                className="node-new-colorpicker "/>
                            </div>
                            <button onClick={() => handleRemoveNodeColor(group)}>
                              <CloseIcon></CloseIcon>
                            </button>
                          </div>
                        ))}

                      </div>
                    )}

                    <div className="graph-color-group-div">
                      <button onClick={handleAddNewColor}>New Group</button>
                    </div>
                  </div>
                </>):(
                <>
                  <div className="graph-color-setting-icon">
                    <button onClick={() => setShowColorSetting(true)}>
                      <SettingsIcon></SettingsIcon>
                    </button>
                  </div>
                </>
              )}
            </div> */}

            
          </div>
        )}

      </div>
    
      <ToastContainer />
    </div>
  );
};

export default Sidebar;