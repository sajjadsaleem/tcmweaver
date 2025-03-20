import jwt from 'jsonwebtoken'
// const fs = require('fs');
// import fs from 'fs/promises'
// const privateKey = fs.readFile('./private.key', 'utf8'); // to sign JWT
// const publicKey = fs.readFile('./public.key', 'utf8'); // to verify JWT

// const sign = (payload, options) => {
//     const signingOptions = {
//         expiresIn: process.env.JWT_EXPIRES,
//         issuer: process.env.JWT_ISSUER,
//         subject: options.subject
//     };
//     return jwt.sign(payload, process.env.JWT_SECRET, signingOptions)
// }

const sign = (payload, options) => {
    const signingOptions = {
        expiresIn: 1209600,
        issuer: "www.barqsol.com",
        subject: options.subject
    };
    return jwt.sign(payload, "abcdefghijklmnopqrstuvwxyz1234567890", signingOptions)
}

const verify = (token, options) => {
    const verifyOptions = {
        expiresIn: 1209600,
        issuer: "www.barqsol.com"
    };
    try {
        return jwt.verify(token, "abcdefghijklmnopqrstuvwxyz1234567890", verifyOptions);
    } catch (err) {
        return null;
    }
}

const parseTokenFromAuthorizationHeader = (req) => {
    const authorizationHeader = req.headers['authorization']
    if (!authorizationHeader || !authorizationHeader.includes('Bearer ')) {
        return null
    }
    return req.headers['authorization'].split(' ')[1]
}

export {
    sign,
    verify,
    parseTokenFromAuthorizationHeader,
}