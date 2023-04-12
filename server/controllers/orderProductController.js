const Order = require('../models/orderProduct');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Create a new order => /api/v1/order/new
exports.newOrder = catchAsyncErrors( async (req, res, next) => {
    const {
        orderItems,
        shippingInformation,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInformation

    } = req.body;

    const order = await Order.create ({
        orderItems,
        shippingInformation,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInformation,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
}) 

//get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors( async (req, res, next) =>{
    const order = await Order.findById(req.params.id).populate('user', 'UserName email')

    if(!order){
        return next(new ErrorHandler('No order found with this id',404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

//get logged in user  order => /api/v1/order/me
exports.myOrders = catchAsyncErrors( async (req, res, next) =>{
    const orders = await Order.find({user : req.user.id})

    if(!orders){
        return next(new ErrorHandler('You do not have any orders now',404))
    }

    res.status(200).json({
        success: true,
        orders
    })
})

//-------------------------------------------ADMIN API FOR ORDERS ----------------------------------

// get all orders => /api/v1/admin/orders
exports.getAllOrders = catchAsyncErrors( async (req, res, next) =>{
    const orders = await Order.find()
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    if(!orders){
        return next(new ErrorHandler('No orders are placed yet!!',404))
    }

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//update / process order => /api/v1/order/:id
exports.updateOrder = catchAsyncErrors( async (req, res, next) =>{
    const order = await Order.findById(req.params.id)
    
    if(order.orderStatus === 'Delivered'){
        return next(new ErrorHandler('Order is already delivered',400))
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();

    await order.save(); 

    res.status(200).json({
        success: true,
        order
    })
})


async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;
    await product.save();
}



//delete single order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors( async (req, res, next) =>{
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler('No order found with this id',404))
    }

    await order.deleteOne();

    res.status(200).json({
        success: true
    })
})
