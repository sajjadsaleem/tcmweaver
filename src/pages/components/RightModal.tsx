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

type Anchor = 'right';

interface TemporaryDrawerProps {
    themeChangeIcon: boolean;
    textOrGraphView: boolean;
    handleThemeChange: any;
    handleGraphOrTextView: any;
}


const TemporaryDrawer: React.FC<TemporaryDrawerProps> = ({ themeChangeIcon, textOrGraphView, handleThemeChange,
    handleGraphOrTextView }) => {
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
                <ListItem sx={{ padding: '0' }} onClick={handleGraphOrTextView}>
                    {textOrGraphView ? (
                        <ListItemButton>
                            <div className="modal-icons">
                                {themeChangeIcon ? (
                                    <img src="/graph-logo-light.png" alt="img" />
                                ) : (
                                    <img src="/graph-logo-dark.png" alt="img" />
                                )}
                            </div>
                            <ListItemText primary="Graph View" style={{ color: themeChangeIcon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
                    ) : (
                        <ListItemButton>
                            <div className="modal-icons">
                                {themeChangeIcon ? (
                                    <img src="/text-logo.png" alt="img" />
                                ) : (
                                    <img src="/text-logo-night.png" alt="img" />
                                )}
                            </div>
                            <ListItemText primary="Text View" style={{ color: themeChangeIcon ? '#6C655C' : '#B3B3B5' }} />
                        </ListItemButton>
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
                                <img src="/menu-icon-light.svg" alt="img" onClick={toggleDrawer(anchor, false)} />
                            ) : (
                                <img src="/menu-icon-dark.svg" alt="img" onClick={toggleDrawer(anchor, false)} />
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