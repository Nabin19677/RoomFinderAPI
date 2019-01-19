//Helper
const helpers = require('../Helpers/helpers');
const httpCodes = require('http-status-codes');
const expressValidators = require('express-validator');

//User Schema
const User = require('../Models/userSchema');
//Config
const config = require('../config/config');
//JSON WEB TOKEN
const jwt = require('jsonwebtoken');

//user controller
auth = {};

//user - POST METHOD
//required - fullname,email,phone,password
auth.register = async function (req, res) {
    //Leave validation if it is in client side but do a low level validation though.

    //Check of phone already exist
    const userPhone = await User.findOne({ phone: req.body.phone });
    const userEmail = await User.findOne({ email: req.body.email });
    if (userPhone) {
        res.send({
            'statusCode': 409,
            'statusMessage': 'Phone already exist'
        });
    } else if (userEmail) {
        res.send({
            'statusCode': 409,
            'statusMessage': 'Email already exist'
        });
    }
    else {
        //hashing password using helpers
        req.body.password = helpers.hash(req.body.password);
        User.create(req.body)
            .then(data => { //if sucessful
                res.send({
                    'statusCode': httpCodes.CREATED,
                    'statusMessage': 'User added successfully',
                    'data': 'data',
                    'Date': Date.now()

                });
            })
            .catch(err => {
                res.send({ //if error, probably something wrong with server mongodb
                    'statusCode': httpCodes.INTERNAL_SERVER_ERROR,
                    'statusMessage': 'SERVER ERROR'
                })
            });

    }
};

auth.login = async function (req, res) { //req.body for body part   
    await User.findOne({ phone: req.body.phone })
        .then((data) => {
            if (helpers.hash(req.body.password) == data.password) {
                jwt.sign({ data }, config.jwtSecret, {
                    expiresIn: '10 days' //this token expires in 10 days
                }, (err, token) => {
                    if (err) {
                        res.send({
                            'statusCode': httpCodes.INTERNAL_SERVER_ERROR,
                            'statusMessage': 'SERVER ERROR'
                        });
                    } else {
                        data.password = null;
                        res.cookie('token', token);
                        res.cookie('userObject', data);
                        res.send({
                            'statusCode': httpCodes.OK,
                            'statusMessage': 'Log in successful',
                            token,
                            userObject: data
                        });
                    }
                });
            } else {
                res.send({
                    'statusCode': httpCodes.CONFLICT,
                    'statusMessage': 'User Password or Phone is wrong'
                });
            }
        })
        .catch((err) => {
            res.send({
                'statusCode': httpCodes.CONFLICT,
                'statusMessage': 'User dont exist;'
            });
        });
}

module.exports = auth;