// Models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCard');
const { Order } = require('../models/order.model');

const initModels = () => {
    // 1 Usuario <--> M Productos
    User.hasMany(Product);
    Product.belongsTo(User);

    // 1 Usuario <--> M Orden
    User.hasMany(Order);
    Order.belongsTo(User);

    // 1 Usuario <--> 1 carrito
    User.hasOne(Cart);
    Cart.belongsTo(User);

    // M Cart <--> M Product
    Cart.belongsToMany(Product, { through: ProductInCart });
    Product.belongsToMany(Cart, { through: ProductInCart });

    // 1 Order <--> 1 carrito
    Cart.hasOne(Order);
    Order.belongsTo(Cart);
};

module.exports = { initModels };
