"use strict";

var config = require('../config');
var mongojs = require('mongojs');
var crypto = require('crypto');
var uuid = require('./uuid');

exports.initializeMongoDB = initializeMongoDB;

function initializeMongoDB() {
	var mongoConfig = config.mongo || {};
	var hostName = mongoConfig.hostName || 'localhost';
	var dataset = mongoConfig.dataset || 'innoRest';
	var db = mongojs(hostName + '/' + dataset);	
	return db;
}

exports.checkUser = function(username, password, callback) {
	var db = initializeMongoDB();
	var dbUsers = db.collection('Users');
	var filter = {};
	filter['username'] = {
		"$regex": username,
		"$options": "i"
	};
	dbUsers.findOne(filter, function(err, user) {
		db.close();
		if (user) {
			if (err) callback();
			var hash = crypto.createHash('md5').update(password).digest('hex');
			if (user.password === hash)
				callback(user);
			else
				callback();
		} else {
			callback();
		}
	});
};

exports.parseAuth = function(req) {
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
    return {
    	login: login,
    	pass: pass
    };
};

exports.getWorkCenter = function(id, callback) {
	var db = initializeMongoDB();
	var workCenters = db.collection('WorkCenters');
	workCenters.findOne({_id: id}, function(err, workCenter) {
		db.close();
		if (workCenter)
			callback(workCenter);
		else
			callback();
	});
};

exports.createWorkCenter = function(doc, callback) {
	var db = initializeMongoDB();
	var workCenters = db.collection('WorkCenters');
	doc._id = uuid.generate();
	console.log(doc)
	workCenters.insert(doc, function(err, workCenter) {
		db.close();
		if (workCenter)
			callback(workCenter);
		else
			callback();
	});
};

exports.getWorkOrder = function(id, callback) {
	var db = initializeMongoDB();
	var workOrders = db.collection('WorkOrders');
	workOrders.findOne({_id: id}, function(err, workOrder) {
		db.close();
		if (workOrder)
			callback(workOrder);
		else
			callback();
	});
};

exports.getWorkOrders = function(id, callback) {
	var db = initializeMongoDB();
	var workOrdersTable = db.collection('WorkOrders');
	workOrdersTable.find({workCenterId: id}, function(err, workOrders) {
		db.close();
		if (workOrders.length > 0)
			callback(workOrders);
		else
			callback();
	});
};

exports.createWorkOrder = function(doc, callback) {
	var db = initializeMongoDB();
	var workOrders = db.collection('WorkOrders');
	doc._id = uuid.generate();
	console.log(doc)
	workOrders.insert(doc, function(err, workOrder) {
		db.close();
		if (workOrder)
			callback(workOrder);
		else
			callback();
	});
};

exports.getSteps = function(id, callback) {
	var db = initializeMongoDB();
	var stepsTable = db.collection('Steps');
	stepsTable.find({workOrderId: id}, function(err, steps) {
		db.close();
		if (steps.length > 0)
			callback(steps);
		else
			callback();
	});
};

exports.getStep = function(id, callback) {
	var db = initializeMongoDB();
	var stepsTable = db.collection('Steps');
	stepsTable.findOne({_id: id}, function(err, step) {
		db.close();
		if (step)
			callback(step);
		else
			callback();
	});
};

exports.createStep = function(doc, callback) {
	var db = initializeMongoDB();
	var stepsTable = db.collection('Steps');
	doc._id = uuid.generate();
	console.log(doc)
	stepsTable.insert(doc, function(err, step) {
		db.close();
		if (step)
			callback(step);
		else
			callback();
	});
};

exports.getContent = function(id, callback) {
	var db = initializeMongoDB();
	var contentTable = db.collection('Content');
	contentTable.findOne({stepId: id}, function(err, content) {
		db.close();
		if (content)
			callback(content);
		else
			callback();
	});
};

exports.createContent = function(doc, callback) {
	var db = initializeMongoDB();
	var contentTable = db.collection('Content');
	doc._id = uuid.generate();
	console.log(doc)
	contentTable.insert(doc, function(err, content) {
		db.close();
		if (content)
			callback(content);
		else
			callback();
	});
};