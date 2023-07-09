const sequelize = require("../sequelize");
const { DataTypes, Sequelize, Deferrable } = require('sequelize');
const Shuttle = require("./shuttle");
const Partier = require("./partier");

const ShuttleMember = sequelize.define('shuttleMember', {
    shuttleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Shuttle,
            key: 'id',
            deferrable: Deferrable.INITIALLY_IMMEDIATE
        }
    },
    partierId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Partier,
            key: 'userId',
            deferrable: Deferrable.INITIALLY_IMMEDIATE
        }
    },
    hasValidated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    hasArrivedSafely: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = ShuttleMember;
