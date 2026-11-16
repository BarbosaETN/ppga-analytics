"use strict";

import ParticipacaoProjetoPesquisaService from "../services/ParticipacaoProjetoPesquisaService.js";

class ParticipacaoProjetoPesquisaController {
  constructor() {
    this.service = new ParticipacaoProjetoPesquisaService();
  }

  async criar(req, res, next) {
    try {
      const participacao = await this.service.criar(req.body);

      return res.status(201).json({
        data: participacao,
      });
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const participacoes = await this.service.listar();

      return res.status(200).json({
        data: participacoes,
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const participacao = await this.service.buscarPorId(
        Number(req.params.id),
      );

      return res.status(200).json({
        data: participacao,
      });
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const participacao = await this.service.atualizar(
        Number(req.params.id),
        req.body,
      );

      return res.status(200).json({
        data: participacao,
      });
    } catch (error) {
      return next(error);
    }
  }

  async excluir(req, res, next) {
    try {
      await this.service.excluir(Number(req.params.id));

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

export default ParticipacaoProjetoPesquisaController;
