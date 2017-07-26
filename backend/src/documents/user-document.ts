import {Document} from 'mongoose';
import {User} from '../shared/user';

export interface UserDocument extends User, Document {
}