"use strict";

import AlunoService from "../services/AlunoService.js";

class AlunoController {
  constructor() {
    this.alunoService = new AlunoService();
  }

  async criar(req, res, next) {
    try {
      const aluno = await this.alunoService.criar(req.body);

      return res.status(201).json({
        data: aluno,
      });
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const alunos = await this.alunoService.listar();

      return res.status(200).json({
        data: alunos,
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const aluno = await this.alunoService.buscarPorId(req.params.id);

      return res.status(200).json({
        data: aluno,
      });
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const aluno = await this.alunoService.atualizar(req.params.id, req.body);

      return res.status(200).json({
        data: aluno,
      });
    } catch (error) {
      return next(error);
    }
  }

  async excluir(req, res, next) {
    try {
      await this.alunoService.excluir(req.params.id);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

export default AlunoController;
