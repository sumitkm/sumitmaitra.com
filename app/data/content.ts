var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Content = new Schema({
    ownerId: String,
    name: String,
    url: String,
    filetype: String,
    assetId: String,
    lastupdated: Date,
    originalname: String,
    mimetype: String,
    size: Number
});

module.exports = mongoose.model('profile', Profile);
