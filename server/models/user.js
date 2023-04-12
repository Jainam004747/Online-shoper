const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new  mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter your first name '],
        trim: true,
        minlength: [3, 'minimum 3 character required'],
        maxlength: [20,'User first name can not exceed 20 characters ']
    },
    lastName: {
        type: String,
        required: [true, 'Please enter your last name '],
        trim: true,
        minlength: [3, 'minimum 3 character required'],
        maxlength: [20,'User last name can not exceed 20 characters ']
    },
    UserName: {
        type: String,
        required: [true, 'Please enter your user name '],
        trim: true,
        unique: true,
        index: true,
        lowercase: true,
        minlength: [3, 'minimum 3 character required'],
        maxlength: [20,'User last name can not exceed 20 characters ']
    },
    Email: {
        type: String,
        required: [true, 'Please enter your Email '],
        trim: true,
        unique: true,
        validate: [validator.isEmail, `please enter a valid email`]
    },
    Password: {
        type: String,
        required: [true, 'Please enter your password '],
        minlength: [6, 'minimum 6 character required'],
        select: false
    },
    Role: {
        type: String,
        enum: ['Admin', 'Member', 'Merchant'],
        default: 'Member'
    },
    ContactNumber: {
        type: String
    },
    ProfilePicture: [ 
        {
            Public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

//Encrypting password before saving user 
userSchema.pre('save' , async function (next){
    if(!this.isModified('Password')){
        next()
    }

    this.Password = await bcrypt.hash(this.Password, 10)
})

//generate and return jwt token
userSchema.methods.getJwtToken = function  ( ) {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

//compare user and password
userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.Password);
}

//generate password reset token 
userSchema.methods.generateResetToken = function () {

    //generate token 
    const resetToken = crypto.randomBytes(20).toString('hex');

    //has and set to reset Password token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // set token expire time 
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000 //30 minutes

    return resetToken;
}

module.exports = mongoose.model('User', userSchema)