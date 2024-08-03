// CONTROLLER REQUIRE
const authController = require('../controller/auth.controller');

const authLogger = async () => {
    return async (req, res, next) => {
        console.log("REQ :: ", req);
        const isLogged = await authController.checkUserLogged(req);
        console.log("ISLOGGED :: ", isLogged);
        if (isLogged) {
            next();
        }
        else {
            res.clearCookie("authToken").redirect('/');
        }
    }
}

module.exports = {
    authLogger
}