module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Book', {
        ISBN: {
            type: DataTypes.STRING,
            unique: true,
            required: true
        },
        year: {
            type: DataTypes.INTEGER
        },
        title: {
            type: DataTypes.STRING,
            required: true
        },
        stock: {
            type: DataTypes.INTEGER,
            unsigned: true,
            default: 0
        },
        price: {
            type: DataTypes.DOUBLE,
            required: true
        },
        description: {
            type: DataTypes.TEXT
        }
    });
};
