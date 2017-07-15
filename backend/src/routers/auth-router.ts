import {Router} from 'express';
import {User} from '../../../shared/user';

export class AuthRouter {

    static addRoutes(router: Router): void {
        router.post('/login', (req, res) => {
        });
        router.post('/register', (req, res) => {
        })
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
}