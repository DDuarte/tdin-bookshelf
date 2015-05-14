/// <reference path="../typings/hapi/hapi.d.ts""/>
/// <reference path="../typings/rabbitjs/rabbit.js.d.ts""/>

var Hapi = require('hapi'),
    config = require('config'),
    context = require('rabbit.js').createContext(config.messageQueue);

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    port: 8080
});

// sequelize models
var db = require('./models');

// Add the route
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('hello world');
    }
});

var pull = context.socket('PULL');
pull.setEncoding('utf8');

server.on('stop', function () {
    pull.close();
});

pull.connect('orders', function () {
    console.log('Connected to pull socket orders');
});

pull.on('data', function (msg) {
    try {
        var orderObj = JSON.parse(msg);
    } catch (err) {
        console.log('Error "' + err + '" when parsing message "' + msg + '"');
        return;
    }

    db.Book.create({ ISBN: 'my-isbn-' + Math.floor(Math.random() * 10000), Title: 'SomeTitle1' }).then(function (b1) {
        db.Book.create({ ISBN: 'my-isbn-' + Math.floor(Math.random() * 10000), Title: 'SomeTitle2' }).then(function (b2) {
            db.Order.create({ dispatched: false }).then(function (order) {
                console.log(JSON.stringify(order));
                order.setOrderBooks([b1, b2]).then(function () {
                    console.log('Added order');
                });
            });
        });
    });
});

// Start the server
server.start(function () {
    console.log('Server started @:', server.info.uri);
});
