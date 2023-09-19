

import { google } from 'googleapis';
import axios from 'axios';
const fs = require('fs');
const path = require('path');
import { OAuth2Client } from 'google-auth-library';


export default async function handler(req, res) {



    if (req.method === "GET") {
        try {

            // const oAuth2Client = new google.auth.OAuth2(
            //     process.env.CLIENT_ID,
            //     process.env.CLIENT_SECRET,
            //     process.env.REDIRECT_URI
            // )

            const CLIENT_ID = process.env.CLIENT_ID
            const CLIENT_SECRET = process.env.CLIENT_SECRET
            const REDIRECT_URI = process.env.REDIRECT_URI

            const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

            let authUrl

            if (!req.query.code) {
                // Generate the URL for the user to authorize the app
                authUrl = oAuth2Client.generateAuthUrl({
                    access_type: 'offline', // 'offline' allows you to receive a refresh token
                    scope: ['https://www.googleapis.com/auth/drive',
                        'https://www.googleapis.com/auth/people.readonly',],
                });
                console.log('authUrl', authUrl)

                // Redirect the user to the auth URL
                // return res.redirect(authUrl);
            }

            // const code = req.query.code;

            // const { tokens } = await oAuth2Client.getToken(code);

            // const accessToken = tokens.access_token;
            // const refreshToken = tokens.refresh_token;

            // const authUrl = oAuth2Client.generateAuthUrl({
            //     access_type: 'offline', // 'offline' allows you to receive a refresh token
            //     scope: ['https://www.googleapis.com/auth/drive'], // Specify the required scopes
            //   });


            // const drive = google.drive({ version: "v3", auth });

            // const response = await drive.files.list({
            //     pageSize: 1000,
            //     fields: 'files(id, name, mimeType)', // Specify the fields you want to retrieve
            // });
            // const files = response.data.files;

            // console.log('files', files)
            // const filesWithContent = [];
            // console.log('files length: ', files.length)


            return res.status(200).json({ authUrl });

            // fs.unlinkSync(tempFilePath);

        } catch (error) {
            console.error("Error fetching files:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
