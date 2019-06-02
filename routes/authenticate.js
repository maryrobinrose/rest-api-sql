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

 const authenticate = (req, res, next) => {
   let message = null;

   //Get the user's credentials from the Authorization header.
   const credentials = authenticate(req);

   //If user's credentials are valid
   if (credentials) {
    //Look for a user whose email address matches
    User.findOne({ where: emailAddress: req.body.emailAddress})
       const user = users.find(u => u.username === credentials.name);
       if (user) {
         const authenticated = bcryptjs
           .compareSync(credentials.pass, user.password);
         if (authenticated) {
           console.log(`Authentication successful for username: ${user.username}`);
   //from unit 9
   /*
           // Store the user on the Request object.
           req.currentUser = user;
         } else {
           message = `Authentication failure for username: ${user.username}`;
         }
       } else {
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
   };*/



//from https://www.npmjs.com/package/basic-auth
// Check credentials
  // The "check" function will typically be against your user store
  /*if (!credentials || !check(credentials.name, credentials.pass)) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    res.end('Access denied')
  } else {
    res.end('Access granted')
  }
})

// Basic function to validate credentials for example
function check (name, pass) {
  var valid = true

  // Simple method to prevent short-circut and use timing-safe compare
  valid = compare(name, 'john') && valid
  valid = compare(pass, 'secret') && valid

  return valid
}*/
