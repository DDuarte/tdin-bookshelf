'use strict';

var books = require('google-books-search-2'),
    Joi = require('joi');

module.exports = function (server) {

    server.route({
        path: '/api/books/search/{term}',
        method: 'GET',
        config: {
            validate: {
                query: {
                    country: Joi.string().allow(null),
                    field: Joi.string().required()
                },
                params: {
                    term: Joi.string().required()
                }
            },
            tags: ['api'],
            handler: function (request, reply) {
                books.search(request.params.term, {
                    field: request.query.field,
                    offset: 0,
                    limit: 10,
                    type: 'books',
                    order: 'relevance',
                    lang: 'en',
                    projection: 'full'
                })
                .then(function(results) {
                    return reply(results);
                })
                .catch(function(error) {
                    console.log(error);
                    return reply(error);
                });
            }
        }
    });

};