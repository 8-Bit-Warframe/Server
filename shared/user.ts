export interface User {
    alias: string;
    email: string;
    password: string;
    friends: object[];
    incomingFriendRequests: object[];
    outgoingFriendRequests: object[];
    createdAt: Date;
    modifiedAt: Date;
}