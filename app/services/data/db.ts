// var config = require('../settings/config');
var mongoose = require('mongoose');

var connection;

module.exports = {
	getConnection: function() {
		if (mongoose.connection.readyState === 0)
			mongoose.connect("mongodb://192.168.0.57/sumitmaitra", { server: { auto_reconnect: true } });
		return mongoose.connection;
	}
};
