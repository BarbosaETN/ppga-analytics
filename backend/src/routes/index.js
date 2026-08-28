'use strict';

import { Router } from 'express';

import pessoaRouter from './pessoas.routes.js';
import instituicaoRouter from './instituicao.routes.js';

const router = Router();

router.use('/pessoas', pessoaRouter);
router.use('/instituicoes', instituicaoRouter)

export default router;