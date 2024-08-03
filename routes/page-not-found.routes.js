const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('page-not-found');
});

module.exports = router;