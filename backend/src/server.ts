import * as express from 'express';
import {Router} from 'express';
import * as bodyParser from 'body-parser';
import {AuthRouter} from './routers/auth-router';

const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const router: Router = express.Router();
AuthRouter.addRoutes(router);

app.use(router);

app.listen(3333);

