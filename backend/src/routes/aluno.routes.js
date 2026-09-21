'use strict';

import { Router } from 'express';
import AlunoController from '../controllers/AlunoController.js';

const alunoRouter = Router();

const alunoController =
    new AlunoController();

alunoRouter.post(
    '/',
    alunoController.criar.bind(
        alunoController
    )
);

export default alunoRouter;