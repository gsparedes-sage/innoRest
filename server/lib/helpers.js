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

exports.getWorkOrders = function(name, callback) {
	var db = initializeMongoDB();
	var workOrdersTable = db.collection('workorders');
	var filter = {};
	filter['WorkCenter'] = {
		"$regex": name,
		"$options": "i"
	};
	workOrdersTable.find(filter, function(err, workOrders) {
		db.close();
		if (workOrders.length > 0)
			callback(workOrders);
		else
			callback();
	});
};

exports.getWorkOrderByOperation = function(id, op, callback) {
	var db = initializeMongoDB();
	var workOrdersTable = db.collection('workorders');
	workOrdersTable.findOne({WorkOrder: id, Operation: op}, function(err, workOrder) {
		db.close();
		if (workOrder)
			callback(workOrder);
		else
			callback();
	});
};

exports.createWorkOrder = function(doc, callback) {
	var db = initializeMongoDB();
	var workOrders = db.collection('workorders');
	workOrders.insert(doc, function(err, workOrder) {
		db.close();
		if (workOrder)
			callback(workOrder);
		else
			callback();
	});
};

exports.getComponents = function(id, op, callback) {
	var db = initializeMongoDB();
	var productsTable = db.collection('workordercomponents');
	productsTable.find({WorkOrder: id, Operation: op}, function(err, products) {
		db.close();
		if (products.length > 0)
			callback(products);
		else
			callback();
	});
};

exports.getComponent = function(id, callback) {
	var db = initializeMongoDB();
	var componentsTable = db.collection('workordercomponents');
	componentsTable.findOne({_id: mongojs.ObjectId(id)}, function(err, component) {
		db.close();
		if (component)
			callback(component);
		else
			callback();
	});
};

exports.getUniqueComponent = function(workOrder, operation, product, callback) {
	var db = initializeMongoDB();
	var componentsTable = db.collection('workordercomponents');
	componentsTable.findOne({WorkOrder: workOrder, Product: product, Operation: operation}, function(err, component) {
		db.close();
		if (component)
			callback(component);
		else
			callback();
	});
};

exports.createComponent = function(doc, callback) {
	var db = initializeMongoDB();
	var componentsTable = db.collection('workordercomponents');
	componentsTable.insert(doc, function(err, component) {
		db.close();
		if (component)
			callback(component);
		else
			callback();
	});
};

exports.getComponentImage = function(id, callback) {
	var db = initializeMongoDB();
	var componentsTable = db.collection('workordercomponents');
	componentsTable.findOne({_id: mongojs.ObjectId(id)}, function(err, component) {
		db.close();
		if (component)
			callback(component);
		else
			callback();	  	
	});
}

exports.getContent = function(id, callback) {
	var db = initializeMongoDB();
	var contentTable = db.collection('Products');
	contentTable.findOne({_id: mongojs.ObjectId(id)}, function(err, content) {
		db.close();
		if (content)
			callback(content);
		else
			callback();
	});
};

exports.createContent = function(doc, callback) {
	var db = initializeMongoDB();
	var contentTable = db.collection('Products');
	contentTable.insert(doc, function(err, content) {
		db.close();
		if (content)
			callback(content);
		else
			callback();
	});
};