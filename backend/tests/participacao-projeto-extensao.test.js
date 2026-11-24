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
  ParticipacaoProjetoExtensao,
  ProjetoExtensao,
  Pessoa,
  sequelize,
} from "../src/database/index.js";

let server;
let baseUrl;

let participacaoIdCriada;
let projetoIdCriado;
let pessoaIdCriada;

beforeAll(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

afterEach(async () => {
  if (participacaoIdCriada) {
    await ParticipacaoProjetoExtensao.destroy({
      where: {
        id: participacaoIdCriada,
      },
    });

    participacaoIdCriada = null;
  }

  if (pessoaIdCriada) {
    await Pessoa.destroy({
      where: {
        id: pessoaIdCriada,
      },
    });

    pessoaIdCriada = null;
  }

  if (projetoIdCriado) {
    await ProjetoExtensao.destroy({
      where: {
        id: projetoIdCriado,
      },
    });

    projetoIdCriado = null;
  }
});

afterAll(async () => {
  await new Promise((resolve) => {
    server.close(resolve);
  });

  await sequelize.close();
});

describe("POST /api/v1/participacoes-projeto-extensao", () => {
  test("deve criar uma participação em projeto de extensão", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: `Pessoa Teste ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    pessoaIdCriada = pessoa.id;

    const projeto = await ProjetoExtensao.create({
      titulo: `Projeto de Extensão ${randomUUID()}`,
    });

    projetoIdCriado = projeto.id;

    const response = await fetch(
      `${baseUrl}/api/v1/participacoes-projeto-extensao`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projeto_id: projeto.id,
          pessoa_id: pessoa.id,
          papel: "Coordenador",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(201);

    expect(body.data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        projeto_id: projeto.id,
        pessoa_id: pessoa.id,
        papel: "Coordenador",
      }),
    );

    participacaoIdCriada = body.data.id;
  });

  test("não deve permitir participação duplicada no mesmo projeto", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: `Pessoa Teste ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    pessoaIdCriada = pessoa.id;

    const projeto = await ProjetoExtensao.create({
      titulo: `Projeto de Extensão ${randomUUID()}`,
    });

    projetoIdCriado = projeto.id;

    const primeiraResponse = await fetch(
      `${baseUrl}/api/v1/participacoes-projeto-extensao`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projeto_id: projeto.id,
          pessoa_id: pessoa.id,
          papel: "Participante",
        }),
      },
    );

    const primeiraBody = await primeiraResponse.json();

    expect(primeiraResponse.status).toBe(201);

    participacaoIdCriada = primeiraBody.data.id;

    const segundaResponse = await fetch(
      `${baseUrl}/api/v1/participacoes-projeto-extensao`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projeto_id: projeto.id,
          pessoa_id: pessoa.id,
          papel: "Coordenador",
        }),
      },
    );

    const segundaBody = await segundaResponse.json();

    expect(segundaResponse.status).toBe(409);

    expect(segundaBody.error).toEqual(
      expect.objectContaining({
        code: "PARTICIPACAO_PROJETO_EXTENSAO_ALREADY_EXISTS",
      }),
    );
  });
});

describe("GET /api/v1/participacoes-projeto-extensao", () => {
  test("deve listar as participações em projetos de extensão", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: `Pessoa Teste ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    pessoaIdCriada = pessoa.id;

    const projeto = await ProjetoExtensao.create({
      titulo: `Projeto de Extensão ${randomUUID()}`,
    });

    projetoIdCriado = projeto.id;

    const participacao = await ParticipacaoProjetoExtensao.create({
      projeto_id: projeto.id,
      pessoa_id: pessoa.id,
      papel: "Participante",
    });

    participacaoIdCriada = participacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/participacoes-projeto-extensao`,
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: participacao.id,
          projeto_id: projeto.id,
          pessoa_id: pessoa.id,
          papel: "Participante",
        }),
      ]),
    );
  });
});

describe("GET /api/v1/participacoes-projeto-extensao/:id", () => {
  test("deve buscar uma participação por ID", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: `Pessoa Teste ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    pessoaIdCriada = pessoa.id;

    const projeto = await ProjetoExtensao.create({
      titulo: `Projeto de Extensão ${randomUUID()}`,
    });

    projetoIdCriado = projeto.id;

    const participacao = await ParticipacaoProjetoExtensao.create({
      projeto_id: projeto.id,
      pessoa_id: pessoa.id,
      papel: "Participante",
    });

    participacaoIdCriada = participacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/participacoes-projeto-extensao/${participacao.id}`,
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual(
      expect.objectContaining({
        id: participacao.id,
        projeto_id: projeto.id,
        pessoa_id: pessoa.id,
        papel: "Participante",
      }),
    );
  });

  test("deve retornar 404 ao buscar uma participação inexistente", async () => {
    const response = await fetch(
      `${baseUrl}/api/v1/participacoes-projeto-extensao/999999`,
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body.error).toEqual(
      expect.objectContaining({
        code: "PARTICIPACAO_PROJETO_EXTENSAO_NOT_FOUND",
      }),
    );
  });
});

describe("PATCH /api/v1/participacoes-projeto-extensao/:id", () => {
  test("deve atualizar o papel de uma participação", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: `Pessoa Teste ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    pessoaIdCriada = pessoa.id;

    const projeto = await ProjetoExtensao.create({
      titulo: `Projeto de Extensão ${randomUUID()}`,
    });

    projetoIdCriado = projeto.id;

    const participacao = await ParticipacaoProjetoExtensao.create({
      projeto_id: projeto.id,
      pessoa_id: pessoa.id,
      papel: "Participante",
    });

    participacaoIdCriada = participacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/participacoes-projeto-extensao/${participacao.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          papel: "Coordenador",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data).toEqual(
      expect.objectContaining({
        id: participacao.id,
        projeto_id: projeto.id,
        pessoa_id: pessoa.id,
        papel: "Coordenador",
      }),
    );
  });

  test("deve retornar 404 ao atualizar uma participação inexistente", async () => {
    const response = await fetch(
      `${baseUrl}/api/v1/participacoes-projeto-extensao/999999`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          papel: "Coordenador",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body.error).toEqual(
      expect.objectContaining({
        code: "PARTICIPACAO_PROJETO_EXTENSAO_NOT_FOUND",
      }),
    );
  });
});

describe("DELETE /api/v1/participacoes-projeto-extensao/:id", () => {
  test("deve excluir uma participação", async () => {
    const pessoa = await Pessoa.create({
      nome_completo: `Pessoa Teste ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    pessoaIdCriada = pessoa.id;

    const projeto = await ProjetoExtensao.create({
      titulo: `Projeto de Extensão ${randomUUID()}`,
    });

    projetoIdCriado = projeto.id;

    const participacao = await ParticipacaoProjetoExtensao.create({
      projeto_id: projeto.id,
      pessoa_id: pessoa.id,
      papel: "Participante",
    });

    participacaoIdCriada = participacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/participacoes-projeto-extensao/${participacao.id}`,
      {
        method: "DELETE",
      },
    );

    expect(response.status).toBe(204);

    participacaoIdCriada = null;

    const participacaoExcluida =
      await ParticipacaoProjetoExtensao.findByPk(
        participacao.id,
      );

    expect(participacaoExcluida).toBeNull();
  });

  test("deve retornar 404 ao excluir uma participação inexistente", async () => {
    const response = await fetch(
      `${baseUrl}/api/v1/participacoes-projeto-extensao/999999`,
      {
        method: "DELETE",
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body.error).toEqual(
      expect.objectContaining({
        code: "PARTICIPACAO_PROJETO_EXTENSAO_NOT_FOUND",
      }),
    );
  });
});
