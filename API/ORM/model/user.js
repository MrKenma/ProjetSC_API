const sequelize = require("../sequelize");
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrementIdentity: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pseudo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hasUploadedProfilePicture: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = User;