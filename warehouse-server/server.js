/// <reference path="../typings/hapi/hapi.d.ts""/>

var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    port: 8080
});

// sequelize models
require('./models');

// Add the route
server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {
        reply('hello world');
    }
});

// Start the server
server.start(function () {
    console.log("Server started @:", server.info.uri);
});
