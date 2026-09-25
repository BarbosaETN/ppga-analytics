'use strict';

import { Router } from 'express';

import pessoaRouter from './pessoas.routes.js';
import instituicaoRouter from './instituicao.routes.js';
import programaRouter from './programa.routes.js';
import alunoRouter from './aluno.routes.js';
import periodoRouter from './periodo.routes.js';
import parserVersaoRouter from "./parser-versao.routes.js";

const router = Router();

router.use('/pessoas', pessoaRouter);
router.use('/instituicoes', instituicaoRouter);
router.use('/programas', programaRouter);
router.use('/alunos', alunoRouter);
router.use('/periodos', periodoRouter);
router.use('/parser-versoes', parserVersaoRouter);

export default router;