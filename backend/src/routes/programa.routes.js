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

programaRouter.get(
    '/',
    programaController.listar.bind(
        programaController
    )
);

programaRouter.get(
    '/:id',
    programaController.buscarPorId.bind(
        programaController
    )
);

programaRouter.patch(
    '/:id',
    programaController.atualizar.bind(
        programaController
    )
);

programaRouter.delete(
    '/:id',
    programaController.excluir.bind(
        programaController
    )
);

export default programaRouter;