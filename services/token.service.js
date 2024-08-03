const jwt = require('jsonwebtoken');

const issService = require('./iss.service');

const { SECRET_KEY } = process.env;

const createToken = async (req, expiresIn) => {
    const formData = req.body;
    const endPoint = req.get("origin"); // http://localhost:8080
    const api = req.originalUrl; // /api/signup
    const iss = endPoint + api;

    const token = await jwt.sign({
        iss: iss,
        data: formData
    }, SECRET_KEY, { expiresIn: expiresIn });

    return token;
}

const createCustomToken = async (data, expiresIn) => {
    const formData = data.body;
    const endPoint = data.endPoint;
    const api = data.originalUrl;
    const iss = endPoint + api;
    const token = await jwt.sign({
        iss: iss,
        data: formData
    }, SECRET_KEY, { expiresIn: expiresIn });

    return token;
}

const verifyToken = (req) => {
    let token = ""; // req.method == 'GET' ? req.headers['x-auth-token'] : req.body.token;

    if (req.method == 'GET') {

        if (req.headers['x-auth-token']) {
            token = req.headers['x-auth-token'];
        }
        else {
            token = req.cookies.authToken;
        }
    }
    else {
        token = req.body.token;
    }

    if (token) {
        try {
            const tmp = jwt.verify(token, SECRET_KEY);
            const requestCommingFrom = tmp.iss;
            if (issService.indexOf(requestCommingFrom) != -1) {
                return {
                    isVerified: true,
                    data: tmp.data
                };
            }
            else {
                return {
                    isVerified: false
                };
            }
        } catch (error) {
            return {
                isVerified: false
            };
        }
    }
    else {
        return {
            isVerified: false
        };
    }
}

const customTokenVerification = async (token) => {
    try {
        const tmp = jwt.verify(token, SECRET_KEY);
        const requestCommingFrom = tmp.iss;
        if (issService.indexOf(requestCommingFrom) != -1) {
            return {
                isVerified: true,
                data: tmp.data
            };
        }
        else {
            return {
                isVerified: false
            };
        }
    } catch (error) {
        return {
            isVerified: false
        };
    }
}

module.exports = {
    createToken,
    verifyToken,
    createCustomToken,
    customTokenVerification
}