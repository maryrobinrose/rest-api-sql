const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const Sequelize = require('sequelize');
const authenticate = require('./authenticate');

/* GET course list. */
router.get('/', (req, res) => {
  //Find all courses
  Course.findAll({
    //Object to pass to findAll to return data
    attributes: [
      'id',
      'title',
      'description',
      'estimatedTime',
      'materialsNeeded',
      'userId'
    ],
    //Include which user is associated with each course
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
      }
    ]
  })
    .then(courses => {
      res.status(200);
      //Bring back courses from JSON
      res.json({ courses });
    })
    //Catch the errors
    .catch(err => {
      err.status = 400;
      next(err);
    });
});

/* GET course by ID. */
router.get('/:id', (req, res, next) => {
  //Find one course
  Course.findOne({
      //Where the ID matches
      where: { id: req.params.id },
      attributes: [
        'id',
        'title',
        'description',
        'estimatedTime',
        'materialsNeeded',
        'userId'
      ],
      //Include user connected with course
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        }
      ]
    })
      .then(course => {
        //If the course matches
        if(course) {
          res.status(200);
          //Return the course
          res.json({ course });
        } else {
          //Show error if no course matches
          const err = new Error('This course does not exist.')
          err.status = 400;
          next(err);
        }
      })
      .catch(err => {
        err.status = 400;
        next(err);
      });
  });

/* POST create new course. */
router.post('/', authenticate, (req, res, next) => {
  //First check to see if course already exists
  Course.findOne({ where: {id: req.body.title} })
    .then(course => {
      //If course already exists, show error
      if(course) {
        const err = new Error('This course already exists.')
        err.status = 400;
        next(err);
      } else {
        //Variable holds new course info
        const newCourse = {
          id: req.body.id,
          title: req.body.title,
          description: req.body.description,
          estimatedTime: req.body.estimatedTime,
          materialsNeeded: req.body.materialsNeeded,
          Userid: req.currentUser.id
        };
        //If the course is new, create new course
        Course.create(newCourse)
          .then (() => {
            //Set location header
            res.location('/');
            //End, return no content
            res.status(201).end();
          })
          //Catch the erros
          .catch(err => {
            err.status = 400;
            next(err);
          });
      }
});

/* PUT update course. */
router.put('/:id', authenticate, (req, res) => {
  //Find one course to update
  Course.findOne({ where: {id: req.params.id} })
    .then(course => {
      //If the course doesn't exist
      if(!course) {
        //Show error
        res.status(404).json({message: 'Course Not Found'});
      } else {
        //Updated course info
        const updateCourse = {
          id: req.body.id,
          title: req.body.title,
          description: req.body.description,
          estimatedTime: req.body.estimatedTime,
          materialsNeeded: req.body.materialsNeeded,
          //Current user's id to connect to new course
          userId: req.currentUser.id
        };
        //If course does exist, update it
        course.update(updateCourse);
      }
    })
    .then (() => {
      //Return no content and end the request
      res.status(204).end();
    })
    //Catch the errors
    .catch(err => {
      err.status = 400;
      next(err);
  });

/* Delete individual course. */
router.delete('/:id', authenticate, (req,res, next) => {
  //Find one course to delete
  Course.findOne({ where: {id: req.params.id} })
    .then(course => {
      //If course doesn't exist
      if (!course) {
        //Show error
        res.status(404).json({message: 'Course Not Found'});
      } else {
        //Delete the course
        return course.destroy();
      }
    })
    .then (() => {
      //Return no content and end the request
      res.status(204).end();
    })
    //Catch the errors
    .catch(err => {
      err.status = 400;
      next(err);
    })
});

module.exports = router;
