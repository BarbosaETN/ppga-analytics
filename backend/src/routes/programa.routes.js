'use strict';

import { Router } from 'express';
import ProgramaController from '../controllers/ProgramaController.js';

const programaRouter = Router();

const programaController =
    new ProgramaController();

programaRouter.post(
    '/',
    programaController.criar.bind(
        programaController
    )
);

export default programaRouter;