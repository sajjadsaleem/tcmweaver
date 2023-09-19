import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Home() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleProceed = () => {
    // Handle the "Proceed" action here, e.g., initiate Google Drive authorization.
    // You can add your logic here.

    // Close the dialog
    setOpenDialog(false);
  };

  return (
    <div>
      <h1>Hello, Next.js with Material-UI Modal</h1>
      <Button variant="contained" onClick={handleOpenDialog}>
        Open Authorization Dialog
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Authorization Required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will be taken to a Google screen to authorize this app to access your Google Drive.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleProceed} color="primary">
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
