import express from 'express';
import donateNow from '../Controller/donateController.js';

const donateRouter = express.Router();

donateRouter.post('/donate', donateNow);

export default donateRouter;