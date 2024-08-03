const express = require('express');
const router = express.Router();

const tokenService = require('../services/token.service');
const httpService = require('../services/http.service');
const bcryptService = require('../services/bcrypt.service');

router.post('/', async (req, res) => {
    let loginAs = req.body.loginAs;

    if (loginAs === "admin") {
        adminLogger(req, res);
    }
    else if (loginAs === "employee") {
        employeeLogger(req, res);
    }
    else if (loginAs === "student") {
        studentLogger(req, res);
    }
});

// ADMIN LOGIN CODE
const adminLogger = async (req, res) => {
    const expiresIn = 120;
    const token = await tokenService.createToken(req, expiresIn);
    // GETTING COMPANY ID
    const companyRes = await httpService.getRequest({
        endPoint: req.get("origin"),
        api: "/api/private/company",
        data: token
    });

    if (companyRes.isCompanyExists) {
        const uid = companyRes.data[0]._id;
        const query = {
            body: {
                uid: uid,
                companyInfo: companyRes.data[0]
            },
            endPoint: req.get("origin"),
            originalUrl: req.originalUrl
        }

        const uidToken = await tokenService.createCustomToken(query, expiresIn);

        // GETTING USER ID
        const userRes = await httpService.getRequest({
            endPoint: req.get("origin"),
            api: "/api/private/user",
            data: uidToken
        });

        // UPDATE ROLE IN AUTH TOKEN
        const role = userRes.data[0].role;
        query.body['role'] = role;

        // GET USER PASSWORD
        if (userRes.isCompanyExists) {

            // ALLOW SINGLE DEVICE LOGIN
            if (userRes.data[0].isLogged) {
                res.status(406).json({
                    message: "Please logout from other device"
                });
                return false;
            }

            const realPassword = userRes.data[0].password;
            const isLogged = await bcryptService.decrypt(realPassword, req.body.password);

            if (isLogged) {
                // CREATE TOKEN AND SET IN COOKIE FOR FEATURE USE
                const oneDayInSecond = 86400; // 1 day
                const authToken = await tokenService.createCustomToken(query, oneDayInSecond);

                // STORE TOKEN IN DB
                const dbToken = await httpService.putRequest({
                    endPoint: req.get("origin"),
                    api: "/api/private/user",
                    data: authToken
                });

                res.cookie("authToken", authToken, { maxAge: (oneDayInSecond * 1000) }); // 1 day
                res.status(200).json({
                    role: "admin",
                    isLogged: true,
                    message: "Success"
                });
            }
            else {
                res.status(401).json({
                    isLogged: false,
                    message: "Wrong password !"
                });
            }
        }
        else {
            res.status(userRes.status).json(userRes);
        }
    }
    else {
        console.log("COMPANY RES :: ", companyRes);
        res.status(companyRes.status).json(companyRes);
    }
}

// EMPLOYEE LOGIN CODE
const employeeLogger = async (req, res) => {
    const expiresIn = 120;
    const token = await tokenService.createToken(req, expiresIn);
    // GETTING COMPANY ID
    const companyRes = await httpService.getRequest({
        endPoint: req.get("origin"),
        api: "/api/private/company",
        data: token
    });

    if (companyRes.isCompanyExists) {
        const uid = companyRes.data[0]._id;
        const query = {
            body: {
                uid: uid,
                employeeInfo: companyRes.data[0]
            },
            endPoint: req.get("origin"),
            originalUrl: req.originalUrl
        }

        const uidToken = await tokenService.createCustomToken(query, expiresIn);

        // GETTING USER ID
        const userRes = await httpService.getRequest({
            endPoint: req.get("origin"),
            api: "/api/private/user",
            data: uidToken
        });

        // UPDATE ROLE IN AUTH TOKEN
        const role = userRes.data[0].role;
        query.body['role'] = role;

        // GET USER PASSWORD
        if (userRes.isCompanyExists) {

            // ALLOW SINGLE DEVICE LOGIN
            if (userRes.data[0].isLogged) {
                res.status(406).json({
                    message: "Please logout from other device"
                });
                return false;
            }

            const realPassword = userRes.data[0].password;
            const isLogged = await bcryptService.decrypt(realPassword, req.body.password);

            if (isLogged) {
                // CREATE TOKEN AND SET IN COOKIE FOR FEATURE USE
                const oneDayInSecond = 86400; // 1 day
                const authToken = await tokenService.createCustomToken(query, oneDayInSecond);

                // STORE TOKEN IN DB
                const dbToken = await httpService.putRequest({
                    endPoint: req.get("origin"),
                    api: "/api/private/user",
                    data: authToken
                });

                res.cookie("authToken", authToken, { maxAge: (oneDayInSecond * 1000) }); // 1 day
                res.status(200).json({
                    role: "employee",
                    isLogged: true,
                    message: "Success"
                });
            }
            else {
                res.status(401).json({
                    isLogged: false,
                    message: "Wrong password !"
                });
            }
        }
        else {
            res.status(userRes.status).json(userRes);
        }
    }
    else {
        console.log("COMPANY RES :: ", companyRes);
        res.status(companyRes.status).json(companyRes);
    }
}

// STUDENT LOGIN CODE
const studentLogger = async (req, res) => {
    const expiresIn = 120;
    const token = await tokenService.createToken(req, expiresIn);
    // GETTING COMPANY ID
    const companyRes = await httpService.getRequest({
        endPoint: req.get("origin"),
        api: "/students/login",
        data: token
    });

    if (companyRes.isCompanyExists) {
        const uid = companyRes.data[0]._id;
        const query = {
            body: {
                uid: uid,
                studentInfo: companyRes.data[0]
            },
            endPoint: req.get("origin"),
            originalUrl: req.originalUrl
        }

        const uidToken = await tokenService.createCustomToken(query, expiresIn);

        // GETTING USER ID
        const userRes = await httpService.getRequest({
            endPoint: req.get("origin"),
            api: "/api/private/user",
            data: uidToken
        });

        // UPDATE ROLE IN AUTH TOKEN
        const role = userRes.data[0].role;
        query.body['role'] = role;

        // GET USER PASSWORD
        if (userRes.isCompanyExists) {

            // ALLOW SINGLE DEVICE LOGIN
            if (userRes.data[0].isLogged) {
                res.status(406).json({
                    message: "Please logout from other device"
                });
                return false;
            }

            const realPassword = userRes.data[0].password;
            const isLogged = await bcryptService.decrypt(realPassword, req.body.password);

            if (isLogged) {
                // CREATE TOKEN AND SET IN COOKIE FOR FEATURE USE
                const oneDayInSecond = 86400; // 1 day
                const authToken = await tokenService.createCustomToken(query, oneDayInSecond);

                // STORE TOKEN IN DB
                const dbToken = await httpService.putRequest({
                    endPoint: req.get("origin"),
                    api: "/api/private/user",
                    data: authToken
                });

                res.cookie("authToken", authToken, { maxAge: (oneDayInSecond * 1000) }); // 1 day
                res.status(200).json({
                    role: "student",
                    isLogged: true,
                    message: "Success"
                });
            }
            else {
                res.status(401).json({
                    isLogged: false,
                    message: "Wrong password !"
                });
            }
        }
        else {
            res.status(userRes.status).json(userRes);
        }
    }
    else {
        console.log("COMPANY RES :: ", companyRes);
        res.status(companyRes.status).json(companyRes);
    }
}

module.exports = router;