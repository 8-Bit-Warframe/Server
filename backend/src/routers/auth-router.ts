import {Request, Router} from 'express';
import {User} from '../../../shared/user';

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
                res.end();
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
    user?: User;

    constructor(success: boolean, message: string, user?: User) {
        this.success = success;
        this.message = message;
        this.user = user;
    }

    toJsonString(): string {
        return JSON.stringify(this);
    }
}