const express = require('express')
const router = express.Router();

const { signIN,
     signUP, 
     logout, 
     forgotPassword, 
     resetPassword, 
     user_details, 
     updatePassword, 
     updateProfile, 
     getAllUsers, 
     getUserDetails, 
     updateUser, 
     deleteUserDetails
} = require('../controllers/userController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route('/signIN').post(signIN);
router.route('/signUP').post(signUP);

router.route('/logout').get(logout);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/me').get(isAuthenticatedUser , user_details);
router.route('/me/update').put(isAuthenticatedUser ,updateProfile);

router.route('/password/update').put(isAuthenticatedUser ,updatePassword);

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('Admin'), getAllUsers);
router.route('/admin/users/:id').get(isAuthenticatedUser, authorizeRoles('Admin'), getUserDetails)
                                .put(isAuthenticatedUser, authorizeRoles('Admin'), updateUser)  
                                .delete(isAuthenticatedUser, authorizeRoles('Admin'), deleteUserDetails);   
                                
                                
module.exports = router; 