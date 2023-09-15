// utils/googleDrive.js

import { google } from 'googleapis';
import axios from 'axios';

// Load your client credentials from a JSON file or secure environment variable
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

async function refreshTokenIfNeeded(accessToken, refreshToken, callback) {
    oAuth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    if (oAuth2Client.isTokenExpiring()) {
        try {
            const { tokens } = await oAuth2Client.refreshAccessToken();
            callback(tokens.access_token);
        } catch (error) {
            console.error('Error refreshing access token:', error);
            callback(null);
        }
    } else {
        callback(accessToken);
    }
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { token } = req.body;
        // console.log('token: ', token)

        refreshTokenIfNeeded(token, null, async (accessToken) => {
            if (!accessToken) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Initialize the Google Drive API client
            const drive = google.drive({
                version: 'v3',
                auth: oAuth2Client,
            });

            try {
                // Fetch files from Google Drive
                const response = await drive.files.list({
                    pageSize: 10, // Number of files to retrieve
                    fields: 'files(id, name)', // Fields to include in the response
                });

                const files = response.data.files;

                // You can do something with the fetched files here
                res.status(200).json({ files });
            } catch (error) {
                console.error('Error fetching files from Google Drive:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
