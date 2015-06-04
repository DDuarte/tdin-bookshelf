module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Order', {
        state: {
            type: DataTypes.ENUM('waiting expedition', 'dispatched', 'toDispatch'),
            required: true
        },
        dispatchDate: {
            type: DataTypes.DATE
        }
    });
};
