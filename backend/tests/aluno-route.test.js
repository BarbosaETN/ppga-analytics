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

describe("GET /api/v1/alunos", () => {
  test("retorna todos os alunos", async () => {
    const pessoa1 = await Pessoa.create({
      nome_completo: "Aluno 1",
      identificador_lattes: `teste-api-${randomUUID()}`,
    });

    const pessoa2 = await Pessoa.create({
      nome_completo: "Aluno 2",
      identificador_lattes: `teste-api-${randomUUID()}`,
    });

    const instituicao = await Instituicao.create({
      nome: "Instituição da Duplicidade",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    const instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicaoIdCriada,
      nome: "Programa para teste",
      sigla: `PROG-${randomUUID().slice(0, 8)}`,
    });

    await Aluno.create({
      pessoa_id: pessoa1.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2026,
    });

    await Aluno.create({
      pessoa_id: pessoa2.id,
      programa_id: programa.id,
      nivel: "Doutorado",
      situacao: "Ativo",
      ano_ingresso: 2026,
    });

    const response = await fetch(`${baseUrl}/api/v1/alunos`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          pessoa_id: pessoa1.id,
          programa_id: programa.id,
          nivel: "Mestrado",
        }),
        expect.objectContaining({
          pessoa_id: pessoa2.id,
          programa_id: programa.id,
          nivel: "Doutorado",
        }),
      ]),
    );
  });

  test("retorna lista vazia quando não existem alunos", async () => {
    await Aluno.destroy({
      where: {},
    });

    const response = await fetch(`${baseUrl}/api/v1/alunos`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body).toEqual({
      data: [],
    });
  });
});

describe("GET /api/v1/alunos/:id", () => {
  test("retorna um aluno pelo id", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "Pessoa para consulta",
      identificador_lattes: `teste-api-${randomUUID()}`,
    });

    const instituicao = await Instituicao.create({
      nome: "Instituição da Duplicidade",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    const instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicaoIdCriada,
      nome: "Programa para consulta",
      sigla: `PROG-${randomUUID().slice(0, 8)}`,
    });

    const aluno = await Aluno.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2026,
    });

    alunoIdCriado = aluno.id;

    const response = await fetch(`${baseUrl}/api/v1/alunos/${aluno.id}`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: aluno.id,
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2026,
    });
  });

  test("retorna 404 quando o aluno não existe", async () => {
    const alunoInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/alunos/${alunoInexistenteId}`,
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "ALUNO_NOT_FOUND",
        message: "Aluno não encontrado.",
        details: {
          id: alunoInexistenteId,
        },
      },
    });
  });

  test("retorna 400 quando o id do aluno é inválido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/alunos/abc`);

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

describe("PATCH /api/v1/alunos/:id", () => {
  test("atualiza um aluno pelo id", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "Pessoa para atualização",
      identificador_lattes: `teste-api-${randomUUID()}`,
    });

    const instituicao = await Instituicao.create({
      nome: "Instituição da Duplicidade",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    const instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicaoIdCriada,
      nome: "Programa para atualização",
      sigla: `PROG-${randomUUID().slice(0, 8)}`,
    });

    const aluno = await Aluno.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2025,
    });

    alunoIdCriado = aluno.id;

    const response = await fetch(`${baseUrl}/api/v1/alunos/${aluno.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nivel: "Doutorado",
        situacao: "Concluído",
        ano_ingresso: 2026,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: aluno.id,
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      nivel: "Doutorado",
      situacao: "Concluído",
      ano_ingresso: 2026,
    });
  });

  test("retorna 404 ao tentar atualizar um aluno que não existe", async () => {
    const alunoInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/alunos/${alunoInexistenteId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nivel: "Doutorado",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "ALUNO_NOT_FOUND",
        message: "Aluno não encontrado.",
        details: {
          id: alunoInexistenteId,
        },
      },
    });
  });

  test("retorna 400 quando o id do aluno é inválido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/alunos/abc`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nivel: "Doutorado",
      }),
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

  test("retorna 400 quando nenhum campo válido é informado", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "Pessoa sem alteração",
      identificador_lattes: `teste-api-${randomUUID()}`,
    });

    const instituicao = await Instituicao.create({
      nome: "Instituição da Duplicidade",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    const instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicaoIdCriada,
      nome: "Programa sem alteração",
      sigla: `PROG-${randomUUID().slice(0, 8)}`,
    });

    const aluno = await Aluno.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2025,
    });

    alunoIdCriado = aluno.id;

    const response = await fetch(`${baseUrl}/api/v1/alunos/${aluno.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Nenhum campo válido para atualização foi informado.",
        details: {
          campos_permitidos: ["nivel", "situacao", "ano_ingresso"],
        },
      },
    });
  });

  test("ignora campos não permitidos na atualização", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "Pessoa original",
      identificador_lattes: `teste-api-${randomUUID()}`,
    });

    const outraPessoa = await Pessoa.create({
      nome_completo: "Outra pessoa",
      identificador_lattes: `teste-api-${randomUUID()}`,
    });

    const instituicao = await Instituicao.create({
      nome: "Instituição da Duplicidade",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    const instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicaoIdCriada,
      nome: "Programa original",
      sigla: `PROG-${randomUUID().slice(0, 8)}`,
    });

    const outroPrograma = await Programa.create({
      instituicao_id: instituicaoIdCriada,
      nome: "Outro programa",
      sigla: `PROG-${randomUUID().slice(0, 8)}`,
    });

    const aluno = await Aluno.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2025,
    });

    alunoIdCriado = aluno.id;

    const response = await fetch(`${baseUrl}/api/v1/alunos/${aluno.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pessoa_id: outraPessoa.id,
        programa_id: outroPrograma.id,
        nivel: "Doutorado",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      nivel: "Doutorado",
    });
  });
});

describe("DELETE /api/v1/alunos/:id", () => {
  test("exclui um aluno pelo id", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: "Pessoa para exclusão",
      identificador_lattes: `teste-api-${randomUUID()}`,
    });

    const instituicao = await Instituicao.create({
      nome: "Instituição da Duplicidade",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    const instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicaoIdCriada,
      nome: "Programa para exclusão",
      sigla: `PROG-${randomUUID().slice(0, 8)}`,
    });

    const aluno = await Aluno.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2025,
    });

    const response = await fetch(`${baseUrl}/api/v1/alunos/${aluno.id}`, {
      method: "DELETE",
    });

    expect(response.status).toBe(204);

    const alunoExcluido = await Aluno.findByPk(aluno.id);

    expect(alunoExcluido).toBeNull();
  });

  test("retorna 404 ao tentar excluir um aluno que não existe", async () => {
    const alunoInexistenteId = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/alunos/${alunoInexistenteId}`,
      {
        method: "DELETE",
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "ALUNO_NOT_FOUND",
        message: "Aluno não encontrado.",
        details: {
          id: alunoInexistenteId,
        },
      },
    });
  });

  test("retorna 400 quando o id do aluno é inválido ao excluir", async () => {
    const response = await fetch(`${baseUrl}/api/v1/alunos/abc`, {
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
