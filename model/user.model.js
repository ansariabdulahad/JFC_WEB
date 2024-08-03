const mongo = require('mongoose');
const { Schema, model } = mongo;

const bcryptService = require('../services/bcrypt.service');

const userSchema = new Schema({
    uid: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: String,
    expiresIn: Number,
    isLogged: Boolean,
    role: String,
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// UNIQUE VALIDATION FOR PASSWORD USING INBUILED MONGOOSE MIDDLEWARE CODING
userSchema.pre("save", async function (next) {
    const data = this.password.toString();
    const encryptedData = await bcryptService.encrypt(data);
    this.password = encryptedData;
    next();
})

module.exports = model("User", userSchema);