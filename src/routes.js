import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';
import PlansController from './app/controllers/PlansController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinsController from './app/controllers/CheckinsController';
import HelpOrdersController from './app/controllers/HelpOrdersController';
import HelpOrdersUserController from './app/controllers/HelpOrdersUserController';

import authMiddleware from './app/middlewares/auth';
import verifyStudent from './app/middlewares/verifyStudent';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.post(
  '/students/:student_id/checkins',
  verifyStudent,
  CheckinsController.store
);
routes.get(
  '/students/:student_id/checkins',
  verifyStudent,
  CheckinsController.index
);

routes.get(
  '/students/:student_id/help-orders',
  verifyStudent,
  HelpOrdersController.index
);
routes.post(
  '/students/:student_id/help-orders',
  verifyStudent,
  HelpOrdersController.store
);

routes.use(authMiddleware);
routes.post('/students', StudentsController.store);
routes.put('/students/:id', StudentsController.update);

routes.put('/users', UserController.update);

routes.get('/plans', PlansController.index);
routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

routes.get('/enrollment', EnrollmentController.index);
routes.post('/enrollment/:student_id/:plan_id', EnrollmentController.store);
routes.put('/enrollment/:id', EnrollmentController.update);
routes.delete('/enrollment/:id', EnrollmentController.delete);

routes.get('/help-orders/:page', HelpOrdersUserController.index);
routes.put(
  '/help-orders/:help_orders_id/answer',
  HelpOrdersUserController.update
);

export default routes;
