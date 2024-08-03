const express = require('express');
const router = express.Router();

const accessController = require('../controller/access.controller');

router.get('/', (req, res) => {
    accessController.getAccess(req, res);
})

module.exports = router;