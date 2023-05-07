const express = require('express')
const router = express.Router();

const { 
    createMerchantRequest
} = require('../controllers/merchantRequestController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')


router.route('/user/requestRole').post(isAuthenticatedUser , createMerchantRequest);
  
                                
                                
module.exports = router; 