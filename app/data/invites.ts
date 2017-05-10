import * as mongoose from "mongoose";

var Invites = new mongoose.Schema({
    invitedByUserId: mongoose.Schema.Types.ObjectId,
    sentDate: Date,
    inviteType: Number,
    status: Number,
    inviteeName: String,
    inviteeEmail: String,
    firstViewed: Date,
    lastViewed: Date,
    acceptedDate: String,
    acceptedById: mongoose.Schema.Types.ObjectId
});
