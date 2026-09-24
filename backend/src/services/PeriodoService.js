"use strict";

import AppError from "../errors/AppError.js";
import PeriodoRepository from "../repositories/PeriodoRepository.js";

class PeriodoService {
  constructor() {
    this.periodoRepository = new PeriodoRepository();
  }

  async criar(dados, options = {}) {
    if (dados.ano === undefined || dados.ano === null) {
      throw new AppError("ano é obrigatório.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "ano",
        },
      });
    }

    return this.periodoRepository.create(dados, options);
  }

  async listar(options = {}) {
    return this.periodoRepository.findAll(options);
  }

  async buscarPorId(id, options = {}) {
    const periodoId = Number(id);

    if (!Number.isInteger(periodoId) || periodoId < 1) {
      throw new AppError("id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "id",
        },
      });
    }

    const periodo = await this.periodoRepository.findById(periodoId, options);

    if (!periodo) {
      throw new AppError("Período não encontrado.", {
        statusCode: 404,
        code: "PERIODO_NOT_FOUND",
        details: {
          id: periodoId,
        },
      });
    }

    return periodo;
  }

  async atualizar(id, dados) {
    const periodo = await this.periodoRepository.findById(id);

    if (!periodo) {
      throw new AppError("Período não encontrado.", {
        statusCode: 404,
        code: "PERIODO_NOT_FOUND",
        details: {
          id: Number(id),
        },
      });
    }

    const camposPermitidos = ["ano", "descricao", "inicio", "fim"];

    const dadosAtualizacao = {};

    for (const campo of camposPermitidos) {
      if (dados[campo] !== undefined) {
        dadosAtualizacao[campo] = dados[campo];
      }
    }

    if (Object.keys(dadosAtualizacao).length === 0) {
      throw new AppError(
        "Nenhum campo válido para atualização foi informado.",
        {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campos_permitidos: camposPermitidos,
          },
        },
      );
    }

    await periodo.update(dadosAtualizacao);

    return periodo;
  }

  async excluir(id) {
    const periodo = await this.periodoRepository.findById(id);

    if (!periodo) {
      throw new AppError("Período não encontrado.", {
        statusCode: 404,
        code: "PERIODO_NOT_FOUND",
        details: {
          id: Number(id),
        },
      });
    }

    await periodo.destroy();
  }
}

export default PeriodoService;
