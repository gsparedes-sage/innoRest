(function() {

  'use strict';
  var express = require('express');
  var router = express.Router();
  var config = require('../config');
  var helpers = require('../lib/helpers');
  var sessionManager = require('../lib/session');

  router.post('/authenticate', ensureSession, function(req, res) {
    var authData = helpers.parseAuth(req);

    helpers.checkUser(authData.login, authData.pass, function(user) {
      if (user) {
        res.locals.authorization = req.headers.authorization;
        req.session.username = user.username;
        req.session.success = true;
      } else
        req.session.success = false;
      res.json(req.session.success);
    });
  });

  router.get('/workCenters/:id', ensureSession, function(req, res) {
    var id = req.params.id;
    console.log(id)
    helpers.getWorkCenter(id, function(workCenter) {
      if (workCenter)
        res.json(workCenter);
      else
        res.json('No entries found.');
    });
  });

  router.post('/workCenters', ensureSession, function(req, res) {
    helpers.createWorkCenter(req.body, function(workCenter) {
      if (workCenter)
        res.json("Success");
      else
        res.json('Failure');
    });
  });

  router.get('/workOrders/:id', ensureSession, function(req, res) {
    var id = req.params.id;
    console.log(id)
    helpers.getWorkOrder(id, function(workOrder) {
      if (workOrder)
        res.json(workOrder);
      else
        res.json('No entries found.');
    });
  });

  router.get('/workOrdersByWorkCenter/:id', ensureSession, function(req, res) {
    var id = req.params.id;
    console.log(id)
    helpers.getWorkOrders(id, function(workOrders) {
      if (workOrders)
        res.json(workOrders);
      else
        res.json('No entries found.');
    });
  });

  router.post('/workOrders', ensureSession, function(req, res) {
    helpers.createWorkOrder(req.body, function(workOrder) {
      if (workOrder)
        res.json("Success");
      else
        res.json('Failure');
    });
  });

  router.get('/stepsByWorkOrder/:id', ensureSession, function(req, res) {
    var id = req.params.id;
    console.log(id)
    helpers.getSteps(id, function(steps) {
      if (steps)
        res.json(steps);
      else
        res.json('No entries found.');
    });
  });

  router.get('/steps/:id', ensureSession, function(req, res) {
    var id = req.params.id;
    console.log(id)
    helpers.getWorkOrder(id, function(workOrder) {
      if (workOrder)
        res.json(workOrder);
      else
        res.json('No entries found.');
    });
  });

  router.post('/steps', ensureSession, function(req, res) {
    helpers.createStep(req.body, function(step) {
      if (step)
        res.json("Success");
      else
        res.json('Failure');
    });
  });

  router.get('/contentByStep/:id', ensureSession, function(req, res) {
    var id = req.params.id;
    console.log(id)
    helpers.getContent(id, function(content) {
      if (content)
        res.json(content);
      else
        res.json('No entries found.');
    });
  });

  router.post('/content', ensureSession, function(req, res) {
    helpers.createContent(req.body, function(content) {
      if (content)
        res.json("Success");
      else
        res.json('Failure');
    });
  });

  function ensureSession(req, res, next) {
    sessionManager.checkSession(req, res);
    sessionManager.setSessionCookie(req, res);
    next();
  }

  module.exports = router;

}());