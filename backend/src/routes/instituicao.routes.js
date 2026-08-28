'use strict';

import { Router } from 'express';
import InstituicaoController from '../controllers/InstituicaoController.js';

const instituicaoRouter = Router();

const instituicaoController =
    new InstituicaoController();

instituicaoRouter.post(
    '/',
    instituicaoController.criar.bind(
        instituicaoController
    )
);

instituicaoRouter.get(
    '/',
    instituicaoController.listar.bind(
        instituicaoController
    )
);

instituicaoRouter.get(
    '/:id',
    instituicaoController.buscarPorId.bind(
        instituicaoController
    )
);

instituicaoRouter.patch(
    '/:id',
    instituicaoController.atualizar.bind(
        instituicaoController
    )
);

export default instituicaoRouter;