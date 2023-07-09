const { Sequelize } = require('sequelize');
require("dotenv").config();
const process = require("process");
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    omitNull: true,
});

module.exports = sequelize;