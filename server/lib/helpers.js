"use strict";

var config = require('../config');
var mongojs = require('mongojs');

exports.initializeMongoDB = function() {
	var mongoConfig = config.mongo || {};
	var hostName = mongoConfig.hostName || 'localhost';
	var dataset = mongoConfig.dataset || 'innoRest';
	var db = mongojs(hostName + '/' + dataset);	
	return db;
}