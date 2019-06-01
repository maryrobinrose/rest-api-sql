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

  //If user already exists
  User.findOne({ where: emailAddress: newUser.emailAddress})
    .then(email => {
      if (email) {
        const err = new Error('This user already exists.')
        err.status = 400;
        next(err);
      } else {

      }


    });


  //If email is empty
  if (!newUser.emailAddress) {
    const err = new Error('Please enter a valid email.');
    err.status = 400;
    next(err);


  // Set the status to 201 Created and end the response.
    res.status(201).end();




module.exports = router;
