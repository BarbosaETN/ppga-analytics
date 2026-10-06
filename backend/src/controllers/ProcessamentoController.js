"use strict";

import ProcessamentoService from "../services/ProcessamentoService.js";

class ProcessamentoController {
  constructor() {
    this.processamentoService = new ProcessamentoService();
  }

  async criar(req, res, next) {
    try {
      const processamento = await this.processamentoService.criar(req.body);

      return res.status(201).json({
        data: processamento,
      });
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const processamentos = await this.processamentoService.listar();

      return res.status(200).json({
        data: processamentos,
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const processamento = await this.processamentoService.buscarPorId(
        req.params.id,
      );

      return res.status(200).json({
        data: processamento,
      });
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const processamento = await this.processamentoService.atualizar(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        data: processamento,
      });
    } catch (error) {
      return next(error);
    }
  }

  async excluir(req, res, next) {
    try {
      await this.processamentoService.excluir(req.params.id);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

export default ProcessamentoController;