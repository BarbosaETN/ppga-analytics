"use strict";

import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "@jest/globals";

import { randomUUID } from "node:crypto";

import app from "../src/app.js";

import {
  Processamento,
  Importacao,
  ParserVersao,
  Docente,
  Pessoa,
  Programa,
  Instituicao,
  sequelize,
} from "../src/database/index.js";

let server;
let baseUrl;

let processamentoIdCriado;
let importacaoIdCriada;
let parserVersaoIdCriada;

let docenteIdCriado;
let pessoaIdCriada;
let programaIdCriado;
let instituicaoIdCriada;

beforeAll(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

afterEach(async () => {
  if (processamentoIdCriado) {
    await Processamento.destroy({
      where: {
        id: processamentoIdCriado,
      },
    });

    processamentoIdCriado = null;
  }

  if (importacaoIdCriada) {
    await Importacao.destroy({
      where: {
        id: importacaoIdCriada,
      },
    });

    importacaoIdCriada = null;
  }

  if (parserVersaoIdCriada) {
    await ParserVersao.destroy({
      where: {
        id: parserVersaoIdCriada,
      },
    });

    parserVersaoIdCriada = null;
  }

  if (docenteIdCriado) {
    await Docente.destroy({
      where: {
        id: docenteIdCriado,
      },
    });

    docenteIdCriado = null;
  }

  if (pessoaIdCriada) {
    await Pessoa.destroy({
      where: {
        id: pessoaIdCriada,
      },
    });

    pessoaIdCriada = null;
  }

  if (programaIdCriado) {
    await Programa.destroy({
      where: {
        id: programaIdCriado,
      },
    });

    programaIdCriado = null;
  }

  if (instituicaoIdCriada) {
    await Instituicao.destroy({
      where: {
        id: instituicaoIdCriada,
      },
    });

    instituicaoIdCriada = null;
  }
});

afterAll(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  await sequelize.close();
});

describe("POST /api/v1/processamentos", () => {
  test("cria um processamento válido", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "João da Silva",
      cpf: `12345678${randomUUID().slice(0, 3)}`,
    });

    pessoaIdCriada = pessoa.id;

    const instituicao = await Instituicao.create({
      nome: "Instituição do Processamento",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa de Pós-Graduação em Engenharia",
      silga: "PE",
    });

    programaIdCriado = programa.id;

    const docente = await Docente.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      categoria: "Professor Permanente",
      ativo: 1,
    });

    docenteIdCriado = docente.id;

    const importacao = await Importacao.create({
      docente_id: docente.id,
      nome_arquivo_original: "curriculo_joao.xml",
      hash_arquivo: "hash-processamento",
      data_importacao: "2026-10-06T10:00:00",
      status: "CONCLUIDA",
    });

    importacaoIdCriada = importacao.id;

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão utilizada no processamento",
      criado_em: "2026-10-06T09:00:00",
    });

    parserVersaoIdCriada = parserVersao.id;

    const response = await fetch(`${baseUrl}/api/v1/processamentos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        importacao_id: importacao.id,
        parser_versao_id: parserVersao.id,
        iniciado_em: "2026-10-06T10:30:00",
        finalizado_em: "2026-10-06T10:35:00",
        status: "CONCLUIDO",
        registros_processados: 150,
        erros: null,
        alertas: null,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    expect(body.data).toMatchObject({
      id: expect.any(Number),
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: "2026-10-06T10:30:00",
      finalizado_em: "2026-10-06T10:35:00",
      status: "CONCLUIDO",
      registros_processados: 150,
      erros: null,
      alertas: null,
    });

    processamentoIdCriado = body.data.id;
  });

  test("retorna 400 quando importacao_id não é informado", async () => {
    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão de teste",
      criado_em: "2026-10-06T09:00:00",
    });

    parserVersaoIdCriada = parserVersao.id;

    const response = await fetch(`${baseUrl}/api/v1/processamentos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parser_versao_id: parserVersao.id,
        iniciado_em: "2026-10-06T10:30:00",
        status: "PROCESSANDO",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando parser_versao_id não é informado", async () => {
    const importacao = await Importacao.create({
      docente_id: null,
      nome_arquivo_original: "curriculo.xml",
      hash_arquivo: "hash-teste",
      data_importacao: "2026-10-06T10:00:00",
      status: "CONCLUIDA",
    });

    importacaoIdCriada = importacao.id;

    const response = await fetch(`${baseUrl}/api/v1/processamentos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        importacao_id: importacao.id,
        iniciado_em: "2026-10-06T10:30:00",
        status: "PROCESSANDO",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando iniciado_em não é informado", async () => {
    const importacao = await Importacao.create({
      docente_id: null,
      nome_arquivo_original: "curriculo.xml",
      hash_arquivo: "hash-teste",
      data_importacao: "2026-10-06T10:00:00",
      status: "CONCLUIDA",
    });

    importacaoIdCriada = importacao.id;

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão de teste",
      criado_em: "2026-10-06T09:00:00",
    });

    parserVersaoIdCriada = parserVersao.id;

    const response = await fetch(`${baseUrl}/api/v1/processamentos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        importacao_id: importacao.id,
        parser_versao_id: parserVersao.id,
        status: "PROCESSANDO",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando status não é informado", async () => {
    const importacao = await Importacao.create({
      docente_id: null,
      nome_arquivo_original: "curriculo.xml",
      hash_arquivo: "hash-teste",
      data_importacao: "2026-10-06T10:00:00",
      status: "CONCLUIDA",
    });

    importacaoIdCriada = importacao.id;

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão de teste",
      criado_em: "2026-10-06T09:00:00",
    });

    parserVersaoIdCriada = parserVersao.id;

    const response = await fetch(`${baseUrl}/api/v1/processamentos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        importacao_id: importacao.id,
        parser_versao_id: parserVersao.id,
        iniciado_em: "2026-10-06T10:30:00",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("GET /api/v1/processamentos", () => {
  test("retorna todos os processamentos", async () => {
    const importacao = await Importacao.create({
      docente_id: null,
      nome_arquivo_original: "curriculo.xml",
      hash_arquivo: "hash-get-lista",
      data_importacao: "2026-10-07T10:00:00",
      status: "CONCLUIDA",
    });

    importacaoIdCriada = importacao.id;

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão para teste de listagem",
      criado_em: "2026-10-07T09:00:00",
    });

    parserVersaoIdCriada = parserVersao.id;

    const processamento = await Processamento.create({
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: "2026-10-07T10:30:00",
      finalizado_em: "2026-10-07T10:35:00",
      status: "CONCLUIDO",
      registros_processados: 100,
      erros: null,
      alertas: null,
    });

    processamentoIdCriado = processamento.id;

    const response = await fetch(`${baseUrl}/api/v1/processamentos`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: processamento.id,
          importacao_id: importacao.id,
          parser_versao_id: parserVersao.id,
          iniciado_em: "2026-10-07T10:30:00",
          finalizado_em: "2026-10-07T10:35:00",
          status: "CONCLUIDO",
          registros_processados: 100,
        }),
      ]),
    );
  });
});

describe("GET /api/v1/processamentos/:id", () => {
  test("retorna um processamento pelo id", async () => {
    const importacao = await Importacao.create({
      docente_id: null,
      nome_arquivo_original: "curriculo.xml",
      hash_arquivo: "hash-get-id",
      data_importacao: "2026-10-07T11:00:00",
      status: "CONCLUIDA",
    });

    importacaoIdCriada = importacao.id;

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão para consulta",
      criado_em: "2026-10-07T10:00:00",
    });

    parserVersaoIdCriada = parserVersao.id;

    const processamento = await Processamento.create({
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: "2026-10-07T11:30:00",
      finalizado_em: "2026-10-07T11:35:00",
      status: "CONCLUIDO",
      registros_processados: 200,
      erros: null,
      alertas: null,
    });

    processamentoIdCriado = processamento.id;

    const response = await fetch(
      `${baseUrl}/api/v1/processamentos/${processamento.id}`,
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: processamento.id,
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: "2026-10-07T11:30:00",
      finalizado_em: "2026-10-07T11:35:00",
      status: "CONCLUIDO",
      registros_processados: 200,
    });
  });

  test("retorna 404 quando o processamento não existe", async () => {
    const processamentoInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/processamentos/${processamentoInexistenteId}`,
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "PROCESSAMENTO_NOT_FOUND",
        message: "Processamento não encontrado.",
        details: {
          id: processamentoInexistenteId,
        },
      },
    });
  });
});

describe("PATCH /processamentos/:id", () => {
  test("Deve atualizar um processamento", async () => {
    const importacao = await Importacao.create({
      docente_id: null,
      nome_arquivo_original: "curriculo.xml",
      hash_arquivo: "hash-patch",
      data_importacao: "2026-10-07T10:00:00",
      status: "CONCLUIDA",
    });

    importacaoIdCriada = importacao.id;

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão para teste de atualização",
      criado_em: "2026-10-07T09:00:00",
    });

    parserVersaoIdCriada = parserVersao.id;

    const processamento = await Processamento.create({
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: "2026-10-07T10:30:00",
      finalizado_em: null,
      status: "PROCESSANDO",
      registros_processados: 0,
      erros: null,
      alertas: null,
    });

    processamentoIdCriado = processamento.id;

    const response = await fetch(
      `${baseUrl}/api/v1/processamentos/${processamento.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          finalizado_em: "2026-10-07T10:35:00",
          status: "CONCLUIDO",
          registros_processados: 100,
          erros: null,
          alertas: "Processamento concluído com sucesso.",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data.id).toBe(processamento.id);
    expect(body.data.importacao_id).toBe(importacao.id);
    expect(body.data.parser_versao_id).toBe(parserVersao.id);
    expect(body.data.finalizado_em).toBe("2026-10-07T10:35:00");
    expect(body.data.status).toBe("CONCLUIDO");
    expect(body.data.registros_processados).toBe(100);
    expect(body.data.erros).toBeNull();
    expect(body.data.alertas).toBe("Processamento concluído com sucesso.");
  });

  test("retorna 400 quando status é informado vazio no PATCH", async () => {
    const importacao = await Importacao.create({
      docente_id: null,
      nome_arquivo_original: "curriculo.xml",
      hash_arquivo: "hash-patch-status",
      data_importacao: "2026-10-07T10:00:00",
      status: "CONCLUIDA",
    });

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão para teste de validação",
      criado_em: "2026-10-07T09:00:00",
    });

    const processamento = await Processamento.create({
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: "2026-10-07T10:30:00",
      finalizado_em: null,
      status: "PROCESSANDO",
      registros_processados: 0,
      erros: null,
      alertas: null,
    });

    const response = await fetch(
      `${baseUrl}/api/v1/processamentos/${processamento.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando iniciado_em é informado vazio no PATCH", async () => {
    const importacao = await Importacao.create({
      docente_id: null,
      nome_arquivo_original: "curriculo.xml",
      hash_arquivo: "hash-patch-iniciado",
      data_importacao: "2026-10-07T10:00:00",
      status: "CONCLUIDA",
    });

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão para teste de validação",
      criado_em: "2026-10-07T09:00:00",
    });

    const processamento = await Processamento.create({
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: "2026-10-07T10:30:00",
      finalizado_em: null,
      status: "PROCESSANDO",
      registros_processados: 0,
      erros: null,
      alertas: null,
    });

    const response = await fetch(
      `${baseUrl}/api/v1/processamentos/${processamento.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          iniciado_em: "",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando nenhum campo válido é informado no PATCH", async () => {
    const importacao = await Importacao.create({
      docente_id: null,
      nome_arquivo_original: "curriculo.xml",
      hash_arquivo: "hash-patch-sem-campos",
      data_importacao: "2026-10-07T10:00:00",
      status: "CONCLUIDA",
    });

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão para teste de validação",
      criado_em: "2026-10-07T09:00:00",
    });

    const processamento = await Processamento.create({
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: "2026-10-07T10:30:00",
      status: "PROCESSANDO",
    });

    const response = await fetch(
      `${baseUrl}/api/v1/processamentos/${processamento.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando importacao_id é inválido no PATCH", async () => {
    const importacao = await Importacao.create({
      docente_id: null,
      nome_arquivo_original: "curriculo.xml",
      hash_arquivo: "hash-patch-importacao-invalida",
      data_importacao: "2026-10-07T10:00:00",
      status: "CONCLUIDA",
    });

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão para teste de validação",
      criado_em: "2026-10-07T09:00:00",
    });

    const processamento = await Processamento.create({
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: "2026-10-07T10:30:00",
      status: "PROCESSANDO",
    });

    const response = await fetch(
      `${baseUrl}/api/v1/processamentos/${processamento.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          importacao_id: "abc",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 404 quando importacao_id não existe no PATCH", async () => {
    const importacao = await Importacao.create({
      docente_id: null,
      nome_arquivo_original: "curriculo.xml",
      hash_arquivo: "hash-patch-importacao-inexistente",
      data_importacao: "2026-10-07T10:00:00",
      status: "CONCLUIDA",
    });

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão para teste de validação",
      criado_em: "2026-10-07T09:00:00",
    });

    const processamento = await Processamento.create({
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: "2026-10-07T10:30:00",
      status: "PROCESSANDO",
    });

    const response = await fetch(
      `${baseUrl}/api/v1/processamentos/${processamento.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          importacao_id: 999999,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("IMPORTACAO_NOT_FOUND");
  });

  test("retorna 400 quando parser_versao_id é inválido no PATCH", async () => {
    const importacao = await Importacao.create({
      docente_id: null,
      nome_arquivo_original: "curriculo.xml",
      hash_arquivo: "hash-patch-parser-invalido",
      data_importacao: "2026-10-07T10:00:00",
      status: "CONCLUIDA",
    });

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão para teste de validação",
      criado_em: "2026-10-07T09:00:00",
    });

    const processamento = await Processamento.create({
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: "2026-10-07T10:30:00",
      status: "PROCESSANDO",
    });

    const response = await fetch(
      `${baseUrl}/api/v1/processamentos/${processamento.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parser_versao_id: "abc",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 404 quando parser_versao_id não existe no PATCH", async () => {
    const importacao = await Importacao.create({
      docente_id: null,
      nome_arquivo_original: "curriculo.xml",
      hash_arquivo: "hash-patch-parser-inexistente",
      data_importacao: "2026-10-07T10:00:00",
      status: "CONCLUIDA",
    });

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão para teste de validação",
      criado_em: "2026-10-07T09:00:00",
    });

    const processamento = await Processamento.create({
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: "2026-10-07T10:30:00",
      status: "PROCESSANDO",
    });

    const response = await fetch(
      `${baseUrl}/api/v1/processamentos/${processamento.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parser_versao_id: 999999,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("PARSER_VERSAO_NOT_FOUND");
  });

  test("retorna 400 quando o id do processamento é inválido no PATCH", async () => {
    const response = await fetch(`${baseUrl}/api/v1/processamentos/abc`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "CONCLUIDO",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.campo).toBe("id");
  });

  test("retorna 404 quando o processamento não existe no PATCH", async () => {
    const response = await fetch(`${baseUrl}/api/v1/processamentos/999999`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "CONCLUIDO",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("PROCESSAMENTO_NOT_FOUND");
  });
});

describe("DELETE /api/v1/processamentos", () => {
  test("deve excluir um processamento", async () => {
    const importacao = await Importacao.create({
      docente_id: null,
      nome_arquivo_original: "curriculo.xml",
      hash_arquivo: "hash-delete",
      data_importacao: "2026-10-07T10:00:00",
      status: "CONCLUIDA",
    });

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      descricao: "Versão para teste de exclusão",
      criado_em: "2026-10-07T09:00:00",
    });

    const processamento = await Processamento.create({
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: "2026-10-07T10:30:00",
      finalizado_em: "2026-10-07T10:35:00",
      status: "CONCLUIDO",
      registros_processados: 100,
      erros: null,
      alertas: null,
    });

    const response = await fetch(
      `${baseUrl}/api/v1/processamentos/${processamento.id}`,
      {
        method: "DELETE",
      },
    );

    expect(response.status).toBe(204);

    const processamentoExcluido = await Processamento.findByPk(
      processamento.id,
    );

    expect(processamentoExcluido).toBeNull();
  });

  test("retorna 400 quando o id do processamento é inválido no DELETE", async () => {
    const response = await fetch(`${baseUrl}/api/v1/processamentos/abc`, {
      method: "DELETE",
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.campo).toBe("id");
  });

  test("retorna 404 quando o processamento não existe no DELETE", async () => {
    const response = await fetch(`${baseUrl}/api/v1/processamentos/999999`, {
      method: "DELETE",
    });

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("PROCESSAMENTO_NOT_FOUND");
  });
});
