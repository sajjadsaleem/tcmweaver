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

type Anchor = 'right';

interface TemporaryDrawerProps {
    themeChangeIcon: boolean;
    textOrGraphView: boolean;
    handleThemeChange: any;
    handleGraphOrTextView: any;
    handleUserOptions: any;
    getPermissions: any;
    handleUserManagementClick: any;
    getUser?: any;
    billingLoader: any;
}


const TemporaryDrawer: React.FC<TemporaryDrawerProps> = ({ themeChangeIcon, textOrGraphView, handleThemeChange,
    handleGraphOrTextView, handleUserOptions, getPermissions, handleUserManagementClick, getUser, billingLoader }) => {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
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
            sx={{ width: anchor === 'right' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >

            <List sx={{ padding: '0 1rem' }}>

                {getUser?.user_role === 'User' && (
                    <>
                        <ListItem sx={{ padding: '0' }} onClick={() => handleUserOptions("profile")}>
                            <ListItemButton>
                                <div className="modal-icons">
                                    {themeChangeIcon ? (
                                        <img src="/users.svg" alt="img" />
                                    ) : (
                                        <img src="/users-dark.svg" alt="img" />
                                    )}
                                </div>
                                <ListItemText primary="Profile" style={{ color: themeChangeIcon ? '#6C655C' : '#B3B3B5' }} />
                            </ListItemButton>

                        </ListItem>

                        <ListItem sx={{ padding: '0' }} onClick={() => handleUserOptions("changepassword")}>
                            <ListItemButton>
                                <div className="modal-icons">
                                    {themeChangeIcon ? (
                                        <img src="/password-light.svg" alt="img" />
                                    ) : (
                                        <img src="/password-dark.svg" alt="img" />
                                    )}
                                </div>
                                <ListItemText primary="Change Password" style={{ color: themeChangeIcon ? '#6C655C' : '#B3B3B5' }} />
                            </ListItemButton>
                        </ListItem>


                        <ListItem sx={{ padding: '0' }} onClick={() => handleUserOptions("billing")}>
                            <ListItemButton>
                                <div className="modal-icons">
                                    {themeChangeIcon ? (
                                        <img src="/billing-light.svg" alt="img" />
                                    ) : (
                                        <img src="/billing-dark.svg" alt="img" />
                                    )}
                                </div>
                                <ListItemText primary="Billing" style={{ color: themeChangeIcon ? '#6C655C' : '#B3B3B5' }} />
                                {billingLoader && <CircularProgress size={17} style={{ color: 'grey' }} />}
                            </ListItemButton>
                        </ListItem>
                    </>
                )}


                <ListItem sx={{ padding: '0' }} onClick={() => handleUserManagementClick("vaultmanagement")}>
                    {_.every(['vault_management'], value => _.includes(getPermissions, value)) && (
                        <>
                            {themeChangeIcon ? (
                                <ListItemButton>
                                    <div className="modal-icons">
                                        <img src="/vault-light.svg" alt="img" />
                                    </div>
                                    <ListItemText primary="Vault Management" style={{ color: themeChangeIcon ? '#6C655C' : '#B3B3B5' }} />
                                </ListItemButton>
                            ) : (
                                <ListItemButton>
                                    <div className="modal-icons">
                                        <img src="/vault-dark.svg" alt="img" />
                                    </div>
                                    <ListItemText primary="Vault Management" style={{ color: themeChangeIcon ? '#6C655C' : '#B3B3B5' }} />
                                </ListItemButton>
                            )}
                        </>
                    )}
                </ListItem>


                <ListItem sx={{ padding: '0' }} onClick={() => handleUserManagementClick("usermanagement")}>
                    {_.every(['user_management'], value => _.includes(getPermissions, value)) && (
                        <>
                            {themeChangeIcon ? (
                                <ListItemButton>
                                    <div className="modal-icons">
                                        <img src="/users.svg" alt="img" />
                                    </div>
                                    <ListItemText primary="User Management" style={{ color: themeChangeIcon ? '#6C655C' : '#B3B3B5' }} />
                                </ListItemButton>
                            ) : (
                                <ListItemButton>
                                    <div className="modal-icons">
                                        <img src="/users-dark.svg" alt="img" />
                                    </div>
                                    <ListItemText primary="User Management" style={{ color: themeChangeIcon ? '#6C655C' : '#B3B3B5' }} />
                                </ListItemButton>
                            )}
                        </>
                    )}
                </ListItem>

                <ListItem sx={{ padding: '0' }} onClick={handleThemeChange}>
                    {themeChangeIcon ? (
                        <ListItemButton>
                            <div className="modal-icons">
                                <img src="/dark-mode.png" alt="img" />
                            </div>
                            <ListItemText primary="Dark Mode" style={{ color: themeChangeIcon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
                    ) : (
                        <ListItemButton>
                            <div className="modal-icons">
                                <img src="/light-modenew.svg" alt="img" />
                            </div>
                            <ListItemText primary="Light Mode" style={{ color: themeChangeIcon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
                    )}
                </ListItem>

                <ListItem sx={{ padding: '0' }} onClick={() => handleUserOptions("logout")}>
                    {themeChangeIcon ? (
                        <ListItemButton>
                            <div className="modal-icons">
                                <img src="/logout.svg" alt="img" />
                            </div>
                            <ListItemText primary="Logout" style={{ color: themeChangeIcon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
                    ) : (
                        <ListItemButton>
                            <div className="modal-icons">
                                <img src="/logout-dark.svg" alt="img" />
                            </div>
                            <ListItemText primary="Logout" style={{ color: themeChangeIcon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
                    )}
                </ListItem>

            </List>

        </Box>
    );


    return (
        <div>
            {(['right'] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <div className="sidebar-menu-icon">
                        {themeChangeIcon ? (
                            <img src="/menu-icon-light.svg" alt="img" onClick={toggleDrawer(anchor, true)} />
                        ) : (
                            <img src="/menu-icon-dark.svg" alt="img" onClick={toggleDrawer(anchor, true)} />
                        )}
                    </div>
                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} className={`drawer-modal ${themeChangeIcon ? '' : 'night-mode'}`}>
                        <div className="sidebar-menu-icon padding" >
                            {themeChangeIcon ? (
                                <img src="/xmarknew.png" alt="img" onClick={toggleDrawer(anchor, false)} />
                            ) : (
                                <img src="/xmark-dark.png" alt="img" onClick={toggleDrawer(anchor, false)} />
                            )}
                        </div>
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}

export default TemporaryDrawer;