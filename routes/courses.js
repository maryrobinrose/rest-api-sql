const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const Sequelize = require('sequelize');
const authenticate = require('./authenticate');

/* GET course list. */
router.get('/', (req, res, next) => {
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
          const err = new Error('This course does not exist.');
          err.status = 400;
          next(err);
        }
      });
      /*.catch(err => {
        err.status = 400;
        next(err);
      });*/
  });

/* POST create new course. */
router.post('/', authenticate, (req, res, next) => {
  //If title is not filled out
  if(!req.body.title && !req.body.description) {
    const err = new Error('Please enter a title and a description.');
    err.status = 400;
    next(err);
  } else if (!req.body.title) {
    const err = new Error('Please enter a title.');
    err.status = 400;
    next(err);
  } else if (!req.body.description) {
    const err = new Error('Please enter a description.');
    err.status = 400;
    next(err);
  } else {
    //Check to see if course already exists
    Course.findOne({ where: {title: req.body.title} })
      .then(title => {
        //If course already exists, show error
        if(title) {
          const err = new Error('This course already exists.');
          err.status = 400;
          next(err);
        } else {
          //If the course is new, create new course
          Course.create(req.body)
            .then (course => {
              //Set location header
              res.location('/api/courses');
              //End, return no content
              res.status(201).end();
            })
            //Catch the errors
            .catch(err => {
              err.status = 400;
              next(err);
            });
          }
        })
  }
});

/* PUT update course. */
router.put('/:id', authenticate, (req, res, next) => {
  //If title is not filled out
  if(!req.body.title && !req.body.description) {
    const err = new Error('Please enter a title and a description.');
    err.status = 400;
    next(err);
  } else if (!req.body.title) {
    const err = new Error('Please enter a title.');
    err.status = 400;
    next(err);
  } else if (!req.body.description) {
    const err = new Error('Please enter a description.');
    err.status = 400;
    next(err);
  } else {
    //Find one course to update
    Course.findOne({ where: {id: req.body.id} })
      .then(course => {
        //If the course doesn't exist
        if(!course) {
          //Show error
          res.status(404).json({message: 'Course Not Found'});
        } else if (course) {
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
          course.update(req.body);
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
  }
});

/* Delete individual course. */
router.delete('/:id', authenticate, (req,res) => {
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
      });
});


module.exports = router;
