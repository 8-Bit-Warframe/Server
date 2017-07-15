import {Router} from 'express';

export class AuthRouter {

    static addRoutes(router: Router): void {
        router.post('/login', (req, res) => {
        });
        router.post('/register', (req, res) => {
        })
    }
}