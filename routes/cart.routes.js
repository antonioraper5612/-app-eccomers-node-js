const express = require('express');

// Controler
const {
    addProductToCart,
    getUserCart,
    updateCartProduct,
    removeProductFromCart,
    purchaseCart
} = require('../controllers/cart.controller');

// Middleware
const { validateSession } = require('../middelware/auth.middelware');
const {
    productInCartValidation,
    validateResult
} = require('../middelware/validators.middleware');
const { cartExists } = require('../middelware/cart.middelware');
const { productExists } = require('../middelware/products.middleware');

const router = express.Router();

router.use(validateSession);

router.get('/', getUserCart);

router.post(
    '/add-product',
    productInCartValidation,
    validateResult,
    addProductToCart
);

router.patch(
    '/update-product',
    productInCartValidation,
    validateResult,
    productExists,
    cartExists,
    updateCartProduct
);

router.post('/purchase', cartExists, purchaseCart);

router.delete('/:productId', cartExists, removeProductFromCart);

module.exports = { cartRouter: router };
