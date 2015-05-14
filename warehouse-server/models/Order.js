module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Order', {
        Date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            required: true
        },
        Dispatched: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            required: true
        },
        DispatchDate: {
            type: DataTypes.DATE,
            allowNull: true,
            required: true
        }
    });
};
