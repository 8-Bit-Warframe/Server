import {Request, Response, Router} from 'express';
import * as password from 'password-hash-and-salt';
import * as jwt from 'jsonwebtoken';

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
                UserModel.getUser({email: req.body.email})
                         .then(value => {
                             if (value === null) {
                                 res.json(new AuthResponse(false, 'A user account with that email address was not found').toJson()).end();
                             } else {
                                 password(req.body.password).verifyAgainst(value.password, (error, verified) => {
                                     if (error) {
                                         console.error('AuthRouter: login: ', error);
                                         res.json(new AuthResponse(false, 'An error occurred. Please try again').toJson()).end();
                                     } else if (verified) {
                                         res.json(new AuthResponse(true, 'User logged in', value).toJson()).end();
                                     } else {
                                         res.json(new AuthResponse(false, 'Incorrect password').toJson()).end();
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
                if (req.body.alias.length < 4) {
                    res.json(new AuthResponse(false, 'Alias must be at least 4 characters long').toJson()).end();
                } else if (req.body.alias > 24) {
                    res.json(new AuthResponse(false, 'Alias cannot be longer than 24 characters long').toJson()).end();
                } else if (req.body.password.length < 5) {
                    res.json(new AuthResponse(false, 'Password must be at least 5 characters long').toJson()).end();
                } else if (req.body.password !== req.body.password2) {
                    res.json(new AuthResponse(false, 'Passwords must match').toJson()).end();
                } else {
                    password(req.body.password).hash((error, hash) => {
                        if (error) {
                            console.error('AuthRouter: register: ', error);
                            res.json(new AuthResponse(false, 'An error occurred. Please try again').toJson()).end();
                        } else {
                            UserModel.createUser(req.body.alias, req.body.email, hash)
                                     .then(value => res.json(new AuthResponse(true, 'User registered', value).toJson()).end())
                                     .catch(reason => {
                                         res.json(new AuthResponse(false, 'Error: ' + AuthRouter.getErrorMessage(reason)).toJson()).end()
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
        params = params.filter(element => !req.body[element]);
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

    private static getErrorMessage(reason: any) {
        let errors = reason.errors;
        let error = errors[Object.keys(errors)[0]];
        return error.message;
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
        if (this.user !== undefined) {
            returnVal.user = {
                alias: this.user.alias,
                email: this.user.email,
                jwt: this.generateJwt()
            };
        }
        return returnVal;
    }

    private generateJwt(): string {
        let payload: object = {
            email: this.user.email
        };
        return jwt.sign(payload, process.env.JWT_SECRET || 'secret');
    }
}