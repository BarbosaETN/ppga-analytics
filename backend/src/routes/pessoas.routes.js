'use strict';

import { Router } from 'express';

import PessoaController from '../controllers/PessoaController.js';

const pessoaRouter = Router();
const pessoaController = new PessoaController();

pessoaRouter.post(
    '/',
    pessoaController.criar.bind(pessoaController)
);

export default pessoaRouter;