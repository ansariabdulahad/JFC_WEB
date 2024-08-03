// SERVICES REQUIRE
const tokenService = require('../services/token.service');
const dbService = require('../services/database.service');

const refreshToken = async (uid, req) => {
    const endPoint = req.get('origin') || `http://${req.get('host')}`;
    const option = {
        body: uid,
        endPoint: endPoint,
        originalUrl: req.originalUrl
    }
    const expiresIn = 86400;
    const newToken = await tokenService.createCustomToken(option, expiresIn);
    const updateMe = {
        token: newToken,
        expiresIn: expiresIn,
        updatedAt: Date.now()
    }

    await dbService.updateByQuery(uid, "userSchema", updateMe);
    return newToken;
}

const checkUserLogged = async (req, res) => {
    const tokenData = await tokenService.verifyToken(req);

    if (tokenData.isVerified) {
        const query = {
            token: req.cookies.authToken,
            isLogged: true
        }

        const userData = await dbService.getRecordByQuery(query, "userSchema");

        if (userData.length > 0) {
            const newToken = await refreshToken(tokenData.data, req);

            res.cookie("authToken", newToken);
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

const logout = async (req, res) => {
    const tokenData = await tokenService.verifyToken(req);

    if (tokenData.isVerified) {
        const query = {
            token: req.cookies.authToken
        }
        const updateMe = {
            isLogged: false,
            updatedAt: Date.now()
        }

        const userRes = await dbService.updateByQuery(query, "userSchema", updateMe);

        if (userRes.modifiedCount) {
            await res.clearCookie("authToken");
            res.redirect('/');
        }
        else {
            res.redirect('/profile');
        }
    }
    else {
        res.status(401).json({ message: "Permission denied" });
    }
}

module.exports = {
    checkUserLogged,
    logout
}