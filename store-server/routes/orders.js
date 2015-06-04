'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    _ = require('lodash'),
    Models = require('../models'),
    Promise = require('bluebird'),
    Config = require('config'),
    moment = require('moment'),
    context = require('rabbit.js').createContext(Config.rabbit.host),
    push = context.socket('PUSH');

push.connect('orders', function() {
    console.log("Connected to push socket orders");
});

module.exports = function(server) {

    server.route({
        path: '/api/orders',
        method: 'GET',
        config: {
            tags: ['api'],
            auth: 'token',
            handler: function(request, reply) {

                Models.Order.findAll({
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
                            state: 'waiting expedition',
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
                                    var unfulfilledItems = [];
                                    Books.forEach(function(book) {
                                        if (book.dataValues.stock < book.OrderBook.quantity)
                                            unfulfilledItems.push(book);
                                    });

                                    if (unfulfilledItems.length == 0) {
                                        t.commit();
                                        Models.Order.update({
                                            state: 'toDispatch',
                                            dispatchDate: moment().add('days', 1)
                                        },{
                                            where: {
                                                id: NewOrder.dataValues.id
                                            }
                                        }).then(function() {
                                            return reply(NewOrder.dataValues);
                                        }).catch(function(error) {
                                            console.log("Error marking order as dispatched:", error);
                                            t.rollback();
                                            return reply(Boom.badImplementation("Internal server error"));
                                        });
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
        path: '/api/orders/{orderId}',
        method: 'GET',
        config: {
            tags: ['api'],
            auth: 'token',
            validate: {
                params: {
                    orderId: Joi.number().required()
                }
            },
            handler: function(request, reply) {

                Models.Order.findOne({
                    where: {
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
                Models.Customer.findOne({
                    where: {
                        id: request.params.userId
                    }
                }).then(function(Customer) {

                    if (!Customer)
                        return reply(Boom.notFound("User with the supplied id does not exist"));

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
                                    }),
                                    customerData: Customer.dataValues
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
                }).catch(function(error) {
                    console.log("Error:", error);
                    return reply(Boom.badImplementation("Internal server error"));
                });
            }
        }
    });

    server.route({
        path: '/api/orders/{orderId}/dispatch',
        method: 'POST',
        config: {
            tags: ['api'],
            validate: {
                params: {
                    orderId: Joi.number().integer().required()
                }
            },
            handler: function(request, reply) {
                Models.sequelize.transaction().then(function (t) {
                    Models.Order.findOne({
                        where: {
                            id: request.params.orderId
                        }
                    })
                    .then(function(Order) {
                        if (!Order)
                            return reply(Boom.notFound("No order with the supplied id was found"));

                        if (Order.dataValues.state == 'waiting expedition')
                            return reply(Boom.badRequest("The order with the supplied id is not ready for dispatch"));

                        if (Order.dataValues.state == 'dispatched')
                            return reply(Boom.badRequest("The order with the supplied id is already dispatched"));

                            Models.Order.update({
                                state: 'dispatched',
                                dispatchDate: moment()
                            }, {
                                where: {
                                    id: request.params.orderId
                                }
                            },{ transaction: t })
                            .then(function(NewOrder) {
                                Order.getBooks()
                                .then(function(Books) {
                                    Promise.map(Books, function(Book) {
                                        return Models.Book.update({
                                            stock: Book.dataValues.stock - Book.dataValues.OrderBook.dataValues.quantity
                                        }, {
                                            where: {
                                                id: Book.dataValues.id
                                            }
                                        }, {transaction: t});
                                    }).then(function() {
                                        t.commit();
                                        return reply(NewOrder.dataValues);
                                    }).catch(function(error) {
                                        console.log("Error:", error);
                                        t.rollback();
                                        return reply(Boom.badImplementation("Internal server error"));
                                    });
                                })
                                .catch(function(error) {
                                    console.log("Error:", error);
                                    t.rollback();
                                    return reply(Boom.badImplementation("Internal server error"));
                                })
                            })
                            .catch(function(error) {
                                console.log("Error:", error);
                                t.rollback();
                                return reply(Boom.badImplementation("Internal server error"));
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
        path: '/api/orders/{orderId}',
        method: 'PATCH',
        config: {
            tags: ['api'],
            validate: {
                params: {
                    orderId: Joi.number().integer().required()
                },
                payload: {
                    books: Joi.array().required().items(Joi.object().keys({
                        ISBN: Joi.string().required(),
                        quantity: Joi.number().integer().required()
                    }))
                }
            },
            handler: function(request, reply) {
                Models.sequelize.transaction().then(function (t) {
                    Models.Order.findOne({
                        where: {
                            id: request.params.orderId
                        }
                    })
                    .then(function(Order) {
                        if (!Order)
                            return reply(Boom.notFound("No order with the supplied id was found"));

                        Models.Order.update({
                            state: 'toDispatch',
                            dispatchDate: moment().add('days', 2)
                        }, {
                            where: {
                                id: request.params.orderId
                            }
                        },{ transaction: t })
                        .then(function() {
                            Promise.map(request.payload.books, function(book) {
                                return new Promise(function(resolve, reject) {
                                    Models.Book.findOne({
                                        where: {
                                            ISBN: book.ISBN
                                        }
                                    }).then(function(BookModel) {
                                        if (!BookModel)
                                            return reject("Book not found with ISBN: " + book.ISBN);

                                        Order.getBooks({
                                            where: {
                                                ISBN: book.ISBN
                                            }
                                        }).then(function(OrderBook) {
                                            if (!OrderBook || OrderBook.length == 0)
                                                return reject("No order book found for ISBN:" + book.ISBN);

                                            Models.Book.update({
                                                stock: BookModel.dataValues.stock + book.quantity //OrderBook[0].dataValues.OrderBook.dataValues.quantity)
                                            }, {
                                                where: {
                                                    ISBN: book.ISBN
                                                }
                                            }, {transaction: t}).then(function(NewBookModel) {
                                                return resolve(NewBookModel.dataValues);
                                            }).catch(function(error) {
                                                return reject(error);
                                            });
                                        }).catch(function(error) {
                                            return reject(error);
                                        });

                                    }).catch(function(error) {
                                        return reject(error);
                                    });
                                });
                            }).then(function() {
                                t.commit();
                                return reply(Order.dataValues);
                            }).catch(function(error) {
                                console.log("Error:", error);
                                t.rollback();
                                return reply(Boom.badImplementation("Internal server error"));
                            });
                        })
                        .catch(function(error) {
                            console.log("Error updating order:", error);
                            t.rollback();
                            return reply(Boom.badImplementation("Internal server error"));
                        });
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
};