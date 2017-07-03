import { Document, Schema, Model, model, Types } from "mongoose";

 var InviteSchema: Schema = new Schema({
    invitedByUserId: Schema.Types.ObjectId,
    sentDate: Date,
    inviteType: Number,
    status: Number,
    inviteName: String,
    inviteEmail: String,
    inviteMessage: String,
    firstViewed: Date,
    lastViewed: Date,
    acceptedDate: String,

    acceptedById: Schema.Types.ObjectId
});

InviteSchema.statics.createInvite = function(appModel : any, userId: string, callback){
    let invite = {
        invitedByUserId : new Types.ObjectId(userId),
        sentDate: new Date(),
        inviteType: 1,
        status: 1,
        inviteName: appModel.name,
        inviteEmail: appModel.email,
        inviteMessage: appModel.message
    };
    this.create(invite, callback)
}

InviteSchema.statics.updateInvite = function(appModel : any, userId: string, callback){
    let updatedProfile = {
        _id: new Types.ObjectId(appModel._id),
        userId: new Types.ObjectId(appModel.userId),
        nickname: appModel.nickname,
        birthdate: new Date(appModel.birthdate),
        fullname: appModel.fullname,
        logoId: new Types.ObjectId(appModel.logoId)
    };
    this.updateOne({ _id: new Types.ObjectId(appModel._id) }, updatedProfile, (error, data)=>{
            if(error !=null)
            {
                callback(error, null);
            }
            else{
                this.getProfileByUserId(appModel.userId, callback);
            }
    });
}

InviteSchema.statics.getInvitesByUserId = function(userId: string, cb){
    this.find(
        {
            'invitedByUserId': new Types.ObjectId(userId)
        })
        .sort({ "_id" : -1 })
        .select({ _id: 1, invitedByUserId: 1, sentDate: 1, inviteType: 1, status: 1, inviteName: 1, inviteEmail: 1, inviteMessage: 1 })
        .exec((err, invites) => {
            console.log("getFeedByUserId: User Id: " + userId + JSON.stringify(invites, null, 1));
            if (err) {
                console.log("getFeedByUserId " + err);
                cb(err, null);
            };
            cb(null, invites);
        });
}

export = model("Invite", InviteSchema);
