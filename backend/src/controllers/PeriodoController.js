"use strict";

import PeriodoService from "../services/PeriodoService.js";

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
}

export default PeriodoController;
