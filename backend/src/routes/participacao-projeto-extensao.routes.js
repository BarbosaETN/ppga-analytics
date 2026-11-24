"use strict";

import { Router } from "express";

import ParticipacaoProjetoExtensaoController from "../controllers/ParticipacaoProjetoExtensaoController.js";

const participacaoProjetoExtensaoRouter = Router();

const participacaoProjetoExtensaoController =
  new ParticipacaoProjetoExtensaoController();

participacaoProjetoExtensaoRouter.post(
  "/",
  participacaoProjetoExtensaoController.criar.bind(
    participacaoProjetoExtensaoController,
  ),
);

participacaoProjetoExtensaoRouter.get(
  "/",
  participacaoProjetoExtensaoController.listar.bind(
    participacaoProjetoExtensaoController,
  ),
);

participacaoProjetoExtensaoRouter.get(
  "/:id",
  participacaoProjetoExtensaoController.buscarPorId.bind(
    participacaoProjetoExtensaoController,
  ),
);

participacaoProjetoExtensaoRouter.patch(
  "/:id",
  participacaoProjetoExtensaoController.atualizar.bind(
    participacaoProjetoExtensaoController,
  ),
);

participacaoProjetoExtensaoRouter.delete(
  "/:id",
  participacaoProjetoExtensaoController.excluir.bind(
    participacaoProjetoExtensaoController,
  ),
);

export default participacaoProjetoExtensaoRouter;
