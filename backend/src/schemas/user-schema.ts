import {Schema} from 'mongoose';
import {UserDocument} from '../documents/user-document';
import {db} from '../config/mongoose';

let schema = new Schema({
    alias: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
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
});

export let UserSchema = db.model<UserDocument>('user', schema, 'users');