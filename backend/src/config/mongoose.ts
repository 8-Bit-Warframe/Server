import * as mongoose from 'mongoose';

export let setupMongoose = function(uri: string) {
    (<any> mongoose).Promise = global.Promise;
    mongoose.createConnection(uri)
        .once('open', () => {
            console.log('Mongoose connected to ' + uri);
        })
        .on('error', err => {
            console.error("Mongoose failed to connect");
            console.error(err);
        });
};