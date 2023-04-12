const User = require('../models/user')

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtTokens');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// user signIn request => /api/v1/signIN
exports.signIN = catchAsyncErrors ( async (req, res, next) => {

    const { Email, Password} = req.body;

    // check if email and password is entered by user
    if (!Email ||!Password) {
        return next(new ErrorHandler('Please enter email and password', 400))
    }

    //finding user in database 
    const user = await User.findOne({Email}).select('+Password');
    if(!user){
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    //check if email and password is correct or not 
    const isPasswordMatch = await user.comparePassword(Password);
    if(!isPasswordMatch){
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
})

// user signUp request => /api/v1/signUp
exports.signUP = catchAsyncErrors ( async (req, res, next) => {

    const { firstName, lastName , UserName, Email, Password} = req.body;
    const user = await User.create({
        firstName,
        lastName,
        UserName,
        Email,
        Password,
        ProfilePicture: {
            Public_id: 'avtar/ahhan',
            url: 'something url'
        }
    });

    sendToken(user, 200, res);
   
})

//get logged in user details => /api/v1/user_details

exports.user_details = catchAsyncErrors( async (req, res, next) => { 
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    });
});

// Update / change user password => /api/v1/password/update

exports.updatePassword = catchAsyncErrors( async (req, res, next) => {

    const user = await User.findById(req.user.id).select('Password');

    //Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);

    if(!isMatched) {
        return next(new ErrorHandler('Invalid password', 400));
    }

    user.Password = req.body.newPassword;
    await user.save();
    
    sendToken(user, 200, res);
})

// Update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors( async (req, res, next) => {

    const newUserData = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        UserName : req.body.UserName,
        Email : req.body.Email
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        user
    });
})

//logout user => /api/v1/logout

exports.logout = catchAsyncErrors ( async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        status:'success',
        message: 'logged out'
    })
})

// Forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors ( async (req, res, next) => { 

    const user = await User.findOne({ Email: req.body.email});

    if(!user){
        return next(new ErrorHandler('User not found with this email', 404));

    }

    //get reset token
    const resetToken = user.generateResetToken();

    await user.save({validateBeforeSave: false});


    //create reset password url 
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`

    try{

        await sendEmail({
            email: user.Email,
            subject: 'Password reset token from onlineShoper',
            message
        
        })
        res.status(200).json ({
            success: true,
            message: `Email sent to : ${user.Email}`
        })

    }catch (error) {
        user.getResetPasswordToken = undefined ;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message, 500));
    }
})

// reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors ( async (req, res, next) => { 

    // hash URL token 
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has expired', 400));
    }
    if(req.body.Password !== req.body.confirmPassword){
        return next(new ErrorHandler('Passwords do not match', 400));
    }

    //setup new password
    user.Password = req.body.Password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
})



//-------------------------------------------- ADMIN ROUTES ------------------------------------------

// get all users 
exports.getAllUsers = catchAsyncErrors ( async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
})

// get user by id => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors ( async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        user
    });
});

// Update user profile(Role) by admin  => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors( async (req, res, next) => {

    const newUserData = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        UserName : req.body.UserName,
        Email : req.body.Email,
        Role : req.body.Role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    });
})

//Delete user => /api/v1/admin/user/:id
exports.deleteUserDetails = catchAsyncErrors ( async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404))
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
    });
});
