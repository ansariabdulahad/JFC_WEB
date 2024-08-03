const tokenService = require('../services/token.service');

const getToken = async (req, res) => {
    const token = await tokenService.verifyToken(req);

    if (token) {
        const expiresIn = req.params.expires * 1000 ;
        const data = JSON.parse(req.body.data);
        const endPoint = req.get('origin') || `http://${req.get('host')}`;
        const option = {
            body: data,
            endPoint: endPoint,
            originalUrl: "/get-token"
        }
        const newToken = await tokenService.createCustomToken(option, expiresIn);
        res.status(200).json({
            token: newToken
        });
    }
    else {
        res.status(401).json({
            message: "Permission denied !"
        });
    }
}

module.exports = {
    getToken
}