// Models
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { ProductInCart } = require('../models/productInCard');
const { Order } = require('../models/order.model');

// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');

exports.getUserCart = catchAsync(async (req, res, next) => {
    const { currentUser } = req;

    const cart = await Cart.findOne({
        where: { status: 'active', userId: currentUser.id },
        include: [
            {
                model: Product,
                through: { where: { status: 'active' } }
            }
        ]
    });

    if (!cart) {
        return next(new AppError(404, 'This user does not have a cart yet'));
    }

    res.status(200).json({ status: 'success', data: { cart } });
});

exports.addProductToCart = catchAsync(async (req, res, next) => {
    const { currentUser } = req;
    const { productId, quantity } = req.body;

    const product = await Product.findOne({
        where: { status: 'active', id: productId }
    });

    if (quantity > product.quantity) {
        return next(
            new AppError(400, `This product only has ${product.quantity} items.`)
        );
    }

    const cart = await Cart.findOne({
        where: { status: 'active', userId: currentUser.id }
    });

    if (!cart) {
        // crea el cart
        const newCart = await Cart.create({ userId: currentUser.id });

        await ProductInCart.create({
            productId,
            cartId: newCart.id,
            quantity
        });
    } else {
        const productExists = await ProductInCart.findOne({
            where: { cartId: cart.id, productId }
        });

        if (productExists && productExists.status === 'active') {
            return next(new AppError(400, 'This product is already in the cart'));
        }

        // si el producto existe y su estatus es remove , lo cambia a active y actualiza su cantidad
        if (productExists && productExists.status === 'removed') {
            await productExists.update({ status: 'active', quantity });
        }

        // agregar eel producto al cart
        if (!productExists) {
            await ProductInCart.create({ cartId: cart.id, productId, quantity });
        }
    }

    res.status(201).json({ status: 'success' });
});

exports.updateCartProduct = catchAsync(async (req, res, next) => {
    const { cart, product } = req;
    const { productId, quantity } = req.body;

    // chequea la cantidad que tiene el producto
    if (quantity > product.quantity) {
        return next(
            new AppError(400, `This product only has ${product.quantity} items`)
        );
    }

    //busca el producto en el cart
    const productInCart = await ProductInCart.findOne({
        where: { status: 'active', cartId: cart.id, productId }
    });

    if (!productInCart) {
        return next(
            new AppError(404, `Can't update product, is not in the cart yet`)
        );
    }

    // si la cantidad es 0 cambia su status a remove
    if (quantity === 0) {
        await productInCart.update({ quantity: 0, status: 'removed' });
    }

    // actualiza canidad
    if (quantity > 0) {
        await productInCart.update({ quantity });
    }

    res.status(204).json({ status: 'success' });
});

exports.removeProductFromCart = catchAsync(async (req, res, next) => {
    const { cart } = req;
    const { productId } = req.params;

    const productInCart = await ProductInCart.findOne({
        where: { status: 'active', cartId: cart.id, productId }
    });

    if (!productInCart) {
        return next(new AppError(404, 'This product does not exist in this cart'));
    }

    await productInCart.update({ status: 'removed', quantity: 0 });

    res.status(204).json({ status: 'success' });
});

exports.purchaseCart = catchAsync(async (req, res, next) => {
    const { currentUser, cart } = req;

    let totalPrice = 0;

    // actualiza el cart a comprado
    const cartPromises = cart.products.map(async (product) => {
        await product.productInCart.update({ status: 'purchased' });

        // total del toda la orden
        const productPrice = product.price * product.productInCart.quantity;

        totalPrice += productPrice;

        // resta la cantidad del producto
        const newQty = product.quantity - product.productInCart.quantity;

        return await product.update({ quantity: newQty });
    });

    await Promise.all(cartPromises);

    // Mark cart as purchased
    await cart.update({ status: 'purchased' });

    const newOrder = await Order.create({
        userId: currentUser.id,
        cartId: cart.id,
        issuedAt: new Date().toLocaleString(),
        totalPrice
    });

    res.status(201).json({
        status: 'success',
        data: { newOrder }
    });
});
