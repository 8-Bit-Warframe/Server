import {Request, Response, Router} from 'express';
import * as password from 'password-hash-and-salt';
import {UserModel} from '../models/user';

export class AuthRouter {
    private static paramNames = {
        'alias': 'Alias',
        'email': 'Email',
        'password': 'Password',
        'password2': 'Confirm Password'
    };

    static addRoutes(router: Router): void {
        router.post('/login', (req: Request, res: Response) => {
            let result = AuthRouter.checkQueryParams(req, ['email', 'password']);
            if (result === null) {
                UserModel.getUser({email: req.query.email})
                         .then(value => {
                             if (value === null) {
                                 res.json(new AuthResponse(false, 'A user account with that email address was not found').toJson()).end();
                             } else {
                                 password(req.query.password).verifyAgainst(value.password, (error, verified) => {
                                     if (error) {
                                         console.error('AuthRouter: login: ', error);
                                         res.json(new AuthResponse(false, 'An error occurred. Please try again').toJson()).end();
                                     } else if (verified) {
                                         res.json(new AuthResponse(false, 'Incorrect password').toJson()).end();
                                     } else {
                                         res.json(new AuthResponse(true, 'User logged in', value).toJson()).end();
                                     }
                                 });
                             }
                         });
            } else {
                res.json(new AuthResponse(false, result).toJson()).end();
            }
        });
        router.post('/register', (req: Request, res: Response) => {
            let result = AuthRouter.checkQueryParams(req, ['alias', 'email', 'password', 'password2']);
            if (result === null) {
                if (req.query.password !== req.query.password2) {
                    res.json(new AuthResponse(false, 'Passwords must match').toJson()).end();
                } else {
                    password(req.query.password).hash((error, hash) => {
                        if (error) {
                            console.error('AuthRouter: register: ', error);
                            res.json(new AuthResponse(false, 'An error occurred. Please try again').toJson()).end();
                        } else {
                            UserModel.createUser(req.query.alias, req.query.email, hash)
                                     .then(value => res.json(new AuthResponse(false, 'User registered', value).toJson()).end())
                                     .catch(reason => {
                                         console.error('AuthRouter: createUser: ', reason);
                                         res.json(new AuthResponse(false, 'An error occurred. Please try again').toJson()).end()
                                     });
                        }
                    });
                }
            } else {
                res.json(new AuthResponse(false, result).toJson()).end();
            }
        });
    }

    private static checkQueryParams(req: Request, params: string[]): string {
        let getName = (param) => AuthRouter.paramNames[param];
        params = params.filter(element => !req.query[element]);
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

    toJson(): object {
        let returnVal = {
            success: this.success,
            message: this.message,
            user: undefined
        };
        if (this.user !== null) {
            returnVal.user = {
                alias: this.user.alias,
                email: this.user.email,
                createdAt: this.user.createdAt,
                modifiedAt: this.user.modifiedAt
            };
        }
        return returnVal;
    }
}