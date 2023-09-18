// utils/googleDrive.js

// import { getData } from "../../../googleDrive"

// Load your client credentials from a JSON file or secure environment variable
// const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// const oAuth2Client = new google.auth.OAuth2(
//     CLIENT_ID,
//     CLIENT_SECRET,
//     REDIRECT_URI
// );

// async function refreshTokenIfNeeded(accessToken, refreshToken, callback) {
//     oAuth2Client.setCredentials({
//         access_token: accessToken,
//         refresh_token: refreshToken,
//     });

//     if (oAuth2Client.isTokenExpiring()) {
//         try {
//             const { tokens } = await oAuth2Client.refreshAccessToken();
//             callback(tokens.access_token);
//         } catch (error) {
//             console.error('Error refreshing access token:', error);
//             callback(null);
//         }
//     } else {
//         callback(accessToken);
//     }
// }

import { google } from 'googleapis';
import axios from 'axios';
const fs = require('fs');
const path = require('path');


export default async function handler(req, res) {

    if (req.method === "GET") {
        try {
            // const serviceAccountJson = {
            //     "type": "service_account",
            //     "project_id": "tcm-weaver",
            //     "private_key_id": "***REMOVED***",
            //     "private_key": "***REMOVED_PRIVATE_KEY***\n",
            //     "client_email": "tcm-weaver@tcm-weaver.iam.gserviceaccount.com",
            //     "client_id": "112629832940370460393",
            //     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            //     "token_uri": "https://oauth2.googleapis.com/token",
            //     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            //     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/tcm-weaver%40tcm-weaver.iam.gserviceaccount.com",
            //     "universe_domain": "googleapis.com"
            // }

            const type = process.env.type;
            const project_id = process.env.project_id;
            const private_key_id = process.env.private_key_id;
            const private_key = process.env.private_key;
            const client_email = process.env.client_email;
            const client_id = process.env.client_id;
            const auth_uri = process.env.auth_uri;
            const token_uri = process.env.token_uri;
            const auth_provider_x509_cert_url = process.env.auth_provider_x509_cert_url;
            const client_x509_cert_url = process.env.client_x509_cert_url;
            const universe_domain = process.env.universe_domain;

            // Construct the service account JSON object
            const serviceAccountJson = {
                type,
                project_id,
                private_key_id,
                private_key,
                client_email,
                client_id,
                auth_uri,
                token_uri,
                auth_provider_x509_cert_url,
                client_x509_cert_url,
                universe_domain,
            };

            // fs.writeFileSync('temp-credentials.json', JSON.stringify(serviceAccountJson));
            const tempFilePath = path.join(__dirname, 'temp-credentials.json');
            fs.writeFileSync(tempFilePath, JSON.stringify(serviceAccountJson));

            // console.log('.env', process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
            // Authenticating the service account here
            // console.log("keyFile:' ")
            const auth = new google.auth.GoogleAuth({
                keyFile: tempFilePath,
                scopes: ["https://www.googleapis.com/auth/drive"],
            });

            // Create a Google Drive client
            const drive = google.drive({ version: "v3", auth });

            // Fetch files from Google Drive
            // const DriveResults = await drive.files.list()
            // const response = await drive.files.list({
            //     pageSize: 10, // Adjust the pageSize as needed to fetch all files
            // });

            const response = await drive.files.list({
                pageSize: 1000, // Adjust the pageSize as needed
                fields: 'files(id, name, mimeType)', // Specify the fields you want to retrieve
            });
            const files = response.data.files;

            console.log('files', files)
            const filesWithContent = [];

            for (const file of files) {
                const fileId = file.id;
                const fileResponse = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });

                // Read the file content and store it in a buffer
                const chunks = [];
                fileResponse.data.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                fileResponse.data.on('end', () => {
                    const fileContent = Buffer.concat(chunks).toString();
                    filesWithContent.push({ ...file, content: fileContent });

                    // Check if all files have been processed
                    if (filesWithContent.length === files.length) {
                        // Send the list of files with their content as a response
                        res.status(200).json(filesWithContent);
                    }
                });
            }

            fs.unlinkSync(tempFilePath);

            // const fileId = '1uk0UUcWeyzAPf8ZPWl6qXgAshA3fT2lZ'; // Replace with the actual file ID

            // // Fetch the file's content from Google Drive
            // const fileResponse = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });

            // console.log('fileResponse ', fileResponse)

            // Read the file content and store it in a buffer
            // const chunks = [];
            // fileResponse.data.on('data', (chunk) => {
            //     chunks.push(chunk);
            // });

            // fileResponse.data.on('end', () => {
            //     const fileContent = Buffer.concat(chunks).toString();

            //     // Send the file's content as a response
            //     res.status(200).send(fileContent);
            // });



            // console.log('response = ', res)

            // console.log('files', files)
            // res.status(200).json(files);
        } catch (error) {
            console.error("Error fetching files:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
// if (req.method === 'POST') {
//     const { token } = req.body;
//     // console.log('token: ', token)

//     refreshTokenIfNeeded(token, null, async (accessToken) => {
//         if (!accessToken) {
//             return res.status(401).json({ error: 'Unauthorized' });
//         }

//         // Initialize the Google Drive API client
//         const drive = google.drive({
//             version: 'v3',
//             auth: oAuth2Client,
//         });

//         try {
//             // Fetch files from Google Drive
//             const response = await drive.files.list({
//                 pageSize: 10, // Number of files to retrieve
//                 fields: 'files(id, name)', // Fields to include in the response
//             });

//             const files = response.data.files;

//             // You can do something with the fetched files here
//             res.status(200).json({ files });
//         } catch (error) {
//             console.error('Error fetching files from Google Drive:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
//     });
// } else {
//     res.status(405).end(); // Method Not Allowed
// }
