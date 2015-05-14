module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Employee', {
        Username: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true,
			unique: true
        },
		Name: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true
        },
		PassHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            required: true
        },
    });
};
