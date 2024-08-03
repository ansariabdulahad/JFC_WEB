const express = require('express');
const router = express.Router();

const exportController = require('../controller/export.controller');

router.post('/', (req, res) => {
    exportController.pdf(req, res);
});

router.delete('/:filename', (req, res) => {
    exportController.deletePdf(req, res);
});

module.exports = router;