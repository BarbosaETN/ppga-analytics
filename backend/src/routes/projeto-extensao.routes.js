"use strict";

import { Router } from "express";

import ProjetoExtensaoController from "../controllers/ProjetoExtensaoController.js";

const projetoExtensaoRouter = Router();

const projetoExtensaoController =
  new ProjetoExtensaoController();

projetoExtensaoRouter.post(
  "/",
  projetoExtensaoController.criar.bind(
    projetoExtensaoController,
  ),
);

projetoExtensaoRouter.get(
  "/",
  projetoExtensaoController.listar.bind(
    projetoExtensaoController,
  ),
);

projetoExtensaoRouter.get(
  "/:id",
  projetoExtensaoController.buscarPorId.bind(
    projetoExtensaoController,
  ),
);

projetoExtensaoRouter.patch(
  "/:id",
  projetoExtensaoController.atualizar.bind(
    projetoExtensaoController,
  ),
);

projetoExtensaoRouter.delete(
  "/:id",
  projetoExtensaoController.excluir.bind(
    projetoExtensaoController,
  ),
);

export default projetoExtensaoRouter;