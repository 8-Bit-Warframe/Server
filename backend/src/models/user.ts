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
        return this.userDocument.friends.map(value => UserModel.getUser({'_id': value}));
    }

    get incomingFriendRequests() {
        return this.userDocument.incomingFriendRequests.map(value => UserModel.getUser({'_id': value}));
    }

    get outgoingFriendRequests() {
        return this.userDocument.outgoingFriendRequests.map(value => UserModel.getUser({'_id': value}));
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
            $addToSet: {
                outgoingFriendRequests: value.id
            }
        }))
                 .then(value => true)
                 .catch(reason => false);
        let b = p.then(value => value.addIncomingFriendRequest(this.id))
                 .then(value => true)
                 .catch(reason => false);
        return Promise.all([a, b])
                      .then(results => results[0] === true && results[1] === true);
    }

    addIncomingFriendRequest(id: any) {
        return this.userDocument.update({
            $addToSet: {
                incomingFriendRequests: id
            }
        });
    }

    removeOutgoingFriendRequest(id: any) {
        return this.userDocument.update({
            $pull: {
                outgoingFriendRequests: id
            }
        });
    }

    acceptFriendRequest(id: any): Promise<boolean> {
        let a = this.userDocument.update({
            $pull: {
                incomingFriendRequests: id
            },
            $push: {
                friends: id
            }
        });
        let b = UserModel.getUser({_id: id})
                         .then(value => value.removeOutgoingFriendRequest(id));
        return Promise.all([a, b])
                      .then(value => true)
                      .catch(reason => false);
    }

    rejectFriendRequest(id: any): Promise<boolean> {
        let a = this.userDocument.update({
            $pull: {
                incomingFriendRequests: id
            }
        });
        let b = UserModel.getUser({_id: id})
                         .then(value => value.removeOutgoingFriendRequest(id));
        return Promise.all([a, b])
                      .then(value => true)
                      .catch(reason => false);
    }

    getAllFriends() {
        return Promise.all([
            Promise.all(this.friends).then(value => value.map(UserModel.filterUserProperties)),
            Promise.all(this.incomingFriendRequests).then(value => value.map(UserModel.filterUserProperties)),
            Promise.all(this.outgoingFriendRequests).then(value => value.map(UserModel.filterUserProperties))
        ]).then(values => ({
            friends: values[0],
            incomingFriendRequests: values[1],
            outgoingFriendRequests: values[2]
        })).catch(console.error);
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

    static updateUser(conditions: object, update: object) {
        UserModel.init();
        return UserModel.userRepository.findOneAndUpdate(conditions, update);
    }

    private static filterUserProperties(user: UserModel) {
        return {
            id: user.id,
            alias: user.alias
        };
    }
}