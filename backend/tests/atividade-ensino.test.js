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
  AtividadeEnsino,
  Docente,
  Pessoa,
  Programa,
  Instituicao,
  ParserVersao,
  Importacao,
  Processamento,
  sequelize,
  Periodo,
} from "../src/database/index.js";

let server;
let baseUrl;

let atividadeEnsinoIdCriada;
let docenteIdCriado;
let pessoaIdCriada;
let programaIdCriado;
let instituicaoIdCriada;
let processamentoIdCriado;

beforeAll(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

afterEach(async () => {
  if (atividadeEnsinoIdCriada) {
    await AtividadeEnsino.destroy({
      where: {
        id: atividadeEnsinoIdCriada,
      },
    });

    atividadeEnsinoIdCriada = null;
  }

  if (docenteIdCriado) {
    await Docente.destroy({
      where: {
        id: docenteIdCriado,
      },
    });

    docenteIdCriado = null;
  }

  if (processamentoIdCriado) {
    await Processamento.destroy({
      where: {
        id: processamentoIdCriado,
      },
    });

    processamentoIdCriado = null;
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

describe("POST /api/v1/atividades-ensino", () => {
  test("cria uma atividade de ensino válida", async () => {
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

    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        tipo: "Disciplina",
        disciplina: "Ciência da Computação",
        nivel: "Mestrado",
        descricao: "Disciplina de Ciência da Computação",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    atividadeEnsinoIdCriada = body.data.id;

    expect(body.data.docente_id).toBe(docente.id);
    expect(body.data.tipo).toBe("Disciplina");
    expect(body.data.disciplina).toBe("Ciência da Computação");
    expect(body.data.nivel).toBe("Mestrado");
    expect(body.data.descricao).toBe("Disciplina de Ciência da Computação");
    expect(body.data.periodo_id).toBeNull();
    expect(body.data.processamento_id).toBeNull();
  });

  test("retorna 404 quando o docente não existe", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: 999999,
        tipo: "Disciplina",
        disciplina: "Ciência da Computação",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body.error.code).toBe("DOCENTE_NOT_FOUND");
  });

  test("retorna 404 quando o período não existe", async () => {
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

    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        periodo_id: 999999,
        tipo: "Disciplina",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body.error.code).toBe("PERIODO_NOT_FOUND");
  });

  test("retorna 400 quando o tipo não é informado", async () => {
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

    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o tipo está vazio", async () => {
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

    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        tipo: "   ",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 404 quando o processamento não existe", async () => {
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

    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        tipo: "Disciplina",
        processamento_id: 999999,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("PROCESSAMENTO_NOT_FOUND");
  });

  test("cria uma atividade de ensino com processamento", async () => {
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

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      criado_em: new Date().toISOString(),
    });

    const importacao = await Importacao.create({
      docente_id: docente.id,
      nome_arquivo_original: "curriculo.pdf",
      hash_arquivo: randomUUID(),
      data_importacao: new Date().toISOString(),
      status: "PROCESSANDO",
    });

    const processamento = await Processamento.create({
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: new Date().toISOString(),
      status: "PROCESSANDO",
    });

    processamentoIdCriado = processamento.id;

    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        tipo: "Disciplina",
        disciplina: "Banco de Dados",
        nivel: "Mestrado",
        descricao: "Disciplina de Banco de Dados",
        processamento_id: processamento.id,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    atividadeEnsinoIdCriada = body.data.id;

    expect(body.data.docente_id).toBe(docente.id);
    expect(body.data.processamento_id).toBe(processamento.id);
    expect(body.data.tipo).toBe("Disciplina");
    expect(body.data.disciplina).toBe("Banco de Dados");
    expect(body.data.nivel).toBe("Mestrado");
    expect(body.data.descricao).toBe("Disciplina de Banco de Dados");
  });

  test("retorna 400 quando o docente_id é inválido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: 0,
        tipo: "Disciplina",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o docente_id é negativo", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: -1,
        tipo: "Disciplina",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o docente_id não é inteiro", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: 1.5,
        tipo: "Disciplina",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o periodo_id é inválido", async () => {
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

    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        periodo_id: 0,
        tipo: "Disciplina",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o periodo_id é negativo", async () => {
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

    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        periodo_id: -1,
        tipo: "Disciplina",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o periodo_id não é inteiro", async () => {
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

    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        periodo_id: 1.5,
        tipo: "Disciplina",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o processamento_id é inválido", async () => {
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

    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        processamento_id: 0,
        tipo: "Disciplina",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o processamento_id é negativo", async () => {
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

    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        processamento_id: -1,
        tipo: "Disciplina",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o processamento_id não é inteiro", async () => {
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

    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        processamento_id: 1.5,
        tipo: "Disciplina",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("GET /api/v1/atividades-ensino", () => {
  test("lista as atividades de ensino", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
      disciplina: "Banco de Dados",
      nivel: "Mestrado",
      descricao: "Disciplina de Banco de Dados",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`);

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(Array.isArray(body.data)).toBe(true);

    expect(body.data.some((item) => item.id === atividade.id)).toBe(true);
  });

  test("lista múltiplas atividades de ensino", async () => {
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

    const atividade1 = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
      disciplina: "Banco de Dados",
      nivel: "Mestrado",
    });

    const atividade2 = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Orientação",
      disciplina: "Engenharia de Software",
      nivel: "Doutorado",
    });

    atividadeEnsinoIdCriada = atividade1.id;

    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino`);

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);

    expect(body.data.some((item) => item.id === atividade1.id)).toBe(true);

    expect(body.data.some((item) => item.id === atividade2.id)).toBe(true);

    await AtividadeEnsino.destroy({
      where: {
        id: atividade2.id,
      },
    });
  });
});

describe("GET /api/v1/atividades-ensino/:id", () => {
  test("busca uma atividade de ensino existente", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
      disciplina: "Banco de Dados",
      nivel: "Mestrado",
      descricao: "Disciplina de Banco de Dados",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data.id).toBe(atividade.id);
    expect(body.data.docente_id).toBe(docente.id);
    expect(body.data.tipo).toBe("Disciplina");
    expect(body.data.disciplina).toBe("Banco de Dados");
    expect(body.data.nivel).toBe("Mestrado");
    expect(body.data.descricao).toBe("Disciplina de Banco de Dados");
  });

  test("retorna 404 quando a atividade de ensino não existe", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino/999999`);

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("ATIVIDADE_ENSINO_NOT_FOUND");
  });

  test("retorna 400 quando o id é inválido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino/0`);

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o id é negativo", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino/-1`);

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o id não é inteiro", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino/1.5`);

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("PATCH /api/v1/atividades-ensino/:id", () => {
  test("atualiza uma atividade de ensino existente", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
      disciplina: "Banco de Dados",
      nivel: "Mestrado",
      descricao: "Disciplina de Banco de Dados",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disciplina: "Engenharia de Software",
          nivel: "Doutorado",
          descricao: "Nova descrição",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data.id).toBe(atividade.id);
    expect(body.data.docente_id).toBe(docente.id);
    expect(body.data.tipo).toBe("Disciplina");
    expect(body.data.disciplina).toBe("Engenharia de Software");
    expect(body.data.nivel).toBe("Doutorado");
    expect(body.data.descricao).toBe("Nova descrição");
  });

  test("retorna 404 quando a atividade de ensino não existe", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino/999999`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        disciplina: "Nova Disciplina",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("ATIVIDADE_ENSINO_NOT_FOUND");
  });

  test("retorna 400 quando o id é inválido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino/0`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        disciplina: "Nova Disciplina",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o id é negativo", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino/-1`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        disciplina: "Nova Disciplina",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o id não é inteiro", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino/1.5`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        disciplina: "Nova Disciplina",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando nenhum campo válido é informado", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
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

  test("retorna 400 quando o tipo está vazio", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: "   ",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("atualiza o docente_id da atividade de ensino", async () => {
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

    const pessoa1 = await Pessoa.create({
      nome_completo: `Pessoa ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    pessoaIdCriada = pessoa1.id;

    const docente1 = await Docente.create({
      pessoa_id: pessoa1.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });

    docenteIdCriado = docente1.id;

    const pessoa2 = await Pessoa.create({
      nome_completo: `Pessoa ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    const docente2 = await Docente.create({
      pessoa_id: pessoa2.id,
      programa_id: programa.id,
      categoria: "Colaborador",
      ativo: 1,
    });

    const atividade = await AtividadeEnsino.create({
      docente_id: docente1.id,
      tipo: "Disciplina",
      disciplina: "Banco de Dados",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docente_id: docente2.id,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.id).toBe(atividade.id);
    expect(body.data.docente_id).toBe(docente2.id);

    await Docente.destroy({
      where: {
        id: docente2.id,
      },
    });

    await Pessoa.destroy({
      where: {
        id: pessoa2.id,
      },
    });
  });

  test("retorna 404 quando o docente_id não existe", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docente_id: 999999,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("DOCENTE_NOT_FOUND");
  });

  test("retorna 400 quando o docente_id é zero", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docente_id: 0,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o docente_id é negativo", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docente_id: -1,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o docente_id é decimal", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docente_id: 1.5,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("atualiza o periodo_id da atividade de ensino", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const periodo = await Periodo.create({
      ano: 2026,
      semestre: 1,
    });

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          periodo_id: periodo.id,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.id).toBe(atividade.id);
    expect(body.data.periodo_id).toBe(periodo.id);

    await Periodo.destroy({
      where: {
        id: periodo.id,
      },
    });
  });

  test("retorna 404 quando o periodo_id não existe", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          periodo_id: 999999,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("PERIODO_NOT_FOUND");
  });

  test("retorna 400 quando o periodo_id é zero", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          periodo_id: 0,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o periodo_id é negativo", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          periodo_id: -1,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o periodo_id é decimal", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          periodo_id: 1.5,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("atualiza o processamento_id da atividade de ensino", async () => {
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

    const parserVersao = await ParserVersao.create({
      versao: `1.0.${randomUUID().slice(0, 6)}`,
      criado_em: new Date().toISOString(),
      descricao: "Versão de teste",
    });

    const importacao = await Importacao.create({
      docente_id: docente.id,
      nome_arquivo_original: "curriculo.pdf",
      hash_arquivo: randomUUID(),
      data_importacao: new Date().toISOString(),
      status: "PROCESSANDO",
    });

    const processamento = await Processamento.create({
      importacao_id: importacao.id,
      parser_versao_id: parserVersao.id,
      iniciado_em: new Date().toISOString(),
      status: "PROCESSANDO",
      registros_processados: 0,
      erros: 0,
      alertas: 0,
    });

    processamentoIdCriado = processamento.id;

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          processamento_id: processamento.id,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.id).toBe(atividade.id);
    expect(body.data.processamento_id).toBe(processamento.id);
  });

  test("retorna 404 quando o processamento_id não existe", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          processamento_id: 999999,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("PROCESSAMENTO_NOT_FOUND");
  });

  test("retorna 400 quando o processamento_id é zero", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          processamento_id: 0,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o processamento_id é negativo", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          processamento_id: -1,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o processamento_id é decimal", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          processamento_id: 1.5,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("atualiza a disciplina da atividade de ensino", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
      disciplina: "Banco de Dados",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disciplina: "Engenharia de Software",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.id).toBe(atividade.id);
    expect(body.data.disciplina).toBe("Engenharia de Software");
  });

  test("atualiza o nivel da atividade de ensino", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
      nivel: "Graduação",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nivel: "Pós-graduação",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.id).toBe(atividade.id);
    expect(body.data.nivel).toBe("Pós-graduação");
  });

  test("atualiza a descricao da atividade de ensino", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
      descricao: "Descrição original",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descricao: "Nova descrição da atividade",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.id).toBe(atividade.id);
    expect(body.data.descricao).toBe("Nova descrição da atividade");
  });

  test("atualiza o tipo da atividade de ensino", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: "Monitoria",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.id).toBe(atividade.id);
    expect(body.data.tipo).toBe("Monitoria");
  });

  test("atualiza vários campos da atividade de ensino", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
      disciplina: "Banco de Dados",
      nivel: "Graduação",
      descricao: "Descrição original",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: "Monitoria",
          disciplina: "Engenharia de Software",
          nivel: "Pós-graduação",
          descricao: "Nova descrição",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.id).toBe(atividade.id);
    expect(body.data.tipo).toBe("Monitoria");
    expect(body.data.disciplina).toBe("Engenharia de Software");
    expect(body.data.nivel).toBe("Pós-graduação");
    expect(body.data.descricao).toBe("Nova descrição");
  });
});

describe("DELETE /api/v1/atividades-ensino/:id", () => {
  test("exclui uma atividade de ensino existente", async () => {
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

    const atividade = await AtividadeEnsino.create({
      docente_id: docente.id,
      tipo: "Disciplina",
      disciplina: "Banco de Dados",
    });

    atividadeEnsinoIdCriada = atividade.id;

    const response = await fetch(
      `${baseUrl}/api/v1/atividades-ensino/${atividade.id}`,
      {
        method: "DELETE",
      },
    );

    expect(response.status).toBe(204);

    const atividadeExcluida = await AtividadeEnsino.findByPk(atividade.id);

    expect(atividadeExcluida).toBeNull();

    atividadeEnsinoIdCriada = null;
  });

  test("retorna 404 quando a atividade de ensino não existe", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino/999999`, {
      method: "DELETE",
    });

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("ATIVIDADE_ENSINO_NOT_FOUND");
  });

  test("retorna 400 quando o id é zero", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino/0`, {
      method: "DELETE",
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o id é negativo", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino/-1`, {
      method: "DELETE",
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("retorna 400 quando o id é decimal", async () => {
    const response = await fetch(`${baseUrl}/api/v1/atividades-ensino/1.5`, {
      method: "DELETE",
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});
