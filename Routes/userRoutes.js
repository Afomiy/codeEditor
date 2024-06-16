const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');


router.get('/login', userController.getLoginPage);
router.post('/login', userController.loginUser);
router.get('/signup',userController. getSignupPage);
router.post('/signup',userController. signupUser);


module.exports = router;
