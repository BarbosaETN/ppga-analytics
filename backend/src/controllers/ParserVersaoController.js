"use strict";

import ParserVersaoService from "../services/ParserVersaoService.js";
import AppError from "../errors/AppError.js";

class ParserVersaoController {
  constructor() {
    this.parserVersaoService = new ParserVersaoService();
  }

  async criar(req, res, next) {
    try {
      const parserVersao = await this.parserVersaoService.criar(req.body);

      return res.status(201).json({
        data: parserVersao,
      });
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const parserVersoes = await this.parserVersaoService.listar();

      return res.status(200).json({
        data: parserVersoes,
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const id = Number(req.params.id);
      const parserVersao = await this.parserVersaoService.buscarPorId(id);

      return res.status(200).json({
        data: parserVersao,
      });
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const id = Number(req.params.id);

      const parserVersao = await this.parserVersaoService.atualizar(
        id,
        req.body,
      );

      return res.status(200).json({
        data: parserVersao,
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

      await this.parserVersaoService.excluir(id);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

export default ParserVersaoController;
