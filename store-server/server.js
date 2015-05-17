/// <reference path="../typings/hapi/hapi.d.ts""/>

var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    port: 8000
});

// Plugins
server.register({
    register: require('hapi-swagger'),
    options: {
        apiVersion: require('./package').version
    }
}, function (err) {
    if (err) {
        server.log(['error'], 'hapi-swagger load error: ' + err);
    } else {
        server.log(['start'], 'hapi-swagger interface loaded');
    }
});

// routes
require('./routes')(server);

// Serve static files
server.route({
    method: 'GET',
    path: '/{name*}',
    handler: {
        directory: {
            path: 'public/app'
        }
    }
});

// Start the server
server.start(function () {
    console.log("Server started @:", server.info.uri);
});
