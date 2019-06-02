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
            res.status(201).end();
          })
          .catch(err => {
            res.status(400).end();
            next(err);
          });
      }
}));

/* PUT update course. */
router.put(''/:id', authenticate (req, res, next) => {
  Course.findOne({ where: {title: req.params.id} })
    .then(course => {
      //If the course doesn't exist
      if(!course) {
        //show error
        res.status(404).json({message: 'Course Not Found'});
      } else {
        //Updated course info
        const updateCourse = {
          id: req.body.id,
          title: req.body.title,
          description: req.body.description,
          estimatedTime: req.body.estimatedTime,
          materialsNeeded: req.body.materialsNeeded
        };
        //Update course
        course.update(updateCourse);
      }
    })
    .then (updateCourse => {
      res.status(204).json(course);
    })
    .catch(err => {
      err.status = 400;
      next(err);
  });


  //Notes from docs, videos
  /*
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

User.create({ username: 'fnord', job: 'omnomnom' })
  .then(() => User.findOrCreate({where: {username: 'fnord'}, defaults: {job: 'something else'}}))
  .then(([user, created]) => {
    console.log(user.get({
      plain: true
    }))
    console.log(created)

    /*
    In this example, findOrCreate returns an array like this:
    [ {
        username: 'fnord',
        job: 'omnomnom',
        id: 2,
        createdAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET),
        updatedAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET)
      },
      false
    ]
    The array returned by findOrCreate gets spread into its 2 parts by the array spread on line 3, and
    the parts will be passed as 2 arguments to the callback function beginning on line 69, which will
    then treat them as "user" and "created" in this case. (So "user" will be the object from index 0
    of the returned array and "created" will equal "false".)

  })*/

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
  Course.findOne({ where: {title: req.params.id} })
    .then(course => {
      //If course doesn't exist
      if (!course) {
        //Show error
        res.status(404).json({message: 'Course Not Found'});
      } else {
        return course.destroy();
      }
    })
    .then (() => {
      res.status(204).json(course);
    })
    .catch(err => {
      err.status = 400;
      next(err);
  });
}));

//from examples
/*const quote = await records.getQuote(req.params.id);
await records.deleteQuote(quote);
res.status(204).end();*/

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
