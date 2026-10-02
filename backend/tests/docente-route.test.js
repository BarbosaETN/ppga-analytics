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
  Docente,
  Pessoa,
  Programa,
  Instituicao,
  sequelize,
} from "../src/database/index.js";

let server;
let baseUrl;

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

describe("POST /api/v1/docentes", () => {
  test("cria um docente válido", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "João da Silva",
      cpf: "12345678901",
    });

    pessoaIdCriada = pessoa.id;

    const instituicao = await Instituicao.create({
      nome: "Instituição da Duplicidade",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa de Pós-Graduação em Engenharia",
      silga: "PE",
    });

    programaIdCriado = programa.id;

    const response = await fetch(`${baseUrl}/api/v1/docentes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pessoa_id: pessoa.id,
        programa_id: programa.id,
        categoria: "Professor Permanente",
        ativo: 1,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    expect(body.data).toMatchObject({
      id: expect.any(Number),
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      categoria: "Professor Permanente",
      ativo: 1,
    });

    docenteIdCriado = body.data.id;
  });

  test("retorna 400 quando pessoa_id é inválido", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição para teste",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa para teste",
      sigla: "PT",
    });

    programaIdCriado = programa.id;

    const response = await fetch(`${baseUrl}/api/v1/docentes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pessoa_id: "abc",
        programa_id: programa.id,
        categoria: "Professor Permanente",
        ativo: 1,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "pessoa_id deve ser um número inteiro positivo.",
        details: {
          campo: "pessoa_id",
        },
      },
    });
  });

  test("retorna 400 quando pessoa_id não é informado", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição para teste",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa para teste",
      sigla: "PT",
    });

    programaIdCriado = programa.id;

    const response = await fetch(`${baseUrl}/api/v1/docentes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        programa_id: programa.id,
        categoria: "Professor Permanente",
        ativo: 1,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "pessoa_id deve ser um número inteiro positivo.",
        details: {
          campo: "pessoa_id",
        },
      },
    });
  });
});

describe("GET /api/v1/docentes", () => {
  test("retorna todos os docentes", async () => {
    const pessoa1 = await Pessoa.create({
      nome_completo: "João da Silva",
      cpf: "12345678901",
    });

    const pessoa2 = await Pessoa.create({
      nome_completo: "Maria da Silva",
      cpf: "12345678902",
    });

    pessoaIdCriada = pessoa2.id;

    const instituicao = await Instituicao.create({
      nome: "Instituição dos Docentes",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa de Pós-Graduação",
      sigla: "PPG",
    });

    programaIdCriado = programa.id;

    const docente1 = await Docente.create({
      pessoa_id: pessoa1.id,
      programa_id: programa.id,
      categoria: "Professor Permanente",
      ativo: 1,
    });

    const docente2 = await Docente.create({
      pessoa_id: pessoa2.id,
      programa_id: programa.id,
      categoria: "Professor Colaborador",
      ativo: 1,
    });

    docenteIdCriado = docente2.id;

    const response = await fetch(`${baseUrl}/api/v1/docentes`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: docente1.id,
          pessoa_id: pessoa1.id,
          programa_id: programa.id,
          categoria: "Professor Permanente",
          ativo: 1,
        }),
        expect.objectContaining({
          id: docente2.id,
          pessoa_id: pessoa2.id,
          programa_id: programa.id,
          categoria: "Professor Colaborador",
          ativo: 1,
        }),
      ]),
    );

    await Docente.destroy({
      where: {
        id: docente1.id,
      },
    });

    await Pessoa.destroy({
      where: {
        id: pessoa1.id,
      },
    });
  });

  test("retorna lista vazia quando não existem docentes", async () => {
    await Docente.destroy({
      where: {},
    });

    const response = await fetch(`${baseUrl}/api/v1/docentes`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body).toEqual({
      data: [],
    });
  });
});

describe("GET /api/v1/docentes/:id", () => {
  test("retorna um docente pelo id", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "Carlos da Silva",
      cpf: "12345678903",
    });

    pessoaIdCriada = pessoa.id;

    const instituicao = await Instituicao.create({
      nome: "Instituição da Consulta",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa da Consulta",
      sigla: "PC",
    });

    programaIdCriado = programa.id;

    const docente = await Docente.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      categoria: "Professor Permanente",
      ativo: 1,
    });

    docenteIdCriado = docente.id;

    const response = await fetch(
      `${baseUrl}/api/v1/docentes/${docente.id}`,
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: docente.id,
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      categoria: "Professor Permanente",
      ativo: 1,
    });
  });

  test("retorna 404 quando o docente não existe", async () => {
    const docenteInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/docentes/${docenteInexistenteId}`,
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "DOCENTE_NOT_FOUND",
        message: "Docente não encontrado.",
        details: {
          id: docenteInexistenteId,
        },
      },
    });
  });
});

describe("PATCH /api/v1/docentes/:id", () => {
  test("atualiza um docente pelo id", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "Carlos da Silva",
      cpf: "12345678904",
    });

    pessoaIdCriada = pessoa.id;

    const instituicao = await Instituicao.create({
      nome: "Instituição da Atualização",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa da Atualização",
      sigla: "PA",
    });

    programaIdCriado = programa.id;

    const docente = await Docente.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      categoria: "Professor Permanente",
      ativo: 1,
    });

    docenteIdCriado = docente.id;

    const response = await fetch(
      `${baseUrl}/api/v1/docentes/${docente.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoria: "Professor Colaborador",
          ativo: 0,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: docente.id,
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      categoria: "Professor Colaborador",
      ativo: 0,
    });
  });

  test("retorna 404 ao tentar atualizar um docente que não existe", async () => {
    const docenteInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/docentes/${docenteInexistenteId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoria: "Professor Colaborador",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "DOCENTE_NOT_FOUND",
        message: "Docente não encontrado.",
        details: {
          id: docenteInexistenteId,
        },
      },
    });
  });

  test("retorna 400 quando nenhum campo válido é informado", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "Ana da Silva",
      cpf: "12345678905",
    });

    pessoaIdCriada = pessoa.id;

    const instituicao = await Instituicao.create({
      nome: "Instituição Sem Alteração",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa Sem Alteração",
      sigla: "PSA",
    });

    programaIdCriado = programa.id;

    const docente = await Docente.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      categoria: "Professor Permanente",
      ativo: 1,
    });

    docenteIdCriado = docente.id;

    const response = await fetch(
      `${baseUrl}/api/v1/docentes/${docente.id}`,
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
    const pessoa = await Pessoa.create({
      nome_completo: "Pedro da Silva",
      cpf: "12345678906",
    });

    pessoaIdCriada = pessoa.id;

    const instituicao = await Instituicao.create({
      nome: "Instituição Atualização Parcial",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa Atualização Parcial",
      sigla: "PAP",
    });

    programaIdCriado = programa.id;

    const docente = await Docente.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      categoria: "Professor Permanente",
      ativo: 1,
    });

    docenteIdCriado = docente.id;

    const response = await fetch(
      `${baseUrl}/api/v1/docentes/${docente.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoria: "Professor Colaborador",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: docente.id,
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      categoria: "Professor Colaborador",
      ativo: 1,
    });
  });
});

describe("DELETE /api/v1/docentes/:id", () => {
  test("exclui um docente pelo id", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "Docente Para Exclusão",
      cpf: "12345678907",
    });

    pessoaIdCriada = pessoa.id;

    const instituicao = await Instituicao.create({
      nome: "Instituição da Exclusão",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa da Exclusão",
      sigla: "PE",
    });

    programaIdCriado = programa.id;

    const docente = await Docente.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      categoria: "Professor Permanente",
      ativo: 1,
    });

    const response = await fetch(
      `${baseUrl}/api/v1/docentes/${docente.id}`,
      {
        method: "DELETE",
      },
    );

    expect(response.status).toBe(204);

    const docenteExcluido = await Docente.findByPk(docente.id);

    expect(docenteExcluido).toBeNull();
  });

  test("retorna 404 ao tentar excluir um docente que não existe", async () => {
    const docenteInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/docentes/${docenteInexistenteId}`,
      {
        method: "DELETE",
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "DOCENTE_NOT_FOUND",
        message: "Docente não encontrado.",
        details: {
          id: docenteInexistenteId,
        },
      },
    });
  });

  test("retorna 400 quando o id do docente é inválido ao excluir", async () => {
    const response = await fetch(`${baseUrl}/api/v1/docentes/abc`, {
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