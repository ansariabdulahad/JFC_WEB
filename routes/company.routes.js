const express = require('express');
const router = express.Router();

const companyController = require('../controller/company.controller');

router.post('/', (req, res) => {
    companyController.createCompany(req, res);
});

router.get('/:query', (req, res) => {
    companyController.getCompanyId(req, res);
});

router.put('/:id', (req, res) => {
    companyController.updateCompanyData(req, res);
});

module.exports = router;