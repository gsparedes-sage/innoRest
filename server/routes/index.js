(function() {

  'use strict';
  var express = require('express');
  var router = express.Router();
  var config = require('../config');
  var helpers = require('../lib/helpers');
  var jwt = require('jsonwebtoken');

  router.get('/', function(req, res) {
    var db = helpers.initializeMongoDB();
    var sites = db.collection('Site');
    sites.find().sort({site:1}, function(err, docs) {
        res.json(docs);
    });
  });

  router.post('/authenticate', function(req, res) {
    var credentials = /^basic\s([\w\+\/]+\=*)/i.exec(req.headers.authorization);
    if (!(credentials && credentials[1]))
      throw new Error("authorization header invalid");

    var usrpwd = new Buffer(credentials[1], "base64");
    usrpwd = usrpwd.toString("utf8");
    var index = usrpwd.indexOf(':');
    if (index < 0)
      throw Error("Improper formatting");

    var login = usrpwd.substr(0, index);
    var pass = usrpwd.substr(index + 1);

    helpers.checkUser(login, pass, function(user) {
      var authData = {};
      if (user) {
        /*var token = jwt.sign(user, config.secret, {
          expiresInMinutes: 1440 // expires in 24 hours
        });
        authData.token = token;*/
        authData.username = user.username;
        authData.success = true;
      } else
        authData.success = false;
      res.json(authData);
    });
  });

  module.exports = router;

}());