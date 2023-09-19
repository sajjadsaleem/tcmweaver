// backend/api/exchangeCodeForToken.js

// Import required libraries
import { google } from 'googleapis';

// Create a new instance of OAuth2Client
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { code } = req.body;

            // Exchange the authorization code for an access token
            const { tokens } = await oAuth2Client.getToken(code);

            const accessToken = tokens.access_token;
            const refreshToken = tokens.refresh_token;

            // You can also save the tokens for future use if needed

            return res.status(200).json({ accessToken });
        } catch (error) {
            console.error("Error exchanging authorization code:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
