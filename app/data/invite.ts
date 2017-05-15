import { Document, Schema, Model, model, Types} from "mongoose";

export interface IInvite extends Document  {
    invitedByUserId: Schema.Types.ObjectId;
    sentDate: Date;
    inviteType: Number;
    status: Number;
    inviteName: String;
    inviteEmail: String;
    firstViewed: Date;
    lastViewed: Date;
    acceptedDate: String;
    acceptedById: Schema.Types.ObjectId
}

export var InviteSchema: Schema = new Schema({
    invitedByUserId: Schema.Types.ObjectId,
    sentDate: Date,
    inviteType: Number,
    status: Number,
    inviteName: String,
    inviteEmail: String,
    firstViewed: Date,
    lastViewed: Date,
    acceptedDate: String,
    acceptedById: Schema.Types.ObjectId
});

InviteSchema.statics.map = function(appModel : any){
    let invite =  {
        invitedByUserId : new Types.ObjectId(appModel.invitedByUserId)
    };
}

export const Invite: Model<IInvite> = model<IInvite>("Invite", InviteSchema);
