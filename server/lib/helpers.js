"use strict";

var config = require('../config');
var mongojs = require('mongojs');
var crypto = require('crypto');

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