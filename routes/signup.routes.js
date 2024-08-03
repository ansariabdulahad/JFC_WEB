const express = require('express');
const router = express.Router();

const tokenService = require('../services/token.service');
const httpService = require('../services/http.service');

router.post('/', async (req, res) => {
    let expiresIn = 120;
    const token = await tokenService.createToken(req, expiresIn);
    const companyRes = await httpService.postRequest({
        endPoint: req.get("origin"),
        api: "/api/private/company",
        data: token
    });

    // REQUESTING USER API
    if (companyRes.isCompanyCreated) {
        const newUser = {
            body: {
                uid: companyRes.data._id,
                password: req.body.password,
                companyInfo: companyRes.data
            },
            endPoint: req.get("origin"),
            originalUrl: req.originalUrl
        }

        const userToken = await tokenService.createCustomToken(newUser, expiresIn);
        const userRes = await httpService.postRequest({
            endPoint: req.get("origin"),
            api: "/api/private/user",
            data: userToken
        });

        res.cookie("authToken", userRes.token, { maxAge: (86400 * 1000) });
        res.json(userRes);
    }
    else {
        res.status(409).json(companyRes);
    }
});

module.exports = router;