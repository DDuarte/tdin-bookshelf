'use strict';

var Joi = require('joi');

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
            validate: {
                params: {
                    userId: Joi.number()
                },
                payload: {
                    items: Joi.array().items(Joi.object().keys({
                            id: Joi.number(),
                            quantity: Joi.number().integer()
                        }
                    ))
                }
            },
            handler: function(request, reply) {
                reply("Not yet implemented");
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