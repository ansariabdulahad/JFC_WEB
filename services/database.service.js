const mongo = require('mongoose');
const companySchema = require('../model/company.model');
const userSchema = require('../model/user.model');
const studentSchema = require('../model/students.model');

const { MONGO_USER, MONGO_PASSWORD, MONGO_DB_NAME } = process.env;

const URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@jfc.dupualb.mongodb.net/${MONGO_DB_NAME}`;
// const URL = "mongodb://localhost:27017/just-web";
mongo.connect(URL);

const schemaList = {
    companySchema: companySchema,
    userSchema: userSchema,
    studentSchema: studentSchema
}

const createRecord = async (data, schema) => {
    const currentSchema = schemaList[schema];
    const dataRes = await new currentSchema(data).save();
    return dataRes;
}

const getRecordByQuery = async (query, schema) => {
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.find(query);
    return dataRes;
}

const updateByQuery = async (query, schema, data) => {
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.updateOne(query, data);
    return dataRes;
}

const countData = async (schema) => {
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.countDocuments();
    return dataRes;
}

const paginateData = async (query, from, to, schema) => {
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.find(query).skip(from).limit(to);
    return dataRes;
}

const deleteById = async (id, schema) => {
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.findByIdAndDelete(id);
    return dataRes;
}

const updateById = async (id, data, schema) => {
    const currentSchema = schemaList[schema];
    const dataRes = await currentSchema.findByIdAndUpdate(id, data, { new: true });
    return dataRes;
}

module.exports = {
    createRecord,
    getRecordByQuery,
    updateByQuery,
    countData,
    paginateData,
    deleteById,
    updateById
}