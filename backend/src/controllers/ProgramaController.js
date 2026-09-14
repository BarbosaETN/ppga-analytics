"use strict";

import ProgramaService from "../services/ProgramaService.js";

class ProgramaController {
  constructor() {
    this.programaService = new ProgramaService();
  }

  async criar(req, res, next) {
    try {
      const programa = await this.programaService.criar(req.body);

      return res.status(201).json({
        data: programa,
      });
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const programas = await this.programaService.listar();

      return res.status(200).json({
        data: programas,
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const programa = await this.programaService.buscarPorId(req.params.id);

      return res.status(200).json({
        data: programa,
      });
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const programa = await this.programaService.atualizar(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        data: programa,
      });
    } catch (error) {
      return next(error);
    }
  }

  async excluir(req, res, next) {
    try {
      await this.programaService.remover(req.params.id);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

export default ProgramaController;
