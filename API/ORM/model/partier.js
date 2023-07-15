const sequelize = require("../sequelize");
const { DataTypes, Sequelize, Deferrable } = require('sequelize');
const User = require("./user");

const Partier = sequelize.define('partier', {
    userid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    refphonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    addresstown: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    addresszipcode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true
});




module.exports = Partier;
