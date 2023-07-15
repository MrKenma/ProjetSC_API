const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');
const Shuttle = require('./shuttle');
const Organization = require('./organization');

const Event = sequelize.define('event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrementIdentity: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nameandnumstreet: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    departingpoint : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startdatetime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    enddatetime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    organizationid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    addresstown: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    addresszipcode: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
    freezeTableName: true
});

Event.hasMany(Shuttle, {foreignKey: 'eventid', sourceKey: 'id'});
Shuttle.belongsTo(Event, {foreignKey: 'eventid', targetKey: 'id'});

Organization.hasMany(Event, {foreignKey: 'organizationid', sourceKey: 'userid'});
Event.belongsTo(Organization, {foreignKey: 'organizationid', targetKey: 'userid'});

module.exports = Event;