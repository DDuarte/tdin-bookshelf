module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Book', {
        ISBN: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        Title: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true,
        }
    });
};
