"use strict";

import { Router } from "express";

import ParserVersaoController from "../controllers/ParserVersaoController.js";

const parserVersaoRouter = Router();

const parserVersaoController = new ParserVersaoController();

parserVersaoRouter.post(
  "/",
  parserVersaoController.criar.bind(parserVersaoController)
);

parserVersaoRouter.get(
  "/",
  parserVersaoController.listar.bind(parserVersaoController)
);

parserVersaoRouter.get(
  "/:id",
  parserVersaoController.buscarPorId.bind(parserVersaoController)
);

parserVersaoRouter.patch(
  "/:id",
  parserVersaoController.atualizar.bind(parserVersaoController),
);

parserVersaoRouter.delete(
  "/:id",
  parserVersaoController.excluir.bind(parserVersaoController),
);

export default parserVersaoRouter;