'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    _ = require('lodash'),
    Models = require('../models'),
    Promise = require('bluebird'),
    Config = require('config'),
    context = require('rabbit.js').createContext(Config.rabbit.host),
    push = context.socket('PUSH');

push.connect('orders', function() {
    console.log("Connected to push socket orders");
});

module.exports = function(server) {

    server.route({
        path: '/api/users/{userId}/orders',
        method: 'GET',
        config: {
            tags: ['api'],
            auth: 'token',
            validate: {
                params: {
                    userId: Joi.number().required()
                }
            },
            handler: function(request, reply) {

                if (request.auth.credentials.id != request.params.userId)
                    return reply(Boom.unauthorized("No permission"));

                Models.Order.findAll({
                    where: {
                        CustomerId: request.params.userId
                    }
                })
                .then(function(Orders) {

                    Promise.map(Orders, function(Order) {
                        return Order.getBooks()
                        .then(function(Books) {
                            return {
                                order: Order.dataValues,
                                items: _.map(Books, function(Book) {
                                    return Book.dataValues;
                                })
                            }
                        });
                    }).then(function(ret) {
                        return reply(ret);
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

                                    var unfulfilledItems = [];
                                    Books.forEach(function(book) {
                                        if (book.dataValues.stock < book.OrderBook.quantity)
                                            unfulfilledItems.push(book);
                                        else {
                                            Models.Book.update({
                                                where: {
                                                    id: book.dataValues.id
                                                }
                                            }, {
                                                stock: book.dataValues.stock - book.OrderBook.quantity
                                            })
                                            .catch(function(error) {
                                                console.log("Error updating book:", error);
                                                t.rollback();
                                                return reply(Boom.badImplementation("Internal server error"));
                                            });
                                        }
                                    });

                                    if (unfulfilledItems.length == 0) {
                                        t.commit();
                                        return reply(NewOrder.dataValues);
                                    } else {
                                        push.write(JSON.stringify({
                                            storeOrderId: NewOrder.dataValues.id,
                                            books: _.map(unfulfilledItems, function(book) {
                                                return {
                                                    title: book.dataValues.title,
                                                    ISBN: book.dataValues.ISBN,
                                                    quantity: book.OrderBook.quantity * 10
                                                }
                                            })
                                        }), 'utf8');
                                        t.commit();
                                        return reply(NewOrder.dataValues);
                                    }
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
            auth: 'token',
            validate: {
                params: {
                    userId: Joi.number(),
                    orderId: Joi.number()
                }
            },
            handler: function(request, reply) {
                if (request.auth.credentials.id != request.params.userId)
                    return reply(Boom.unauthorized("No permission"));

                Models.Order.findOne({
                    where: {
                        CustomerId: request.params.userId,
                        id: request.params.orderId
                    }
                })
                .then(function(Order) {

                    if (!Order)
                        return reply(Boom.notFound("No order found with the given id"));

                    Order.getBooks()
                    .then(function(Books) {
                        return reply({
                            orderData: Order.dataValues,
                            items: _.map(Books, function(Book) {
                                return Book.dataValues;
                            })
                        });
                    })
                    .catch(function(error) {
                        console.log("Error:", error);
                        return reply(Boom.badImplementation("Internal server error"));
                    });
                })
                .catch(function(error) {
                    console.log("Error:", error);
                    return reply(Boom.badImplementation("Internal server error"));
                });
            }
        }
    });
};