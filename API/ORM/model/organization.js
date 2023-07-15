const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');
const User = require('./user');

const Organization = sequelize.define('organization', {
    userid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    responsiblename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isverified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,   
    }
}, {
    timestamps: false,
    freezeTableName: true
});

Organization.hasOne(User, {foreignKey: 'id', sourceKey: 'userid'});
User.belongsTo(Organization, {foreignKey: 'id', targetKey: 'userid'});

module.exports = Organization;