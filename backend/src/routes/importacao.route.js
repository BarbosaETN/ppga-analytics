"use strict";

import { Router } from "express";

import ImportacaoController from "../controllers/ImportacaoController.js";

const importacaoRouter = Router();

const importacaoController = new ImportacaoController();

importacaoRouter.post(
  "/",
  importacaoController.criar.bind(importacaoController),
);

importacaoRouter.get(
  "/",
  importacaoController.listar.bind(importacaoController),
);

importacaoRouter.get(
  "/:id",
  importacaoController.buscarPorId.bind(importacaoController),
);

importacaoRouter.patch(
  "/:id",
  importacaoController.atualizar.bind(importacaoController),
);

importacaoRouter.delete(
  "/:id",
  importacaoController.excluir.bind(importacaoController),
);

export default importacaoRouter;