const sequelize = require("../sequelize");
const { DataTypes, Sequelize, Deferrable } = require('sequelize');
const Shuttle = require("./shuttle");
const Partier = require("./partier");

const ShuttleMember = sequelize.define('shuttlemember', {
    shuttleid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    partierid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Partier,
            key: 'userid',
            deferrable: Deferrable.INITIALLY_IMMEDIATE
        }
    },
    hasvalidated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    hasarrivedsafely: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = ShuttleMember;
