const express = require('express')
const router = express.Router();

const { 
    getProducts, 
    newProduct, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct,
    getMerchantProducts,
    createProductReview,
    getProductReviews,
    deleteProductReviews,
    getAdminProducts
} = require('../controllers/productController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);

router.route('/admin/products').get(isAuthenticatedUser,authorizeRoles('Admin'),getAdminProducts);
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('Admin'), newProduct);
router.route('/admin/product/:id').put(isAuthenticatedUser, authorizeRoles('Admin'), updateProduct).delete(isAuthenticatedUser, deleteProduct);


router.route('/merchant/product/new').post(isAuthenticatedUser, authorizeRoles('Merchant'), newProduct);
router.route('/merchant/product/:id').put(isAuthenticatedUser, authorizeRoles('Merchant'), updateProduct)
                                    .delete(isAuthenticatedUser, deleteProduct);
router.route('/merchant/products').get(isAuthenticatedUser, getMerchantProducts);

router.route('/review').put(isAuthenticatedUser,  createProductReview);
router.route('/reviews').get(isAuthenticatedUser,  getProductReviews)
                        .delete(isAuthenticatedUser, deleteProductReviews);

module.exports = router; 