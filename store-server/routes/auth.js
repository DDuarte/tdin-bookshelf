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
                    email: Joi.string().email(),
                    password: Joi.string()
                }
            },
            handler: function (request, reply) {
                Models.Customer.create({
                    email: request.payload.email,
                    password: SHA256(request.payload.password).toString(CryptoJS.enc.Base64)
                })
                .then(function(NewCustomer) {
                    var ret = _.omit(NewCustomer, 'password');
                    ret.token = _.set(NewCustomer, 'token', Jwt.sign(ret, privateKey));
                    return reply(ret);
                })
                .catch(function(error) {
                        console.log(error);
                    return reply(Boom.badImplementation('Internal server error'));
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
                    email: Joi.string().email(),
                    password: Joi.string()
                }
            },
            handler: function (request, reply) {
                Models.Customer.findOne({
                    email: request.payload.email,
                    password: SHA256(request.payload.password).toString(CryptoJS.enc.Base64)
                })
                .then(function(Customer) {
                    var ret = _.omit(Customer, 'password');
                    ret.token = _.set(Customer, 'token', Jwt.sign(ret, privateKey));
                    return reply(ret);
                })
                .catch(function(error) {
                    return reply(Boom.badImplementation('Internal server error'));
                });
            }
        }
    })
};