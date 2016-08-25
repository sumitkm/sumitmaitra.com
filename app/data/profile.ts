var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Profile = new Schema({
    userId: Schema.Types.ObjectId,
    nickname: String,
    birthdate: Date,
    fullname: String,
    logoUrl: String,
    logoId: Schema.Types.ObjectId,
    headerUrl: String,
    headerId: Schema.Types.ObjectId,
    containerId: Schema.Types.ObjectId
});

Profile.statics.getProfileByUserId = function(userId: string, cb) {
    console.log("inside getProfileByUserId:" + userId);
    this.findOne(
        {
            'userId': mongoose.Types.ObjectId(userId)
        },
        (err, profile) => {
            console.log("User Id: " + userId);
            if (err) {
                console.log("findProfileByUserId " + err);
                cb(err, null);
            };
            cb(null, profile);
        });
}

module.exports = mongoose.model('profile', Profile);
