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
}