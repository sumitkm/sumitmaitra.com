import * as mongoose from "mongoose";
var Schema = mongoose.Schema;

var Profile = new Schema({
    userId: Schema.Types.ObjectId,
    nickname: String,
    birthdate: Date,
    birthYear: String,
    birthMonth: String,
    birthDay: String,
    fullname: String,
    logoUrl: String,
    logoId: Schema.Types.ObjectId,
    headerUrl: String,
    headerId: Schema.Types.ObjectId,
    containerId: Schema.Types.ObjectId
});

Profile.statics.getProfileByUserId = function(userId: string, cb) {
    //console.log("inside getProfileByUserId:" + userId);
    this.findOne(
        {
            'userId': new mongoose.Types.ObjectId(userId)
        },
        (err, profile) => {
            if (err) {
                cb(err, null);
            };
            cb(null, profile);
        });
}

module.exports = mongoose.model("profile", Profile);
