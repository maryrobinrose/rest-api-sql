const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const User = require("../models").User;
const Sequelize = require('sequelize');
const authenticateUser = require('./auth');



/* GET current User. */
router.get('/', authenticateUser, (req, res) => {
  const user = req.curentUser;
  res.status(200);
  res.json({
      id: req.currentUser.id,
      firstName: req.currentUser.firstName,
      lastName: req.currentUser.lastName,
      emailAddres: req.currentUser.emailAddres
  });
});

/* POST create user. */
router.post('/', (req, res, next) => {
  const newUser = req.body;


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

});


module.exports = router;
