const express = require('express');
const router = express.Router();

const tokenController = require('../controller/token.controller');

router.post('/:expires', (req, res) => {
    tokenController.getToken(req, res);
});

module.exports = router;