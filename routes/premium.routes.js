const express = require('express');
const router = express.Router();

const routePermissionMiddleware = require('../middleware/route-permission.middleware');

router.get('/', routePermissionMiddleware, (req, res) => {
    res.render('premium');
});

module.exports = router;