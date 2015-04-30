module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Customer', {
        name: {
            type: DataTypes.STRING(64)
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true
            },
            required: true
        },
        date: {
            type: DataTypes.DATE
        },
        active: {
            type: DataTypes.BOOLEAN
        },
        address: {
            type: DataTypes.STRING,
            required: true
        }
    });
};