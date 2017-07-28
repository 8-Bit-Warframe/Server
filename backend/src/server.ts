import * as express from 'express';
import {NextFunction, Request, Response, Router} from 'express';
import * as bodyParser from 'body-parser';
import {AuthRouter} from './routers/auth-router';
import {UserRouter} from './routers/user-router';

const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const router: Router = express.Router();
AuthRouter.addRoutes(router);
UserRouter.addRoutes(router);

app.use(router);

app.listen(3333);

