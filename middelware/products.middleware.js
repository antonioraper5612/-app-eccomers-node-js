// Models
const { Product } = require('../models/product.model');
const { User } = require('../models/user.model');

// Utils
const { AppError } = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

exports.productExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { productId } = req.body;

    const product = await Product.findOne({
        where: { status: 'active', id: id || productId },
        include: [{ model: User, attributes: { exclude: ['password'] } }]
    });

    if (!product) {
        return next(new AppError(404, 'No product found'));
    }

    req.product = product;

    next();
});

exports.productOwner = catchAsync(async (req, res, next) => {
    // Get current session user's id
    const { currentUser, product } = req;

    // compara si el producto le pertenece al usuario
    if (product.userId !== currentUser.id) {
        return next(new AppError(403, 'You are not the owner of this product'));
    }

    next();
});
