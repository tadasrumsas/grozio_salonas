const {body} = require('express-validator');
const { getUserByEmail } = require('../models/userModel');
const argon2 = require('argon2');

const loginValidator = [
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail()
      .custom(async (value) => {
        const existingUser = await getUserByEmail(value);
        if (!existingUser) {
          throw new Error('User with this email does not exist, please sign up');
        }
        return true;
      }),
  
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .custom(async (value, { req }) => {
        const existingUser = await getUserByEmail(req.body.email);
        if (!await argon2.verify(existingUser.password, value)) {
          throw new Error('Incorrect password');
        }
        return true;
      }),
  ];
module.exports = loginValidator;