const mongo = require('mongoose');
const { Schema, model } = mongo;

const studentSchema = new Schema({
    companyId: String,
    studentName: String,
    studentEmail: {
        type: String,
        unique: true
    },
    studentFather: String,
    studentDob: String,
    studentMobile: Number,
    studentCountry: String,
    studentState: String,
    studentPincode: String,
    studentAddress: String,
    studentProfile: String,
    isProfile: Boolean,
    status: {
        type: Boolean,
        default: false,
    },
    isUser: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("student", studentSchema);