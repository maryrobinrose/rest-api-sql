var express = require('express');
var router = express.Router();

/* GET current user. */
router.get('/', function(req, res, next) {
  res.redirect('/api/users')
});

module.exports = router;
