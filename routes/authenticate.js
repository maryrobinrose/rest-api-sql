const User = require("../models").User;
const Sequelize = require('sequelize');
const authenticate = require('basic-auth');
const bcryptjs = require('bcryptjs');
