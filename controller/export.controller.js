const tokenService = require('../services/token.service');
const Pdf = require('pdfkit-table');
const fs = require('fs');
const crypto = require('crypto');

const pdf = async (req, res) => {
    const random = crypto.randomBytes(4).toString('hex');
    const pdfFile = `public/exports/${random}.pdf`;
    const commingData = req.body;
    const pdfData = JSON.parse(commingData.data);
    const token = await tokenService.verifyToken(req);
    const company = token.data.companyInfo;

    if (token.isVerified) {
        const doc = new Pdf({
            margin: 30,
            page: 'A4'
        });

        const table = {
            title: "Students Report",
            headers: [
                {
                    label: "Name",
                    property: "name"
                },
                {
                    label: "Email",
                    property: "email"
                },
                {
                    label: "Father",
                    property: "father"
                },
                {
                    label: "Mobile",
                    property: "mobile"
                },
                {
                    label: "Address",
                    property: 'address'
                },
                {
                    label: "Joined At",
                    property: "joinedAt"
                }
            ],
            datas: []
        };

        for (let data of pdfData) {
            table.datas.push({
                name: data.studentName,
                email: data.studentEmail,
                father: data.studentFather,
                mobile: data.studentMobile,
                address: data.studentAddress,
                joinedAt: data.createdAt
            });
        }

        doc.pipe(fs.createWriteStream(pdfFile));
        doc.fontSize(20);
        doc.text(company.company, {
            align: 'center',
        });
        doc.moveDown(2);
        doc.table(table);
        doc.end();

        res.status(200).json({
            message: "Success",
            filename: random + ".pdf"
        });
    }
    else {
        res.status(401).json({
            message: "Permission denied !"
        });
    }
}

const deletePdf = async (req, res) => {
    const token = await tokenService.verifyToken(req);

    if (token.isVerified) {
        let filename = "public/exports/" + req.params.filename;
        fs.unlinkSync(filename);

        res.status(200).json({
            message: "Success"
        });
    }
    else {
        res.status(401).json({
            message: "Permission denied !"
        });
    }
}

module.exports = {
    pdf,
    deletePdf
}