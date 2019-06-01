'use strict';

const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const User = require("../models").User;
const Sequelize = require('sequelize');
const authenticateUser = require('./auth');



/* GET current User. */
router.get('/', authenticateUser, (req, res) => {
  const user = req.curentUser;
  res.status(200);
  res.json({
      id: req.currentUser.id,
      firstName: req.currentUser.firstName,
      lastName: req.currentUser.lastName,
      emailAddres: req.currentUser.emailAddres
  });
});

/* Create a new book form. */
router.get('/new-book', function(req, res, next) {
  res.render("books/new-book", {book: {}, title: "New Book"});
});

/* POST create book. */
router.post('/', function(req, res, next) {
  Book.create(req.body).then(function(book) {
    res.redirect("/books/" + book.id);
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("books/new-book", {book: Book.build(req.body), errors: error.errors, title: "New Book"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
});

/* GET individual book. */
router.get("/:id", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
    if(book) {
      res.render("books/update-book", {book: book, title: book.title});
    } else {
      const err = new Error('Book Not Found');
        res.render("error", { error: err });
    }
  }).catch(function(error){
      res.send(500, error);
   });
});

/* PUT update book. */
router.put("/:id", function(req, res, next){
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
});

/* Delete individual book. */
router.delete("/:id", function(req, res, next){
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
});

module.exports = router;
