import * as crypto from "crypto";
var db = require('./db').getConnection();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var crypto = require('crypto');

var schema = new Schema({
    username: 		{ type: String, required: false },
    email: 			{ type: String, required: true, index: { unique: true } },
    color: 			{ type: String, required: false }
});

class userSchema {


    static findUser = (email, done) => {
    	email = email.toLowerCase();
    	User.findOne({ email: email }, done);
    }

    static deleteUser = (email, callback)  => {
    	if(!email || !callback)
    		return callback('An email address has to be provided');

    	email = email.toLowerCase().trim();
    	User.remove({email: email}, function(err) {
    		callback(err);
    	})
    }

    static createOrUpdateUser = (email, username, color, newEmail, callback) => {
    	if(newEmail && !callback) {
    		callback = newEmail;
    		newEmail = undefined;
    	}
    	if(!newEmail)
    		newEmail = email;
    	if(!email)
    		return callback('At least an email address has to be provided');
    	email = email.toLowerCase().trim();
    	newEmail = newEmail.toLowerCase().trim();

    	var newUser = {
    		email: newEmail,
    		username: username,
    		color: color
    	};
    	// Create or update user, return it
    	User.findOneAndUpdate( { email: email } , newUser, { upsert: true, new:true }, function(error, user) {

    		console.log(user);

    		callback(error, user);
    	})
    };

    public md5 = () => {
    	return crypto.createHash('md5').update(User.email).digest("hex");
    };

    public gravatar = () => {
    	var items = { 'Gravatar': '', 'Mystery man': 'mm',
    				'Identicon': 'identicon', 'Monster': 'monsterid',
    				'Wavatar' : 'wavatar', 'Retro' : 'retro', 'None': 'blank' };
    	if(User.color.length && items[User.color] && items[User.color].length) {
    		return 'https://www.gravatar.com/avatar/' + this.md5() + '?f=y&d=' + items[User.color];
    	} else {
    		return 'https://www.gravatar.com/avatar/' + this.md5() + '?&d=retro';
    	}
    }
}

export var User = db.model('User', schema);
