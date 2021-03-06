(function() {

  'use strict';
  var express = require('express');
  var router = express.Router();
  var config = require('../config');
  var fs = require('fs');
  var helpers = require('../lib/helpers');
  var sessionManager = require('../lib/session');
  var multipart = require('connect-multiparty');
  var multipartMiddleware = multipart();

  router.get('/insertComponent', function (req, res) {
    res.render('insert');
  });

  router.get('/updateComponent', function (req, res) {
    res.render('update');
  });

  router.get("/images/:id", function(req,res) {
    var id = req.params.id;

    helpers.getComponentImage(id, function(component) {
      console.log(component)
      if (component) {
        res.writeHead(200, {"Content-Type": component.img.contentType});
        res.end(component.img.data.buffer, 'binary');
      } else
        res.end();
    });      
  });

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

  router.get('/workOrdersByWorkCenter/:name', ensureSession, function(req, res) {
    var name = req.params.name;
    helpers.getWorkOrders(name, function(workOrders) {
      if (workOrders)
        res.json(workOrders);
      else
        res.json('No entries found.');
    });
  });

  router.get('/workOrdersByOperation/:id/:operation', ensureSession, function(req, res) {
    var id = req.params.id;
    var op = req.params.operation;
    helpers.getWorkOrderByOperation(id, op, function(workOrder) {
      if (workOrder)
        res.json(workOrder);
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

  router.get('/componentsByWorkOrder/:id/:operation', ensureSession, function(req, res) {
    var id = req.params.id;
    var op = req.params.operation;
    helpers.getComponents(id, op, function(components) {
      if (components)
        res.json(components);
      else
        res.json('No entries found.');
    });
  });

  router.post('/components', multipartMiddleware, ensureSession, function(req, res) {
    req.body.img = {};
    if (req.files.image) {
      req.body.img.data = fs.readFileSync(req.files.image.path);
      req.body.img.contentType = req.files.image.headers["content-type"];
      req.body.img.name = req.files.image.originalFilename;
    } else {
      req.body.img.data = '';
      req.body.img.contentType = '';
      req.body.img.name = '';
    }
    console.log(req.body)
    helpers.createComponent(req.body, function(component) {
      if (component)
        res.json("Success");
      else
        res.json('Failure');
    });
  });

  router.post('/updateComponent', multipartMiddleware, ensureSession, function(req, res) {
    req.body.img = {};
    if (req.files.image) {
      req.body.img.data = fs.readFileSync(req.files.image.path);
      req.body.img.contentType = req.files.image.headers["content-type"];
      req.body.img.name = req.files.image.originalFilename;
    } else {
      req.body.img.data = '';
      req.body.img.contentType = '';
      req.body.img.name = '';
    }
    console.log(req.body)
    helpers.updateComponent(req.body.id, req.body, function(component) {
      if (component)
        res.json("Success");
      else
        res.json('Failure');
    });
  });

  router.get('/contentByComponent/:id', ensureSession, function(req, res) {
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

  router.get('/checkit', function(req, res) {
    res.sendStatus(200);
    res.end();
  }); 

  function ensureSession(req, res, next) {
    sessionManager.checkSession(req, res);
    sessionManager.setSessionCookie(req, res);
    next();
  }

  module.exports = router;

}());