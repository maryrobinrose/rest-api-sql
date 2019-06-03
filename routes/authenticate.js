'use strict';

const express = require('express');
const User = require("../models").User;
const authenticate = require('basic-auth');
const bcryptjs = require('bcryptjs');

/**
 * Middleware to authenticate the request using Basic Authentication.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */

 module.exports (req, res, next) => {
   //Hold errors
   let message = null;

   //Get the user's credentials from the Authorization header.
   const credentials = authenticate(req);

   //If user's credentials are valid
   if (credentials) {
    //Look for a user whose email address matches
    User.findOne({ where: emailAddress: credentials.name})
       .then (user => {
         //If email exists
       if (user) {
         //Check the password
         const authenticated = bcryptjs
           .compareSync(credentials.pass, user.password);
        //If password is a match
         if (authenticated) {
           console.log(`Authentication successful for username: ${user.username}`);
       })
         // Store the user on the Request object.
         req.currentUser = user;
       } else {
         //If password isn't a match
         message = `Authentication failure for username: ${user.username}`;
       }
     } else {
       //If user isn't a match
       message = `User not found for username: ${credentials.name}`;
     }
   } else {
     message = 'Auth header not found';
   }

   if (message) {
     console.warn(message);
     res.status(401).json({ message: 'Access Denied' });
   } else {
     next();
   }
  };
