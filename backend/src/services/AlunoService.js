"use strict";

import AppError from "../errors/AppError.js";
import { UniqueConstraintError } from "sequelize";
import AlunoRepository from "../repositories/AlunoRepository.js";
import PessoaRepository from "../repositories/PessoaRepository.js";
import ProgramaRepository from "../repositories/ProgramaRepository.js";

class AlunoService {
  constructor() {
    this.alunoRepository = new AlunoRepository();

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

    const dadosAluno = {
      pessoa_id: pessoaId,
      programa_id: programaId,
      nivel: dados.nivel?.trim() || null,
      situacao: dados.situacao?.trim() || null,
      ano_ingresso: dados.ano_ingresso ?? null,
    };

    try {
      return await this.alunoRepository.create(dadosAluno, options);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new AppError("A pessoa já está cadastrada neste programa.", {
          statusCode: 409,
          code: "ALUNO_ALREADY_EXISTS",
          details: null,
        });
      }

      throw error;
    }
  }
}

export default AlunoService;
