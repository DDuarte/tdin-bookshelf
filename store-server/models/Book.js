module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Book', {
        ISBN: {
            type: DataTypes.STRING
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
            unsigned: true
        }
    });
};
