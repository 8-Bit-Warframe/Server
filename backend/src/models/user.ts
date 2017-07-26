import {UserRepository} from '../repositories/user-repository';
import {UserDocument} from '../documents/user-document';

export class UserModel {
    private static userRepository: UserRepository;

    private userDocument: UserDocument;

    private constructor(userDocument: UserDocument) {
        this.userDocument = userDocument;
    }

    get id() {
        return this.userDocument._id;
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

    addFriend(alias: string): Promise<boolean> {
        let p: Promise<UserModel> = UserModel.getUser({alias: alias})
                                             .then(value => value === null ? Promise.reject('User not found') : Promise.resolve(value));
        let a = p.then(value => this.userDocument.update({
            $push: {
                outgoingFriendRequests: value.id
            }
        })).catch(reason => false);
        let b = p.then(value => value.addIncomingFriendRequest(this.id))
                 .catch(reason => false);
        return Promise.all([a, b])
                      .then(results => results[0] === true && results[1] === true);
    }

    addIncomingFriendRequest(id: any) {
        return this.userDocument.update({
            $push: {
                incomingFriendRequests: id
            }
        });
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