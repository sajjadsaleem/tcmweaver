import React, { useEffect, useRef, useState } from 'react'
import LayoutWrapper from '../components/LayoutWrapper'
import AuthLayout from '../components/AuthLayout'
import { ToastContainer, toast } from "react-toastify";
import Link from 'next/link';
import * as Helpers from '../../util/Helpers'
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,  FormControl,
    Grid,  IconButton,  Input,  InputAdornment,  InputLabel,  List, ListItem, ListItemText, MenuItem, Paper,
    Select as MuiSelect, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
      Typography } from '@mui/material';
import axios from 'axios';
import router from 'next/router';
import AdminLayout from '../components/AdminLayout';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useDispatch, useSelector } from 'react-redux';
import { FullPageComponentLoading } from '@/util/FullPageComponentLoading';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';


const animatedComponents = makeAnimated();

const Dashboard = () => {

  const dispatch = useDispatch()
  const getStAuth = useSelector((state:any) => state.stAuth)

  const [themeChangericon, setThemeChangerIcon] = useState(false);
  const [graphOrTextView, setgraphOrTextView] = useState(true);
  const [syncPopup, setSyncPopup] = useState(false);
  const [foldersPopup, setFoldersPopup] = useState(false);
  const [folders, setFolders] = useState<any>([]);
  const [accessToken, setAccessToken] = useState('');
  const [selectedListItem, setSelectedListItem] = useState(1);
  const [originalVault , setOriginalVault] = useState([])
  const [vaultFiles , setVaultFiles] = useState([])
  const [searched, setSearched] = useState<string>("");
  const [originalUsers , setOriginalUsers] = useState<any>([])
  const [searchedUsers , setSearchedUsers] = useState([])
  const [userSearchValue , setUserSearchValue] = useState([])
  const [showAddUser , setShowAddUser] = useState(false)
  const [formData, setFormData] = useState<any>({
    fullName: '',
    email: '',
    role: 'User',
    password: '',
    confirmPassword: '',
    status: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInviteFields, setShowInviteFields] = useState(true);
  const [showOptions, setShowOptions] = useState(-1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSetPassword , setShowSetPassword] = useState(false)
  const [showSetPasswordToggle , setShowSetPasswordToggle] = useState(false)
  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: '',
    confirmPassword:''
  });
  const [showConfirmPasswordToggle , setShowConfirmPasswordToggle] = useState(false)
  const [indexToChangePassword , setIndexToChangePassword] = useState<any>(null)
  const [updatePasswordLoader , setUpdatePasswordLoader] = useState<any>(false)
  const [showEditUserDialog , setShowEditUserDialog] = useState(false)
  const [editUserLoader , setEditUserLoader] = useState(false)
  const [currentUser , setCurrentUser] = useState('')
  const [currentUserImage , setCurrentUserImage] = useState('')
  const [proccedBtnLoading , setProceedBtnLoading] = useState(false)
  const [folderSelectedLoader , setFolderSelectedLoader] = useState(false)
  const [clickedFolder, setClickedFolder] = useState(null);
  const [taskCompleted, setTaskCompleted] = useState(false);
  // const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [showVaultFiles, setShowVaultFiles] = useState(false)
  const [originalVaultFilesToShow , setOriginalVaultFilesToShow] = useState<any>([])
  const [vaultFilesToShow , setVaultFilesToShow] = useState<any>([])
  const [selectedFolders, setSelectedFolders] = useState<any>([]);
  const [foldersSelectedNext , setFoldersSelectedNext] = useState<any>(false)    
  const [showFolderComparison , setShowFolderComparison] = useState(false)
  const [folderToCompare , setFoldersToCompare] = useState([])
  const [notMatchDropdown , setNotMatchDropdown] = useState([
    {
      name: 'Vault does not exist'
    }
  ])
  const [showVaultDelete , setShowVaultDelete] = useState(false)
  const [vaultToDelete , setVaultToDelete] = useState('')
  const [packageSearchValue , setPackageSearchValue] = useState([])
  const [stripePackages , setStripePackages] = useState<any>([])
  const [searchedStripePackages , setSearchedStripePackages] = useState([])
  const [showAddVaultPopup , setShowAddVaultPopup] = useState(false)
  const [packageToAddVault , setPackageToAddVault] = useState<any>({})
  const [allVaultsToSelect , setAllVaultsToSelect] = useState<any>([])
  const [defaultVaultsInPackage , setDefaultVaultInPackage] = useState([])
  const [selectedVaultsForPackage , setSelectedVaultsForPackage] = useState([])
  const [currentSync , setCurrentSync] = useState(false)
  const [showCurrentSync, setShowCurrentSync] = useState(false)
  const [totalFilesToSync , setTotalFilesToSync] = useState<any>(null)
  const [currentSyncedFiles , setCurrentSyncedFiles] = useState<any>(null)
  const [selectedVaultsForUser , setSelectedVaultsForUser] = useState([])
  const [defaultVaultsForUser , setDefaultVaultsForUser] = useState([])
  const [userToAddVault , setUserToAddVault] = useState<any>({})
  const [showAddVaultToUserPopup , setShowAddVaultToUserPopup] = useState(false)
  const fileInputRef = useRef<any>(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [getUser, setUser] = useState<any>({})
  const [getFullPageComponentLoading, setFullPageComponentLoading] = useState(true);

    // console.log('original vault' , originalVault)
    // console.log('vaultFiles' , vaultFiles)
    // console.log('originalusers' , originalUsers)
    // console.log('searchedUsers' , searchedUsers)
    // console.log('formData' , formData)
    // console.log('showoption' , showOptions)
    // console.log('newpasswordData' ,newPasswordData)
    // console.log('edituserdialog' , showEditUserDialog)
    // console.log('indexToChangePassword' , indexToChangePassword)
    // console.log('vaultfilestoshow' , vaultFilesToShow)
    // console.log('folders' , folders)
    // console.log('selectedfolders' , selectedFolders)
    // console.log('foldertocompare'  , folderToCompare)
    // console.log('vaulttodelete' , vaultToDelete)
    // console.log('folderselectedloader' , folderSelectedLoader)
    // console.log('searchedstripepackages' , searchedStripePackages)
    // console.log('showaddvaultpopup' , showAddVaultPopup)
    // console.log('pkg to add vault ' , packageToAddVault)
    // console.log('selectallvaults to ' , allVaultsToSelect)
    // console.log('defaultVault' , defaultVaultsInPackage)
    // console.log('selectedvaultsforpackage' , selectedVaultsForPackage)

  useEffect(() => {
    const getInit = () => {
      setUser(getStAuth.stAccessTokenVerify)
    }
    getInit()
    if(getUser.user) {
      if(getUser.user.role_id !==1){
        router.push('/');
      } 
      else {
        setFullPageComponentLoading(false)
      }
    }


  }, [getUser , getStAuth])


  async function fetchFilenames() {
    try {
      const response = await axios.get('/api/getFilenames'); // Replace with your API endpoint
      // console.log('response.data' , response.data)
      if (response.data) {
        // console.log('res.data' , response.data)
        const transformedData:any = Object.keys(response.data).map((vault_name) => ({
          vault_name,
          files: response.data[vault_name].filenames.map((item:any) => ({ filename: item.filename })),
          vault_price: response.data[vault_name].vault_price
        }));
        transformedData.sort((a:any, b:any) => a.vault_name.localeCompare(b.vault_name));
        // console.log('transformedData' , transformedData)
        const vaultNames = transformedData.map((item:any) => ({
          value: item.vault_name,
          label: item.vault_name,
        }));

        // console.log('vaultnames'  , vaultNames)

        setAllVaultsToSelect(vaultNames)
        setOriginalVault(transformedData);
        setVaultFiles(transformedData)
      }
    } catch (error) {
      console.error('Error fetching filenames:', error);
    }
  }

  async function fetchUsers() {
    try {
      const response = await axios.get('/api/getUsers'); // Replace with your API endpoint
      // console.log('response.data' , response.data)
      if (response.data && response.data.allUsers) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const fullName = response.data.allUsers.find((u:any) => u.email === user.email)?.full_name;
          const image = response.data.allUsers.find((u:any) => u.email === user.email)?.image;
          setCurrentUser(fullName)
          setCurrentUserImage(image)
        }
        setOriginalUsers(response.data.allUsers);
        setSearchedUsers(response.data.allUsers)
      }
    } catch (error) {
      console.error('Error fetching filenames:', error);
    }

  }

  useEffect(()=> {
    const { usermanagement } = router.query;
    if (usermanagement === "usermanagement") {
      setSelectedListItem(2);
    }

    

    fetchFilenames();
    fetchUsers();
  }, [])


  useEffect(() => {
    // Check if the URL contains the 'code' parameter
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");
    window.history.replaceState({}, document.title, window.location.pathname);
    // console.log(document.title,window.location.pathname)


    if (authorizationCode) {
      // Authorization code is present in the URL, send it to your backend
      console.log('authorizationCode', authorizationCode)
      axios.post("/api/exchangeCodeForToken", { code: authorizationCode })
        .then((res:any) => {
          // Handle the response from the backend, which may contain the access token
          const accessToken = res.data.accessToken;
          console.log('accessToken ', accessToken)
          // axios
          // .get("https://people.googleapis.com/v1/people/me", {
          //   headers: {
          //     Authorization: `Bearer ${accessToken}`,
          //   },
          //   params: {
          //     personFields: 'emailAddresses',
          //   },
          // })
          // .then((userRes) => {
          //   const primaryEmail = userRes.data.emailAddresses.find(
          //     (email:any) => email.metadata.primary
          //   );
          //   if (primaryEmail) {
          //     setUserEmail(primaryEmail.value);
          //   }
          // })
          // .catch((userErr) => {
          //   console.error("Error fetching user email:", userErr.response);
          // })
          setAccessToken(accessToken);
        
          // Now you can use the accessToken to make authenticated requests to Google Drive API.
        })
        .catch((err:any) => {
          console.error("Error exchanging authorization code:", err.response);
        });
    } 
  }, []);

  useEffect(() => {
    // Check if accessToken is available
    if (accessToken) {
      console.log('now in google drive api')
      // Use the accessToken to make authenticated requests to Google Drive API
      axios.get("https://www.googleapis.com/drive/v3/files", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: "mimeType='application/vnd.google-apps.folder' and not trashed",
        },
        })
        .then((res:any) => {
          // Handle the list of files from the Google Drive API response
          console.log('Folders:', res.data.files);
          setFolders(res.data.files);
          setFoldersPopup(true)
          

        })
        .catch((err:any) => {
          console.error("Error fetching files from Google Drive:", err.response);
        });
    }
  }, [accessToken]);



  const handleSiteNameClick = () => {
      // setSearchValue("");
      // setGraphSearchValue("")
      // setSearchResults([]);
      // setOpenedResults([]);
      // setShouldShowFilters(true);
  };


  function handleThemeChangerClick() {
    // console.log("themeChangerIcon: ", themeChangericon);
    setThemeChangerIcon(!themeChangericon);
    const sideNav:any = document.querySelector(`.${"side-nav"}`);
    // const mainPanel = document.querySelector(`.${"main"}`);
    const workspacePanel:any = document.querySelector(`.${"workspace-content"}`);
    
    sideNav.classList.toggle("night-mode");
    // mainPanel.classList.toggle("night-mode");
  
    // sideNav.classList.toggle("night-mode");
    workspacePanel.classList.toggle("night-mode");

    // if(themeChangericon){
    //   setTextColorForNode('white')
    // } else {
    //   setTextColorForNode('black')
    // }
  }


  const handleGraphOrTextView = () => {
    // setgraphOrTextView(!graphOrTextView);
  };


  const handleLogout = () => {
    Helpers.logout()
    router.push('/login')
  }


  // const openSyncDialog = () => {
  //   setSyncPopup(true)
  // }


  const handleCloseDialog = () => {
    setSyncPopup(false);
    setProceedBtnLoading(false)
    
  };


  const synchronizeFiles = async () => {
    setProceedBtnLoading(true)
    axios.get("/api/googleDriveFiles")
      .then((res:any) => {
        if (res.data && res.data.authUrl) {
          // Redirect the user to the Google OAuth authorization page
          window.location.href = res.data.authUrl;
        } else {
          console.error("No 'authUrl' found in the response.");
          setProceedBtnLoading(false)
        }

        // setBtnLoading(false);
        // Helpers.setAccessToken(res.data.token)
        // Helpers.setUser(res.data.user)
        // router.push("/?dashboard");
      })
      .catch((err:any) => {
        console.log("err=", err.response);
      })
  }


  const handlerFolderPopupClose = async () => {
    setFoldersPopup(false)
    setShowFolderComparison(false)
    setSelectedFolders([])
  }


  const handleFolderSelection = (selectedFolder:any) => {
    
    const updatedFolders:any = folders.map((folder:any) =>
      folder.id === selectedFolder.id
        ? { ...folder, checked: !folder.checked }
        : folder
    );
    setFolders(updatedFolders);

    const selected = updatedFolders.filter((folder:any) => folder.checked);
    // console.log('selected' , selected)

    const updatedSelected:any = selected.map((selectedItem:any) => {
      const matchingVault:any = originalVault.find(
        (vault:any) => vault.vault_name === selectedItem.name
      );

      // console.log('matchingvault' , matchingVault)
    
      if (matchingVault) {
        return {
          ...selectedItem,
          option: matchingVault.vault_name,
        };
      }
    
      return selectedItem;
    });

    // console.log('folders in database' , originalVault)
    const selectedNames = selected.map((item:any) => item.name);
    // console.log('selectedNames', selectedNames);
    const filteredVault = originalVault.filter((vault:any) =>
    selectedNames.some((selectedName:any) =>
      vault.vault_name === selectedName
    )
  );
  
    // console.log('filteredVault' , filteredVault);


    setFoldersToCompare(filteredVault)
    setSelectedFolders(updatedSelected);
  };


  const handleFoldersNext = () => {
    setFoldersPopup(false)
    setShowFolderComparison(true)

  };


  const requestSearch = (event:any) => {
    // console.log(event.target.value)
    setSearched(event.target.value)
    const searchedVal = event.target.value
    const filteredRows = originalVault.filter((row:any) => {
      return row.vault_name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    filteredRows.sort((a:any, b:any) => a.vault_name.localeCompare(b.vault_name));
    setVaultFiles(filteredRows);
  };


  const requestUserSearch = (event:any) => {
    // console.log(event.target.value)
    setUserSearchValue(event.target.value)
    const searchedVal = event.target.value
    const filteredRows = originalUsers.filter((row:any) => {
      return row.full_name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setSearchedUsers(filteredRows);
  };


  const showAddUserPopup = () => {
    setShowAddUser(true)
  }


  const closeAddUserDialog = () => {
    setShowAddUser(false)
    setFormData({
      fullName: '',
      email: '',
      role: 'User',
      password: '',
      confirmPassword: '',
      status: ''
    });
    setShowPassword(false)
  }


  const handleChange = (e:any) => {
    const { name, value } = e.target;
    console.log('name' , name)
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleAddUser = async () => {
    const requiredFields = [ 'email','fullName', 'password', 'confirmPassword'];
    let emptyField:any = requiredFields.find((field:any) => !formData[field]);

    if (emptyField) {
      emptyField = emptyField.charAt(0).toUpperCase() + emptyField.slice(1).toLowerCase();
      toast.error(`${emptyField} is required!`, { autoClose: 2000 });
      return;
    } else {
      if(formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match!', { autoClose: 2000 });
        return;
      } else {
        setIsLoading(true);
        await axios.post('/api/addUser', formData)
        .then(async (res:any)=>{
          console.log('user add response' , res.data);
          setOriginalUsers(res.data.allUsers);
          setSearchedUsers(res.data.allUsers)
          closeAddUserDialog()
          setIsLoading(false);
          toast.success('User added successfully!');


        })
        .catch((error:any)=>{
          console.log('Error calling addUser api:', error);
          setIsLoading(false);
          toast.error('Failed to add user');
        })
      }

    }
  }


  const toggleInviteFields = () => {
    setShowInviteFields(!showInviteFields);
  };


  const handleInviteUser = async () => {
    const requiredFields = [ 'email'];
    let emptyField:any = requiredFields.find((field:any) => !formData[field]);
    if (emptyField) {
      emptyField = emptyField.charAt(0).toUpperCase() + emptyField.slice(1).toLowerCase();
      toast.error(`${emptyField} is required!`, { autoClose: 2000 });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        toast.error('Invalid email!', { autoClose: 1500 });
        return;
    }

    setIsLoading(true)
    await axios.post('/api/inviteUser' , formData)
    .then(async (res:any)=>{
      setOriginalUsers(res.data.allUsers);
      setSearchedUsers(res.data.allUsers)
      setShowAddUser(false)
      setIsLoading(false)
      toast.success(res.data.message);
      setFormData({
        fullName: '',
        email: '',
        role: 'User',
        password: '',
        confirmPassword: '',
        status: ''
      });
    })
    .catch((error:any)=>{
      setIsLoading(false)
      console.log('error' , error)
      toast.error('Failed to invite user');
    }) 
  }


  const handleEllipsisClick = (index:any) => {    
    // console.log('ellispes click' , index)    
    setShowOptions(index === showOptions ? -1 : index);
  };


  const handleEditClick = (index:any) => {
    const userToEdit:any = originalUsers[index]
    // console.log('usertoedit' , userToEdit)
    setIndexToChangePassword(index)
    // console.log('usertoedit' , userToEdit)
    setFormData((prevData:any) => ({
      ...prevData,
      role: userToEdit.role_id === 1 ? "Admin" : userToEdit.role_id === 2 ? "User" : "",
      email: userToEdit.email,
      fullName: userToEdit.full_name,
      status: userToEdit.status,
      image: userToEdit.image

    }));
    setShowEditUserDialog(true)

  };


  const handleEditUser = async () => {
    setEditUserLoader(true)
    // console.log('emailtoudpatedata' , originalUsers[indexToChangePassword].email)
    // console.log('formData' , formData)
    // setUpdatePasswordLoader(true)
    const storedUserJson:any = localStorage.getItem("user");
    const storedUser = JSON.parse(storedUserJson)

    console.log('storeduser' , storedUser.role)
    await axios.post('/api/editUser', {
      email: originalUsers[indexToChangePassword].email,
      currentUser: storedUser.role,
      data: formData
    })
    .then(async (res:any)=>{
      // console.log('user updated successfully' , res.data);
      // await fetchUsers()
      setOriginalUsers(res.data.allUsers);
      setSearchedUsers(res.data.allUsers)
      // closeAddUserDialog()
      await fetchUsers()
      setShowEditUserDialog(false)
      setEditUserLoader(false)
      toast.success('User updated successfully!');
      setFormData({
        fullName: '',
        email: '',
        role: 'User',
        password: '',
        confirmPassword: '',
        status: '',
        image: ''
      });
    })
    .catch((error:any)=>{
      console.log('Error calling editUser api:', error);
      setEditUserLoader(false)
      // setIsLoading(false);
      toast.error('Failed to updated user data');
    })
  }


  const closeEditUserDailog = () => {
    setShowEditUserDialog(false)
    setFormData({
      fullName: '',
      email: '',
      role: 'User',
      password: '',
      confirmPassword: '',
      status: ''
    });
  }


  const handleSetPasswordClick = (index:any) => {
    setShowSetPassword(true)
    setIndexToChangePassword(index)
  };


  const handleDeleteClick = async (index:any) => {
    setIsDeleting(true);
    const userEmailToDelete:any = originalUsers[index].email;
    axios.delete(`/api/deleteUser?email=${userEmailToDelete}`)
      .then(async (response:any) => {
        console.log('response after deleting ' , response)
        // await fetchUsers()
        setOriginalUsers(response.data.allUsers);
        setSearchedUsers(response.data.allUsers)
        setIsDeleting(false);
        handleEllipsisClick(index+1)
        toast.success('User deleted successfully', { autoClose: 1500 });

        // console.log('User deleted successfully:', response.data);
      })
      .catch((error:any) => {
        // Handle any errors that occur during the API request
        console.error('Error deleting user:', error);
        setIsDeleting(false);
        handleEllipsisClick(index+1)
        toast.error('Failed to delete user', { autoClose: 1500 });
      });

  };


  const closeSetPasswordDialog = () => {
    setShowSetPassword(false)
    setNewPasswordData({
      newPassword: '',
      confirmPassword:''
    });
    setShowSetPasswordToggle(false)
    setShowConfirmPasswordToggle(false)

  }


  const handleSetPassword = async () => {
    const emailToUpdatePassword:any = originalUsers[indexToChangePassword].email;
    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      toast.error('Passwords do not match!', { autoClose: 2000 });
      return;
    } else {
      setUpdatePasswordLoader(true)
      await axios.post('/api/updatePassword', {
        email: emailToUpdatePassword,
        password: newPasswordData.newPassword
      })
      .then((res:any)=>{
        console.log('set password successfully' , res.data);
        // closeAddUserDialog()
        setShowSetPassword(false)
        setUpdatePasswordLoader(false)
        toast.success('Password updated successfully!');
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


  const handleSetNewPasswordToggle = (e:any) =>{
    const { name, value } = e.target;
    setNewPasswordData({
      ...newPasswordData,
      [name]: value,
    });
  }


  const handleVaultRowClick = (vault:any) => {
    setShowVaultFiles(true)
    console.log(vault)
    setVaultFilesToShow(vault)
    setOriginalVaultFilesToShow(vault)
  }
  
  const vaultFileSearch = (event:any ) => {
    //  console.log(event.target.value)
      setSearched(event.target.value)
      const searchedVal = event.target.value
      const filteredRows = originalVaultFilesToShow.files.filter((row:any) => {
        return row.filename.toLowerCase().includes(searchedVal.toLowerCase());
      });

      console.log('filteredrows' , filteredRows)

      setVaultFilesToShow({ ...originalVaultFilesToShow, files: filteredRows });

  }


  const handleDataSync = ()=> {
    console.log('now in handleDataSync')
    setTaskCompleted(true)
    // console.log('selectedfolders now' , selectedFolders)
    const updatedSelectedFolders = selectedFolders.map((folder:any) => {
      if (!folder.option || folder.option === 'Create new vault') {
        return { ...folder, option: 'Create new vault' };
      }
      return folder;
    });

    // setShowFolderComparison(true)

    setFolderSelectedLoader(true)
    setCurrentSync(true)
    setShowCurrentSync(true)

    axios.get("api/downloadFiles", {
            headers: { Authorization: `Bearer ${accessToken}`,},
            params: { folderId: updatedSelectedFolders, },
          })
          .then(async(res:any)=>{
              const reqData = res.data.data
              setTotalFilesToSync(res.data.message)
              // toast("Syncronizing vaults in background. Please check the vaults in a few minutes.", {
              //   position: "top-right",
              //   autoClose: 1500,
              //   hideProgressBar: false,
              //   closeOnClick: true,
              //   pauseOnHover: true,
              //   draggable: true,
              //   type: "success",
              //   progress: undefined,
              //   theme: "light",
              // });
              
              const chunkSize = 100;
              var currentlySyncronizingFiles = 0
              

              for (let i = 0; i < reqData.length; i++) {
                const downloadedFiles = reqData[i].downloadedFiles;
              
                // Split downloadedFiles into chunks
                for (let j = 0; j < downloadedFiles.length; j += chunkSize) {
                  const chunk = downloadedFiles.slice(j, j + chunkSize);

                  currentlySyncronizingFiles = currentlySyncronizingFiles + chunk.length

                  setCurrentSyncedFiles(currentlySyncronizingFiles)
              
                  const requestData = {
                    name: reqData[i].name,
                    option: reqData[i].option,
                    downloadedFiles: chunk,
                  };
                  

                  await axios.post('api/downFilesCheck', requestData,{
                    headers: {
                      Authorization: `Bearer ${accessToken}`
                    }
                  })
                  .then((res:any)=>{
                    // console.log('res' , res.data)
                    
                    // setTaskCompleted(false);
                    // setShowFolderComparison(false)
                    
                    // setFolderSelectedLoader(true)


                  }).catch((err:any)=>{
                    console.log('err' , err)
                    // setTaskCompleted(false);
                  })
              
                }

              }
              fetchFilenames()
              // setTaskCompleted(false)
              // setFolderSelectedLoader(true)
              // setSelectedFolders([])
              setTaskCompleted(false)
              setShowCurrentSync(false)


          }).catch((err:any)=>{
              console.log('err' , err)
          })
        


  }


  const handleDeleteVault = (vault:any) => {
    setVaultToDelete(vault.vault_name)

    setShowVaultDelete(true)
    // console.log('vault' , vault)
  }


  const deleteVault = () => {
    setProceedBtnLoading(true);
  
    axios.delete(`/api/deleteVault?vaultName=${vaultToDelete}`)
      .then(async (response:any) => {
        await fetchFilenames()
        toast.success('Vault deleted successfully', { autoClose: 1500 });
        setShowVaultDelete(false)
        setProceedBtnLoading(false);
        console.log("Vault deleted successfully");
      })
      .catch((error:any) => {
        setProceedBtnLoading(false);
        console.log("Error deleting vault:", error.response.data.error.detail);
        if (error.response.data.error.detail && error.response.data.error.detail.includes("referenced from table \"vaultPackages\"")) {
          toast.error('Vault is used in a package. Remove it from the package then try again', { autoClose: 1500 });
        }
        // toast.error('Failed to delete vault', { autoClose: 1500 });
      })
  };


  const requestPackageSearch = (event:any) => {
    // console.log(event.target.value)
    setPackageSearchValue(event.target.value)
    const searchedVal = event.target.value
    const filteredRows = stripePackages.filter((row:any) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setSearchedStripePackages(filteredRows);
  };


  const handleDashboardNavigation = (item:any) => {
    setSelectedListItem(item)
    const storedUser = localStorage.getItem("user");
    let user
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      user = userData.email
    }

    // console.log(user)

    const requestData:any = {
      user: user,
    };
    axios.post(`/api/getProducts` , requestData)
    .then((res:any)=> {
      // console.log('res' , res)
      setStripePackages(res.data.stripeProducts)
      setSearchedStripePackages(res.data.stripeProducts)
      // console.log('getProducts response' , res.data.stripeProducts)
    })
    .catch((err:any)=> {

    })


  }


  const convertUnixTimestampToDateTime = (timestamp:any) => {
    // Convert the timestamp to milliseconds
    const timestampInMilliseconds = timestamp * 1000;
  
    // Create a Date object
    const date = new Date(timestampInMilliseconds);
  
    // Format the date and time as needed
    const formattedDate = date.toLocaleString(); // Adjust the formatting as needed
  
    return formattedDate;
  };


  const getCurrencySign = (currency:any) => {
    switch (currency) {
      case 'usd':
        return '$';
      case 'eur':
        return '€';
      // Add more currency cases as needed
      default:
        return currency; // Return the currency name if not found
    }
  }


  const handleShowVaultAddPopup = async (row:any) => {
    // console.log('row' , row)
    // console.log('allvaultstoselect' , allVaultsToSelect)
    const currentVaults = row.features.map((feature:any) => feature.name);
    const defaultValues = allVaultsToSelect.filter((option:any) => currentVaults.includes(option.value));
    // console.log('defaultValues' , defaultValues)
    setSelectedVaultsForPackage(defaultValues)
    setDefaultVaultInPackage(defaultValues)
    setPackageToAddVault(row)
    setShowAddVaultPopup(true)

  }


  const closeAddVaultPopup = async () => {
    setShowAddVaultPopup(false)
    setSelectedVaultsForPackage([]);
  }


  const handleVaultsAddToPackage = async () => {
    setEditUserLoader(true)
    const selectedVaultsValues = selectedVaultsForPackage.map((item:any) => ({ value: item.value }));
    const dataToSend = {
      packageId: packageToAddVault.id,
      selectedVaults: selectedVaultsValues
    };

    axios.post('/api/packageVaultUpdate', dataToSend)
    .then((res:any)=>{
      // console.log('res from package vaults udpate' , res.data)
      const storedUser = localStorage.getItem("user");
      let user
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        user = userData.email
      }

      // console.log(user)

      const requestData:any = {
        user: user,
      };

      console.log(user)
      axios.post(`/api/getProducts` , requestData)
      .then((res:any)=> {
        setStripePackages(res.data.stripeProducts)
        setSearchedStripePackages(res.data.stripeProducts)
      })
      .catch((err:any)=> {})

      setEditUserLoader(false)
      setShowAddVaultPopup(false)

    }).catch((err)=>{
      console.log('error from package vaults udpate' , err)
      setEditUserLoader(false)

    })
  }


  const handleShowUserVaultAddPopup = async (row:any) => {
    console.log(row)
    console.log('allvaultstoselect' , allVaultsToSelect)
    const currentVaults = row.vaults.map((vlt:any) => vlt);
    const defaultValues = allVaultsToSelect.filter((option:any) => currentVaults.includes(option.value));

    // console.log('defaultValues' , defaultValues)

    setSelectedVaultsForUser(defaultValues)
    setDefaultVaultsForUser(defaultValues)
    setUserToAddVault(row)
    setShowAddVaultToUserPopup(true)

  }


  const closeAddVaultToUserPopup = async () => {
    setShowAddVaultToUserPopup(false)
    setSelectedVaultsForUser([]);
  }


  const handleVaultsAddToUser = async () => {
    setEditUserLoader(true)
    const selectedVaultsValues = selectedVaultsForUser.map((item:any) => ({ value: item.value }));

    const dataToSend = {
      userId: userToAddVault.id,
      selectedVaults: selectedVaultsValues
    };

    console.log('datatosend' , dataToSend)

    axios.post('/api/userVaultUpdate', dataToSend)
    .then((res:any)=>{

      axios.get(`/api/getUsers`)
      .then((res:any)=> {
        setOriginalUsers(res.data.allUsers);
        setSearchedUsers(res.data.allUsers)
        setEditUserLoader(false)
        setShowAddVaultToUserPopup(false)
      })
      .catch((err:any)=> {})

      

    }).catch((err)=>{
      console.log('error from package vaults udpate' , err)
      setEditUserLoader(false)

    })
  }

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

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
            setImagePreviews(previews);
            }
        };

        reader.readAsDataURL(selectedProfilePicture);
  };
  

  const handleEditProfilePicture = () => {
    setFormData((prevFormData:any) => ({
      ...prevFormData,
      image: '',
    }));
  }
    

  return (
    <LayoutWrapper layout={AdminLayout}>
      {getFullPageComponentLoading ? (
        <>
          <FullPageComponentLoading></FullPageComponentLoading>
        </>
      ):(
        <div>
          <div className="side-nav side-nav-dashboard night-mode">
            <div className={"logoVc"}>
              <div className="site-name" onClick={handleSiteNameClick}>
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

                {syncPopup && (<div>
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
                        {proccedBtnLoading ? (
                          <>
                            <span className="processing-text">Please Wait</span>
                            <span className="spinner-grow spinner-grow-sm ml-2" role="status" aria-hidden="true"></span>
                          </>
                        ):(
                          <>Proceed</>
                        )}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>)}

                {foldersPopup && (
                  <Dialog open={foldersPopup} // onClose={handlerFolderPopupClose}
                  >
                    <DialogTitle>
                      {taskCompleted ? 'Data Sync' : 'Select folder to sync data'}
                    </DialogTitle>
                    <DialogContent sx={{paddingLeft: '6px'}}>
                      <List>
                        {folders.map((folder:any) => (
                          <ListItem button key={folder.id} sx={{ paddingLeft: '0px'}}>
                            <Checkbox
                              checked={folder.checked}
                              onChange={() => handleFolderSelection(folder)}
                            />
                            <img src='folder.svg' alt='folder logo' style={{ width: '15px', marginRight: '6px' , marginLeft: '15px' }} />
                            {folder.name}
                          </ListItem>
                        ))}
                      </List>
                    </DialogContent>

                    <DialogActions>
                      <Button onClick={handlerFolderPopupClose} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={handleFoldersNext} color="primary" variant="contained"
                        disabled={!folders.some((folder:any) => folder.checked)}>
                        Next
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}

                {showFolderComparison && (
                  <Dialog open={showFolderComparison} onClose={handlerFolderPopupClose}>

                    <DialogTitle>Selected folders</DialogTitle>

                    <DialogContent sx={{paddingLeft: '6px'}}>
                      <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1, marginRight: '10px', paddingLeft: '0px' }}>
                          <List>
                            {selectedFolders.map((folder:any , index:any) => (
                              <div key={folder.id} style={{display: 'flex' , alignItems: 'center'}}>
                                <ListItem >
                                  <img src='folder.svg' alt='folder logo' style={{ width: '15px', marginRight: '6px', marginTop: '5px' }} />
                                  {folder.name}
                                </ListItem>
                                <ListItem key={folder.id + 1}>
                                {folderToCompare.some((compareFolder:any) =>
                                compareFolder.vault_name === folder.name) ? (
                                  <>
                                    <img src='vault.svg' alt='folder logo' style={{ width: '15px' , marginRight: '5px' }} />
                                    <select id={`vaultSelect`} value={folder.option}
                                      disabled={folderSelectedLoader} 
                                      defaultValue={folder.name}
                                      onChange={(e:any) => {
                                        console.log('e' , e.target)
                                        setSelectedFolders((prevSelectedFolders:any) => {
                                          return prevSelectedFolders.map((prevFolder:any, i:any) => {
                                            console.log('prevfolder' , prevFolder , i , index)
                                            if (i === index) {
                                              return {
                                                ...prevFolder,
                                                option: e.target.value,
                                              };
                                            }
                                            return prevFolder;
                                          });
                                        });
                                      }}>
                                      {originalVault.map((vault:any) => (
                                          <option key={vault.vault_name} value={vault.vault_name}>
                                              {`Overwrite ${vault.vault_name}`}
                                          </option>
                                      ))}
                                      
                                    </select>
                                  </>
                                ) : (
                                  <>
                                    <img src='vault.svg' alt='folder logo' style={{ width: '15px' , marginRight: '5px' }} />
                                    <select id="vaultSelect"
                                      disabled={folderSelectedLoader} 
                                      onChange={(e:any) => {
                                        console.log('e change' , e.target)
                                        setSelectedFolders((prevSelectedFolders:any) => {
                                          return prevSelectedFolders.map((prevFolder:any, i:any) => {
                                            if (i === index) {
                                              return {
                                                ...prevFolder,
                                                option: e.target.value,
                                              };
                                            }
                                            return prevFolder;
                                          });
                                        });
                                      }}>
                                      <option value="Create new vault" selected>Create new vault</option>
                                      {originalVault.map((vault:any) => (
                                          <option key={vault.vault_name} value={vault.vault_name}>
                                              {`Overwrite ${vault.vault_name}`}
                                          </option>
                                      ))}
                                    </select>
                                  </>
                                )}
                                </ListItem>
                                </div>
                            ))}
                          </List>
                        </div>
                      </div>
                      {currentSync && (
                        <div>
                          {showCurrentSync && (
                            <>
                              <ListItem>We are synchronizing your files. Dont close the popup.</ListItem>
                            </>
                          )}

                          <ListItem>
                            {totalFilesToSync === null ? (
                              <>
                                <span className="processing-text">Processing</span>
                                <span
                                  className="spinner-grow spinner-grow-sm ml-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </>
                            ) : (
                              <>
                                {taskCompleted ? (
                                  <>
                                    <span className="processing-text">
                                      Processing {currentSyncedFiles} / {totalFilesToSync} files
                                    </span>
                                    <span
                                      className="spinner-grow spinner-grow-sm ml-2"
                                      role="status"
                                      aria-hidden="true">
                                    </span>
                                  </>
                                ):(
                                  <>
                                    <span>
                                      Syncronized {currentSyncedFiles} / {totalFilesToSync} files
                                    </span>
                                  </>
                                )

                                }
                                
                              </>
                            )}
                          </ListItem>

                        </div>
                      )}
                    </DialogContent>

                    <DialogActions>
                      {folderSelectedLoader ? (
                        <>
                          {/* <Button onClick={() => {
                            setShowFolderComparison(false)
                            setSelectedFolders([])}} color="primary">
                            Done
                          </Button> */}
                          {/* <Button onClick={() => {
                            setShowFolderComparison(false)
                            setFoldersPopup(true)}} color="primary">
                            Back
                          </Button> */}
                          {taskCompleted ? (
                            <>
                              <Button color="primary" variant="contained" disabled>
                                Sync
                                {/* <span
                                className="spinner-grow spinner-grow-sm ml-2"
                                role="status"
                                aria-hidden="true"
                                ></span> */}
                              </Button> 
                            </>
                          ) : (
                            <>
                              <Button onClick={handlerFolderPopupClose} color="primary" variant="contained">
                              Done
                              </Button>
                            </>
                          )}
                        </>):(
                        <>
                          <Button onClick={() => {
                            setShowFolderComparison(false)
                            setFoldersPopup(true)}} color="primary">
                            Back
                          </Button>
                          {taskCompleted ? (
                            <>
                              <Button color="primary" variant="contained">
                                Syncronizing
                                <span
                                className="spinner-grow spinner-grow-sm ml-2"
                                role="status"
                                aria-hidden="true"
                                ></span>
                              </Button> 
                            </>
                          ) : (
                            <>
                              <Button onClick={handleDataSync} color="primary" variant="contained">
                              Sync
                              </Button>
                            </>
                          )}
                        </>
                      )}
                      
                      
                    </DialogActions>

                  </Dialog>
                  
                )}

                {showAddUser ? (
                  <div>
                    <Dialog open={showAddUser} onClose={closeAddUserDialog} sx={{ width: 550 , margin: 'auto' }} >
                      <DialogTitle>Add User</DialogTitle>
                      <DialogContent>
                        <DialogContentText>Please enter the user details:</DialogContentText>
                        <Grid container spacing={2} sx={{paddingTop:1}}>
                          <Grid item xs={12}>
                            <FormControl fullWidth>
                              <InputLabel sx={{ background: '#fff' , paddingLeft: 1 , paddingRight: 1 }}>Role</InputLabel>
                              <MuiSelect
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                size='small'
                              >
                                <MenuItem value="User">User</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                              </MuiSelect>
                            </FormControl>
                            <TextField
                              label="Email"
                              type='email'
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              fullWidth
                              margin="normal"
                              size='small'
                              required
                            />
                            <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'space-between'}}>
                              <Typography variant="body1">
                                Invite User by Sending Email Notification
                              </Typography>
                              <Switch
                                checked={showInviteFields}
                                onChange={toggleInviteFields}
                                color="primary"
                              />
                            </div>
                            {showInviteFields ? (<></>):(
                              <>
                                <TextField
                                  label="Full Name"
                                  name="fullName"
                                  value={formData.fullName}
                                  onChange={handleChange}
                                  fullWidth
                                  margin="normal"
                                  size='small'
                                  required/>
                                <TextField
                                  type={showPassword ? 'text' : 'password'}
                                  label="Password"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  fullWidth
                                  margin="normal"
                                  size='small'
                                  required
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() => setShowPassword(!showPassword)}
                                          edge="end"
                                        >
                                          {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                                <TextField
                                  type={showPassword ? 'text' : 'password'}
                                  label="Confirm password"
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleChange}
                                  fullWidth
                                  margin="normal"
                                  size='small'
                                  required
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() => setShowPassword(!showPassword)}
                                          edge="end"
                                        >
                                          {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </>
                            )}
                          </Grid> 
                        </Grid>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={closeAddUserDialog} color="primary">
                          Cancel
                        </Button>
                        {showInviteFields ? (
                          <>
                            <Button color='primary' onClick={handleInviteUser} disabled={isLoading}>
                              {isLoading ? 'Sending Invite...' : 'Send Invite'}
                            </Button>
                          </>): (
                          <>
                            <Button color="primary" onClick={handleAddUser} disabled={isLoading}>
                              {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                          </>
                        )}
                      
                      </DialogActions>
                    </Dialog>
                  </div>
                ):(
                  <>
                  </>
                )}

                {showSetPassword ? (<>
                  <Dialog open={showSetPassword} onClose={closeSetPasswordDialog}>
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
                    </Dialog></>): (<></>
                )}

                {showEditUserDialog && (
                  <>
                    <Dialog open={showEditUserDialog} onClose={closeEditUserDailog} sx={{ width: 550 , margin: 'auto' }} >
                      <DialogTitle>Edit User</DialogTitle>
                      <DialogContent>
                        <DialogContentText>Please enter the user details:</DialogContentText>
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
                                    alt="Profile"
                                  />
                                )}
                              </div>

                              <div className="edit-profile-button-div">
                                <button onClick={handleChooseFile} >
                                  Change picture
                                </button>
                                <button onClick={handleEditProfilePicture} >
                                  Remove
                                </button>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  style={{ display: 'none' }}
                                  onChange={handleFileChange}
                                />
                              </div>
                            </div>



                            <FormControl fullWidth>
                              <InputLabel sx={{ background: '#fff' , paddingLeft: 1 , paddingRight: 1 }}>Role</InputLabel>
                              <MuiSelect
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                size='small'
                              >
                                <MenuItem value="User">User</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                              </MuiSelect>
                            </FormControl>
                            <TextField
                              label="Email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              fullWidth
                              margin="normal"
                              size='small'
                            />
                            <TextField
                              label="Full Name"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                              fullWidth
                              margin="normal"
                              size='small'
                            />
                            <Grid item xs={12} sx={{paddingTop:2}}>
                              <FormControl fullWidth>
                                <InputLabel sx={{ background: '#fff' , paddingLeft: 1 , paddingRight: 1 }}>Status</InputLabel>
                                <MuiSelect name="status" value={formData.status} onChange={handleChange} size='small'>
                                  <MenuItem value="Active">Active</MenuItem>
                                  <MenuItem value="Inactive">Inactive</MenuItem>
                                </MuiSelect>
                              </FormControl>
                            </Grid>

                          </Grid> 
                        </Grid>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={closeEditUserDailog} color="primary">Cancel</Button>
                        <Button color="primary" onClick={handleEditUser} disabled={editUserLoader}>
                          {editUserLoader ? 'Saving...' : 'Save'}
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}

                {showVaultDelete && (
                  <Dialog open={showVaultDelete} onClose={() => setShowVaultDelete(false)}>
                    <DialogTitle>Delete Vault</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Are you sure you want to delete
                        <strong style={{ fontWeight: 'bold' }}> {vaultToDelete}</strong> ?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setShowVaultDelete(false)} color="primary">Cancel</Button>
                      <Button onClick={deleteVault} color="primary">
                        {proccedBtnLoading ? (
                            <>
                              Deleting {" "}
                              <span className="spinner-grow spinner-grow-sm ml-2" role="status" aria-hidden="true"></span>
                            </>
                          ) : (
                            <>Delete</>
                          )}
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}

                {showAddVaultPopup && (
                  <>
                    <Dialog open={showAddVaultPopup} onClose={closeAddVaultPopup} >
                      <Paper sx={{ width: 500 }}>                    
                        <DialogTitle>{packageToAddVault.name}</DialogTitle>
                        <DialogContent sx={{ height: 300}}>
                          <DialogContentText>
                            Select vaults to add to this package:
                          </DialogContentText>
                          <Grid sx={{marginTop: '10px' }}>
                            <Select
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              defaultValue={defaultVaultsInPackage}
                              isMulti
                              options={allVaultsToSelect}
                              onChange={(selectedOptions:any) => {
                                setSelectedVaultsForPackage(selectedOptions);
                              }}
                            />  
                          </Grid>
                        
                        </DialogContent>

                        <DialogActions>
                          <Button onClick={closeAddVaultPopup} color="primary">
                            Cancel
                          </Button>
                          <Button color="primary" onClick={handleVaultsAddToPackage} disabled={editUserLoader}>
                            {editUserLoader ? 'Saving...' : 'Save'}
                          </Button>
                        </DialogActions>
                      </Paper>
                    </Dialog>
                  </>
                )}

                {showAddVaultToUserPopup && (
                  <>
                    <Dialog open={showAddVaultToUserPopup} onClose={closeAddVaultToUserPopup} >
                      <Paper sx={{ width: 500 }}>                    
                        <DialogTitle>{userToAddVault.full_name}</DialogTitle>
                        <DialogContent sx={{ height: 300}}>
                          <DialogContentText>
                            Select vaults to give access to this user:
                          </DialogContentText>

                          <Grid sx={{marginTop: '10px' }}>
                            <Select
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              defaultValue={defaultVaultsForUser}
                              isMulti
                              options={allVaultsToSelect}
                              onChange={(selectedOptions:any) => {
                                setSelectedVaultsForUser(selectedOptions);
                              }}
                            />  
                          </Grid>
                        </DialogContent>

                        <DialogActions>
                          <Button onClick={closeAddVaultToUserPopup} color="primary">
                            Cancel
                          </Button>
                          <Button color="primary" onClick={handleVaultsAddToUser} disabled={editUserLoader}>
                            {editUserLoader ? 'Saving...' : 'Save'}
                          </Button>
                        </DialogActions>
                      </Paper>
                    </Dialog>
                  </>
                )}

              </div>
            </div>

            <div className='dashboard-navigation'>
              <List>
                <Link href="/">
                  <ListItem className={`dashboard-navigation-list ${selectedListItem === 0 ? 'selected-dashboard-navigation-list' : ''}`}
                    onClick={() => setSelectedListItem(0)}>
                      <img src='home.png' alt="Home" style={{ marginRight: '10px' }} />
                      <ListItemText primary="Home" />
                  </ListItem>
                </Link>

                <ListItem className={`dashboard-navigation-list ${selectedListItem === 1 ? 'selected-dashboard-navigation-list' : ''}`}
                  onClick={() => setSelectedListItem(1)}>
                    <img src='vault.svg' alt="Vault" style={{ marginRight: '10px' }} />
                    <ListItemText primary="Vault Management" />
                </ListItem>

                <ListItem className={`dashboard-navigation-list ${selectedListItem === 2 ? 'selected-dashboard-navigation-list' : ''}`}
                  onClick={() => setSelectedListItem(2)}>
                    {themeChangericon ? (
                      <img src='users-dark.svg' alt="Users" style={{ marginRight: '10px' }} />
                    ):(
                      <img src='users-dark.svg' alt="Users" style={{ marginRight: '10px' }} />
                    )}
                    
                    <ListItemText primary="User Management" />
                </ListItem>

                <ListItem className={`dashboard-navigation-list ${selectedListItem === 3 ? 'selected-dashboard-navigation-list' : ''}`}
                  onClick={() => handleDashboardNavigation(3)}>
                    {/* <img src='users.svg' alt="Users" style={{ marginRight: '10px' }} /> */}
                    <SubscriptionsIcon></SubscriptionsIcon>
                    <ListItemText style={{marginLeft: '10px'}} primary="Packages" />
                </ListItem>

              </List>
            </div>
            
            <div className='logout-section'>
              <div className='avatar-title'>
                <div className='profile-avatar'>
                  {currentUserImage && currentUserImage !== null && currentUserImage !== '' ? (
                      <img src={currentUserImage}alt="Profile Picture"/>
                    ):(
                      <img src='/profile-avatar.webp' alt="Profile"/>
                    )}
                  {/* <img src={currentUserImage} alt="Profile Picture"/> */}
                </div>
                <div className="profile-title"><h4>{currentUser}</h4></div>
              </div>

              <div className='logout-button-div'>
                <button className="logout-button" onClick={handleLogout} >
                  {themeChangericon ? (
                      <img src='logout-dark.svg' alt="Users" style={{ marginRight: '10px' }} />
                  ):(
                      <img src='logout-dark.svg' alt="Users" style={{ marginRight: '10px' }} />
                  )}
                  Logout
                </button>
              </div> 
            </div>

          </div>
            
          <div className="workspace-content night-mode">
            <div className='main main-setting'>
              {selectedListItem === 0 && (
                <div></div>
              )}

              {selectedListItem === 1 && (
                <div className='main-vault'>
                  <div className="vault-breadcrumbs">
                    {showVaultFiles ? (
                      <>
                        <h5>
                          <span onClick={() => {setShowVaultFiles(false)}} style={{ cursor: 'pointer' }}>
                            Vault 
                          </span>
                          / {vaultFilesToShow.vault_name}
                        </h5></>):(<>
                        <h5>Vaults</h5>
                      </>
                    )}
                    
                  </div>

                  <div className="vault-search">
                    <div>
                      {showVaultFiles ? (
                        <>
                        <input className='vault-searchbar' placeholder='Search file' value={searched}
                        onChange={vaultFileSearch} />
                        </>
                      ):(
                        <input className='vault-searchbar' placeholder='Search file' value={searched}
                        onChange={requestSearch} />
                      )}
                    </div>
                    <div>
                      {showVaultFiles ? (
                        <button className='vault-sync-btn' onClick={() => {
                          setShowVaultFiles(false);}}  style={{marginRight: '5px'}}>
                        back
                      </button>
                      ):(
                        <button className='vault-sync-btn' onClick={() => setSyncPopup(true)}>
                        Sync
                        {themeChangericon ? (
                          <img src='sync.svg' alt='Sync Icon' style={{ marginLeft: '12px' }} />
                        ):(
                          <img src='sync-dark.svg' alt='Sync Icon' style={{ marginLeft: '12px' }} />
                        )}
                        
                      </button>
                      )}
                      
                    </div>
                  </div>

                  {showVaultFiles ? (
                      <div className="vault-table"> 
                        <TableContainer component={Paper} sx={{ borderTopLeftRadius: '16px',borderTopRightRadius: '16px'}}>
                          <Table sx={{ minWidth: 650 }} aria-label="simple table" className='vault-table-container'>
                            <TableHead sx={{ backgroundColor: '#F4F4F4', boxShadow: 'none'}} className='vault-table-head' >
                              <TableRow className='vault-table-row'>
                                <TableCell sx={{borderTopLeftRadius: '17px' , width: '15%'}}>
                                  <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>No#</Typography>
                                </TableCell>
                                <TableCell sx={{borderTopRightRadius: '17px'}}>
                                  <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>File</Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {vaultFilesToShow.files.map((row:any , index:any) => (
                                <TableRow
                                  key={index}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  className='vault-table-row vault-file-hover'
                                >
                                  <TableCell component="th" scope="row" className='vault-table-body-row'>{index + 1}</TableCell>
                                  <TableCell className='vault-table-body-row'>{row.filename}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                  ):(
                    <div className="vault-table"> 
                      <TableContainer component={Paper} sx={{ borderTopLeftRadius: '16px',borderTopRightRadius: '16px'}}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" className='vault-table-container'>
                          <TableHead sx={{ backgroundColor: '#F4F4F4', boxShadow: 'none'}} className='vault-table-head' >
                            <TableRow className='vault-table-row'>
                              <TableCell sx={{borderTopLeftRadius: '17px' , width: '15%'}}>
                                <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>
                                  No#
                                </Typography>
                              </TableCell>

                              <TableCell sx={{width: '45%'}} >
                                <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>
                                  Vaults
                                </Typography>
                              </TableCell>

                              {/* <TableCell sx={{width: '15%'}} >
                                <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>
                                  Price
                                </Typography>
                              </TableCell> */}

                              <TableCell sx={{borderTopRightRadius: '17px'}}>
                                <Typography variant='subtitle1' fontWeight="bold" className='vault-table-head-row'>
                                  Actions
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {vaultFiles.map((row:any , index) => (
                              <TableRow key={index} className='vault-table-row hover-row'
                                sx={{ '&:last-child td, &  :last-child th': { border: 0 } }} 
                                onDoubleClick={() => handleVaultRowClick(row)}
                              >
                                <TableCell component="th" scope="row" className='vault-table-body-row'>{index + 1}</TableCell>

                                <TableCell className='vault-table-body-row'>
                                  <span style={{ display: 'flex', alignItems: 'center', userSelect: 'none' }}>
                                    <img src="vault.svg" alt="Folder Icon"
                                      style={{ width: '17px', height: '17px', marginRight: '10px' }} />
                                    {row.vault_name}
                                  </span>
                                </TableCell>
                                
                                <TableCell scope="row" className='vault-table-body-row'>
                                  <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src="eye.png" alt="Folder Icon" className='vault-view-icon'
                                      style={{ width: '20px', height: '20px', marginRight: '10px' }}
                                      onClick={() => handleVaultRowClick(row)}
                                    />

                                    <img src="delete.png" alt="Folder Icon" className='vault-view-icon'
                                      style={{ width: '18px', height: '18px', marginRight: '10px' }}
                                      onClick={() => handleDeleteVault(row)}
                                    />
                                  </span>
                                  
                                  

                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  )}
                  
                </div>
              )}

              {selectedListItem === 2 && (
                <div className='main-user-management'>
                  <div className="user-breadcrumbs">
                    <h5>User Management/Users</h5>
                  </div>

                  <div className="user-search">
                    <div>
                      <input className='user-searchbar' placeholder='Search user' value={userSearchValue}
                      onChange={requestUserSearch} />
                    </div>
                    <div>
                      <button className='add-user' onClick={showAddUserPopup}>
                        Add User
                        <img src='plus.png' alt='Sync Icon' style={{ marginLeft: '12px' }} />
                      </button>
                    </div>
                  </div>

                  <div className="user-table">
                    <TableContainer component={Paper} sx={{ overflowX: 'inherit' ,borderTopLeftRadius: '16px',borderTopRightRadius: '16px'}}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table" className='vault-table-container'>

                        <TableHead sx={{ backgroundColor: '#F4F4F4', boxShadow: 'none'}} className='vault-table-head' >
                          <TableRow className='vault-table-row'>

                            <TableCell sx={{borderTopLeftRadius: '17px' , width: '6%'}}>
                              <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>No#</Typography>
                            </TableCell>

                            <TableCell sx={{width:'20%'}}>
                              <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>Name</Typography>
                            </TableCell>

                            <TableCell sx={{width: '25%'}}>
                              <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>Email</Typography>
                            </TableCell>

                            <TableCell sx={{width: '7%'}}>
                              <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>Role</Typography>
                            </TableCell>

                            <TableCell sx={{width: '8%'}}>
                              <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>Status</Typography>
                            </TableCell>

                            <TableCell sx={{width: '18%'}}>
                            <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>Vaults Access</Typography>
                            </TableCell>

                            <TableCell sx={{width: '18%'}}>
                              <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>Subscriptions</Typography>
                            </TableCell>

                            <TableCell sx={{borderTopRightRadius: '17px' , width:'10%'}}>
                              <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>Action</Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        
                        <TableBody>
                          {searchedUsers.map((row:any , index) => (
                            <TableRow
                              key={row.email}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              className='vault-table-row user-row-hover'
                            >
                              <TableCell component="th" scope="row" className='vault-table-body-row'>{index + 1}</TableCell>
                              <TableCell className='vault-table-body-row'>{row.full_name}</TableCell>
                              <TableCell className='vault-table-body-row'>{row.email}</TableCell>
                              <TableCell className='vault-table-body-row'>{row.role_id === 1 ? 'Admin' : row.role_id === 2 ? 'User' : ''}</TableCell>
                              <TableCell className='vault-table-body-row' style={{ color: row.status === 'Active' ? '#28C76F' : 'inherit' }}>
                                {row.status}
                              </TableCell>
                                
                              <TableCell>
                                {row.vaults && row.vaults.length > 0 ? (
                                    <>
                                      {row.vaults.map((vault:any , index:any) => (
                                        <button className="package-vaults" key={index}>
                                          {vault}
                                        </button>
                                      ))}
                                    </>
                                    ):(
                                    <>
                                      <p style={{display: 'inline'}}>No vault attached</p>
                                      
                                    </>
                                )}
                                  
                                <img src="attach-vault.png" alt="logo" 
                                  style={{ width: '15px', height: '15px', cursor: 'pointer' , marginLeft:'5px' }}
                                  onClick={() => handleShowUserVaultAddPopup(row)}
                                />
                              </TableCell>

                              <TableCell>
                                {row.subscriptions && row.subscriptions.length > 0 ? (
                                  <>
                                    {row.subscriptions.map((subscription:any, index:any) => (
                                      <button className="package-vaults" key={index}>
                                        {subscription}
                                      </button>
                                    ))}
                                  </>
                                ) : (
                                  <>
                                    <p style={{ display: 'inline' }}>No subscriptions</p>
                                  </>
                                )}
                              </TableCell>

                              <TableCell className='vault-table-body-row'>
                                <div className='user-action-icon-div' onClick={() => handleEllipsisClick(index+1)}>
                                  <img className='user-action-icon' src='ellipsis.svg' alt='ellipses image'/>
                                  {showOptions === index+1 && (
                                    <div className='options-div'>
                                      <div onClick={() => handleEditClick(index)}>Edit</div>
                                      <div onClick={() => handleSetPasswordClick(index)}>Set Password</div>
                                      <div onClick={(e) => { e.stopPropagation(); handleDeleteClick(index); }}>
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                          
                            </TableRow>
                          ))}
                        </TableBody>

                      </Table>
                    </TableContainer>
                  </div>
                </div>
              )}

              {selectedListItem == 3 && (
                <div className='main-user-management'>
                  <div className="user-breadcrumbs">
                    <h5>Packages</h5>
                  </div>

                  <div className="user-search">
                    <div>
                      <input className='user-searchbar' placeholder='Search package' value={packageSearchValue}
                      onChange={requestPackageSearch} />
                    </div>
                    {/* <div>
                      <button className='add-user' onClick={showAddUserPopup}>
                        Add Package
                        <img src='plus.png' alt='Sync Icon' style={{ marginLeft: '12px' }} />
                      </button>
                    </div> */}
                  </div>

                <div className="user-table">
                  <TableContainer component={Paper} sx={{ overflowX: 'inherit' ,borderTopLeftRadius: '16px',borderTopRightRadius: '16px'}}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" className='vault-table-container'>
                      <TableHead sx={{ backgroundColor: '#F4F4F4', boxShadow: 'none'}} className='vault-table-head' >
                        <TableRow className='vault-table-row'>
                          <TableCell sx={{borderTopLeftRadius: '17px' , width: '13%'}}>
                            <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>No#</Typography>
                          </TableCell>
                          <TableCell sx={{width: '25%'}}>
                            <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>Name</Typography>
                          </TableCell>
                          <TableCell sx={{width: '10%'}}>
                            <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>Price</Typography>
                          </TableCell>
                          <TableCell sx={{width: '10%'}}>
                            <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>Created</Typography>
                          </TableCell>
                          <TableCell sx={{ width: '30%'}} >
                            <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>Vaults</Typography>
                          </TableCell>
                          {/* <TableCell sx={{borderTopRightRadius: '17px'}}>
                            <Typography variant="subtitle1" fontWeight="bold" className='vault-table-head-row'>Action</Typography>
                          </TableCell> */}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {searchedStripePackages.map((row:any , index) => (
                          <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            className='vault-table-row user-row-hover'
                          >
                              <TableCell component="th" scope="row" className='vault-table-body-row'>
                                {index + 1}
                              </TableCell>
                              <TableCell className='vault-table-body-row'>{row.name}</TableCell>
                              <TableCell className='vault-table-body-row'>
                                {getCurrencySign(row.default_price.currency)} {row.default_price.unit_amount_decimal / 100}
                              </TableCell>
                              <TableCell className='vault-table-body-row'>
                                {convertUnixTimestampToDateTime(row.created)}
                              </TableCell>
                              <TableCell>
                                {row.features && row.features.length > 0 ? (
                                  <>
                                    {row.features.map((feature:any , index:any) => (
                                      <button className="package-vaults" key={index}>
                                        {feature.name}
                                      </button>
                                    ))}
                                  </>
                                  ):(
                                  <>
                                    <p style={{display: 'inline'}}>No vault attached</p>
                                    
                                  </>
                                )}
                                
                                <img src="attach-vault.png" alt="logo" 
                                  style={{ width: '15px', height: '15px', cursor: 'pointer' , marginLeft:'5px' }}
                                  onClick={() => handleShowVaultAddPopup(row)}
                                />
                              </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>

              )}
  
            </div>
          </div>
    
          <ToastContainer autoClose={1500} />
        </div>
      )}
      
    </LayoutWrapper>
  );
}

export default Dashboard