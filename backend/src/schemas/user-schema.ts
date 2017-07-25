import {Schema} from 'mongoose';
import {UserDocument} from '../documents/user-document';
import {db} from '../config/mongoose';

let schema = new Schema({
    alias: {
        type: String,
        required: true,
        unique: 'Alias already exists'
    },
    email: {
        type: String,
        required: true,
        unique: 'Email already exists'
    },
    password: {
        type: String,
        required: true
    },
    friends: {
        type: [Schema.Types.ObjectId],
        required: false
    },
    incomingFriendRequests: {
        type: [Schema.Types.ObjectId],
        required: false
    },
    outgoingFriendRequests: {
        type: [Schema.Types.ObjectId],
        required: false
    }
}).pre('save', function(next) {
    if (this._doc) {
        let doc = <UserDocument> this._doc;
        let now = new Date();
        if (!doc.createdAt) {
            doc.createdAt = now;
        }
        doc.modifiedAt = now;
    }
    next();
    return this;
}).plugin(require('mongoose-beautiful-unique-validation'));

export let UserSchema = db.model<UserDocument>('user', schema, 'users');