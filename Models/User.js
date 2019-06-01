'use strict';

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "First name is required"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Last name is required"
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Email is required"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Password is required"
        }
      }
    },
  }, {
    classMethods: {
      associate: function(models) {
      }
    },
  });
  return User;
};
