const jwt = require('jsonwebtoken');
const Userdata = require('../models/user');
const mongoose = require('mongoose');
const config = require('../config')
module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(401).send({
            error: "you must be logged in"
        })
    }
    const token = authorization.replace("Bearer ","");
    jwt.verify(token, config.jwt_token, (err, payload) => {
        if (err) {
            return res.status(401).send({
                error: "you must be logged in"
            })
        }
        const { _id } = payload;
        Userdata.findById(_id).then((data) => {
            req.user = data;
        })
        next();
    })
}