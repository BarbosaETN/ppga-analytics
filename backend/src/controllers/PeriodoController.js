"use strict";

import PeriodoService from "../services/PeriodoService.js";
import AppError from "../errors/AppError.js";

class PeriodoController {
  constructor() {
    this.periodoService = new PeriodoService();
  }

  async criar(req, res, next) {
    try {
      const periodo = await this.periodoService.criar(req.body);

      return res.status(201).json({
        data: periodo,
      });
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const periodos = await this.periodoService.listar();

      return res.status(200).json({
        data: periodos,
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const periodo = await this.periodoService.buscarPorId(req.params.id);

      return res.status(200).json({
        data: periodo,
      });
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const periodo = await this.periodoService.atualizar(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        data: periodo,
      });
    } catch (error) {
      return next(error);
    }
  }

  async excluir(req, res, next) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        throw new AppError("id deve ser um número inteiro positivo.", {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "id",
          },
        });
      }

      await this.periodoService.excluir(id);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

export default PeriodoController;
