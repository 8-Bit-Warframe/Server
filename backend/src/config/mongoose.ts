import * as mongoose from 'mongoose';
import {Connection} from 'mongoose';

const uri = 'mongodb://localhost/' + (process.env.LS_MONGODB || 'lsTest');

export let db: Connection;

(<any> mongoose).Promise = global.Promise;
db = mongoose.createConnection(uri)
             .once('open', () => {
                 console.log('Mongoose connected to ' + uri);
             })
             .on('error', err => {
                 console.error("Mongoose failed to connect");
                 console.error(err);
             });