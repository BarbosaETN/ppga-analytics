"use strict";

import ParserVersao from "../database/models/parser-versao.js";
import AppError from "../errors/AppError.js";

class ParserVersaoService {
  async criar(dados) {
    if (!dados.versao || !dados.versao.trim()) {
      throw new AppError("A versão é obrigatória.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
      });
    }

    if (!dados.criado_em || !dados.criado_em.trim()) {
      throw new AppError("A data de criação é obrigatória.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
      });
    }

    const parserVersao = await ParserVersao.create({
      versao: dados.versao.trim(),
      descricao: dados.descricao?.trim() || null,
      criado_em: dados.criado_em.trim(),
    });

    return parserVersao;
  }

  async listar() {
    return await ParserVersao.findAll();
  }

  async buscarPorId(id) {
    const parserVersao = await ParserVersao.findByPk(id);

    if (!parserVersao) {
      throw new AppError("Versão do parser não encontrada.", {
        statusCode: 404,
        code: "PARSER_VERSAO_NOT_FOUND",
        details: {
          id,
        },
      });
    }

    return parserVersao;
  }

  async atualizar(id, dados) {
    const parserVersao = await ParserVersao.findByPk(id);

    if (!parserVersao) {
      throw new AppError("Versão do parser não encontrada.", {
        statusCode: 404,
        code: "PARSER_VERSAO_NOT_FOUND",
        details: {
          id,
        },
      });
    }

    const dadosPermitidos = {};

    if (dados.versao !== undefined) {
      if (!dados.versao || !dados.versao.trim()) {
        throw new AppError("A versão é obrigatória.", {
          statusCode: 400,
          code: "VALIDATION_ERROR",
        });
      }

      dadosPermitidos.versao = dados.versao.trim();
    }

    if (dados.descricao !== undefined) {
      dadosPermitidos.descricao = dados.descricao?.trim() || null;
    }

    if (dados.criado_em !== undefined) {
      if (!dados.criado_em || !dados.criado_em.trim()) {
        throw new AppError("A data de criação é obrigatória.", {
          statusCode: 400,
          code: "VALIDATION_ERROR",
        });
      }

      dadosPermitidos.criado_em = dados.criado_em.trim();
    }

    if (Object.keys(dadosPermitidos).length === 0) {
      throw new AppError(
        "É necessário informar pelo menos um campo para atualização.",
        {
          statusCode: 400,
          code: "VALIDATION_ERROR",
        },
      );
    }

    await parserVersao.update(dadosPermitidos);

    return parserVersao;
  }

  async excluir(id) {
    const parserVersao = await ParserVersao.findByPk(id);

    if (!parserVersao) {
      throw new AppError("Versão do parser não encontrada.", {
        statusCode: 404,
        code: "PARSER_VERSAO_NOT_FOUND",
        details: {
          id,
        },
      });
    }

    await parserVersao.destroy();
  }
}

export default ParserVersaoService;
