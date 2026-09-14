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
  Instituicao,
  Aluno,
  Pessoa,
  Programa,
  sequelize,
} from "../src/database/index.js";

let server;
let baseUrl;
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

describe("POST /api/v1/programas", () => {
  test("retorna erro de validação para programa sem nome", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição para teste",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const response = await fetch(`${baseUrl}/api/v1/programas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instituicao_id: instituicao.id,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "nome é obrigatório.",
        details: {
          campo: "nome",
        },
      },
    });
  });

  test("retorna 400 quando instituicao_id é inválido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/programas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instituicao_id: "abc",
        nome: "Programa inválido",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "instituicao_id deve ser um número inteiro positivo.",
        details: {
          campo: "instituicao_id",
        },
      },
    });
  });

  test("retorna 404 quando a instituição não existe", async () => {
    const instituicaoInexistenteId = 999999999;

    const response = await fetch(`${baseUrl}/api/v1/programas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instituicao_id: instituicaoInexistenteId,
        nome: "Programa sem instituição",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "INSTITUICAO_NOT_FOUND",
        message: "Instituição não encontrada.",
        details: {
          id: instituicaoInexistenteId,
        },
      },
    });
  });

  test("cria um programa válido no banco", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição do Programa",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const sigla = `PROG-${randomUUID().slice(0, 8)}`;

    const response = await fetch(`${baseUrl}/api/v1/programas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instituicao_id: instituicao.id,
        nome: "Programa de Teste",
        sigla,
      }),
    });

    const body = await response.json();

    programaIdCriado = body.data.id;

    expect(response.status).toBe(201);

    expect(body.data).toMatchObject({
      id: expect.any(Number),
      instituicao_id: instituicao.id,
      nome: "Programa de Teste",
      sigla,
    });

    const programaNoBanco = await Programa.findByPk(programaIdCriado);

    expect(programaNoBanco).not.toBeNull();

    expect(programaNoBanco.instituicao_id).toBe(instituicao.id);
  });

  test("cria um programa sem sigla", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição sem sigla",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const response = await fetch(`${baseUrl}/api/v1/programas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instituicao_id: instituicao.id,
        nome: "Programa sem sigla",
      }),
    });

    const body = await response.json();

    programaIdCriado = body.data.id;

    expect(response.status).toBe(201);

    expect(body.data).toMatchObject({
      id: expect.any(Number),
      instituicao_id: instituicao.id,
      nome: "Programa sem sigla",
      sigla: null,
    });
  });

  test("retorna erro de validação para nome contendo apenas espaços", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição para espaços",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const response = await fetch(`${baseUrl}/api/v1/programas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instituicao_id: instituicao.id,
        nome: "     ",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "nome é obrigatório.",
        details: {
          campo: "nome",
        },
      },
    });
  });
});

describe("GET /api/v1/programas", () => {
  test("retorna todos os programas", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição dos Programas",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa1 = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa de Computação",
      sigla: "PC",
    });

    const programa2 = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa de Administração",
      sigla: "PA",
    });

    const response = await fetch(`${baseUrl}/api/v1/programas`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: programa1.id,
          instituicao_id: instituicao.id,
          nome: "Programa de Computação",
          sigla: "PC",
        }),
        expect.objectContaining({
          id: programa2.id,
          instituicao_id: instituicao.id,
          nome: "Programa de Administração",
          sigla: "PA",
        }),
      ]),
    );

    await Programa.destroy({
      where: {
        id: [programa1.id, programa2.id],
      },
    });
  });
});

describe("GET /api/v1/programas/:id", () => {
  test("retorna um programa pelo ID", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição do Programa",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa para busca",
      sigla: "PB",
    });

    programaIdCriado = programa.id;

    const response = await fetch(`${baseUrl}/api/v1/programas/${programa.id}`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body).toEqual({
      data: {
        id: programa.id,
        instituicao_id: instituicao.id,
        nome: "Programa para busca",
        sigla: "PB",
      },
    });
  });

  test("retorna 404 quando o programa não existe", async () => {
    const idInexistente = 999999999;

    const response = await fetch(
      `${baseUrl}/api/v1/programas/${idInexistente}`,
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "PROGRAMA_NOT_FOUND",
        message: "Programa não encontrado.",
        details: {
          id: idInexistente,
        },
      },
    });
  });

  test("retorna 400 quando o ID é inválido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/programas/abc`);

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

  test("retorna 400 quando o ID é zero", async () => {
    const response = await fetch(`${baseUrl}/api/v1/programas/0`);

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

describe("PATCH /api/v1/programas/:id", () => {
  test("atualiza o nome do programa", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição do Programa",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Nome antigo",
      sigla: "PA",
    });

    programaIdCriado = programa.id;

    const response = await fetch(`${baseUrl}/api/v1/programas/${programa.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: "Nome atualizado",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: programa.id,
      instituicao_id: instituicao.id,
      nome: "Nome atualizado",
      sigla: "PA",
    });
  });

  test("atualiza a sigla do programa", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição da Sigla",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa da Sigla",
      sigla: "ANTIGA",
    });

    programaIdCriado = programa.id;

    const response = await fetch(`${baseUrl}/api/v1/programas/${programa.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sigla: "NOVA",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: programa.id,
      instituicao_id: instituicao.id,
      nome: "Programa da Sigla",
      sigla: "NOVA",
    });
  });

  test("permite remover a sigla enviando valor vazio", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição da Sigla",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa com Sigla",
      sigla: "SIGLA",
    });

    programaIdCriado = programa.id;

    const response = await fetch(`${baseUrl}/api/v1/programas/${programa.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sigla: "   ",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data.sigla).toBeNull();
  });

  test("atualiza o programa para outra instituição existente", async () => {
    const instituicaoAtual = await Instituicao.create({
      nome: "Instituição Atual",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    const novaInstituicao = await Instituicao.create({
      nome: "Nova Instituição",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = novaInstituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicaoAtual.id,
      nome: "Programa para Transferência",
      sigla: "PT",
    });

    programaIdCriado = programa.id;

    const response = await fetch(`${baseUrl}/api/v1/programas/${programa.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instituicao_id: novaInstituicao.id,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toMatchObject({
      id: programa.id,
      instituicao_id: novaInstituicao.id,
      nome: "Programa para Transferência",
      sigla: "PT",
    });

    await Instituicao.destroy({
      where: {
        id: instituicaoAtual.id,
      },
    });
  });

  test("retorna 404 quando a nova instituição não existe", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição Original",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa Original",
      sigla: "PO",
    });

    programaIdCriado = programa.id;

    const response = await fetch(`${baseUrl}/api/v1/programas/${programa.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instituicao_id: 999999999,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: {
        code: "INSTITUICAO_NOT_FOUND",
        message: "Instituição não encontrada.",
        details: {
          id: 999999999,
        },
      },
    });
  });

  test("retorna 400 quando o novo nome é vazio", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição do Nome",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Nome válido",
      sigla: "NV",
    });

    programaIdCriado = programa.id;

    const response = await fetch(`${baseUrl}/api/v1/programas/${programa.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: "   ",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "nome não pode ser vazio.",
        details: {
          campo: "nome",
        },
      },
    });
  });

  test("retorna 404 quando o programa não existe", async () => {
    const response = await fetch(`${baseUrl}/api/v1/programas/999999999`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: "Novo nome",
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

  test("retorna 400 quando o ID é inválido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/programas/abc`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: "Novo nome",
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
});

describe("DELETE /api/v1/programas/:id", () => {
  test("exclui um programa existente", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição para exclusão",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa para excluir",
      sigla: "PE",
    });

    programaIdCriado = programa.id;

    const response = await fetch(`${baseUrl}/api/v1/programas/${programa.id}`, {
      method: "DELETE",
    });

    expect(response.status).toBe(204);

    const programaNoBanco = await Programa.findByPk(programa.id);

    expect(programaNoBanco).toBeNull();

    programaIdCriado = null;
  });

  test("retorna 404 quando o programa não existe", async () => {
    const response = await fetch(`${baseUrl}/api/v1/programas/999999999`, {
      method: "DELETE",
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

  test("retorna 400 quando o ID é inválido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/programas/abc`, {
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

  test("retorna 409 quando o programa possui alunos associados", async () => {
    const instituicao = await Instituicao.create({
      nome: "Instituição com Aluno",
      sigla: `INST-${randomUUID().slice(0, 8)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: "Programa com Aluno",
      sigla: "PCA",
    });

    programaIdCriado = programa.id;

    const pessoa = await Pessoa.create({
      nome_completo: "Aluno de Teste",
      identificador_lattes: `LATTES-${randomUUID()}`,
    });

    const aluno = await Aluno.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
    });

    const response = await fetch(`${baseUrl}/api/v1/programas/${programa.id}`, {
      method: "DELETE",
    });

    const body = await response.json();

    expect(response.status).toBe(409);

    expect(body).toEqual({
      error: {
        code: "PROGRAMA_HAS_DEPENDENCIES",
        message:
          "Não é possível excluir o programa porque existem registros associados.",
        details: null,
      },
    });

    const programaNoBanco = await Programa.findByPk(programa.id);

    expect(programaNoBanco).not.toBeNull();

    await Aluno.destroy({
      where: {
        id: aluno.id,
      },
    });

    await Pessoa.destroy({
      where: {
        id: pessoa.id,
      },
    });

    programaIdCriado = null;
    instituicaoIdCriada = null;
  });
});
