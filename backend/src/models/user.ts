import {UserRepository} from '../repositories/user-repository';
import {UserDocument} from '../documents/user-document';

export class UserModel {
    private static userRepository: UserRepository;

    private userDocument: UserDocument;

    private constructor(userDocument: UserDocument) {
        this.userDocument = userDocument;
    }

    get alias() {
        return this.userDocument.alias;
    }

    get email() {
        return this.userDocument.email;
    }

    get password() {
        return this.userDocument.password;
    }

    get friends() {
        return Promise.all(this.userDocument.friends.map(value => UserModel.getUser({'_id': value})));
    }

    get incomingFriendRequests() {
        return this.userDocument.incomingFriendRequests;
    }

    get outgoingFriendRequests() {
        return this.userDocument.outgoingFriendRequests;
    }

    get createdAt() {
        return this.userDocument.createdAt;
    }

    get modifiedAt() {
        return this.userDocument.modifiedAt;
    }

    private static init() {
        UserModel.userRepository = UserModel.userRepository || new UserRepository();
    }

    static createUser(alias: string, email: string, password: string): Promise<UserModel> {
        UserModel.init();
        let user = <UserDocument> {
            alias: alias,
            email: email,
            password: password
        };
        return UserModel.userRepository.create(user).then(value => new UserModel(value));
    }

    static getUser(conditions: object, options?: object): Promise<UserModel> {
        UserModel.init();
        return UserModel.userRepository.findOne(conditions, options).exec().then(value => {
            if (!value) {
                return null;
            } else {
                return new UserModel(value);
            }
        });
    }
}