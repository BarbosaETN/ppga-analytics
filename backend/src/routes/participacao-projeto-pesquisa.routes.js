"use strict";

import { Router } from "express";

import ParticipacaoProjetoPesquisaController from "../controllers/ParticipacaoProjetoPesquisaController.js";

const participacaoProjetoPesquisaRouter = Router();

const participacaoProjetoPesquisaController =
  new ParticipacaoProjetoPesquisaController();

participacaoProjetoPesquisaRouter.post(
  "/",
  participacaoProjetoPesquisaController.criar.bind(
    participacaoProjetoPesquisaController,
  ),
);

participacaoProjetoPesquisaRouter.get(
  "/",
  participacaoProjetoPesquisaController.listar.bind(
    participacaoProjetoPesquisaController,
  ),
);

participacaoProjetoPesquisaRouter.get(
  "/:id",
  participacaoProjetoPesquisaController.buscarPorId.bind(
    participacaoProjetoPesquisaController,
  ),
);

participacaoProjetoPesquisaRouter.patch(
  "/:id",
  participacaoProjetoPesquisaController.atualizar.bind(
    participacaoProjetoPesquisaController,
  ),
);

participacaoProjetoPesquisaRouter.delete(
  "/:id",
  participacaoProjetoPesquisaController.excluir.bind(
    participacaoProjetoPesquisaController,
  ),
);

export default participacaoProjetoPesquisaRouter;