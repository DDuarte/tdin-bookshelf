'use strict';

var Models = require('../models'),
    Joi = require('joi'),
    Jwt = require('jsonwebtoken'),
    _ = require('lodash'),
    CryptoJS = require('crypto-js'),
    SHA256 = require("crypto-js/sha256"),
    Boom = require('boom');

var privateKey = require('config').jwt;

module.exports = function (server) {

    function validate(decodedToken, callback) {
        var error;

        Models.Customer.findOne({
            where: {
                id: decodedToken.id
            }
        })
        .then(function (Customer) {
            if (!Customer)
                return callback(error, false, {});

            return callback(error, true, _.assign(Customer.dataValues));
        })
        .catch(function () {
            return callback(error, false, {});
        });
    }

    server.register(require('hapi-auth-jwt'), function () {
        server.auth.strategy('token', 'jwt', {
            key: privateKey,
            validateFunc: validate
        });
    });

    server.route({
        path: '/api/register',
        method: 'POST',
        config: {
            tags: ['api'],
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().required(),
                    name: Joi.string().required(),
                    address: Joi.string().required()
                }
            },
            handler: function (request, reply) {

                Models.Customer.findOne({
                    where: {
                        email: request.payload.email
                    }
                })
                .then(function(Customer) {

                    if (Customer)
                        return reply(Boom.badRequest("Customer already exists"));

                    Models.Customer.create({
                        email: request.payload.email,
                        password: SHA256(request.payload.password).toString(CryptoJS.enc.Base64),
                        name: request.payload.name,
                        address: request.payload.address
                    })
                    .then(function(NewCustomer) {
                        var ret = _.omit(NewCustomer.dataValues, 'password');
                        ret.scope = 'customer';
                        ret = _.set(ret, 'token', Jwt.sign(ret, privateKey));
                        return reply(ret);
                    })
                    .catch(function(error) {
                        console.log(error);
                        return reply(Boom.badImplementation('Internal server error'));
                    });
                })
                .catch(function(error) {
                    console.log("Error:", error);
                    return reply(Boom.badImplementation("Internal server error"));
                });
            }
        }
    });

    server.route({
        path: '/api/login',
        method: 'POST',
        config: {
            tags: ['api'],
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                }
            },
            handler: function (request, reply) {
                Models.Customer.findOne({
                    where: {
                        email: request.payload.email,
                        password: SHA256(request.payload.password).toString(CryptoJS.enc.Base64)
                    }
                })
                .then(function(Customer) {
                    if (Customer) {
                        console.log("Customer:", Customer);
                        var ret = _.omit(Customer.dataValues, 'password');
                        ret.scope = 'customer';
                        ret = _.set(ret, 'token', Jwt.sign(ret, privateKey));
                        return reply(ret);
                    }

                    Models.Clerk.findOne({
                        where: {
                            email: request.payload.email,
                            password: SHA256(request.payload.password).toString(CryptoJS.enc.Base64)
                        }
                    }).then(function(Clerk) {
                        if (!Clerk)
                            return reply(Boom.badRequest("Invalid email and/or password"));

                        var ret = _.omit(Clerk.dataValues, 'password');
                        ret.scope = 'clerk';
                        ret = _.set(ret, 'token', Jwt.sign(ret, privateKey));
                        return reply(ret);
                    }).catch(function(error) {
                        console.log("Error:", error);
                        return reply(Boom.badImplementation("Internal server error"));
                    });

                })
                .catch(function(error) {
                    console.log("Error:", error);
                    return reply(Boom.badImplementation('Internal server error'));
                });
            }
        }
    });
};