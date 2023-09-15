// utils/googleDrive.js

import { google } from 'googleapis';
import axios from 'axios';

// Load your client credentials from a JSON file or secure environment variable
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
);

// Create an instance of the Google Drive API
const drive = google.drive({ version: 'v3', auth: oauth2Client });

export default drive;
