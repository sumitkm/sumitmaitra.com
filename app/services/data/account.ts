var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
	nickname: String,
    birthdate: Date,
	isVerified: Boolean,
	email: String,
	verificationCode: Schema.Types.ObjectId
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);
