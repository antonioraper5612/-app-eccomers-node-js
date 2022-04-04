const express = require('express');
const ratelimit = require('express-rate-limit')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

// Controllers
const { globalErrorHandler } = require('./controllers/error.controller');

// Routers
const { usersRouter } = require('./routes/users.routes');
const { productsRouter } = require('./routes/products.routes');
const { cartRouter } = require('./routes/cart.routes');

const app = express();

// Enable incoming JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//helmet
app.use(helmet())

//compression
app.use(compression())

//morgan
app.use(morgan('dev'))

//rate limit
app.use(ratelimit({
    windowMs: 60 * 60 * 1000,
    max: 1000,
    Message: 'too many requests from your IP,try after 1 hour'
}))

// Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/cart', cartRouter);

app.use(globalErrorHandler);

module.exports = { app };