const express = require('express');
const { signup, login, logout, protect, getAuthenticatedUser} = require('../controlers/authControler');
const signupValidator = require('../validators/signup');
const validate = require('../validators/validate');
const loginValidator = require('../validators/login');



const router = express.Router();


router.route('/signup').post(signupValidator, validate, signup);
router.route('/login').post(loginValidator, validate, login);
router.route('/logout').get(protect, logout);
router.route('/me').get(protect,getAuthenticatedUser);
module.exports = router;