const express = require('express');
const bcrypt = require('bcryptjs');  // For password hashing
const { check } = require('express-validator');  // Import express-validator
const { handleValidationErrors } = require('../../utils/validation');  // Import validation handler
const { Op } = require('sequelize');  // Import Op for querying database

const { setTokenCookie } = require('../../utils/auth');  // Auth utilities
const { User } = require('../../db/models');  // User model

const router = express.Router();

// **Signup Validation Middleware**
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })         // Email must exist and not be falsy
    .isEmail()                            // Must be a valid email format
    .withMessage('Please provide a valid email.'),
  
  check('username')
    .exists({ checkFalsy: true })         // Username must exist and not be falsy
    .isLength({ min: 4 })                 // Must be at least 4 characters long
    .withMessage('Please provide a username with at least 4 characters.'),
  
  check('username')
    .not()                                // Username must NOT be an email
    .isEmail()
    .withMessage('Username cannot be an email.'),
  
  check('password')
    .exists({ checkFalsy: true })         // Password must exist and not be falsy
    .isLength({ min: 6 })                 // Password must be at least 6 characters long
    .withMessage('Password must be 6 characters or more.'),
  
  check('firstName')
    .exists({ checkFalsy: true })         // First name must exist
    .withMessage('Please provide your first name.'),

  check('lastName')
    .exists({ checkFalsy: true })         // Last name must exist
    .withMessage('Please provide your last name.'),

  handleValidationErrors  // Handle validation errors
];

// **Sign up Route**
router.post(
  '/',
  validateSignup,  // Apply validation middleware
  async (req, res, next) => {  // Handle user signup
    const { email, password, username, firstName, lastName } = req.body;  // Extract user data

    // Check if the email or username already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]  // Search by email or username
      }
    });

    if (existingUser) {
      const err = new Error('User already exists');
      err.status = 400;
      err.errors = { email: 'Email or username is already in use.' };
      return next(err);  // Return error if user already exists
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password);  // Hash password securely

    // Create a new user
    const user = await User.create({ 
      email, 
      username, 
      hashedPassword, 
      firstName,  // Include firstName
      lastName    // Include lastName
    });

    // Create a safe user object (without the password)
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,  // Include in response
      lastName: user.lastName     // Include in response
    };

    // Set the JWT cookie (log the user in immediately)
    await setTokenCookie(res, safeUser);

    // Return the new user's data
    return res.json({
      user: safeUser  // Send back safe user data
    });
  }
);

module.exports = router;