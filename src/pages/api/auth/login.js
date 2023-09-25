import { db } from '@vercel/postgres';
import * as Validation from '../../../util/Validation'
import * as jwt from '../../../util/jwt'
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// const { Client } = require('pg');

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
      console.log(process.env.DATABASE_URL);

      const { errors, isValid } = Validation.validateSignupData(req.body, rules);
      if (!isValid || errors.length > 0) {
        return res.status(500).send({
          success: false,
          status: "error",
          errors: errors,
          message: 'Internal Server Error'
        });
      }

      // const client = new Client({
      //   connectionString: process.env.DATABASE_URL,
      //   ssl: {
      //     rejectUnauthorized: false,
      //   },
      // });

      // await client.connect();

      // // Query the database to find a user with the provided email
      // const getUsers = await client.query(
      //   "SELECT * FROM users WHERE username = $1",
      //   [email]
      // );

      const user = await prisma.users.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        errors.push({ email: 'User does not exist' });
        return res.status(500).send({
          success: false,
          status: "error",
          errors: errors,
          message: 'User does not exist'
        });
      }

      const hashedPassword = user.password;
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);

      if (!isPasswordValid) {
        errors.push({ password: 'Invalid password' });
        return res.status(500).send({
          success: false,
          status: "error",
          errors: errors,
          message: 'Invalid password'
        });
      }

      const payload = { id: user.id };
      const signingOptions = {
        subject: email
      };

      const signedToken = jwt.sign(payload, signingOptions);

      return res.status(200).send({
        success: true,
        status: "success",
        errors: [],
        message: 'You have logged in successfully',
        token: signedToken,
        user: {
          email: user.email
        },
      });
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