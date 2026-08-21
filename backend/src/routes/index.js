'use strict';

import { Router } from 'express';

import pessoaRouter from './pessoas.routes.js';

const router = Router();

router.use('/pessoas', pessoaRouter);

export default router;