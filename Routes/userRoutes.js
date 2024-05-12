const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

// Define routes using the controller functions
router.get('/login', userController.getLoginPage);
router.post('/login', userController.loginUser);
router.get('/signup',userController. getSignupPage);
router.post('/signup',userController. signupUser);

// Export the router
module.exports = router;
