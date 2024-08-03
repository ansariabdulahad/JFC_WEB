const ajax = require('supertest');

const postRequest = async (req) => {
    const response = await ajax(req.endPoint) // http://localhost:8080
        .post(req.api) // /api/private/company
        .send({ token: req.data });

    return response.body;
}

const getRequest = async (req) => {
    const response = await ajax(req.endPoint)
        .get(req.api + "/" + req.data)
        .set({ 'X-Auth-Token': req.data });

    return response.body;
}

const putRequest = async (req) => {
    const response = await ajax(req.endPoint)
        .put(req.api + "/" + req.data)
        .send({ token: req.data });

    return response;
}

module.exports = {
    postRequest,
    getRequest,
    putRequest
}