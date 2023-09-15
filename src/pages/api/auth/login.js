import { db } from '@vercel/postgres';
import * as Validation from '../../../util/Validation'
import * as jwt from '../../../util/jwt'
import bcrypt from 'bcrypt';


const { Client } = require('pg');

export default async function login(req, res) {
  if (req.method !== 'POST') {
    return res.status(500).end();
  } else {
    try {
      const { email, password } = req.body;
      const rules = [
        { email: ['required', 'email'] },
        { password: ['required'] },
      ]

      const { errors, isValid } = Validation.validateSignupData(req.body, rules);
      if (!isValid || errors.length > 0) {
        return res.status(500).send({
          success: false,
          status: "error",
          errors: errors,
          message: 'Internal Server Error'
        });
      }

      const client = new Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      });

      await client.connect();

      // Query the database to find a user with the provided email
      const getUsers = await client.query(
        "SELECT * FROM users WHERE username = $1",
        [email]
      );
      // console.log('getUsers: ', getUsers)

      if (getUsers.rows.length === 0) {
        errors.push({ email: 'User does not exist' })
        return res.status(500).send({
          success: false,
          status: "error",
          errors: errors,
          message: 'User does not exist'
        });
      }

      const hashedPassword = getUsers.rows[0].password;
      // const hashedPassword = getUsers[0].password;
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);

      if (!isPasswordValid) {
        errors.push({ password: 'Invalid password' })
        return res.status(500).send({
          success: false,
          status: "error",
          errors: errors,
          message: 'Invalid password'
        });
      }

      // console.log('getusers.rows: ', getUsers.rows[0])

      const user = getUsers.rows[0]

      // console.log('user: ', user)

      const payload = { id: user.id }
      const signingOptions = {
        subject: email
      }


      const signedToken = jwt.sign(payload, signingOptions)
      // console.log('payload: ', payload)
      // console.log('signedToken: ', signedToken)

      // await client.end();

      // console.log('user: ', user)

      return res.status(200).send({
        success: true,
        status: "success",
        errors: [],
        message: 'You have logged in successfully',
        token: signedToken,
        user: {
          email: user
        },
      });

      // if (result.rows.length === 1) {
      //   const user = result.rows[0];

      //   // Check if the provided password matches the stored password
      //   if (user.password === password) {
      //     // Authentication successful
      //     // Set a session or JWT token here if needed

      //     res.status(200).json({ success: true, message: "Authentication successful" });
      //   } else {
      //     // Password does not match
      //     res.status(401).json({ success: false, message: "Authentication failed" });
      //   }
      // } else {
      //   // User with the provided email not found
      //   res.status(401).json({ success: false, message: "Authentication failed" });
      // }

      // // Disconnect from the database
      // await client.end();

    } catch (error) {

      console.error('Error creating user:', error);

      return res.status(500).send({
        success: false,
        status: "error",
        errors: [{ error: error }],
        message: 'Internal Server Error catch'
      });
    }



  }


}
