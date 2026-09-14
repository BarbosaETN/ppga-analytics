"use strict";

import { ForeignKeyConstraintError } from "sequelize";

import AppError from "../errors/AppError.js";
import ProgramaRepository from "../repositories/ProgramaRepository.js";
import InstituicaoRepository from "../repositories/InstituicaoRepository.js";

class ProgramaService {
  constructor() {
    this.programaRepository = new ProgramaRepository();
    this.instituicaoRepository = new InstituicaoRepository();
  }

  async criar(dados, options = {}) {
    const instituicaoId = Number(dados.instituicao_id);

    if (!Number.isInteger(instituicaoId) || instituicaoId < 1) {
      throw new AppError(
        "instituicao_id deve ser um número inteiro positivo.",
        {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "instituicao_id",
          },
        },
      );
    }

    const instituicao = await this.instituicaoRepository.findById(
      instituicaoId,
      options,
    );

    if (!instituicao) {
      throw new AppError("Instituição não encontrada.", {
        statusCode: 404,
        code: "INSTITUICAO_NOT_FOUND",
        details: {
          id: instituicaoId,
        },
      });
    }

    const nome = dados.nome?.trim();

    if (!nome) {
      throw new AppError("nome é obrigatório.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "nome",
        },
      });
    }

    const dadosPrograma = {
      instituicao_id: instituicaoId,
      nome,
      sigla: dados.sigla?.trim() || null,
    };

    return this.programaRepository.create(dadosPrograma, options);
  }

  async listar(options = {}) {
    return this.programaRepository.findAll(options);
  }

  async buscarPorId(id, options = {}) {
    const programaId = Number(id);

    if (!Number.isInteger(programaId) || programaId < 1) {
      throw new AppError("id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "id",
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

    return programa;
  }

  async atualizar(id, dados, options = {}) {
    const programaId = Number(id);

    if (!Number.isInteger(programaId) || programaId < 1) {
      throw new AppError("id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "id",
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

    const dadosAtualizacao = {};

    if (dados.nome !== undefined) {
      const nome = dados.nome?.trim();

      if (!nome) {
        throw new AppError("nome não pode ser vazio.", {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "nome",
          },
        });
      }

      dadosAtualizacao.nome = nome;
    }

    if (dados.sigla !== undefined) {
      dadosAtualizacao.sigla = dados.sigla?.trim() || null;
    }

    if (dados.instituicao_id !== undefined) {
      const instituicaoId = Number(dados.instituicao_id);

      if (!Number.isInteger(instituicaoId) || instituicaoId < 1) {
        throw new AppError(
          "instituicao_id deve ser um número inteiro positivo.",
          {
            statusCode: 400,
            code: "VALIDATION_ERROR",
            details: {
              campo: "instituicao_id",
            },
          },
        );
      }

      const instituicao = await this.instituicaoRepository.findById(
        instituicaoId,
        options,
      );

      if (!instituicao) {
        throw new AppError("Instituição não encontrada.", {
          statusCode: 404,
          code: "INSTITUICAO_NOT_FOUND",
          details: {
            id: instituicaoId,
          },
        });
      }

      dadosAtualizacao.instituicao_id = instituicaoId;
    }

    await this.programaRepository.update(dadosAtualizacao, {
      ...options,
      where: {
        id: programaId,
      },
    });

    return this.programaRepository.findById(programaId, options);
  }

  async remover(id, options = {}) {
    const programaId = Number(id);

    if (!Number.isInteger(programaId) || programaId < 1) {
      throw new AppError("id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "id",
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

    try {
      await this.programaRepository.delete({
        ...options,
        where: {
          id: programaId,
        },
      });
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new AppError(
          "Não é possível excluir o programa porque existem registros associados.",
          {
            statusCode: 409,
            code: "PROGRAMA_HAS_DEPENDENCIES",
          },
        );
      }

      throw error;
    }
  }
}

export default ProgramaService;
