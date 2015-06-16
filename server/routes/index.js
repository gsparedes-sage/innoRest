(function() {

  'use strict';
  var express = require('express');
  var router = express.Router();
  var config = require('../config');
  var helpers = require('../lib/helpers');

  router.get('/', function(req, res) {
      var db = helpers.initializeMongoDB();
      var sites = db.collection('Site');
      sites.find().sort({site:1}, function(err, docs) {
          // docs is now a sorted array
          res.json(docs);
      });
  });

  module.exports = router;

}());