
const { body } = require("express-validator")
const { validationResult } = require("express-validator")
const { AppError } = require('../util/appError')





// Products validations
exports.createProductValidations = [
    body('title')
        .isString()
        .withMessage('Title must be a string')
        .notEmpty()
        .withMessage('Must provide a valid title'),
    body('description')
        .isString()
        .withMessage('Description must be a string')
        .notEmpty()
        .withMessage('Must provide a valid description'),
    body('quantity')
        .isNumeric()
        .withMessage('Quantity must be a number')
        .custom((value) => value > 0)
        .withMessage('Quantity must be greater than 0'),
    body('price')
        .isNumeric()
        .withMessage('Quantity must be a number')
        .custom((value) => value > 0)
        .withMessage('Quantity must be greater than 0')
];

// END: Products validations

// Cart validations
exports.productInCartValidation = [
    body('productId')
        .isNumeric()
        .withMessage('Product id must be a number')
        .custom((value) => value > 0)
        .withMessage('Must provide a valid id'),
    body('quantity')
        .isNumeric()
        .withMessage('Quantity must be a number')
        .custom((value) => value > 0)
        .withMessage('Quantity must be greater than 0')
];


exports.validateResult = (req, res, next) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const message = errors.array().map(({ msg, param }) => `${msg} - ${param}`).join('. ');
        return next(new AppError(400, message))
    }
    next();
}