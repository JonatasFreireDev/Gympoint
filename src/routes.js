import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/session', SessionController.store);
routes.post('/students', StudentsController.store);
routes.use(authMiddleware);

export default routes;
