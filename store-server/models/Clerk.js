module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Clerk', {
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true
            },
            required: true
        },
        password: {
            type: DataTypes.STRING,
            required: true
        }
    });
};
