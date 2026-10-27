import jwt from 'jsonwebtoken'

const sign = (payload, options) => {
    const signingOptions = {
        issuer: "www.barqsol.com",
        subject: options.subject
    };
    return jwt.sign(payload, "abcdefghijklmnopqrstuvwxyz1234567890", signingOptions)
}

const verify = (token, options) => {
    const verifyOptions = {
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