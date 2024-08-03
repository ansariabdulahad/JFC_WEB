const mongo = require('mongoose');
const { Schema, model } = mongo;

const companySchema = new Schema({
    company: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    mobile: Number,
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isLogo: {
        type: Boolean,
        default: false
    },
    logoUrl: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// UNIQUE VALIDATION FOR COMPANY NAME USING MONGOOSE INBUILED MIDDLEWARE CODING
companySchema.pre("save", async function (next) {
    const query = {
        company: this.company
    }
    const length = await model("Company").countDocuments(query);

    if (length > 0) {
        const cmpError = {
            label: "Company name already exists !",
            field: "company-name"
        }
        throw next(cmpError);
    }
    else {
        next();
    }
});

// UNIQUE VALIDATION FOR EMAIL USING MONGOOSE INBUILED MIDDLEWARE CODING
companySchema.pre("save", async function (next) {
    const query = {
        email: this.email
    }
    const length = await model("Company").countDocuments(query);

    if (length > 0) {
        const emailError = {
            label: "Email already exists !",
            field: "company-email"
        }
        throw next(emailError);
    }
    else {
        next();
    }
});

module.exports = model("Company", companySchema);