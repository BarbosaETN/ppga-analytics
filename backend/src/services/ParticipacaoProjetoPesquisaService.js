"use strict";

import AppError from "../errors/AppError.js";
import ParticipacaoProjetoPesquisaRepository from "../repositories/ParticipacaoProjetoPesquisaRepository.js";
import ProjetoPesquisaRepository from "../repositories/ProjetoPesquisaRepository.js";
import PessoaRepository from "../repositories/PessoaRepository.js";

class ParticipacaoProjetoPesquisaService {
  constructor() {
    this.repository = new ParticipacaoProjetoPesquisaRepository();
    this.projetoPesquisaRepository = new ProjetoPesquisaRepository();
    this.pessoaRepository = new PessoaRepository();
  }

  async criar(dados, options = {}) {
    const { projeto_id } = dados;

    if (!Number.isInteger(projeto_id) || projeto_id <= 0) {
      throw new AppError("O projeto_id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
      });
    }

    const projeto = await this.projetoPesquisaRepository.findById(
      projeto_id,
      options,
    );

    if (!projeto) {
      throw new AppError(
        "O projeto de pesquisa informado não foi encontrado.",
        {
          statusCode: 404,
          code: "PROJETO_PESQUISA_NOT_FOUND",
        },
      );
    }

    const { pessoa_id } = dados;

    if (!Number.isInteger(pessoa_id) || pessoa_id <= 0) {
      throw new AppError("O pessoa_id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
      });
    }

    const pessoa = await this.pessoaRepository.findById(pessoa_id, options);

    if (!pessoa) {
      throw new AppError("A pessoa informada não foi encontrada.", {
        statusCode: 404,
        code: "PESSOA_NOT_FOUND",
      });
    }

    const papel = dados.papel?.trim() || null;

    const participacaoExistente = await this.repository.findOne(
      {
        projeto_id,
        pessoa_id,
      },
      options,
    );

    if (participacaoExistente) {
      throw new AppError("A pessoa já participa deste projeto de pesquisa.", {
        statusCode: 409,
        code: "PARTICIPACAO_PROJETO_PESQUISA_ALREADY_EXISTS",
      });
    }

    const participacao = await this.repository.create(
      {
        projeto_id,
        pessoa_id,
        papel,
      },
      options,
    );

    return participacao;
  }
}

export default ParticipacaoProjetoPesquisaService;
