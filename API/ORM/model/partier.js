const sequelize = require("../sequelize");
const { DataTypes, Sequelize, Deferrable } = require('sequelize');
const User = require("./user");

const Partier = sequelize.define('partier', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
            deferrable: Deferrable.INITIALLY_IMMEDIATE
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    refPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    addressTown: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    addressZipCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = Partier;
