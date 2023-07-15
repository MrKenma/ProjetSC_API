const sequelize = require("../sequelize");
const { DataTypes } = require('sequelize');
const Partier = require("./partier");

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
    phonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hasuploadedprofilepicture: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    timestamps: false,
    freezeTableName: true
});


module.exports = User;