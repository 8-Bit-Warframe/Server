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
            UserRouter.checkJwt(req)
                      .then(value => UserModel.getUser({email: value['email']}))
                      .then(value => value.friends)
                      .then(value => {
                          value.forEach(item => ({alias: item.alias}));
                          return value;
                      })
                      .then(value => res.json(value).end())
                      .catch(reason => res.sendStatus(401).json({
                          error: reason
                      }).end());
        });
    }

    private static checkJwt(req: Request): Promise<string> {
        return new Promise((resolve, reject) => {
            if (req.headers['authorization']) {
                let split = (<string>req.headers['authorization']).split(' ');
                if (split[0] === 'Bearer') {
                    let token = split[1];
                    jwt.verify(token, process.env.LS_JWT_SECRET || 'secret', (error, decoded: object) => {
                        if (error) {
                            reject();
                        } else {
                            resolve(decoded);
                        }
                    });
                } else {
                    reject('Incorrect authorization header');
                }
            } else {
                reject('Authorization header not present');
            }
        });
    }
}