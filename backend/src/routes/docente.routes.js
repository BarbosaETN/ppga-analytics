"use strict";

import { Router } from "express";

import DocenteController from "../controllers/DocenteController.js";

const docenteRouter = Router();

const docenteController = new DocenteController();

docenteRouter.post(
  "/",
  docenteController.criar.bind(docenteController),
);

docenteRouter.get(
  "/",
  docenteController.listar.bind(docenteController),
);

docenteRouter.get(
  "/:id",
  docenteController.buscarPorId.bind(docenteController),
);

docenteRouter.patch(
  "/:id",
  docenteController.atualizar.bind(docenteController),
);

docenteRouter.delete(
  "/:id",
  docenteController.excluir.bind(docenteController),
);

export default docenteRouter;