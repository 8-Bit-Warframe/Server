import * as express from 'express';
import {Router} from 'express';
import * as bodyParser from 'body-parser';
import {AuthRouter} from './routers/auth-router';
import {setupMongoose} from './config/mongoose'

const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

setupMongoose('mongodb://localhost/' + (process.env.LS_MONGODB || 'lsTest'));

const router: Router = express.Router();
AuthRouter.addRoutes(router);

app.use(router);

app.listen(3333);

