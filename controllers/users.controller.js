const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError')
const { filterObj } = require('../util/filterObj')

//Models
const { User } = require('../models/user.model')
const { Order } = require('../models/order.model')
const { Cart } = require('../models/cart.model')
const { Product } = require('../models/product.model')


dotenv.config({ path: './config.env' });


exports.getAllUsers = catchAsync(async (req, res, next) => {
    const user = await User.findAll({
        where: { status: "active" }, attributes: { exclude: ['password'] }
    })

    res.status(200).json({ data: user, status: "success" })

});

exports.getUserById = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findOne({ where: { id, status: "active" } })

    if (!user) {
        return next(new AppError(404, "invalid id "))
    }
    res.status(200).json({ data: user, status: "success" })
});

exports.createUser = catchAsync(async (req, res, next) => {
    const {
        username,
        email,
        password,
    } = req.body

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newuser = await User.create({
        username,
        email,
        password: hashedPassword,
        status: "active",
        roles: "guest"
    })

    if (!newuser) {
        return next(new AppError(404, "Error create Users"))
    }

    newuser.password = undefined

    res.status(200).json({ data: newuser, status: "success" })

});

exports.updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { username, email } = req.body

    const newUser = filterObj(req.body, "username", "email")

    const user = await User.findOne({ where: { id, status: "active" } })
    await user.update({ ...newUser })

    res.status(200).json({ data: newUser })

});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { status } = req.body
    const user = await User.findOne({ where: { id, status: "active" } })
    await user.update({ status })

    res.status(204).json()
});

exports.loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email, status: "active" }
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError(404, "email or password is not valid"))
    }
    //User credenciales ok
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRECT, { expiresIn: process.env.JWT_EXPIRESIN })

    user.password = undefined
    user.email = undefined
    res.status(200).json({ status: 'success', data: { user, token } })
})


exports.getUsersProducts = catchAsync(async (req, res, next) => {
    const { id } = req.currentUser
    const user = await Product.findAll({ where: { status: 'active', userId: id } })
    res.status(200).json({ data: user, status: 'success' })
})


exports.getUsersOrders = catchAsync(async (req, res, next) => {
    const { id } = req.currentUser
    const order = await Order.findAll({ where: { userId: id }, include: [{ model: User }] })

    if (!order) {
        return next(new AppError(404, "no order found "))
    }
    res.status(200).json({ data: order, status: 'success' })

})

exports.getOrderById = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const order = await Order.findOne({
        where: { id },
        include: [{
            model: Cart,
            include: [{
                model: Product,
                through: { where: { status: 'purchased' } }
            }]
        }]
    })

    if (!order) {
        return next(new AppError(404, "no order found with that id"))
    }

    res.status(200).json({ data: order, status: 'success' })
})


