const User  = require('../models/user');

const jwt = require('jsonwebtoken');
const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");


//check if user authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors( async (req, res, next) => {

    const {token} = req.cookies;

    if(!token){
        return next(new Errorhandler('Login first to access this resourse.',401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    next();
})

// handling user roles 
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.Role)){
            return next(new Errorhandler(`Role (${req.user.Role}) is not allowed to access this resource`,403))
        }
        next();
    }
}