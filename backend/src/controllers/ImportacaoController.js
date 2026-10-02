"use strict";

import ImportacaoService from "../services/ImportacaoService.js";

class ImportacaoController {
  constructor() {
    this.importacaoService = new ImportacaoService();
  }

  async criar(req, res, next) {
    try {
      const importacao = await this.importacaoService.criar(req.body);

      return res.status(201).json({
        data: importacao,
      });
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const importacoes = await this.importacaoService.listar();

      return res.status(200).json({
        data: importacoes,
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const importacao = await this.importacaoService.buscarPorId(
        req.params.id,
      );

      return res.status(200).json({
        data: importacao,
      });
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const importacao = await this.importacaoService.atualizar(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        data: importacao,
      });
    } catch (error) {
      return next(error);
    }
  }

  async excluir(req, res, next) {
    try {
      await this.importacaoService.excluir(req.params.id);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

export default ImportacaoController;