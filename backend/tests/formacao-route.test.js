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
  Formacao,
  Docente,
  Pessoa,
  Programa,
  Instituicao,
  sequelize,
} from "../src/database/index.js";

let server;
let baseUrl;

let formacaoIdCriada;
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
  if (formacaoIdCriada) {
    await Formacao.destroy({
      where: {
        id: formacaoIdCriada,
      },
    });

    formacaoIdCriada = null;
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
  await new Promise((resolve) => {
    server.close(resolve);
  });

  await sequelize.close();
});

describe("POST /api/v1/formacoes", () => {
  test("cria uma formação válida", async () => {
    const instituicao = await Instituicao.create({
      nome: `Instituição ${randomUUID()}`,
      sigla: `INS-${randomUUID().slice(0, 6)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: `Programa ${randomUUID()}`,
      sigla: `PRO-${randomUUID().slice(0, 6)}`,
    });

    programaIdCriado = programa.id;

    const pessoa = await Pessoa.create({
      nome_completo: `Pessoa ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    pessoaIdCriada = pessoa.id;

    const docente = await Docente.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });

    docenteIdCriado = docente.id;

    const response = await fetch(`${baseUrl}/api/v1/formacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        nivel: "Doutorado",
        curso: "Ciência da Computação",
        instituicao: "Universidade Federal de São Paulo",
        ano_inicio: 2018,
        ano_conclusao: 2022,
        titulo: "Doutor em Ciência da Computação",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    formacaoIdCriada = body.data.id;

    expect(body.data.docente_id).toBe(docente.id);
    expect(body.data.nivel).toBe("Doutorado");
    expect(body.data.curso).toBe("Ciência da Computação");
    expect(body.data.instituicao).toBe("Universidade Federal de São Paulo");
    expect(body.data.ano_inicio).toBe(2018);
    expect(body.data.ano_conclusao).toBe(2022);
    expect(body.data.titulo).toBe("Doutor em Ciência da Computação");
  });

  test("cria uma formação apenas com os campos obrigatórios", async () => {
    const instituicao = await Instituicao.create({
      nome: `Instituição ${randomUUID()}`,
      sigla: `INS-${randomUUID().slice(0, 6)}`,
    });

    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: `Programa ${randomUUID()}`,
      sigla: `PRO-${randomUUID().slice(0, 6)}`,
    });

    programaIdCriado = programa.id;

    const pessoa = await Pessoa.create({
      nome_completo: `Pessoa ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    pessoaIdCriada = pessoa.id;

    const docente = await Docente.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });

    docenteIdCriado = docente.id;

    const response = await fetch(`${baseUrl}/api/v1/formacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        nivel: "Mestrado",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    formacaoIdCriada = body.data.id;

    expect(body.data.docente_id).toBe(docente.id);
    expect(body.data.nivel).toBe("Mestrado");
    expect(body.data.curso).toBeNull();
    expect(body.data.instituicao).toBeNull();
    expect(body.data.ano_inicio).toBeNull();
    expect(body.data.ano_conclusao).toBeNull();
    expect(body.data.titulo).toBeNull();
  });

  test("retorna 400 quando docente_id é inválido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/formacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: "abc",
        nivel: "Doutorado",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.campo).toBe("docente_id");
  });

  test("retorna 404 quando docente não existe", async () => {
    const response = await fetch(`${baseUrl}/api/v1/formacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: 999999,
        nivel: "Doutorado",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("DOCENTE_NOT_FOUND");
    expect(body.error.details.id).toBe(999999);
  });

  test("retorna 400 quando nivel é vazio", async () => {
    const instituicao = await Instituicao.create({
      nome: `Instituição ${randomUUID()}`,
      sigla: `INS-${randomUUID().slice(0, 6)}`,
    });
    instituicaoIdCriada = instituicao.id;

    const programa = await Programa.create({
      instituicao_id: instituicao.id,
      nome: `Programa ${randomUUID()}`,
      sigla: `PRO-${randomUUID().slice(0, 6)}`,
    });
    programaIdCriado = programa.id;

    const pessoa = await Pessoa.create({
      nome_completo: `Pessoa ${randomUUID()}`,
      lattes_id: randomUUID(),
    });
    pessoaIdCriada = pessoa.id;

    const docente = await Docente.create({
      pessoa_id: pessoa.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });
    docenteIdCriado = docente.id;

    const response = await fetch(`${baseUrl}/api/v1/formacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        nivel: "",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.campo).toBe("nivel");
  });
});
