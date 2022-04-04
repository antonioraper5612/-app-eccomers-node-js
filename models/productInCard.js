const { db } = require('../util/database')
const { DataTypes } = require('sequelize')

const ProductInCart = db.define('productInCart', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'active'
    }
}, { timestamps: false });




module.exports = { ProductInCart }