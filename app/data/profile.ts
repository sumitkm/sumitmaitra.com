var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Profile = new Schema({
    nickname: String,
    birthdate: Date,
    fullname: String,
    logoUrl: String,
    logoId : Schema.Types.ObjectId,
    headerUrl: String,
    headerId: Schema.Types.ObjectId,
    containerId: Schema.Types.ObjectId
});

module.exports = mongoose.model('profile', Profile);
