const mongoose = require('mongoose')

const productSchema = new  mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter Product name '],
        trim: true,
        maxLength: [100,'Product name can not exceed 100 characters ']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [5, 'Product name cannot exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [ 
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    category: {
        type: String,
        required: [true, 'Please select category for this product'],
        enum: {
            values: [
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message: 'Please select correct category for product'
        }
    },
    brandSeller: {
        type: String,
        required: [true, 'Please enter product seller/ brand']
    },
    size: {
        type: String,
        enum: [
            'OneSize', 
            //cloaths size
            'XS',
            'S',
            'M',
            'L',
            'XL',
            'XXL',
            'XXXL',
            '0-6M',
            '6-12M',
            '1-2Y',
            '2-3Y',
            '3-4Y',
            '4-5Y',
            '5-6Y',
            '6-7Y',
            '7-8Y',
            '8-9Y',
            '9-10Y',
            '10-11Y',
            '11-12Y',
            '12-13Y',
            '13-14Y',
            //Shoes size
            'UK6',
            'UK7',
            'UK8',
            'UK9',
            'UK10',
            'UK11'  
        ],
        default: 'OneSize'
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [5, 'Product name cannot exceed 5 characters'],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Product', productSchema)