const {body} = require('express-validator');
const { getUserByEmail } = require('../models/userModel');

const signupValidator = [

    body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .custom(async(value) =>{
        const user = await getUserByEmail(value);

        if(user) throw new Error("User already exist");
        return true; 
    }),

    body('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({min: 3, max :30})
    .withMessage('Name must be at least 3 characters long max 30 characters long')
    .custom(async(value) =>{
        const user = await getUserByEmail(value);

        if(user) throw new Error("User already exist");
        return true; 
    }),

    body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({min: 8})
    .withMessage('Password must be at least 8 characters long')
    .isStrongPassword()
    .withMessage('Password must be at least 8 characters long, one lowercase, one uppercase, one number and one special character')
    .custom((value, {req}) => {
        if (value !== req.body.confirmPassword) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
];
module.exports = signupValidator;