const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');


const errorMiddleware = require('./middlewares/errors');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// import all routes
const products = require('./routes/product');
const user = require('./routes/user');
const order = require('./routes/orderProduct');


app.use('/api/v1', products)
app.use('/api/v1', user)
app.use('/api/v1', order)

// Middleware to  handle errors
app.use(errorMiddleware);


module.exports = app;