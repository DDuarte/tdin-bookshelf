var Sequelize = require('sequelize');
var config    = require('config').database;  // we use node-config to handle environments

var FORCE_RESYNC = false; //SETTING THIS TO TRUE WILL DROP AND RE-CREATE ALL TABLES

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
    'Book'
];

models.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
    //module.exports[model].schema(POSTGRES_SCHEMA);
});

// describe relationships
(function(m) {

    m.Order.hasOne(m.Customer);
    m.Order.hasMany(m.Book, {
        through: {
            quantity: { type: Sequelize.INTEGER }
        }
    });
})(module.exports);

// sync models
sequelize.sync({force:FORCE_RESYNC}).then(function () {
    console.log('All models synced');
});

// export connection
module.exports.sequelize = sequelize;