'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    _ = require('lodash'),
    Models = require('../models'),
    Promise = require('bluebird');

module.exports = function(server) {

    server.route({
        path: '/api/users/{userId}/orders',
        method: 'GET',
        config: {
            tags: ['api'],
            validate: {
                params: {
                    userId: Joi.number()
                }
            },
            handler: function(request, reply) {
                reply(request.params.userId);
            }
        }
    });

    server.route({
        path: '/api/users/{userId}/orders',
        method: 'POST',
        config: {
            tags: ['api'],
            auth: 'token',
            validate: {
                params: {
                    userId: Joi.number().required()
                },
                payload: {
                    items: Joi.array().items(Joi.object().keys({
                            id: Joi.number(),
                            quantity: Joi.number()
                        }
                    )).required()
                }
            },
            handler: function(request, reply) {

                if (request.auth.credentials.id != request.params.userId)
                    return reply(Boom.unauthorized("No permission"));

                Models.sequelize.transaction().then(function (t) {
                    Models.Customer.findOne({
                        where: {
                            id: request.auth.credentials.id
                        }
                    }, {transaction: t})
                    .then(function(Customer) {
                        Models.Order.create({
                            state: 'waiting',
                            CustomerId: request.auth.credentials.id
                        }, {transaction: t})
                        .then(function(NewOrder) {
                            Promise.map(request.payload.items, function(item) {
                                console.log("Mapping items");
                                return Models.Book.findOne({
                                    where: {
                                        id: item.id
                                    }
                                });
                            }).then(function(Books) {
                                for (var i = 0; i < Books.length; ++i) {
                                    Books[i].OrderBook = {
                                        quantity: request.payload.items[i].quantity
                                    }
                                }

                                NewOrder.setBooks(Books, {transaction: t})
                                    .then(function() {
                                        console.log("After set books");
                                        t.commit();
                                        return reply(NewOrder.dataValues);
                                    })
                                    .catch(function(error) {
                                        console.log("Error:", error);
                                        t.rollback();
                                        return reply(Boom.badImplementation("Internal server error"));
                                    });
                            }).catch(function(error) {
                                console.log("Error:", error);
                                t.rollback();
                                return reply(Boom.badImplementation("Internal server error"));
                            });
                        })
                    })
                    .catch(function(error) {
                        console.log("Error:", error);
                        t.rollback();
                        return reply(Boom.badImplementation("Internal server error"));
                    });
                });
            }
        }
    });

    server.route({
        path: '/api/users/{userId}/orders/{orderId}',
        method: 'GET',
        config: {
            tags: ['api'],
            validate: {
                params: {
                    userId: Joi.number(),
                    orderId: Joi.number()
                }
            },
            handler: function(request, reply) {
                reply("Not yet implemented");
            }
        }
    })
};