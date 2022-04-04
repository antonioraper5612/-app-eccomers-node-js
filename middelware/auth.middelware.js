const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { promisify } = require('util');

// Models
const { User } = require('../models/user.model');

// Utils
const { AppError } = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

dotenv.config({ path: './config.env' });

exports.validateSession = catchAsync(async (req, res, next) => {

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Bearer token123.split(' ') -> [Bearer, token123]
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError(401, 'Invalid session'));
    }

    // decodifico token  
    const decodedToken = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRECT
    );
    //  busco el usuario si existe
    // 
    const user = await User.findOne({
        where: { id: decodedToken.id, status: 'active' },
        attributes: {
            exclude: ['password']
        }
    });

    if (!user) {
        return next(new AppError(401, 'Invalid session'));
    }

    // agrego usuario al obj req
    req.currentUser = user;

    // Grant access
    next();
});


