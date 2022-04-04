const { Sequelize } = require('sequelize');
const dotenv = require('dotenv')


dotenv.config({ path: "./config.env" })



const db = new Sequelize({
    dialect: 'postgres',
    host: process.env.HOSTDB,
    username: process.env.DBUSERNAME,
    password: process.env.PASSWORD,
    database: process.env.DBNAME,
    port: process.env.PORTDB,
    logging: false

})

module.exports = { db }