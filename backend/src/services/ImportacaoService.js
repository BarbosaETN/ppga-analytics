"use strict";

import AppError from "../errors/AppError.js";
import ImportacaoRepository from "../repositories/ImportacaoRepository.js";
import DocenteRepository from "../repositories/DocenteRepository.js";

class ImportacaoService {
  constructor() {
    this.importacaoRepository = new ImportacaoRepository();
    this.docenteRepository = new DocenteRepository();
  }

  async criar(dados, options = {}) {
    let docenteId = null;

    if (dados.docente_id !== undefined && dados.docente_id !== null) {
      docenteId = Number(dados.docente_id);

      if (!Number.isInteger(docenteId) || docenteId < 1) {
        throw new AppError(
          "docente_id deve ser um número inteiro positivo.",
          {
            statusCode: 400,
            code: "VALIDATION_ERROR",
            details: {
              campo: "docente_id",
            },
          },
        );
      }

      const docente = await this.docenteRepository.findById(
        docenteId,
        options,
      );

      if (!docente) {
        throw new AppError("Docente não encontrado.", {
          statusCode: 404,
          code: "DOCENTE_NOT_FOUND",
          details: {
            id: docenteId,
          },
        });
      }
    }

    if (!dados.data_importacao || !dados.data_importacao.trim()) {
      throw new AppError("A data de importação é obrigatória.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "data_importacao",
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

    const dadosImportacao = {
      docente_id: docenteId,
      nome_arquivo_original:
        dados.nome_arquivo_original?.trim() || null,
      hash_arquivo: dados.hash_arquivo?.trim() || null,
      data_importacao: dados.data_importacao.trim(),
      status: dados.status.trim(),
    };

    return this.importacaoRepository.create(dadosImportacao, options);
  }

  async listar(options = {}) {
    return this.importacaoRepository.findAll(options);
  }

  async buscarPorId(id, options = {}) {
    const importacaoId = Number(id);

    if (!Number.isInteger(importacaoId) || importacaoId < 1) {
      throw new AppError("id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "id",
        },
      });
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

    return importacao;
  }

  async atualizar(id, dados, options = {}) {
    const importacaoId = Number(id);

    if (!Number.isInteger(importacaoId) || importacaoId < 1) {
      throw new AppError("id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "id",
        },
      });
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

    const camposPermitidos = [
      "docente_id",
      "nome_arquivo_original",
      "hash_arquivo",
      "data_importacao",
      "status",
    ];

    const dadosAtualizacao = {};

    if (dados.docente_id !== undefined) {
      if (dados.docente_id === null) {
        dadosAtualizacao.docente_id = null;
      } else {
        const docenteId = Number(dados.docente_id);

        if (!Number.isInteger(docenteId) || docenteId < 1) {
          throw new AppError(
            "docente_id deve ser um número inteiro positivo.",
            {
              statusCode: 400,
              code: "VALIDATION_ERROR",
              details: {
                campo: "docente_id",
              },
            },
          );
        }

        const docente = await this.docenteRepository.findById(
          docenteId,
          options,
        );

        if (!docente) {
          throw new AppError("Docente não encontrado.", {
            statusCode: 404,
            code: "DOCENTE_NOT_FOUND",
            details: {
              id: docenteId,
            },
          });
        }

        dadosAtualizacao.docente_id = docenteId;
      }
    }

    if (dados.nome_arquivo_original !== undefined) {
      dadosAtualizacao.nome_arquivo_original =
        dados.nome_arquivo_original?.trim() || null;
    }

    if (dados.hash_arquivo !== undefined) {
      dadosAtualizacao.hash_arquivo =
        dados.hash_arquivo?.trim() || null;
    }

    if (dados.data_importacao !== undefined) {
      if (!dados.data_importacao || !dados.data_importacao.trim()) {
        throw new AppError("A data de importação é obrigatória.", {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "data_importacao",
          },
        });
      }

      dadosAtualizacao.data_importacao = dados.data_importacao.trim();
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

    await importacao.update(dadosAtualizacao, options);

    return importacao;
  }

  async excluir(id, options = {}) {
    const importacaoId = Number(id);

    if (!Number.isInteger(importacaoId) || importacaoId < 1) {
      throw new AppError("id deve ser um número inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "id",
        },
      });
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

    await importacao.destroy(options);
  }
}

export default ImportacaoService;