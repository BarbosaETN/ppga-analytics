"use strict";

import { Router } from "express";

import ProcessamentoController from "../controllers/ProcessamentoController.js";

const processamentoRouter = Router();

const processamentoController = new ProcessamentoController();

processamentoRouter.post(
  "/",
  processamentoController.criar.bind(processamentoController),
);

processamentoRouter.get(
  "/",
  processamentoController.listar.bind(processamentoController),
);

processamentoRouter.get(
  "/:id",
  processamentoController.buscarPorId.bind(processamentoController),
);

processamentoRouter.patch(
  "/:id",
  processamentoController.atualizar.bind(processamentoController),
);

processamentoRouter.delete(
  "/:id",
  processamentoController.excluir.bind(processamentoController),
);

export default processamentoRouter;