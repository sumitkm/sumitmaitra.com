var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedItem = new Schema({
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
