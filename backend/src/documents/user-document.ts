import {User} from '../../../shared/user';
import {Document} from 'mongoose';

export interface UserDocument extends User, Document {
}