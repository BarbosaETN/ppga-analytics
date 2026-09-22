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

alunoRouter.get(
    '/',
    alunoController.listar.bind(alunoController)
);

alunoRouter.get(
    '/:id',
    alunoController.buscarPorId.bind(alunoController)
);

alunoRouter.patch(
    '/:id',
    alunoController.atualizar.bind(alunoController)
);

alunoRouter.delete(
    '/:id',
    alunoController.excluir.bind(alunoController)
);

export default alunoRouter;