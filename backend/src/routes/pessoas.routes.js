'use strict';

import { Router } from 'express';

import PessoaController from '../controllers/PessoaController.js';

const pessoaRouter = Router();
const pessoaController = new PessoaController();

pessoaRouter.post(
    '/',
    pessoaController.criar.bind(pessoaController)
);

pessoaRouter.get(
    '/',
    pessoaController.listar.bind(pessoaController)
);

pessoaRouter.get(
    '/:id',
    pessoaController.buscarPorId.bind(pessoaController)
);

pessoaRouter.patch(
    '/:id',
    pessoaController.atualizar.bind(pessoaController)
);

pessoaRouter.delete(
    '/:id',
    pessoaController.remover.bind(pessoaController)
);

export default pessoaRouter;