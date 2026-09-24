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
import { Periodo, sequelize } from "../src/database/index.js";

let server;
let baseUrl;
let periodoIdCriado;

beforeAll(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

afterEach(async () => {
  if (periodoIdCriado) {
    await Periodo.destroy({
      where: {
        id: periodoIdCriado,
      },
    });

    periodoIdCriado = null;
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

describe("POST /api/v1/periodos", () => {
  test("cria um período válido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/periodos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ano: 2026,
        descricao: "Período 2026",
        inicio: "2026-01-01",
        fim: "2026-12-31",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    expect(body.data).toMatchObject({
      id: expect.any(Number),
      ano: 2026,
      descricao: "Período 2026",
      inicio: "2026-01-01",
      fim: "2026-12-31",
    });
  });

  test("retorna 400 quando o ano não é informado", async () => {
    const response = await fetch(`${baseUrl}/api/v1/periodos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descricao: "Período sem ano",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "ano é obrigatório.",
        details: {
          campo: "ano",
        },
      },
    });
  });

  test("cria um período sem os campos opcionais", async () => {
    const response = await fetch(`${baseUrl}/api/v1/periodos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ano: 2027,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    expect(body.data).toMatchObject({
      id: expect.any(Number),
      ano: 2027,
    });
  });
});

describe("GET /api/v1/periodos", () => {
  test("retorna todos os períodos", async () => {
    const periodo1 = await Periodo.create({
      ano: 2025,
      descricao: "Período 2025",
    });

    const periodo2 = await Periodo.create({
      ano: 2026,
      descricao: "Período 2026",
    });

    periodoIdCriado = periodo2.id;

    const response = await fetch(`${baseUrl}/api/v1/periodos`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: periodo1.id,
          ano: 2025,
          descricao: "Período 2025",
        }),
        expect.objectContaining({
          id: periodo2.id,
          ano: 2026,
          descricao: "Período 2026",
        }),
      ]),
    );

    await Periodo.destroy({
      where: {
        id: periodo1.id,
      },
    });
  });

  test("retorna lista vazia quando não existem períodos", async () => {
    await Periodo.destroy({
      where: {},
    });

    const response = await fetch(`${baseUrl}/api/v1/periodos`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body).toEqual({
      data: [],
    });
  });
});

describe("GET /api/v1/periodos/:id", () => {
  test("retorna um período pelo id", async () => {
    const periodo = await Periodo.create({
      ano: 2026,
      descricao: "Período para consulta",
      inicio: "2026-01-01",
      fim: "2026-12-31",
    });

    periodoIdCriado = periodo.id;

    const response = await fetch(`${baseUrl}/api/v1/periodos/${periodo.id}`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: periodo.id,
      ano: 2026,
      descricao: "Período para consulta",
      inicio: "2026-01-01",
      fim: "2026-12-31",
    });
  });

  test("retorna 404 quando o período não existe", async () => {
    const periodoInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/periodos/${periodoInexistenteId}`,
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body.error.code).toBe("PERIODO_NOT_FOUND");
  });
});

describe("PATCH /api/v1/periodos/:id", () => {
  test("atualiza um período pelo id", async () => {
    const periodo = await Periodo.create({
      ano: 2025,
      descricao: "Período antes da atualização",
      inicio: "2025-01-01",
      fim: "2025-12-31",
    });

    periodoIdCriado = periodo.id;

    const response = await fetch(`${baseUrl}/api/v1/periodos/${periodo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ano: 2026,
        descricao: "Período depois da atualização",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: periodo.id,
      ano: 2026,
      descricao: "Período depois da atualização",
      inicio: "2025-01-01",
      fim: "2025-12-31",
    });
  });

  test("retorna 404 ao tentar atualizar um período que não existe", async () => {
    const periodoInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/periodos/${periodoInexistenteId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descricao: "Período inexistente",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "PERIODO_NOT_FOUND",
        message: "Período não encontrado.",
        details: {
          id: periodoInexistenteId,
        },
      },
    });
  });

  test("retorna 400 quando nenhum campo válido é informado", async () => {
    const periodo = await Periodo.create({
      ano: 2025,
      descricao: "Período sem alteração",
    });

    periodoIdCriado = periodo.id;

    const response = await fetch(`${baseUrl}/api/v1/periodos/${periodo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("atualiza somente os campos informados", async () => {
    const periodo = await Periodo.create({
      ano: 2025,
      descricao: "Descrição original",
      inicio: "2025-01-01",
      fim: "2025-12-31",
    });

    periodoIdCriado = periodo.id;

    const response = await fetch(`${baseUrl}/api/v1/periodos/${periodo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fim: "2026-06-30",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: periodo.id,
      ano: 2025,
      descricao: "Descrição original",
      inicio: "2025-01-01",
      fim: "2026-06-30",
    });
  });
});

describe("DELETE /api/v1/periodos/:id", () => {
  test("exclui um período pelo id", async () => {
    const periodo = await Periodo.create({
      ano: 2026,
      descricao: "Período para exclusão",
    });

    const response = await fetch(`${baseUrl}/api/v1/periodos/${periodo.id}`, {
      method: "DELETE",
    });

    expect(response.status).toBe(204);

    const periodoExcluido = await Periodo.findByPk(periodo.id);

    expect(periodoExcluido).toBeNull();
  });

  test("retorna 404 ao tentar excluir um período que não existe", async () => {
    const periodoInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/periodos/${periodoInexistenteId}`,
      {
        method: "DELETE",
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "PERIODO_NOT_FOUND",
        message: "Período não encontrado.",
        details: {
          id: periodoInexistenteId,
        },
      },
    });
  });

  test("retorna 400 quando o id do período é inválido ao excluir", async () => {
    const response = await fetch(`${baseUrl}/api/v1/periodos/abc`, {
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
