import express from 'express';
import path from 'path';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      express.static(path.resolve(__dirname, 'app', 'views', 'image'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
