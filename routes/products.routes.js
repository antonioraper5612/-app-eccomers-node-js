const express = require('express');

// Controller
const {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    disableProduct
} = require('../controllers/products.controller');

// Middlewares
const { validateSession } = require('../middelware/auth.middelware');
const {
    productExists,
    productOwner
} = require('../middelware/products.middleware');
const {
    createProductValidations,
    validateResult
} = require('../middelware/validators.middleware');

const router = express.Router();

router.use(validateSession);

router
    .route('/')
    .get(getAllProducts)
    .post(createProductValidations, validateResult, createProduct);

router
    .use('/:id', productExists)
    .route('/:id')
    .get(getProductById)
    .patch(productOwner, updateProduct)
    .delete(productOwner, disableProduct);

module.exports = { productsRouter: router };
