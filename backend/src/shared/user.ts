import {Types} from 'mongoose';

export interface User {
    alias: string;
    email: string;
    password: string;
    friends: Types.ObjectId[];
    incomingFriendRequests: Types.ObjectId[];
    outgoingFriendRequests: Types.ObjectId[];
    createdAt: Date;
    modifiedAt: Date;
}