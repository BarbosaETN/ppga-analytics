"use strict";

import { Router } from "express";
import FormacaoController from "../controllers/FormacaoController.js";

const formacaoRouter = Router();
const formacaoController = new FormacaoController();

formacaoRouter.post(
    "/",
    formacaoController.criar.bind(formacaoController)
);

formacaoRouter.get(
    "/",
    formacaoController.listar.bind(formacaoController) 
);

formacaoRouter.get(
    "/:id",
    formacaoController.buscarPorId.bind(formacaoController) 
);

formacaoRouter.patch(
    "/:id",
    formacaoController.atualizar.bind(formacaoController)
);

formacaoRouter.delete(
    "/:id",
    formacaoController.excluir.bind(formacaoController)
);

export default formacaoRouter;
