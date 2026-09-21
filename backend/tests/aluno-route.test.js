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
  Aluno,
  Instituicao,
  Pessoa,
  Programa,
  sequelize,
} from "../src/database/index.js";

let server;
let baseUrl;

let alunoIdCriado;
let pessoaIdCriada;
let instituicaoIdCriada;
let programaIdCriado;

beforeAll(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  const { port } = server.address();

  baseUrl = `http://127.0.0.1:${port}`;
});

afterEach(async () => {
  if (alunoIdCriado) {
    await Aluno.destroy({
      where: {
        id: alunoIdCriado,
      },
    });

    alunoIdCriado = null;
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

describe("POST /api/v1/alunos", () => {
  test("cria um aluno válido", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "Aluno de Teste",
      identificador_lattes: `LATTES-${randomUUID()}`,
    });

    pessoaIdCriada = pessoa.id;

    const instituicao = await Instituicao.create({
      nome: "Instituição do Aluno",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa do Aluno",
      sigla: "PA",
    });

    programaIdCriado = programa.id;

    const response = await fetch(`${baseUrl}/api/v1/alunos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pessoa_id: pessoa.id,
        programa_id: programa.id,
        nivel: "Mestrado",
        situacao: "Ativo",
        ano_ingresso: 2026,
      }),
    });

    const body = await response.json();

    alunoIdCriado = body.data.id;

    expect(response.status).toBe(201);

    expect(body.data).toMatchObject({
      id: expect.any(Number),
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2026,
    });

    const alunoNoBanco = await Aluno.findByPk(alunoIdCriado);

    expect(alunoNoBanco).not.toBeNull();
  });

  test("retorna 400 quando pessoa_id é inválido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/alunos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pessoa_id: "abc",
        programa_id: 1,
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

  test("retorna 404 quando a pessoa não existe", async () => {
    const response = await fetch(`${baseUrl}/api/v1/alunos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pessoa_id: 999999999,
        programa_id: 1,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "PESSOA_NOT_FOUND",
        message: "Pessoa não encontrada.",
        details: {
          id: 999999999,
        },
      },
    });
  });

  test("retorna 400 quando programa_id é inválido", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "Pessoa para teste",
      identificador_lattes: `LATTES-${randomUUID()}`,
    });

    pessoaIdCriada = pessoa.id;

    const response = await fetch(`${baseUrl}/api/v1/alunos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pessoa_id: pessoa.id,
        programa_id: "abc",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "programa_id deve ser um número inteiro positivo.",
        details: {
          campo: "programa_id",
        },
      },
    });
  });

  test("retorna 404 quando o programa não existe", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "Pessoa para programa inexistente",
      identificador_lattes: `LATTES-${randomUUID()}`,
    });

    pessoaIdCriada = pessoa.id;

    const response = await fetch(`${baseUrl}/api/v1/alunos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pessoa_id: pessoa.id,
        programa_id: 999999999,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "PROGRAMA_NOT_FOUND",
        message: "Programa não encontrado.",
        details: {
          id: 999999999,
        },
      },
    });
  });

  test("retorna erro ao tentar cadastrar a mesma pessoa no mesmo programa", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "Pessoa duplicada",
      identificador_lattes: `LATTES-${randomUUID()}`,
    });

    pessoaIdCriada = pessoa.id;

    const instituicao = await Instituicao.create({
      nome: "Instituição da Duplicidade",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa da Duplicidade",
      sigla: "PD",
    });

    programaIdCriado = programa.id;

    const primeiroResponse = await fetch(`${baseUrl}/api/v1/alunos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pessoa_id: pessoa.id,
        programa_id: programa.id,
      }),
    });

    const primeiroBody = await primeiroResponse.json();

    alunoIdCriado = primeiroBody.data.id;

    expect(primeiroResponse.status).toBe(201);

    const segundoResponse = await fetch(`${baseUrl}/api/v1/alunos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pessoa_id: pessoa.id,
        programa_id: programa.id,
      }),
    });

    const segundoBody = await segundoResponse.json();

    expect(segundoBody).toEqual({
      error: {
        code: "ALUNO_ALREADY_EXISTS",
        message: "A pessoa já está cadastrada neste programa.",
        details: null,
      },
    });

    console.log(
      "Resposta da duplicidade:",
      segundoResponse.status,
      segundoBody,
    );

    expect(segundoResponse.status).toBe(409);
  });
});
