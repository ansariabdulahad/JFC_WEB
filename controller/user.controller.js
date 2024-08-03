const tokenService = require('../services/token.service');
const dbService = require('../services/database.service');

const createUser = async (req, res) => {
    const token = await tokenService.verifyToken(req);

    if (token.isVerified) {
        try {
            // START AUTO LOGIN DURING SIGNUP
            const uidJson = {
                uid: token.data.uid,
                companyInfo: token.data.companyInfo
            }
            const endPoint = req.get('origin') || `http://${req.get('host')}`;
            const option = {
                body: uidJson,
                endPoint: endPoint,
                originalUrl: req.originalUrl
            }
            const expiresIn = 86400;
            const newToken = await tokenService.createCustomToken(option, expiresIn);

            // ADD MORE PROPERTIES TO TOKEN WHILE SIGNUP
            token.data['token'] = newToken;
            token.data['expiresIn'] = expiresIn;
            token.data['isLogged'] = true;
            token.data['role'] = "admin";

            // END AUTO LOGIN DURING SIGNUP

            // STORE DATA IN COLLECTION DURING SIGNUP
            const userRes = await dbService.createRecord(token.data, 'userSchema');

            res.status(200).json({
                token: newToken,
                isUserCreated: true,
                message: "User created successfully"
            });
        } catch (error) {
            res.status(500).json({
                isUserCreated: false,
                message: "Internal server error"
            })
        }
    }
    else {
        res.status(401).json({
            message: "Permission Denied !"
        });
    }
}

const getUserPassword = async (req, res) => {
    const token = await tokenService.verifyToken(req);

    if (token.isVerified) {
        const userData = token.data;
        const query = {
            uid: userData.uid
        }
        const dataRes = await dbService.getRecordByQuery(query, 'userSchema');

        if (dataRes.length > 0) {
            res.status(200).json({
                status: 200,
                isCompanyExists: true,
                message: "Company found !",
                data: dataRes
            });
        }
        else {
            res.status(404).json({
                status: 404,
                isCompanyExists: false,
                message: "Company not found !"
            });
        }
    }
    else {
        res.status(401).json({
            message: "Permission denied !"
        });
    }
}

const createLog = async (req, res) => {
    const token = await tokenService.verifyToken(req);

    if (token.isVerified) {
        const query = { uid: token.data.uid };
        const data = {
            token: req.body.token,
            expiresIn: 86400,
            isLogged: true,
            updatedAt: Date.now()
        }

        const userRes = await dbService.updateByQuery(query, "userSchema", data);
        res.status(201).json({ message: "User updated successfully !" });
    }
    else {
        res.status(401).json({
            message: "Permission denied !"
        });
    }
}

module.exports = {
    createUser,
    getUserPassword,
    createLog
}