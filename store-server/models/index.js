/// <reference path="../../typings/node/node.d.ts"/>

var Sequelize = require('sequelize');
var config    = require('config').database;  // we use node-config to handle environments

var FORCE_RESYNC = false; //SETTING THIS TO TRUE WILL DROP AND RE-CREATE ALL TABLES

var CryptoJS = require('crypto-js'),
    SHA256 = require("crypto-js/sha256");

// initialize database connection
var sequelize = new Sequelize(
    config.name,
    config.username,
    config.password,
    config.options
);

// load models
var models = [
    'Order',
    'Customer',
    'Book',
    'OrderBook',
    'Clerk'
];

models.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
    //module.exports[model].schema(POSTGRES_SCHEMA);
});

// describe relationships
(function(m) {

    m.Book.hasMany(m.Order, {
        through: m.OrderBook
    });

    m.Order.hasMany(m.Book, {
        through: m.OrderBook
    });

    m.Customer.hasMany(m.Order);

})(module.exports);

// sync models
sequelize.sync({force:FORCE_RESYNC}).then(function () {

    module.exports.Clerk.findOne({
        where: {
            email: 'clerk@bookshelf.com'
        }
    }).then(function (Clerk) {

        if (!Clerk) {
            module.exports.Clerk.bulkCreate([
                    {
                        email: 'clerk@bookshelf.com',
                        password: SHA256('bookshelf').toString(CryptoJS.enc.Base64)
                    }
                ]
            ).catch(function (error) {
                console.log("Error setting up:", error);
            });
        }
    });
    console.log('All models synced');
});

// export connection
module.exports.sequelize = sequelize;
