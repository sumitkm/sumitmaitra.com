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
    console.log("inside getProfileByName:" + userId);
    this.findOne(
        {
            'userId': mongoose.Types.ObjectId(userId)
        },
        '_id, userId',
        (err, user) => {
            console.log("User name: " + userId);
            if (err) {
                console.log("findProfileByUserId " + err);
                cb(err, null);
            };
            cb(null, user);
        });
}

module.exports = mongoose.model('profile', Profile);
