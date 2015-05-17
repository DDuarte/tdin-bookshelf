'use strict';

var Joi = require('joi');

module.exports = function(server) {
    server.route({
        method: 'GET',
        path: '/api/users/{id}',
        config: {
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.number()
                }
            },
            handler: function(request, reply) {
                reply('Hello world');
            }
        }
    });
};