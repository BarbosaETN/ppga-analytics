"use strict";

import DocenteService from "../services/DocenteService.js";

class DocenteController {
  constructor() {
    this.docenteService = new DocenteService();
  }

  async criar(req, res, next) {
    try {
      const docente = await this.docenteService.criar(req.body);

      return res.status(201).json({
        data: docente,
      });
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const docentes = await this.docenteService.listar();

      return res.status(200).json({
        data: docentes,
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const docente = await this.docenteService.buscarPorId(req.params.id);

      return res.status(200).json({
        data: docente,
      });
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const docente = await this.docenteService.atualizar(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        data: docente,
      });
    } catch (error) {
      return next(error);
    }
  }

  async excluir(req, res, next) {
    try {
      await this.docenteService.excluir(req.params.id);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

export default DocenteController;