import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import _, { replace, result, update } from "lodash";
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';


type Anchor = 'left';

interface AdminDrawerProps {
    themeChangericon: any;
    handleThemeChange: any;
    handleNavigationValue: any;
    selectedListItem: any;
    currentUserImage: any;
    currentUser: any;
    setUserLogoutPopup: any;
    handleDashboardNavigation: any;
}


const AdminDrawer: React.FC<AdminDrawerProps> = ({ themeChangericon, handleThemeChange, handleNavigationValue,
    selectedListItem, currentUserImage, currentUser, setUserLogoutPopup, handleDashboardNavigation }) => {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor: Anchor, open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }

            setState({ ...state, [anchor]: open });
        };

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: anchor === 'left' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >

            <List sx={{ padding: '0 1rem' }}>


                <ListItem sx={{ padding: '0' }} className={`dashboard-navigation-list ${selectedListItem === 0 ?
                    'selected-dashboard-navigation-list' : ''}`} onClick={() => handleNavigationValue(0)}>
                    <Link href="/">
                        <ListItemButton>
                            <div className="mobile-dashboard-home-icon modal-icons">
                                <img src="/home.png" alt="img" />
                            </div>
                            <ListItemText primary="Home" style={{ color: themeChangericon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
                    </Link>
                </ListItem>


                <ListItem sx={{ padding: '0' }} onClick={() => handleNavigationValue(1)}>
                    {themeChangericon ? (
                        <ListItemButton>
                            <div className="modal-icons">
                                <img src="/vault-light.svg" alt="img" />
                            </div>
                            <ListItemText primary="Vault Management" style={{ color: themeChangericon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
                    ) : (
                        <ListItemButton>
                            <div className="modal-icons">
                                <img src="/vault-dark.svg" alt="img" />
                            </div>
                            <ListItemText primary="Vault Management" style={{ color: themeChangericon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
                    )}
                </ListItem>

                <ListItem sx={{ padding: '0' }} onClick={() => handleNavigationValue(2)}>
                    {themeChangericon ? (
                        <ListItemButton>
                            <div className="modal-icons">
                                <img src="/users.svg" alt="img" />
                            </div>
                            <ListItemText primary="User Management" style={{ color: themeChangericon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
                    ) : (
                        <ListItemButton>
                            <div className="modal-icons">
                                <img src="/users-dark.svg" alt="img" />
                            </div>
                            <ListItemText primary="User Management" style={{ color: themeChangericon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
                    )}
                </ListItem>


                <ListItem sx={{ padding: '0' }} onClick={() => handleDashboardNavigation(3)}>
                    {themeChangericon ? (
                        <ListItemButton>
                            <div className="modal-icons mobile-dashboard-home-icon">
                                <SubscriptionsIcon></SubscriptionsIcon>

                            </div>
                            <ListItemText primary="Packages" style={{ color: themeChangericon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
                    ) : (
                        <ListItemButton>
                            <div className="modal-icons mobile-dashboard-home-icon">
                                <SubscriptionsIcon></SubscriptionsIcon>
                            </div>
                            <ListItemText primary="Packages" style={{ color: themeChangericon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
                    )}
                </ListItem>



                <ListItem sx={{ padding: '0' }} onClick={handleThemeChange}>
                    {themeChangericon ? (
                        <ListItemButton>
                            <div className="modal-icons">
                                <img src="/dark-mode.png" alt="img" />
                            </div>
                            <ListItemText primary="Dark Mode" style={{ color: themeChangericon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
                    ) : (
                        <ListItemButton>
                            <div className="modal-icons">
                                <img src="/light-modenew.svg" alt="img" />
                            </div>
                            <ListItemText primary="Light Mode" style={{ color: themeChangericon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
                    )}
                </ListItem>

            </List>

        </Box>
    );


    return (
        <div>
            {(['left'] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <div className="dashboard-hamburgur-icon">
                        {themeChangericon ? (
                            <img src="/menu-icon-light.svg" alt="img" onClick={toggleDrawer(anchor, true)} />
                        ) : (
                            <img src="/menu-icon-dark.svg" alt="img" onClick={toggleDrawer(anchor, true)} />
                        )}
                    </div>
                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} className={`drawer-modal ${themeChangericon ? '' : 'night-mode'}`}>
                        <div className="dashboard-sidebar-menu-icon padding" >
                            {themeChangericon ? (
                                <img src="/xmarknew.png" alt="img" onClick={toggleDrawer(anchor, false)} />
                            ) : (
                                <img src="/xmark-dark.png" alt="img" onClick={toggleDrawer(anchor, false)} />
                            )}
                        </div>

                        {list(anchor)}

                        <div className='mobile-logout-section'>
                            <div className='avatar-title'>
                                <div className='profile-avatar'>
                                    {currentUserImage && currentUserImage !== null && currentUserImage !== '' ? (
                                        <img src={currentUserImage} alt="Profile Picture" />
                                    ) : (
                                        <img src='/profile-avatar.webp' alt="Profile" />
                                    )}
                                    {/* <img src={currentUserImage} alt="Profile Picture"/> */}
                                </div>
                                <div className="profile-title"><h4>{currentUser}</h4></div>
                            </div>

                            <div className='logout-button-div'>
                                <button className="logout-button" onClick={() => setUserLogoutPopup(true)} >
                                    {themeChangericon ? (
                                        <img src='logout-dark.svg' alt="Users" style={{ marginRight: '10px' }} />
                                    ) : (
                                        <img src='logout-dark.svg' alt="Users" style={{ marginRight: '10px' }} />
                                    )}
                                    Logout
                                </button>
                            </div>
                        </div>
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}

export default AdminDrawer;