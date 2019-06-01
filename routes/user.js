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
  });
});

/* POST create user. */
router.post('/', (req, res, next) => {

  //If user already exists
  User.findOne({ where: emailAddress: req.body.emailAddress})
    .then(email => {
      // If user already exists
      if (email) {
        const err = new Error('This user already exists.')
        err.status = 400;
        next(err);

      } else {

        const newUser = {
          firstName: req.currentUser.firstName,
          lastName: req.currentUser.lastName,
          emailAddress: req.currentUser.emailAddress,
          password: req.currentUser.password
        };
        // Hash password
        newUser.password = bcryptjs.hashSync(newUser.password);

      }
        // Create new user
        User.create(newUser)
          .then (() => {
            res.location('/');
            res.status(201).end();
          })
          // Catch errors
          .catch(err => {
            err.status = 400;
            next(err);
          });
      })
  });


module.exports = router;
