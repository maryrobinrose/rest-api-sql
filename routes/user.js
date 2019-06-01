const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const User = require("../models").User;
const Sequelize = require('sequelize');
const authenticateUser = require('./auth');
const bcryptjs = require("bcryptjs");

const { check, validationResult } = require('express-validator/check');

/* GET current User. */
router.get('/', authenticateUser, (req, res) => {
  const user = req.curentUser;
  res.status(200);
  res.json({
      id: req.currentUser.id,
      firstName: req.currentUser.firstName,
      lastName: req.currentUser.lastName,
      emailAddress: req.currentUser.emailAddress,
      password: req.currentUser.password
  });
});

/* POST create user. */
router.post('/', (req, res, next) => {
  const newUser = req.body;

  //If email is empty
  if (!newUser.emailAddress) {
    const err = new Error('Please enter a valid email.');
    err.status - 400;
    next(err);
  } else {
    
  }






  const errors = validationResult(req);
  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    res.status(400).json({ errors: errorMessages });

    }
  // Get the user from the request body.
  const newUser = req.body;
  // Set the status to 201 Created and end the response.
  res.status(201).end();

  // If email address is null
    //show error err.status = 400;

  // if email already exists
    // show error - already exists
  // if email is new/valid
    // res.status(201)
    //Create new user
      //user.create
    //Catch error and check sequelize validation
      // error message

      // Validate that we have a `name` value.
  if (!user.name) {
    errors.push('Please provide a value for "name"');
  }

  // Validate that we have an `email` value.
  if (!user.email) {
    errors.push('Please provide a value for "email"');
  }

  // If there are any errors...
  if (errors.length > 0) {
    // Return the validation errors to the client.
    res.status(400).json({ errors });
  } else {
    // Add the user to the `users` array.
    users.push(user);

    // Set the status to 201 Created and end the response.
    res.status(201).end();
  }

});


module.exports = router;
