'use strict';

var Joi = require('joi'),
    Models = require('../models'),
    Boom = require('boom');

module.exports = function(server) {
    server.route({
        path: '/api/books',
        method: 'POST',
        config: {
            tags: ['api'],
            validate: {
                payload: {
                    title: Joi.string().required(),
                    description: Joi.string().allow(null),
                    isbn: Joi.string().required(),
                    stock: Joi.number().required(),
                    price: Joi.number().required(),
                    thumbnail: Joi.string().required()
                }
            },
            handler: function(request, reply) {
                Models.Book.findOne({
                    where: {
                        ISBN: request.payload.isbn
                    }
                })
                .then(function(Book) {
                    if (Book)
                        return reply(Boom.badRequest("A book with the given ISBN already exists"));

                    Models.Book.create({
                        title: request.payload.title,
                        description: request.payload.description,
                        ISBN: request.payload.isbn,
                        stock: request.payload.stock,
                        price: request.payload.price,
                        thumbnail: request.payload.thumbnail
                    })
                    .then(function(NewBook) {
                        return reply(NewBook.dataValues);
                    })
                    .catch(function(Error) {
                        console.log("Error:", Error);
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
        path: '/api/books/latest',
        method: 'GET',
        config: {
            tags: ['api'],
            handler: function(request, reply) {
                Models.Book.findAll({
                    limit: 3
                }).then(function (books) {
                    return reply(books);
                }).catch(function (error) {
                    return Boom.badImplementation(error);
                });
            }
        }
    });

    server.route({
        path: '/api/books/{id}',
        method: 'GET',
        config: {
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.number().required()
                }
            },
            handler: function(request, reply) {
                Models.Book.findOne({
                    where: {
                        id: request.params.id
                    }
                })
                .then(function(Book) {
                    if (!Book)
                        return reply(Boom.notFound("Book not found"));

                    return reply(Book.dataValues);
                })
                .catch(function(error) {
                    console.log("Error:", error);
                    return reply(Boom.badImplementation(error));
                });
            }
        }
    });
};