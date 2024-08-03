const tokenService = require('../services/token.service');
const dbService = require('../services/database.service');

const create = async (req, res) => {
    const token = await tokenService.verifyToken(req);

    if (token.isVerified) {
        const data = req.body;
        data['companyId'] = token.data.uid;

        try {
            const dataRes = await dbService.createRecord(data, "studentSchema");

            res.status(200).json({
                message: "Record Created !",
                data: dataRes
            });
        } catch (error) {
            res.status(409).json({
                message: "Record not created",
                error: error
            });
        }
    }
    else {
        res.status(401).json({
            message: "Permission denied !"
        });
    }
}

const createUser = async (req, res) => {
    const query = {
        _id: req.params.id
    }
    const updateMe = {
        updatedAt: Date.now(),
        isUser: true,
        isProfile: req.body.isProfile,
        studentProfile: req.body.studentProfile,
        status: true
    }

    await dbService.updateByQuery(query, "studentSchema", updateMe);

    const userData = {
        uid: req.params.id,
        password: req.body.password,
        role: "student"
    }

    await dbService.createRecord(userData, "userSchema");

    res.status(200).json({
        message: req.body
    })
}

const allStudents = async (req, res) => {
    const token = tokenService.verifyToken(req);

    if (token.isVerified) {
        const query = {
            companyId: req.params.companyId
        }

        const dataRes = await dbService.getRecordByQuery(query, "studentSchema");

        res.status(200).json({
            data: dataRes
        })
    }
    else {
        res.status(401).json({
            message: "Permission denied !"
        });
    }
}

const countStudents = async (req, res) => {
    const token = await tokenService.verifyToken(req);

    if (token.isVerified) {
        const dataRes = await dbService.countData("studentSchema");

        res.status(200).json({
            data: dataRes
        });
    }
    else {
        res.status(401).json({
            message: "Permission denied !"
        });
    }
}

const invitation = async (req, res) => {
    const token = req.params.studentToken;
    const tokenData = await tokenService.customTokenVerification(token);

    if (tokenData.isVerified) {
        const studentId = tokenData.data.studentId;
        const student = await getStudentInfo(studentId); // calling...

        if (!student.isUser) {
            res.render('invitation');
        }
        else {
            res.redirect('/');
        }
    } else {
        res.status(401).redirect("/");
    }
}

const paginate = async (req, res) => {
    const token = await tokenService.verifyToken(req);

    if (token.isVerified) {
        let from = Number(req.params.from);
        let to = Number(req.params.to);
        let query = {
            companyId: token.data.uid
        }

        const dataRes = await dbService.paginateData(query, from, to, "studentSchema");

        res.status(200).json({
            data: dataRes
        });
    }
    else {
        res.status(401).json({
            message: "Permission denied !"
        });
    }
}

const deleteStudents = async (req, res) => {
    const token = await tokenService.verifyToken(req);

    if (token.isVerified) {
        const { id } = req.params;
        const deleteRes = await dbService.deleteById(id, "studentSchema");

        res.status(200).json({
            data: deleteRes
        });
    }
    else {
        res.status(401).json({
            message: "Permission denied !"
        });
    }
}

const updateStudents = async (req, res) => {
    const token = await tokenService.verifyToken(req);

    if (token.isVerified) {
        const id = req.params.id;
        const data = req.body;
        const updateRes = await dbService.updateById(id, data, "studentSchema");

        res.status(200).json({
            data: updateRes
        });
    }
    else {
        res.status(401).json({
            message: "Permission denied !"
        });
    }
}

const getStudentInfo = async (studentId) => {
    const query = {
        _id: studentId
    }

    const dataRes = await dbService.getRecordByQuery(query, 'studentSchema');
    return dataRes[0];
}

const getStudentId = async (req, res) => {
    const token = await tokenService.verifyToken(req);

    if (token.isVerified) {
        const query = {
            studentEmail: token.data.email
        }

        const companyRes = await dbService.getRecordByQuery(query, "studentSchema");

        if (companyRes.length > 0) {
            res.status(200).json({
                status: 200,
                isCompanyExists: true,
                message: "Company found !",
                data: companyRes
            });
        }
        else {
            res.status(404).json({
                status: 404,
                isCompanyExists: false,
                message: "Company not found !"
            });
        }
    }
    else {
        res.status(401).json({
            message: "Permission Denied !"
        });
    }
}

module.exports = {
    create,
    allStudents,
    countStudents,
    invitation,
    paginate,
    deleteStudents,
    updateStudents,
    createUser,
    getStudentId
}