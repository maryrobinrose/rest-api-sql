'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const Sequelize = require('sequelize');
const models = require('./models').sequelize;

// construct the database
const db = new Sequelize({
  dialect: "sqlite",
  storage: "./fsjstd-restapi.db"
});

console.log('Testing the connection to the database...');

// Test the connection to the database
  db.authenticate()
    .then(() => {
      console.log('Connected to database.');
    })
    .catch(err => console.error('The connection failed.'));

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

//Create the Express app
const app = express();

//Setup morgan which gives us http request logging
app.use(morgan('dev'));

//Setup JSON body parser
app.use(express.json());

//Set up API routes
app.use('/api', require('./routes/index'));
app.use('/api/users', require('./routes/user'));
//app.use('/api/courses', require('./routes/courses'));


//Setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

//Send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

//Setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

//Set our port
app.set('port', process.env.PORT || 5000);

//Start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
