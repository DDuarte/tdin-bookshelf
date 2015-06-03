module.exports = function(sequelize, DataTypes) {
    return sequelize.define('OrderBook', {
        quantity: {
            type: DataTypes.INTEGER,
            unsigned: true
        }
    });
};
