"use strict";

import AppError from "../errors/AppError.js";
import { UniqueConstraintError } from "sequelize";

import DocenteRepository from "../repositories/DocenteRepository.js";
import PessoaRepository from "../repositories/PessoaRepository.js";
import ProgramaRepository from "../repositories/ProgramaRepository.js";

class DocenteService {
  constructor() {
    this.docenteRepository = new DocenteRepository();

    this.pessoaRepository = new PessoaRepository();

    this.programaRepository = new ProgramaRepository();
  }

  async criar(dados, options = {}) {
    const pessoaId = Number(dados.pessoa_id);

    if (!Number.isInteger(pessoaId) || pessoaId < 1) {
      throw new AppError("pessoa_id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "pessoa_id",
        },
      });
    }

    const pessoa = await this.pessoaRepository.findById(pessoaId, options);

    if (!pessoa) {
      throw new AppError("Pessoa não encontrada.", {
        statusCode: 404,
        code: "PESSOA_NOT_FOUND",
        details: {
          id: pessoaId,
        },
      });
    }

    const programaId = Number(dados.programa_id);

    if (!Number.isInteger(programaId) || programaId < 1) {
      throw new AppError("programa_id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "programa_id",
        },
      });
    }

    const programa = await this.programaRepository.findById(
      programaId,
      options,
    );

    if (!programa) {
      throw new AppError("Programa não encontrado.", {
        statusCode: 404,
        code: "PROGRAMA_NOT_FOUND",
        details: {
          id: programaId,
        },
      });
    }

    const dadosDocente = {
      pessoa_id: pessoaId,
      programa_id: programaId,
      categoria: dados.categoria?.trim() || null,
      ativo: dados.ativo ?? 1,
    };

    try {
      return await this.docenteRepository.create(dadosDocente, options);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new AppError("A pessoa já está cadastrada neste programa.", {
          statusCode: 409,
          code: "DOCENTE_ALREADY_EXISTS",
          details: null,
        });
      }

      throw error;
    }
  }

  async listar(options = {}) {
    return this.docenteRepository.findAll(options);
  }

  async buscarPorId(id, options = {}) {
    const docenteId = Number(id);

    if (!Number.isInteger(docenteId) || docenteId < 1) {
      throw new AppError("id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "id",
        },
      });
    }

    const docente = await this.docenteRepository.findById(docenteId, options);

    if (!docente) {
      throw new AppError("Docente não encontrado.", {
        statusCode: 404,
        code: "DOCENTE_NOT_FOUND",
        details: {
          id: docenteId,
        },
      });
    }

    return docente;
  }

  async atualizar(id, dados, options = {}) {
    const docenteId = Number(id);

    if (!Number.isInteger(docenteId) || docenteId < 1) {
      throw new AppError("id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "id",
        },
      });
    }

    const docente = await this.docenteRepository.findById(docenteId, options);

    if (!docente) {
      throw new AppError("Docente não encontrado.", {
        statusCode: 404,
        code: "DOCENTE_NOT_FOUND",
        details: {
          id: docenteId,
        },
      });
    }

    const camposPermitidos = ["categoria", "ativo"];

    const dadosAtualizacao = {};

    for (const campo of camposPermitidos) {
      if (dados[campo] !== undefined) {
        dadosAtualizacao[campo] = dados[campo];
      }
    }

    if (dadosAtualizacao.categoria !== undefined) {
      dadosAtualizacao.categoria =
        dadosAtualizacao.categoria?.trim() || null;
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

    await docente.update(dadosAtualizacao, options);

    return docente;
  }

  async excluir(id, options = {}) {
    const docenteId = Number(id);

    if (!Number.isInteger(docenteId) || docenteId < 1) {
      throw new AppError("id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "id",
        },
      });
    }

    const docente = await this.docenteRepository.findById(docenteId, options);

    if (!docente) {
      throw new AppError("Docente não encontrado.", {
        statusCode: 404,
        code: "DOCENTE_NOT_FOUND",
        details: {
          id: docenteId,
        },
      });
    }

    await docente.destroy(options);

    return;
  }
}

export default DocenteService;