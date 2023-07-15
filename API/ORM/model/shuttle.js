const sequelize = require("../sequelize");
const { DataTypes } = require('sequelize');
const ShuttleMember = require("./shuttleMember");
const Partier = require("./partier");
const User = require("./user");

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

Shuttle.hasMany(ShuttleMember, {foreignKey: 'shuttleid', sourceKey: 'id'});
ShuttleMember.belongsTo(Shuttle, {foreignKey: 'shuttleid', targetKey: 'id'});

Partier.hasMany(ShuttleMember, {foreignKey: 'partierid', sourceKey: 'userid'});
ShuttleMember.belongsTo(Partier, {foreignKey: 'partierid', targetKey: 'userid'});

Partier.hasOne(User, {foreignKey: 'id', sourceKey: 'userid'});
User.belongsTo(Partier, {foreignKey: 'id', targetKey: 'userid'});

module.exports = Shuttle;