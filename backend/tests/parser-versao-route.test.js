"use strict";

import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "@jest/globals";

import app from "../src/app.js";
import { ParserVersao, sequelize } from "../src/database/index.js";

let server;
let baseUrl;

beforeAll(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

afterEach(async () => {
  await ParserVersao.destroy({
    where: {},
  });
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

describe("POST /api/v1/parser-versoes", () => {
  test("cria uma versão válida", async () => {
    const response = await fetch(`${baseUrl}/api/v1/parser-versoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        versao: "1.0.0",
        descricao: "Primeira versão do parser",
        criado_em: "2026-09-25",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    expect(body.data).toMatchObject({
      id: expect.any(Number),
      versao: "1.0.0",
      descricao: "Primeira versão do parser",
      criado_em: "2026-09-25",
    });
  });

  test("retorna 400 quando a versão não é informada", async () => {
    const response = await fetch(`${baseUrl}/api/v1/parser-versoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descricao: "Versão sem número",
        criado_em: "2026-09-25",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "A versão é obrigatória.",
        details: null,
      },
    });
  });

  test("retorna 400 quando a versão contém apenas espaços", async () => {
    const response = await fetch(`${baseUrl}/api/v1/parser-versoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        versao: "   ",
        descricao: "Versão inválida",
        criado_em: "2026-09-25",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "A versão é obrigatória.",
        details: null,
      },
    });
  });

  test("retorna 400 quando criado_em não é informado", async () => {
    const response = await fetch(`${baseUrl}/api/v1/parser-versoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        versao: "2.0.0",
        descricao: "Versão sem data de criação",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "A data de criação é obrigatória.",
        details: null,
      },
    });
  });

  test("cria uma versão sem descrição", async () => {
    const response = await fetch(`${baseUrl}/api/v1/parser-versoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        versao: "3.0.0",
        criado_em: "2026-09-25",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    expect(body.data).toMatchObject({
      id: expect.any(Number),
      versao: "3.0.0",
      criado_em: "2026-09-25",
    });
  });
});

describe("GET /api/v1/parser-versoes", () => {
  test("retorna todas as versões do parser", async () => {
    const parserVersao1 = await ParserVersao.create({
      versao: "1.0.0",
      descricao: "Primeira versão",
      criado_em: "2026-01-01",
    });

    const parserVersao2 = await ParserVersao.create({
      versao: "1.1.0",
      descricao: "Segunda versão",
      criado_em: "2026-02-01",
    });

    const response = await fetch(`${baseUrl}/api/v1/parser-versoes`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: parserVersao1.id,
          versao: "1.0.0",
          descricao: "Primeira versão",
          criado_em: "2026-01-01",
        }),
        expect.objectContaining({
          id: parserVersao2.id,
          versao: "1.1.0",
          descricao: "Segunda versão",
          criado_em: "2026-02-01",
        }),
      ]),
    );

    await ParserVersao.destroy({
      where: {
        id: [parserVersao1.id, parserVersao2.id],
      },
    });
  });

  test("retorna lista vazia quando não existem versões", async () => {
    await ParserVersao.destroy({
      where: {},
    });

    const response = await fetch(`${baseUrl}/api/v1/parser-versoes`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body).toEqual({
      data: [],
    });
  });
});

describe("GET /api/v1/parser-versoes/:id", () => {
  test("retorna uma versão do parser pelo id", async () => {
    const parserVersao = await ParserVersao.create({
      versao: "2.0.0",
      descricao: "Versão para consulta",
      criado_em: "2026-03-01",
    });

    const response = await fetch(
      `${baseUrl}/api/v1/parser-versoes/${parserVersao.id}`,
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: parserVersao.id,
      versao: "2.0.0",
      descricao: "Versão para consulta",
      criado_em: "2026-03-01",
    });

    await ParserVersao.destroy({
      where: {
        id: parserVersao.id,
      },
    });
  });

  test("retorna 404 quando a versão do parser não existe", async () => {
    const parserVersaoInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/parser-versoes/${parserVersaoInexistenteId}`,
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "PARSER_VERSAO_NOT_FOUND",
        message: "Versão do parser não encontrada.",
        details: {
          id: parserVersaoInexistenteId,
        },
      },
    });
  });
});

describe("PATCH /api/v1/parser-versoes/:id", () => {
  test("atualiza uma versão do parser pelo id", async () => {
    const parserVersao = await ParserVersao.create({
      versao: "1.0.0",
      descricao: "Descrição original",
      criado_em: "2026-01-01",
    });

    parserVersaoIdCriado = parserVersao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/parser-versoes/${parserVersao.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          versao: "1.1.0",
          descricao: "Descrição atualizada",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: parserVersao.id,
      versao: "1.1.0",
      descricao: "Descrição atualizada",
      criado_em: "2026-01-01",
    });
  });

  test("retorna 404 ao tentar atualizar uma versão que não existe", async () => {
    const parserVersaoInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/parser-versoes/${parserVersaoInexistenteId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descricao: "Versão inexistente",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "PARSER_VERSAO_NOT_FOUND",
        message: "Versão do parser não encontrada.",
        details: {
          id: parserVersaoInexistenteId,
        },
      },
    });
  });

  test("retorna 400 quando nenhum campo válido é informado", async () => {
    const parserVersao = await ParserVersao.create({
      versao: "2.0.0",
      descricao: "Descrição original",
      criado_em: "2026-02-01",
    });

    parserVersaoIdCriado = parserVersao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/parser-versoes/${parserVersao.id}`,
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
    const parserVersao = await ParserVersao.create({
      versao: "3.0.0",
      descricao: "Descrição original",
      criado_em: "2026-03-01",
    });

    parserVersaoIdCriado = parserVersao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/parser-versoes/${parserVersao.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descricao: "Nova descrição",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: parserVersao.id,
      versao: "3.0.0",
      descricao: "Nova descrição",
      criado_em: "2026-03-01",
    });
  });

  test("retorna 400 quando a versão informada é vazia", async () => {
    const parserVersao = await ParserVersao.create({
      versao: "4.0.0",
      descricao: "Descrição original",
      criado_em: "2026-04-01",
    });

    parserVersaoIdCriado = parserVersao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/parser-versoes/${parserVersao.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          versao: "   ",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "A versão é obrigatória.",
        details: null,
      },
    });
  });
});

describe("DELETE /api/v1/parser-versoes/:id", () => {
  test("exclui uma versão do parser pelo id", async () => {
    const parserVersao = await ParserVersao.create({
      versao: "1.0.0",
      descricao: "Versão para exclusão",
      criado_em: "2026-09-25",
    });

    const response = await fetch(
      `${baseUrl}/api/v1/parser-versoes/${parserVersao.id}`,
      {
        method: "DELETE",
      },
    );

    expect(response.status).toBe(204);

    const parserVersaoExcluida = await ParserVersao.findByPk(
      parserVersao.id,
    );

    expect(parserVersaoExcluida).toBeNull();
  });

  test("retorna 404 ao tentar excluir uma versão do parser que não existe", async () => {
    const parserVersaoInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/parser-versoes/${parserVersaoInexistenteId}`,
      {
        method: "DELETE",
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "PARSER_VERSAO_NOT_FOUND",
        message: "Versão do parser não encontrada.",
        details: {
          id: parserVersaoInexistenteId,
        },
      },
    });
  });

  test("retorna 400 quando o id da versão do parser é inválido ao excluir", async () => {
    const response = await fetch(
      `${baseUrl}/api/v1/parser-versoes/abc`,
      {
        method: "DELETE",
      },
    );

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