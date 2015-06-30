(function() {

  'use strict';
  var express = require('express');
  var router = express.Router();
  var config = require('../config');
  var helpers = require('../lib/helpers');
  var sessionManager = require('../lib/session');
  var async = require('async');

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
    console.log(name)

    async.waterfall([
        function(callback) {
          helpers.getWorkOrders(name, function(workOrders) {
            if (workOrders) {
              callback(null, workOrders)
            } else
              res.json('No entries found.');
          });
        },
        function(listOfWorkOrders, callback) {
          async.forEachOfSeries(listOfWorkOrders, function (workOrder, key, cb) {
            console.log("WORK ORDER: ", workOrder)
            helpers.getUniqueProduct(workOrder.WorkOrder, workOrder.Operation, workOrder.Product, function(product) {
              console.log("PRODUCT: ", product)
              if (product) {
                workOrder["Quantity"] = product["Quantity"];
                workOrder["UOM"] = product["UOM"];
                workOrder["BOMSequence"] = product["BOMSequence"];
              } else {
                workOrder["Quantity"] = '';
                workOrder["UOM"] = '';
                workOrder["BOMSequence"] = '';
              }
              cb();
            });
          }, function(err) {
            callback(null, [listOfWorkOrders]);
          });
        }
    ], function (err, result) {
      if (result[0]) {
        res.json(result[0]);
      } else
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

  router.get('/productsByWorkOrder/:id', ensureSession, function(req, res) {
    var id = req.params.id;
    console.log(id)
    helpers.getProducts(id, function(products) {
      if (products)
        res.json(products);
      else
        res.json('No entries found.');
    });
  });

  router.post('/products', ensureSession, function(req, res) {
    helpers.createProduct(req.body, function(product) {
      if (product)
        res.json("Success");
      else
        res.json('Failure');
    });
  });

  router.get('/contentByProduct/:id', ensureSession, function(req, res) {
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