module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Order', {
        state: {
            type: DataTypes.ENUM('waiting', 'dispatched', 'toDispatch'),
            required: true
        },
        date: {
            type: DataTypes.DATE
        }
    });
};
