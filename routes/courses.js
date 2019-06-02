const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const Sequelize = require('sequelize');
const authenticate = require('./login');

/* GET course list. */
router.get('/', (req, res) => {
  Course.findAll({
    attributes: [
      'id',
      'title',
      'description',
      'estimatedTime',
      'materialsNeeded',
      'userId'
    ],
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
      }
    ]
  })
    .then(courses => {
      res.status(200);
      res.json({ courses });
    })
    .catch(err => {
      err.status = 400;
      next(err);
    });
});

/* GET course by ID. */
router.get('/:id', (req, res, next) => {
  Course.findOne({
      where: { id: req.params.id },
      attributes: [
        'id',
        'title',
        'description',
        'estimatedTime',
        'materialsNeeded',
        'userId'
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        }
      ]
    })
      .then(course => {
        if(course) {
          res.status(200);
          //Course list
          res.json({ course });
        } else {
          //Show error if no course matches
          const err = new Error('This course does not exist.')
          err.status = 400;
          next(err);
        }
    });
});

/* POST new course. */
router.post('/:id', authenticate, (req, res, next) => {
  
});
