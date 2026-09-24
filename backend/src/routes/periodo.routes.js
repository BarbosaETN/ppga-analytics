'use strict';

import { Router } from 'express';
import PeriodoController from '../controllers/PeriodoController.js';

const periodoRouter = Router();

const periodoController = new PeriodoController();

periodoRouter.post(
    '/',
    periodoController.criar.bind(periodoController)
);

periodoRouter.get(
    '/',
    periodoController.listar.bind(periodoController)
);

export default periodoRouter;