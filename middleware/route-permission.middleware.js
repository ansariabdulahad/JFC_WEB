const tokenService = require('../services/token.service');

const accessRole = {
    admin: ['/students'],
    student: ['/premium'],
    employee: []
}

const permission = async (req, res, next) => {
    const tokenData = await tokenService.verifyToken(req);
    const role = tokenData.data.role;
    const accessUrl = req.originalUrl;

    if (accessRole[role].indexOf(accessUrl) != -1) {
        next();
    }
    else {
        res.redirect('/page-not-found');
    }
}

module.exports = permission;