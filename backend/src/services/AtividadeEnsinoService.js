"use strict";

import AppError from "../errors/AppError.js";
import AtividadeEnsinoRepository from "../repositories/AtividadeEnsinoRepository.js";
import DocenteRepository from "../repositories/DocenteRepository.js";
import PeriodoRepository from "../repositories/PeriodoRepository.js";
import ProcessamentoRepository from "../repositories/ProcessamentoRepository.js";

class AtividadeEnsinoService {
  constructor() {
    this.repository = new AtividadeEnsinoRepository();
    this.docenteRepository = new DocenteRepository();
    this.periodoRepository = new PeriodoRepository();
    this.processamentoRepository = new ProcessamentoRepository();
  }

  async criar(dados, options = {}) {
    const {
      docente_id,
      periodo_id,
      tipo,
      disciplina,
      nivel,
      descricao,
      processamento_id,
    } = dados;

    if (!Number.isInteger(docente_id) || docente_id <= 0) {
      throw new AppError("O docente_id deve ser um inteiro positivo.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "docente_id",
        },
      });
    }

    const docente = await this.docenteRepository.findById(docente_id, options);

    if (!docente) {
      throw new AppError("Docente não encontrado.", {
        statusCode: 404,
        code: "DOCENTE_NOT_FOUND",
      });
    }

    if (periodo_id !== undefined && periodo_id !== null) {
      if (!Number.isInteger(periodo_id) || periodo_id <= 0) {
        throw new AppError("O periodo_id deve ser um inteiro positivo.", {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "periodo_id",
          },
        });
      }

      const periodo = await this.periodoRepository.findById(
        periodo_id,
        options,
      );

      if (!periodo) {
        throw new AppError("Período não encontrado.", {
          statusCode: 404,
          code: "PERIODO_NOT_FOUND",
        });
      }
    }

    if (typeof tipo !== "string" || !tipo.trim()) {
      throw new AppError("O tipo é obrigatório.", {
        statusCode: 400,
        code: "VALIDATION_ERROR",
        details: {
          campo: "tipo",
        },
      });
    }

    if (processamento_id !== undefined && processamento_id !== null) {
      if (!Number.isInteger(processamento_id) || processamento_id <= 0) {
        throw new AppError("O processamento_id deve ser um inteiro positivo.", {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "processamento_id",
          },
        });
      }

      const processamento = await this.processamentoRepository.findById(
        processamento_id,
        options,
      );

      if (!processamento) {
        throw new AppError("Processamento não encontrado.", {
          statusCode: 404,
          code: "PROCESSAMENTO_NOT_FOUND",
        });
      }
    }

    return this.repository.create(
      {
        docente_id,
        periodo_id: periodo_id ?? null,
        tipo: tipo.trim(),
        disciplina:
          typeof disciplina === "string" && disciplina.trim()
            ? disciplina.trim()
            : null,
        nivel: typeof nivel === "string" && nivel.trim() ? nivel.trim() : null,
        descricao:
          typeof descricao === "string" && descricao.trim()
            ? descricao.trim()
            : null,
        processamento_id: processamento_id ?? null,
      },
      options,
    );
  }

  async listar(options = {}) {
    return this.repository.findAll(options);
  }

  async buscarPorId(id, options = {}) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(
        "O ID da atividade de ensino deve ser um inteiro positivo.",
        {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "id",
          },
        },
      );
    }

    const atividade = await this.repository.findById(id, options);

    if (!atividade) {
      throw new AppError("Atividade de ensino não encontrada.", {
        statusCode: 404,
        code: "ATIVIDADE_ENSINO_NOT_FOUND",
      });
    }

    return atividade;
  }

  async atualizar(id, dados, options = {}) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(
        "O ID da atividade de ensino deve ser um inteiro positivo.",
        {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "id",
          },
        },
      );
    }

    const atividade = await this.repository.findById(id, options);

    if (!atividade) {
      throw new AppError("Atividade de ensino não encontrada.", {
        statusCode: 404,
        code: "ATIVIDADE_ENSINO_NOT_FOUND",
      });
    }

    const camposPermitidos = [
      "docente_id",
      "periodo_id",
      "tipo",
      "disciplina",
      "nivel",
      "descricao",
      "processamento_id",
    ];

    const camposRecebidos = Object.keys(dados);

    const possuiCampoValido = camposRecebidos.some((campo) =>
      camposPermitidos.includes(campo),
    );

    if (!possuiCampoValido) {
      throw new AppError(
        "Nenhum campo válido foi informado para atualização.",
        {
          statusCode: 400,
          code: "VALIDATION_ERROR",
        },
      );
    }

    const atualizacao = {};

    if (dados.docente_id !== undefined) {
      if (!Number.isInteger(dados.docente_id) || dados.docente_id <= 0) {
        throw new AppError("O docente_id deve ser um inteiro positivo.", {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "docente_id",
          },
        });
      }

      const docente = await this.docenteRepository.findById(
        dados.docente_id,
        options,
      );

      if (!docente) {
        throw new AppError("Docente não encontrado.", {
          statusCode: 404,
          code: "DOCENTE_NOT_FOUND",
        });
      }

      atualizacao.docente_id = dados.docente_id;
    }

    if (dados.periodo_id !== undefined) {
      if (dados.periodo_id !== null) {
        if (!Number.isInteger(dados.periodo_id) || dados.periodo_id <= 0) {
          throw new AppError("O periodo_id deve ser um inteiro positivo.", {
            statusCode: 400,
            code: "VALIDATION_ERROR",
            details: {
              campo: "periodo_id",
            },
          });
        }

        const periodo = await this.periodoRepository.findById(
          dados.periodo_id,
          options,
        );

        if (!periodo) {
          throw new AppError("Período não encontrado.", {
            statusCode: 404,
            code: "PERIODO_NOT_FOUND",
          });
        }
      }

      atualizacao.periodo_id = dados.periodo_id;
    }

    if (dados.tipo !== undefined) {
      if (typeof dados.tipo !== "string" || !dados.tipo.trim()) {
        throw new AppError("O tipo é obrigatório.", {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "tipo",
          },
        });
      }

      atualizacao.tipo = dados.tipo.trim();
    }

    if (dados.disciplina !== undefined) {
      atualizacao.disciplina =
        typeof dados.disciplina === "string" && dados.disciplina.trim()
          ? dados.disciplina.trim()
          : null;
    }

    if (dados.nivel !== undefined) {
      atualizacao.nivel =
        typeof dados.nivel === "string" && dados.nivel.trim()
          ? dados.nivel.trim()
          : null;
    }

    if (dados.descricao !== undefined) {
      atualizacao.descricao =
        typeof dados.descricao === "string" && dados.descricao.trim()
          ? dados.descricao.trim()
          : null;
    }

    if (dados.processamento_id !== undefined) {
      if (dados.processamento_id !== null) {
        if (
          !Number.isInteger(dados.processamento_id) ||
          dados.processamento_id <= 0
        ) {
          throw new AppError(
            "O processamento_id deve ser um inteiro positivo.",
            {
              statusCode: 400,
              code: "VALIDATION_ERROR",
              details: {
                campo: "processamento_id",
              },
            },
          );
        }

        const processamento = await this.processamentoRepository.findById(
          dados.processamento_id,
          options,
        );

        if (!processamento) {
          throw new AppError("Processamento não encontrado.", {
            statusCode: 404,
            code: "PROCESSAMENTO_NOT_FOUND",
          });
        }
      }

      atualizacao.processamento_id = dados.processamento_id;
    }

    await this.repository.update(atualizacao, {
      ...options,
      where: { id },
    });

    return this.repository.findById(id, options);
  }

  async excluir(id, options = {}) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(
        "O ID da atividade de ensino deve ser um inteiro positivo.",
        {
          statusCode: 400,
          code: "VALIDATION_ERROR",
          details: {
            campo: "id",
          },
        },
      );
    }

    const atividade = await this.repository.findById(id, options);

    if (!atividade) {
      throw new AppError("Atividade de ensino não encontrada.", {
        statusCode: 404,
        code: "ATIVIDADE_ENSINO_NOT_FOUND",
      });
    }

    await this.repository.delete({
      ...options,
      where: { id },
    });

    return atividade;
  }
}

export default AtividadeEnsinoService;
