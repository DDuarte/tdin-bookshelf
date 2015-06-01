'use strict';

var books = require('google-books-search'),
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
                    field: 'title',
                    offset: 0,
                    limit: 10,
                    type: 'books',
                    order: 'relevance',
                    lang: 'en'
                }, function(error, results) {
                    if (error)
                        return reply(error).code(500);

                    return reply(results);
                });
            }
        }
    })

};