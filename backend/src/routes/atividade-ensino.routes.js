"use strict";

import { Router } from "express";

import AtividadeEnsinoController from "../controllers/AtividadeEnsinoController.js";

const atividadeEnsinoRouter = Router();

const atividadeEnsinoController = new AtividadeEnsinoController();

atividadeEnsinoRouter.post(
  "/",
  atividadeEnsinoController.criar.bind(atividadeEnsinoController),
);

atividadeEnsinoRouter.get(
  "/",
  atividadeEnsinoController.listar.bind(atividadeEnsinoController),
);

atividadeEnsinoRouter.get(
  "/:id",
  atividadeEnsinoController.buscarPorId.bind(atividadeEnsinoController),
);

atividadeEnsinoRouter.patch(
  "/:id",
  atividadeEnsinoController.atualizar.bind(atividadeEnsinoController),
);

atividadeEnsinoRouter.delete(
  "/:id",
  atividadeEnsinoController.excluir.bind(atividadeEnsinoController),
);

export default atividadeEnsinoRouter;