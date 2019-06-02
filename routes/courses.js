const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const Sequelize = require('sequelize');
const authenticate = require('basic-auth');
const bcryptjs = require('bcryptjs');

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
  Course.findAll({
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
    })
      .catch(err => {
        err.status = 400;
        next(err);
      });
  });

//POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content

/* POST create new course. */
router.post('/', authenticate, (req, res, next) => {
  //First check to see if course already exists
  Course.findOne({ where: {title: req.body.title} })
    .then(course => {
      if(course) {
        const err = new Error('This course already exists.')
        err.status = 400;
        next(err);
      } else {
        //If the course is new, create new course
        //Variable holds new course info
        const newCourse = {
          id: req.body.id,
          title: req.body.title,
          description: req.body.description,
          estimatedTime: req.body.estimatedTime,
          materialsNeeded: req.body.materialsNeeded
        };
        Course.create(newCourse)
          .then (newCourse => {
            res.status(201).json(course);
          })
          .catch(err => {
            res.status(400).json({message: 'Course description is required.'});
            next(err);
          });
      }
}));

/* PUT update course. */
router.put("/:id", authenticate (req, res, next) => {
  asyncHandler(async(req,res) => {
    const quote = await records.getQuote(req.params.id);
    if(quote){
        quote.quote = req.body.quote;
        quote.author = req.body.author;

        await records.updateQuote(quote);
        res.status(204).end();
    } else {
        res.status(404).json({message: "Quote Not Found"});
    }
}));

// From project 8
/* PUT update book. */
/*router.put("/:id", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
    if(book) {
      return book.update(req.body);
    } else {
      res.send(404);
    }
    //Updated book
  }).then(function(book){
    res.redirect("/books/" + book.id);
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        var book = Book.build(req.body);
        book.id = req.params.id;
        res.render("books/update-book", {book: book, errors: error.errors, title: "Update Book"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});*/

/* Delete individual course. */
router.delete('/:id', authenticate (req,res) => {
  Course.findByPk(req.params.id)
    .then(course => {
      if (!course) {

      }
    })
    return course.destroy();
    const quote = await records.getQuote(req.params.id);
    await records.deleteQuote(quote);
    res.status(204).end();
}));

//From project 8
/*router.delete("/:id", (req, res, next) => {
  Book.findByPk(req.params.id).then(function(book){
    if(book) {
      return book.destroy();
    } else {
      res.send(404);
    }
  }).then(function(){
      res.redirect("/books");
  }).catch(function(error){
      res.send(500, error);
   });
});*/


module.exports = router;
