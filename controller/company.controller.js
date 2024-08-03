const tokenService = require('../services/token.service');
const dbService = require('../services/database.service');

const createCompany = async (req, res) => {
    const token = await tokenService.verifyToken(req);

    if (token) {
        try {
            // STORE DATA IN COLLECTION
            let data = token.data;
            const dataRes = await dbService.createRecord(data, 'companySchema');

            res.status(200).json({
                isCompanyCreated: true,
                message: "Company created successfully",
                data: dataRes
            });

        } catch (error) {
            res.status(409).json({
                isCompanyCreated: false,
                message: error
            });
        }
    }
    else {
        res.status(401).json({
            message: "Permission Denied !"
        })
    }
}

const getCompanyId = async (req, res) => {
    const token = await tokenService.verifyToken(req);

    if (token.isVerified) {
        const query = {
            email: token.data.email
        }

        const companyRes = await dbService.getRecordByQuery(query, "companySchema");

        if (companyRes.length > 0) {
            res.status(200).json({
                status: 200,
                isCompanyExists: true,
                message: "Company found !",
                data: companyRes
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
            message: "Permission Denied !"
        });
    }
}

const updateCompanyData = async (req, res) => {
    const token = await tokenService.verifyToken(req);

    if (token.isVerified) {
        const id = req.params.id;
        const data = req.body;
        try {
            const dataRes = await dbService.updateById(id, data, "companySchema");
            const newToken = await refreshToken(req, id, dataRes);

            res.cookie("authToken", newToken, { maxAge: (86400 * 1000) });
            res.status(200).json({
                message: "Update success",
                data: dataRes
            });
        } catch (error) {
            res.status(424).json({
                message: "Update failed"
            });
        }
    }
    else {
        res.status(401).json({
            message: "Permission Denied !"
        });
    }
}

const refreshToken = async (req, id, dataRes) => {
    const data = {
        uid: id,
        companyInfo: dataRes
    }
    const endPoint = req.get('origin') || `http://${req.get('host')}`;
    const option = {
        body: data,
        endPoint: endPoint,
        originalUrl: "/api/private/company"
    }
    const expiresIn = 86400;
    const newToken = await tokenService.createCustomToken(option, expiresIn);

    const query = {
        uid: id
    }

    const updateMe = {
        token: newToken,
        expiresIn: expiresIn,
        updatedAt: Date.now()
    }

    await dbService.updateByQuery(query, "userSchema", updateMe);
    return newToken;
}

module.exports = {
    createCompany,
    getCompanyId,
    updateCompanyData
}