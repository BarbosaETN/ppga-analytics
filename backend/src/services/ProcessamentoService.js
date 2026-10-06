"use strict";

import AppError from "../errors/AppError.js";
import ProcessamentoRepository from "../repositories/ProcessamentoRepository.js";
import ImportacaoRepository from "../repositories/ImportacaoRepository.js";
import ParserVersaoRepository from "../repositories/ParserVersaoRepository.js";

class ProcessamentoService {
  constructor() {
    this.processamentoRepository = new ProcessamentoRepository();
    this.importacaoRepository = new ImportacaoRepository();
    this.parserVersaoRepository = new ParserVersaoRepository();
  }

  async criar(dados, options = {}) {
    const importacaoId = Number(dados.importacao_id);

    if (!Number.isInteger(importacaoId) || importacaoId < 1) {
      throw new AppError(
        "importacao_id deve ser um número inteiro positivo.",
        {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "importacao_id",
          },
        },
      );
    }

    const importacao = await this.importacaoRepository.findById(
      importacaoId,
      options,
    );

    if (!importacao) {
      throw new AppError("Importação não encontrada.", {
        statusCode: 404,
        code: "IMPORTACAO_NOT_FOUND",
        details: {
          id: importacaoId,
        },
      });
    }

    const parserVersaoId = Number(dados.parser_versao_id);

    if (!Number.isInteger(parserVersaoId) || parserVersaoId < 1) {
      throw new AppError(
        "parser_versao_id deve ser um número inteiro positivo.",
        {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "parser_versao_id",
          },
        },
      );
    }

    const parserVersao = await this.parserVersaoRepository.findById(
      parserVersaoId,
      options,
    );

    if (!parserVersao) {
      throw new AppError("Versão do parser não encontrada.", {
        statusCode: 404,
        code: "PARSER_VERSAO_NOT_FOUND",
        details: {
          id: parserVersaoId,
        },
      });
    }

    if (!dados.iniciado_em || !dados.iniciado_em.trim()) {
      throw new AppError("A data de início é obrigatória.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "iniciado_em",
        },
      });
    }

    if (!dados.status || !dados.status.trim()) {
      throw new AppError("O status é obrigatório.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "status",
        },
      });
    }

    const dadosProcessamento = {
      importacao_id: importacaoId,
      parser_versao_id: parserVersaoId,
      iniciado_em: dados.iniciado_em.trim(),
      finalizado_em: dados.finalizado_em?.trim() || null,
      status: dados.status.trim(),
      registros_processados: dados.registros_processados ?? null,
      erros: dados.erros?.trim() || null,
      alertas: dados.alertas?.trim() || null,
    };

    return this.processamentoRepository.create(
      dadosProcessamento,
      options,
    );
  }

  async listar(options = {}) {
    return this.processamentoRepository.findAll(options);
  }

  async buscarPorId(id, options = {}) {
    const processamentoId = Number(id);

    if (!Number.isInteger(processamentoId) || processamentoId < 1) {
      throw new AppError("id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "id",
        },
      });
    }

    const processamento = await this.processamentoRepository.findById(
      processamentoId,
      options,
    );

    if (!processamento) {
      throw new AppError("Processamento não encontrado.", {
        statusCode: 404,
        code: "PROCESSAMENTO_NOT_FOUND",
        details: {
          id: processamentoId,
        },
      });
    }

    return processamento;
  }

  async atualizar(id, dados, options = {}) {
    const processamentoId = Number(id);

    if (!Number.isInteger(processamentoId) || processamentoId < 1) {
      throw new AppError("id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "id",
        },
      });
    }

    const processamento = await this.processamentoRepository.findById(
      processamentoId,
      options,
    );

    if (!processamento) {
      throw new AppError("Processamento não encontrado.", {
        statusCode: 404,
        code: "PROCESSAMENTO_NOT_FOUND",
        details: {
          id: processamentoId,
        },
      });
    }

    const camposPermitidos = [
      "importacao_id",
      "parser_versao_id",
      "iniciado_em",
      "finalizado_em",
      "status",
      "registros_processados",
      "erros",
      "alertas",
    ];

    const dadosAtualizacao = {};

    if (dados.importacao_id !== undefined) {
      const importacaoId = Number(dados.importacao_id);

      if (!Number.isInteger(importacaoId) || importacaoId < 1) {
        throw new AppError(
          "importacao_id deve ser um número inteiro positivo.",
          {
            statusCode: 400,
            code: "VALIDATION_ERROR",
            details: {
              campo: "importacao_id",
            },
          },
        );
      }

      const importacao = await this.importacaoRepository.findById(
        importacaoId,
        options,
      );

      if (!importacao) {
        throw new AppError("Importação não encontrada.", {
          statusCode: 404,
          code: "IMPORTACAO_NOT_FOUND",
          details: {
            id: importacaoId,
          },
        });
      }

      dadosAtualizacao.importacao_id = importacaoId;
    }

    if (dados.parser_versao_id !== undefined) {
      const parserVersaoId = Number(dados.parser_versao_id);

      if (!Number.isInteger(parserVersaoId) || parserVersaoId < 1) {
        throw new AppError(
          "parser_versao_id deve ser um número inteiro positivo.",
          {
            statusCode: 400,
            code: "VALIDATION_ERROR",
            details: {
              campo: "parser_versao_id",
            },
          },
        );
      }

      const parserVersao = await this.parserVersaoRepository.findById(
        parserVersaoId,
        options,
      );

      if (!parserVersao) {
        throw new AppError("Versão do parser não encontrada.", {
          statusCode: 404,
          code: "PARSER_VERSAO_NOT_FOUND",
          details: {
            id: parserVersaoId,
          },
        });
      }

      dadosAtualizacao.parser_versao_id = parserVersaoId;
    }

    if (dados.iniciado_em !== undefined) {
      if (!dados.iniciado_em || !dados.iniciado_em.trim()) {
        throw new AppError("A data de início é obrigatória.", {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "iniciado_em",
          },
        });
      }

      dadosAtualizacao.iniciado_em = dados.iniciado_em.trim();
    }

    if (dados.finalizado_em !== undefined) {
      dadosAtualizacao.finalizado_em =
        dados.finalizado_em?.trim() || null;
    }

    if (dados.status !== undefined) {
      if (!dados.status || !dados.status.trim()) {
        throw new AppError("O status é obrigatório.", {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "status",
          },
        });
      }

      dadosAtualizacao.status = dados.status.trim();
    }

    if (dados.registros_processados !== undefined) {
      dadosAtualizacao.registros_processados =
        dados.registros_processados;
    }

    if (dados.erros !== undefined) {
      dadosAtualizacao.erros = dados.erros?.trim() || null;
    }

    if (dados.alertas !== undefined) {
      dadosAtualizacao.alertas = dados.alertas?.trim() || null;
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

    await processamento.update(dadosAtualizacao, options);

    return processamento;
  }

  async excluir(id, options = {}) {
    const processamentoId = Number(id);

    if (!Number.isInteger(processamentoId) || processamentoId < 1) {
      throw new AppError("id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "id",
        },
      });
    }

    const processamento = await this.processamentoRepository.findById(
      processamentoId,
      options,
    );

    if (!processamento) {
      throw new AppError("Processamento não encontrado.", {
        statusCode: 404,
        code: "PROCESSAMENTO_NOT_FOUND",
        details: {
          id: processamentoId,
        },
      });
    }

    await processamento.destroy(options);
  }
}

export default ProcessamentoService;