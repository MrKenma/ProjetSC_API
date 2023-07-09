const sequelize = require("../sequelize");
const { DataTypes } = require('sequelize');

const Shuttle = sequelize.define('shuttle', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrementIdentity: true,
    },
    departuretime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    eventid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    destinationtown: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destinationzipcode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    timestamps: false,
    freezeTableName: true
});

module.exports = Shuttle;