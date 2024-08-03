const AWS = require('aws-sdk');
const pug = require('pug');
const tokenService = require('../services/token.service');
const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, SOURCE_EMAIL } = process.env;

const config = {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: REGION
}
const mailer = new AWS.SES(config);


const sendEmail = async (req, res) => {
    const token = tokenService.verifyToken(req);

    if (token.isVerified) {
        const data = JSON.parse(req.body.reciept);
        const emailInfo = {
            Destination: {
                ToAddresses: [
                    data.to
                ]
            },
            Message: {
                Subject: {
                    Charset: "UTF-8",
                    Data: data.subject
                },
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: pug.renderFile("D:/JustForCode_Lec/Node JS/PROJECT/JFC_WEB/views/email-template.pug", data)
                    }
                }
            },
            Source: SOURCE_EMAIL
        }
        try {
            await mailer.sendEmail(emailInfo).promise();
            res.status(200).json({
                message: "Sending success"
            });
        } catch (error) {
            res.status(424).json({
                message: "Sending Failed"
            });
        }
    }
    else {
        res.status(401).json({
            message: "Permission denied !"
        });
    }
}

module.exports = {
    sendEmail
}