import * as mongoose from "mongoose";
var Schema = mongoose.Schema;

var FeedItem = new Schema({
    userId: Schema.Types.ObjectId,
    type: Number,
    title: String,
    body: String,
    attachments: [],
    permissionRoles: []
});

FeedItem.statics.getFeedByUserId = function(userId: string, cb) {
    //console.log("inside getProfileByUserId:" + userId);
    this.find(
        {
            'userId': new mongoose.Types.ObjectId(userId)
        },
        (err, feedItems) => {
            console.log("getFeedByUserId: User Id: " + userId + JSON.stringify(feedItems, null, 1));
            if (err) {
                console.log("getFeedByUserId " + err);
                cb(err, null);
            };
            cb(null, feedItems);
        });
}

FeedItem.statics.deleteFeedItem = function(userId: string, cb) {
    // this.deleteFeed
}

export =  mongoose.model('feedItem', FeedItem);
