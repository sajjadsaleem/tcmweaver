import { db } from '@vercel/postgres';
import * as Validation from '../../../util/Validation'
import * as jwt from '../../../util/jwt'
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";


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


      const db = drizzle(sql)
      const userArray = await db.select().from(users).where(eq(users.email, email));
      const user = userArray[0] || null;

      console.log('user', user)



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
          email: user.email,
          role: user.role_id
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