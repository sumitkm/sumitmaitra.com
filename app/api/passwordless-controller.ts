/// <amd-dependency path="./api-controller"/>
var express = require('express');
var router = express.Router();
var passwordless = require('passwordless');
var flash = require('connect-flash');

export class PasswordlessController implements ApiController
{
    users = [
                { id: 1, email: 'marc@example.com' },
                { id: 2, email: 'alice@example.com' }
            ];
    constructor() {
        this["sendToken:path"] = "/login/sendToken";
    }

    public sendToken = (req, res, next) => {
        console.log("inside PasswordlessController.sendToken");
        console.log('From CrossRouter - (req):' + typeof(req));
        console.log('From CrossRouter - (res):' + typeof(res));
        console.log('From CrossRouter - (next):' + typeof(next));

		req.checkBody('user', 'Please provide a valid email address').isLength(1,200).isEmail();
		req.sanitize('user').toLowerCase();
		req.sanitize('user').trim();
		var errors = req.validationErrors(true);
		if (errors) {
            console.error("ValidationErrors");
			req.flash('validation', errors);
			res.redirect('/account/login');
		} else {
            console.log("NO ValidationErrors");
        	// Request token
        	passwordless.requestToken(
        		(email, delivery, callback) => {
        			// Return user, if she exists, create new if she doesn't
        			// Users.findUser(email, function(error, user) {
        			// 	if(error) {
        			// 		callback(error.toString());
        			// 	} else if(user) {
        			// 		callback(null, user.id);
        			// 	} else {
        			// 		User.createOrUpdateUser(email, '', '', function(error, user) {
        			// 			if(error) {
        			// 				callback(error.toString());
        			// 			} else {
        			// 				callback(null, user.id);
        			// 			}
        			// 		})
        			// 	}
        			// })
                    console.log("RequestToken for: " + email);
                    callback(null, email);
        		},
                {
                    failureRedirect: '/',
        			failureFlash: 'We had issues sending out this email... Could you try it at a later moment?',
        			successFlash: 'You should have an email in your inbox in a couple of seconds...!'
                }),
                (req, res) => {
                    console.log("Redirecting to '/': ");

        		    res.redirect('/');
                };
        }
    //    next();
	}
}
