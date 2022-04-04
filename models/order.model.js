const { db } = require('../util/database')
const { DataTypes } = require('sequelize')

const Order = db.define('order', {
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
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    issuedAt: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        //activo suspendido
    },
    status: {
        type: DataTypes.STRING(11),
        allowNull: false,
        defaultValue: "active"
        // admin visitante
    }


}, { timestamps: false })

module.exports = { Order }