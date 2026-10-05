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
  Importacao,
  Docente,
  Pessoa,
  Programa,
  Instituicao,
  sequelize,
} from "../src/database/index.js";

let server;
let baseUrl;

let importacaoIdCriada;
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
  if (importacaoIdCriada) {
    await Importacao.destroy({
      where: {
        id: importacaoIdCriada,
      },
    });

    importacaoIdCriada = null;
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

describe("POST /api/v1/importacoes", () => {
  test("cria uma importação válida", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "João da Silva",
      cpf: "12345678901",
    });

    pessoaIdCriada = pessoa.id;

    const instituicao = await Instituicao.create({
      nome: "Instituição da Importação",
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

    const response = await fetch(`${baseUrl}/api/v1/importacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        nome_arquivo_original: "curriculo_joao.xml",
        hash_arquivo: "abc123hash",
        data_importacao: "2026-10-05T10:00:00",
        status: "PROCESSANDO",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    expect(body.data).toMatchObject({
      id: expect.any(Number),
      docente_id: docente.id,
      nome_arquivo_original: "curriculo_joao.xml",
      hash_arquivo: "abc123hash",
      data_importacao: "2026-10-05T10:00:00",
      status: "PROCESSANDO",
    });

    importacaoIdCriada = body.data.id;
  });

  test("cria uma importação sem docente", async () => {
    const response = await fetch(`${baseUrl}/api/v1/importacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome_arquivo_original: "curriculo_sem_docente.xml",
        hash_arquivo: "hash456",
        data_importacao: "2026-10-05T11:00:00",
        status: "PROCESSANDO",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    expect(body.data).toMatchObject({
      id: expect.any(Number),
      docente_id: null,
      nome_arquivo_original: "curriculo_sem_docente.xml",
      hash_arquivo: "hash456",
      data_importacao: "2026-10-05T11:00:00",
      status: "PROCESSANDO",
    });

    importacaoIdCriada = body.data.id;
  });

  test("retorna 400 quando data_importacao não é informada", async () => {
    const response = await fetch(`${baseUrl}/api/v1/importacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome_arquivo_original: "curriculo.xml",
        hash_arquivo: "hash789",
        status: "PROCESSANDO",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "A data de importação é obrigatória.",
        details: {
          campo: "data_importacao",
        },
      },
    });
  });

  test("retorna 400 quando status não é informado", async () => {
    const response = await fetch(`${baseUrl}/api/v1/importacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome_arquivo_original: "curriculo.xml",
        hash_arquivo: "hash999",
        data_importacao: "2026-10-05T12:00:00",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "O status é obrigatório.",
        details: {
          campo: "status",
        },
      },
    });
  });
});

describe("GET /api/v1/importacoes", () => {
  test("retorna todas as importações", async () => {
    const importacao1 = await Importacao.create({
      nome_arquivo_original: "curriculo_1.xml",
      hash_arquivo: "hash001",
      data_importacao: "2026-10-05T10:00:00",
      status: "PROCESSADO",
    });

    const importacao2 = await Importacao.create({
      nome_arquivo_original: "curriculo_2.xml",
      hash_arquivo: "hash002",
      data_importacao: "2026-10-05T11:00:00",
      status: "PROCESSANDO",
    });

    const response = await fetch(`${baseUrl}/api/v1/importacoes`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: importacao1.id,
          nome_arquivo_original: "curriculo_1.xml",
          hash_arquivo: "hash001",
          data_importacao: "2026-10-05T10:00:00",
          status: "PROCESSADO",
        }),
        expect.objectContaining({
          id: importacao2.id,
          nome_arquivo_original: "curriculo_2.xml",
          hash_arquivo: "hash002",
          data_importacao: "2026-10-05T11:00:00",
          status: "PROCESSANDO",
        }),
      ]),
    );

    await Importacao.destroy({
      where: {
        id: [importacao1.id, importacao2.id],
      },
    });
  });

  test("retorna lista vazia quando não existem importações", async () => {
    await Importacao.destroy({
      where: {},
    });

    const response = await fetch(`${baseUrl}/api/v1/importacoes`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body).toEqual({
      data: [],
    });
  });
});

describe("GET /api/v1/importacoes/:id", () => {
  test("retorna uma importação pelo id", async () => {
    const importacao = await Importacao.create({
      nome_arquivo_original: "curriculo_consulta.xml",
      hash_arquivo: "hash-consulta",
      data_importacao: "2026-10-05T13:00:00",
      status: "PROCESSADO",
    });

    importacaoIdCriada = importacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/importacoes/${importacao.id}`,
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: importacao.id,
      docente_id: null,
      nome_arquivo_original: "curriculo_consulta.xml",
      hash_arquivo: "hash-consulta",
      data_importacao: "2026-10-05T13:00:00",
      status: "PROCESSADO",
    });
  });

  test("retorna 404 quando a importação não existe", async () => {
    const importacaoInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/importacoes/${importacaoInexistenteId}`,
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "IMPORTACAO_NOT_FOUND",
        message: "Importação não encontrada.",
        details: {
          id: importacaoInexistenteId,
        },
      },
    });
  });
});


describe("PATCH /api/v1/importacoes/:id", () => {
  test("atualiza uma importação pelo id", async () => {
    const importacao = await Importacao.create({
      nome_arquivo_original: "curriculo_original.xml",
      hash_arquivo: "hash-original",
      data_importacao: "2026-10-05T14:00:00",
      status: "PROCESSANDO",
    });

    importacaoIdCriada = importacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/importacoes/${importacao.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome_arquivo_original: "curriculo_atualizado.xml",
          status: "PROCESSADO",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: importacao.id,
      nome_arquivo_original: "curriculo_atualizado.xml",
      hash_arquivo: "hash-original",
      data_importacao: "2026-10-05T14:00:00",
      status: "PROCESSADO",
    });
  });

  test("retorna 404 ao tentar atualizar uma importação que não existe", async () => {
    const importacaoInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/importacoes/${importacaoInexistenteId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "PROCESSADO",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "IMPORTACAO_NOT_FOUND",
        message: "Importação não encontrada.",
        details: {
          id: importacaoInexistenteId,
        },
      },
    });
  });

  test("retorna 400 quando nenhum campo válido é informado", async () => {
    const importacao = await Importacao.create({
      nome_arquivo_original: "curriculo_sem_alteracao.xml",
      hash_arquivo: "hash-sem-alteracao",
      data_importacao: "2026-10-05T15:00:00",
      status: "PROCESSANDO",
    });

    importacaoIdCriada = importacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/importacoes/${importacao.id}`,
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

  test("atualiza somente os campos informados", async () => {
    const importacao = await Importacao.create({
      nome_arquivo_original: "curriculo_parcial.xml",
      hash_arquivo: "hash-parcial",
      data_importacao: "2026-10-05T16:00:00",
      status: "PROCESSANDO",
    });

    importacaoIdCriada = importacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/importacoes/${importacao.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "PROCESSADO",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: importacao.id,
      nome_arquivo_original: "curriculo_parcial.xml",
      hash_arquivo: "hash-parcial",
      data_importacao: "2026-10-05T16:00:00",
      status: "PROCESSADO",
    });
  });
});

describe("DELETE /api/v1/importacoes/:id", () => {
  test("exclui uma importação pelo id", async () => {
    const importacao = await Importacao.create({
      nome_arquivo_original: "curriculo_exclusao.xml",
      hash_arquivo: "hash-exclusao",
      data_importacao: "2026-10-05T17:00:00",
      status: "PROCESSADO",
    });

    const response = await fetch(
      `${baseUrl}/api/v1/importacoes/${importacao.id}`,
      {
        method: "DELETE",
      },
    );

    expect(response.status).toBe(204);

    const importacaoExcluida = await Importacao.findByPk(importacao.id);

    expect(importacaoExcluida).toBeNull();
  });

  test("retorna 404 ao tentar excluir uma importação que não existe", async () => {
    const importacaoInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/importacoes/${importacaoInexistenteId}`,
      {
        method: "DELETE",
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "IMPORTACAO_NOT_FOUND",
        message: "Importação não encontrada.",
        details: {
          id: importacaoInexistenteId,
        },
      },
    });
  });

  test("retorna 400 quando o id da importação é inválido ao excluir", async () => {
    const response = await fetch(`${baseUrl}/api/v1/importacoes/abc`, {
      method: "DELETE",
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "id deve ser um número inteiro positivo.",
        details: {
          campo: "id",
        },
      },
    });
  });
});
