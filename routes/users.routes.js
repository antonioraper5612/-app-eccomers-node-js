const express = require('express');

// Controllers
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    getUsersProducts,
    getUsersOrders,
    getOrderById
} = require('../controllers/users.controller');

// Middlewares
const { validateSession } = require('../middelware/auth.middelware');
const {
    userExists,
    protectUserAccount
} = require('../middelware/users.middelware');

const router = express.Router();

router.post('/', createUser);

router.post('/login', loginUser);

router.use(validateSession);

router.get('/', getAllUsers);

router.get('/me', getUsersProducts);

router.get('/orders', getUsersOrders);

router.get('/orders/:id', getOrderById);

router.use('/:id', userExists)
    .route('/:id').get(getUserById)
    .patch(protectUserAccount, updateUser)
    .delete(protectUserAccount, deleteUser);

module.exports = { usersRouter: router };
