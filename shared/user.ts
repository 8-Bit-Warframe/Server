export interface User {
    alias: string;
    email: string;
    password: string;
    friends: object[];
    createdAt: Date;
    modifiedAt: Date;
}