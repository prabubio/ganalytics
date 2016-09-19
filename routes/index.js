var express = require('express');
var router = express.Router();
var Controller = require('./../controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

// GET data
router.get('/analytics', function(req, res, next) {
    Controller.getData(req, res);
});

module.exports = router;
