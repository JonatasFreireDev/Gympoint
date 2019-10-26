import {Router} from 'express';

const routes = new Router();

routes.get('/ola',(req, res) =>{
  return res.json({value:"Ola"});
})

export default routes;