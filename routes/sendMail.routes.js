const express = require('express');
const router = express.Router();

const sendMailController = require('../controller/sendMail.controller');

router.post("/", (req, res) => {
    sendMailController.sendEmail(req, res);
});

module.exports = router;