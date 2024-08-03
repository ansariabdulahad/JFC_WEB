const express = require('express');
const router = express.Router();

// CONTROLLER REQUIRE
const authController = require('../controller/auth.controller');

router.get('/', (req, res) => {
    authController.logout(req, res);
});

module.exports = router;