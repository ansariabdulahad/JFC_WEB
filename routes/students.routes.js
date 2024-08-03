const express = require('express');
const router = express.Router();

const studentsController = require('../controller/students.controller');
const routePermissionMiddleware = require('../middleware/route-permission.middleware');

router.get('/', routePermissionMiddleware, (req, res) => {
    res.render('students');
});

router.get('/all/:companyId', (req, res) => {
    studentsController.allStudents(req, res);
});

router.get('/count-all', (req, res) => {
    studentsController.countStudents(req, res);
});

router.get('/login/:query', (req, res) => {
    studentsController.getStudentId(req, res);
});

router.get('/invitation/:studentToken', (req, res) => {
    studentsController.invitation(req, res);
});

router.get('/:from/:to', (req, res) => {
    studentsController.paginate(req, res);
});

router.post('/', (req, res) => {
    studentsController.create(req, res);
});

router.post('/:id', (req, res) => {
    studentsController.createUser(req, res);
})

router.delete('/:id', (req, res) => {
    studentsController.deleteStudents(req, res);
});

router.put("/:id", (req, res) => {
    studentsController.updateStudents(req, res);
})

module.exports = router;