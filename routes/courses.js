const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const Course = require("../models").Course;
const Sequelize = require('sequelize');
const authenticate = require('./login');
