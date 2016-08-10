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

Account.statics.verifyAccount = function(verificationCode: string, cb) {
    console.log("inside verify account:" + verificationCode);
	this.findOne({
			'verificationCode': mongoose.Types.ObjectId(verificationCode)
		},
        'username',
        (err, user) => {
            console.log("User with verificationCode: " + verificationCode);
            if (err) {
    			console.log("findUserByVerficationCode: " + err);
    			cb(err, null);
    		};
    	    user.verificationCode = null;
    		user.isVerified = true;
    	    user.save(function(saveErr) {
    	        if (saveErr) {
    	            return cb(saveErr);
    	        }
    	        cb(null, user);
    	    });
    	});
}

// Account.statics.findUserByVerficationCode = (verificationCode, cb) => {
//     let query = Account.findOne({
// 			'account.verificationCode': new Schema.Types.ObjectId(verificationCode)
// 		}, 'username', (err, account) => {
//         if (err) {
// 			console.log("findUserByVerficationCode: " + err);
// 			cb(err, null);
// 		};
// 		cb(null, account);
//     });
// }

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);
