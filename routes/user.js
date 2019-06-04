const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const User = require("../models").User;
const Sequelize = require('sequelize');
const authenticate = require('./authenticate');
const bcryptjs = require('bcryptjs');

/* GET current user (Read users that already exist) */
router.get('/', authenticate, (req, res) => {
  //OK - working
  res.status(200);
  //Bring back formatted JSON data
  res.json({
      id: req.currentUser.id,
      firstName: req.currentUser.emailAddress,
      lastName: req.currentUser.lastName,
      emailAddress: req.currentUser.emailAddress,
  });
});

/* POST create user. */
router.post('/', (req, res, next) => {
  //If user already exists, find the user
  User.findOne({ where: { emailAddress: req.body.emailAddress } })
    .then(user => {
      // If user already exists based on emaill address
      if (user) {
        //Create the error
        const err = new Error('This user already exists.')
        //Bad request
        err.status = 400;
        //Express catches and processes error
        next(err);
        //If user doesn'e exist
      } else {
        //Create place for new user
        const newUser = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          emailAddress: req.body.emailAddress,
          password: req.body.password
        };
        //Hash password -- https://www.npmjs.com/package/bcryptjs
        newUser.password = bcryptjs.hashSync(newUser.password);
        //Create new user
        User.create(newUser)
          .then (() => {
            //Set location header
            res.location('/');
            //End, return no content
            res.status(201).end();
          })
          //Catch errors
          .catch(err => {
            err.status = 400;
            next(err);
          });
      }

      })
  });


module.exports = router;
