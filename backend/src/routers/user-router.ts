import {Request, Response, Router} from 'express';
import * as jwt from 'jsonwebtoken';
import {UserModel} from '../models/user';

export class UserRouter {

    static addRoutes(router: Router) {
        router.get('/user/profile', (req: Request, res: Response) => {
            console.log(req.headers['authorization']);
            if (req.headers['authorization']) {
                let split = (<string>req.headers['authorization']).split(' ');
                if (split[0] === 'Bearer') {
                    let token = split[1];
                    jwt.verify(token, process.env.LS_JWT_SECRET || 'secret', (error, decoded: string) => {
                        if (!error) {
                            let data = JSON.parse(decoded);
                            // TODO Add more functionality when there is more user data
                            UserModel.getUser({email: data.email});
                        }
                    })
                }
            }
            res.end();
        });
        router.get('/user/friends', (req: Request, res: Response) => {
            if (req.headers['authorization']) {
                let split = (<string>req.headers['authorization']).split(' ');
                if (split[0] === 'Bearer') {
                    let token = split[1];
                    jwt.verify(token, process.env.LS_JWT_SECRET || 'secret', (error, decoded: object) => {
                        if (!error) {
                            UserModel.getUser({email: decoded['email']})
                                     .then(user => user.friends.then(friends => {
                                         friends.forEach(value => ({
                                             alias: value.alias}));
                                         res.json(friends).end();
                                     }).catch(reason => {
                                         console.error(reason);
                                         res.end();
                                     }))
                                     .catch(reason => {
                                         console.error(reason);
                                         res.end();
                                     });
                        }
                    })
                }
            }
        });
    }
}