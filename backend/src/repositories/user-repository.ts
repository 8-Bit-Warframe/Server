import {BaseRepository} from './base-respository';
import {UserDocument} from '../documents/user-document';
import {UserSchema} from '../schemas/user-schema';

export class UserRepository extends BaseRepository<UserDocument> {

    constructor() {
        super(UserSchema);
    }
}