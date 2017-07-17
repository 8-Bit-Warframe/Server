import {Request, Router} from 'express';
import * as password from 'password-hash-and-salt';

import {User} from '../../../shared/user';
import {UserModel} from '../models/user';

export class AuthRouter {
    private static paramNames = {
        'alias': 'Alias',
        'email': 'Email',
        'password': 'Password',
        'password2': 'Confirm Password'
    };

    static addRoutes(router: Router): void {
        router.post('/login', (req, res) => {
            let result = AuthRouter.checkQueryParams(req, ['email', 'password']);
            if (result === null) {
                res.end();
            } else {
                res.send(new AuthResponse(false, result).toJsonString()).end();
            }
        });
        router.post('/register', (req, res) => {
            let result = AuthRouter.checkQueryParams(req, ['alias', 'email', 'password', 'password2']);
            if (result === null) {
                if (req.query.password !== req.query.password2) {
                    res.send(new AuthResponse(false, 'Passwords must match').toJsonString()).end();
                } else {
                    password(req.query.password).hash((error, hash) => {
                        if (error) {
                            console.error('AuthRouter: register: ', error);
                            res.send(new AuthResponse(false, 'An error occurred. Please try again').toJsonString()).end();
                        } else {
                            UserModel.createUser(req.query.alias, req.query.email, hash)
                                     .then(value => res.send(new AuthResponse(false, 'User registered', value).toJsonString()).end())
                                     .catch(reason => {
                                         console.error('AuthRouter: createUser: ', reason);
                                         res.send(new AuthResponse(false, 'An error occurred. Please try again').toJsonString()).end()
                                     });
                        }
                    });
                    res.end();
                }
            } else {
                res.send(new AuthResponse(false, result).toJsonString()).end();
            }
        })
    }

    private static checkQueryParams(req: Request, params: string[]): string {
        let getName = (param) => AuthRouter.paramNames[param];
        params.filter(element => !req.query[element]);
        if (params.length > 0) {
            if (params.length === 1) {
                return `The field '${getName(params[0])}' must be filled in`;
            } else {
                let s = 'The fields ';
                params.forEach((value, index, array) => {
                    if (index < array.length - 2) {
                        s += `'${getName(value)}', `;
                    } else if (index < array.length - 1) {
                        s += `'${getName(value)}' and `;
                    } else {
                        s += `'${getName(value)}' must be filled in`;
                    }
                });
                return s;
            }
        } else {
            return null;
        }
    }
}

class AuthResponse {
    success: boolean;
    message: string;
    user?: UserModel;

    constructor(success: boolean, message: string, user?: UserModel) {
        this.success = success;
        this.message = message;
        this.user = user;
    }

    toJsonString(): string {
        return JSON.stringify(this);
    }
}