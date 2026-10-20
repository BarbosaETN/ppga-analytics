'use strict';

import { Router } from 'express';
import OrientacaoController from '../controllers/OrientacaoController.js';

const orientacaoRouter = Router();
const orientacaoController = new OrientacaoController();

orientacaoRouter.post(
    '/',
    orientacaoController.criar.bind(orientacaoController)
);

orientacaoRouter.get(
    '/',
    orientacaoController.listar.bind(orientacaoController)
);

orientacaoRouter.get(
    '/:id',
    orientacaoController.buscarPorId.bind(orientacaoController)
);

orientacaoRouter.patch(
    '/:id',
    orientacaoController.atualizar.bind(orientacaoController)
);

orientacaoRouter.delete(
    '/:id',
    orientacaoController.excluir.bind(orientacaoController)
);

export default orientacaoRouter;