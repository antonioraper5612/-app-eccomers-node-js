const { db } = require('../util/database')
const { DataTypes } = require('sequelize')

const Cart = db.define('cart', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(11),
        allowNull: false,
        defaultValue: "active"
        //activo suspendido
    }

}, { timestamps: false })

module.exports = { Cart }