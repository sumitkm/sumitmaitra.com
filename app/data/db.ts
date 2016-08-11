// var config = require('../settings/config');
var mongoose = require('mongoose');

var connection;

module.exports = {
	getConnection: function() {
		if (mongoose.connection.readyState === 0)
			mongoose.connect("mongodb://devmongodb/sumitmaitra", { server: { auto_reconnect: true } });
		return mongoose.connection;
	}
};
