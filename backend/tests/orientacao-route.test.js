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
  Orientacao,
  Docente,
  Aluno,
  Pessoa,
  Programa,
  Instituicao,
  sequelize,
} from "../src/database/index.js";

let server;
let baseUrl;

let orientacaoIdCriada;
let docenteIdCriado;
let alunoIdCriado;
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
  if (orientacaoIdCriada) {
    await Orientacao.destroy({
      where: { id: orientacaoIdCriada },
    });
    orientacaoIdCriada = null;
  }

  if (docenteIdCriado) {
    await Docente.destroy({
      where: { id: docenteIdCriado },
    });
    docenteIdCriado = null;
  }

  if (alunoIdCriado) {
    await Aluno.destroy({
      where: { id: alunoIdCriado },
    });
    alunoIdCriado = null;
  }

  if (pessoaIdCriada) {
    await Pessoa.destroy({
      where: { id: pessoaIdCriada },
    });
    pessoaIdCriada = null;
  }

  if (programaIdCriado) {
    await Programa.destroy({
      where: { id: programaIdCriado },
    });
    programaIdCriado = null;
  }

  if (instituicaoIdCriada) {
    await Instituicao.destroy({
      where: { id: instituicaoIdCriada },
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

describe("POST /api/v1/orientacoes", () => {
  test("cria uma orientação válida", async () => {
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

    const pessoaDocente = await Pessoa.create({
      nome_completo: `Docente ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    const docente = await Docente.create({
      pessoa_id: pessoaDocente.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });
    docenteIdCriado = docente.id;

    const pessoaAluno = await Pessoa.create({
      nome_completo: `Aluno ${randomUUID()}`,
      lattes_id: randomUUID(),
    });
    pessoaIdCriada = pessoaAluno.id;

    const aluno = await Aluno.create({
      pessoa_id: pessoaAluno.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2024,
    });
    alunoIdCriado = aluno.id;

    const response = await fetch(`${baseUrl}/api/v1/orientacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        aluno_id: aluno.id,
        nivel: "Mestrado",
        status: "Em andamento",
        titulo: "Análise de dados acadêmicos",
        ano_inicio: 2024,
        ano_conclusao: 2026,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    orientacaoIdCriada = body.data.id;

    expect(body.data.docente_id).toBe(docente.id);
    expect(body.data.aluno_id).toBe(aluno.id);
    expect(body.data.nivel).toBe("Mestrado");
    expect(body.data.status).toBe("Em andamento");
    expect(body.data.titulo).toBe("Análise de dados acadêmicos");
    expect(body.data.ano_inicio).toBe(2024);
    expect(body.data.ano_conclusao).toBe(2026);
    expect(body.data.processamento_id).toBeNull();
  });

  test("cria uma orientação apenas com os campos obrigatórios", async () => {
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

    const pessoaDocente = await Pessoa.create({
      nome_completo: `Docente ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    const docente = await Docente.create({
      pessoa_id: pessoaDocente.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });
    docenteIdCriado = docente.id;

    const pessoaAluno = await Pessoa.create({
      nome_completo: `Aluno ${randomUUID()}`,
      lattes_id: randomUUID(),
    });
    pessoaIdCriada = pessoaAluno.id;

    const aluno = await Aluno.create({
      pessoa_id: pessoaAluno.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2024,
    });
    alunoIdCriado = aluno.id;

    const response = await fetch(`${baseUrl}/api/v1/orientacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        aluno_id: aluno.id,
        status: "Concluída",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    orientacaoIdCriada = body.data.id;

    expect(body.data.docente_id).toBe(docente.id);
    expect(body.data.aluno_id).toBe(aluno.id);
    expect(body.data.status).toBe("Concluída");

    expect(body.data.nivel).toBeNull();
    expect(body.data.titulo).toBeNull();
    expect(body.data.ano_inicio).toBeNull();
    expect(body.data.ano_conclusao).toBeNull();
    expect(body.data.processamento_id).toBeNull();
  });

  test("retorna 400 quando docente_id é inválido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/orientacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: "abc",
        aluno_id: 1,
        status: "Em andamento",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.campo).toBe("docente_id");
  });

  test("retorna 404 quando docente não existe", async () => {
    const response = await fetch(`${baseUrl}/api/v1/orientacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: 999999,
        aluno_id: 1,
        status: "Em andamento",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("DOCENTE_NOT_FOUND");
    expect(body.error.details.id).toBe(999999);
  });

  test("retorna 400 quando aluno_id é inválido", async () => {
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
      nome_completo: `Docente ${randomUUID()}`,
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

    const response = await fetch(`${baseUrl}/api/v1/orientacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        aluno_id: "abc",
        status: "Em andamento",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.campo).toBe("aluno_id");
  });

  test("retorna 404 quando aluno não existe", async () => {
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
      nome_completo: `Docente ${randomUUID()}`,
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

    const response = await fetch(`${baseUrl}/api/v1/orientacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        aluno_id: 999999,
        status: "Em andamento",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("ALUNO_NOT_FOUND");
    expect(body.error.details.id).toBe(999999);
  });

  test("retorna 400 quando status é vazio", async () => {
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

    const pessoaDocente = await Pessoa.create({
      nome_completo: `Docente ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    const docente = await Docente.create({
      pessoa_id: pessoaDocente.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });
    docenteIdCriado = docente.id;

    const pessoaAluno = await Pessoa.create({
      nome_completo: `Aluno ${randomUUID()}`,
      lattes_id: randomUUID(),
    });
    pessoaIdCriada = pessoaAluno.id;

    const aluno = await Aluno.create({
      pessoa_id: pessoaAluno.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2024,
    });
    alunoIdCriado = aluno.id;

    const response = await fetch(`${baseUrl}/api/v1/orientacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docente_id: docente.id,
        aluno_id: aluno.id,
        status: "",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.campo).toBe("status");
  });
});

describe("GET /api/v1/orientacoes", () => {
  test("lista as orientações", async () => {
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

    const pessoaDocente = await Pessoa.create({
      nome_completo: `Docente ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    const docente = await Docente.create({
      pessoa_id: pessoaDocente.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });
    docenteIdCriado = docente.id;

    const pessoaAluno = await Pessoa.create({
      nome_completo: `Aluno ${randomUUID()}`,
      lattes_id: randomUUID(),
    });
    pessoaIdCriada = pessoaAluno.id;

    const aluno = await Aluno.create({
      pessoa_id: pessoaAluno.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2024,
    });
    alunoIdCriado = aluno.id;

    const orientacao = await Orientacao.create({
      docente_id: docente.id,
      aluno_id: aluno.id,
      nivel: "Mestrado",
      status: "Em andamento",
      titulo: "Pesquisa em análise de dados",
      ano_inicio: 2024,
      ano_conclusao: 2026,
    });
    orientacaoIdCriada = orientacao.id;

    const response = await fetch(`${baseUrl}/api/v1/orientacoes`);

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);

    const orientacaoEncontrada = body.data.find(
      (item) => item.id === orientacao.id,
    );

    expect(orientacaoEncontrada).toBeDefined();
    expect(orientacaoEncontrada.docente_id).toBe(docente.id);
    expect(orientacaoEncontrada.aluno_id).toBe(aluno.id);
    expect(orientacaoEncontrada.status).toBe("Em andamento");
  });
});

describe("GET /api/v1/orientacoes/:id", () => {
  test("busca uma orientação pelo id", async () => {
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

    const pessoaDocente = await Pessoa.create({
      nome_completo: `Docente ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    const docente = await Docente.create({
      pessoa_id: pessoaDocente.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });
    docenteIdCriado = docente.id;

    const pessoaAluno = await Pessoa.create({
      nome_completo: `Aluno ${randomUUID()}`,
      lattes_id: randomUUID(),
    });
    pessoaIdCriada = pessoaAluno.id;

    const aluno = await Aluno.create({
      pessoa_id: pessoaAluno.id,
      programa_id: programa.id,
      nivel: "Doutorado",
      situacao: "Ativo",
      ano_ingresso: 2023,
    });
    alunoIdCriado = aluno.id;

    const orientacao = await Orientacao.create({
      docente_id: docente.id,
      aluno_id: aluno.id,
      nivel: "Doutorado",
      status: "Concluída",
      titulo: "Pesquisa sobre sistemas distribuídos",
      ano_inicio: 2023,
      ano_conclusao: 2025,
    });
    orientacaoIdCriada = orientacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/orientacoes/${orientacao.id}`,
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data.id).toBe(orientacao.id);
    expect(body.data.docente_id).toBe(docente.id);
    expect(body.data.aluno_id).toBe(aluno.id);
    expect(body.data.nivel).toBe("Doutorado");
    expect(body.data.status).toBe("Concluída");
    expect(body.data.titulo).toBe("Pesquisa sobre sistemas distribuídos");
  });

  test("retorna 404 quando a orientação não existe", async () => {
    const response = await fetch(`${baseUrl}/api/v1/orientacoes/999999`);

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("ORIENTACAO_NOT_FOUND");
    expect(body.error.details.id).toBe(999999);
  });
});

describe("PATCH /api/v1/orientacoes/:id", () => {
  test("atualiza uma orientação", async () => {
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

    const pessoaDocente = await Pessoa.create({
      nome_completo: `Docente ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    const docente = await Docente.create({
      pessoa_id: pessoaDocente.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });
    docenteIdCriado = docente.id;

    const pessoaAluno = await Pessoa.create({
      nome_completo: `Aluno ${randomUUID()}`,
      lattes_id: randomUUID(),
    });
    pessoaIdCriada = pessoaAluno.id;

    const aluno = await Aluno.create({
      pessoa_id: pessoaAluno.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2024,
    });
    alunoIdCriado = aluno.id;

    const orientacao = await Orientacao.create({
      docente_id: docente.id,
      aluno_id: aluno.id,
      nivel: "Mestrado",
      status: "Em andamento",
      titulo: "Título antigo",
      ano_inicio: 2024,
      ano_conclusao: 2026,
    });
    orientacaoIdCriada = orientacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/orientacoes/${orientacao.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nivel: "Doutorado",
          status: "Concluída",
          titulo: "Título atualizado",
          ano_inicio: 2025,
          ano_conclusao: 2028,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body.data.id).toBe(orientacao.id);
    expect(body.data.docente_id).toBe(docente.id);
    expect(body.data.aluno_id).toBe(aluno.id);
    expect(body.data.nivel).toBe("Doutorado");
    expect(body.data.status).toBe("Concluída");
    expect(body.data.titulo).toBe("Título atualizado");
    expect(body.data.ano_inicio).toBe(2025);
    expect(body.data.ano_conclusao).toBe(2028);
  });

  test("retorna 400 quando o id é inválido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/orientacoes/abc`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "Concluída",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.campo).toBe("id");
  });

  test("retorna 404 quando a orientação não existe", async () => {
    const response = await fetch(`${baseUrl}/api/v1/orientacoes/999999`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "Concluída",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("ORIENTACAO_NOT_FOUND");
    expect(body.error.details.id).toBe(999999);
  });

  test("retorna 400 quando docente_id é inválido", async () => {
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

    const pessoaDocente = await Pessoa.create({
      nome_completo: `Docente ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    const docente = await Docente.create({
      pessoa_id: pessoaDocente.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });
    docenteIdCriado = docente.id;

    const pessoaAluno = await Pessoa.create({
      nome_completo: `Aluno ${randomUUID()}`,
      lattes_id: randomUUID(),
    });
    pessoaIdCriada = pessoaAluno.id;

    const aluno = await Aluno.create({
      pessoa_id: pessoaAluno.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2024,
    });
    alunoIdCriado = aluno.id;

    const orientacao = await Orientacao.create({
      docente_id: docente.id,
      aluno_id: aluno.id,
      nivel: "Mestrado",
      status: "Em andamento",
    });
    orientacaoIdCriada = orientacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/orientacoes/${orientacao.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docente_id: "abc",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.campo).toBe("docente_id");
  });

  test("retorna 404 quando o novo docente não existe", async () => {
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

    const pessoaDocente = await Pessoa.create({
      nome_completo: `Docente ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    const docente = await Docente.create({
      pessoa_id: pessoaDocente.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });
    docenteIdCriado = docente.id;

    const pessoaAluno = await Pessoa.create({
      nome_completo: `Aluno ${randomUUID()}`,
      lattes_id: randomUUID(),
    });
    pessoaIdCriada = pessoaAluno.id;

    const aluno = await Aluno.create({
      pessoa_id: pessoaAluno.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2024,
    });
    alunoIdCriado = aluno.id;

    const orientacao = await Orientacao.create({
      docente_id: docente.id,
      aluno_id: aluno.id,
      nivel: "Mestrado",
      status: "Em andamento",
    });
    orientacaoIdCriada = orientacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/orientacoes/${orientacao.id}`,
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
    expect(body.error.details.id).toBe(999999);
  });

  test("retorna 400 quando aluno_id é inválido", async () => {
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

    const pessoaDocente = await Pessoa.create({
      nome_completo: `Docente ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    const docente = await Docente.create({
      pessoa_id: pessoaDocente.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });
    docenteIdCriado = docente.id;

    const pessoaAluno = await Pessoa.create({
      nome_completo: `Aluno ${randomUUID()}`,
      lattes_id: randomUUID(),
    });
    pessoaIdCriada = pessoaAluno.id;

    const aluno = await Aluno.create({
      pessoa_id: pessoaAluno.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2024,
    });
    alunoIdCriado = aluno.id;

    const orientacao = await Orientacao.create({
      docente_id: docente.id,
      aluno_id: aluno.id,
      nivel: "Mestrado",
      status: "Em andamento",
    });
    orientacaoIdCriada = orientacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/orientacoes/${orientacao.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aluno_id: "abc",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.campo).toBe("aluno_id");
  });

  test("retorna 404 quando o novo aluno não existe", async () => {
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

    const pessoaDocente = await Pessoa.create({
      nome_completo: `Docente ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    const docente = await Docente.create({
      pessoa_id: pessoaDocente.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });
    docenteIdCriado = docente.id;

    const pessoaAluno = await Pessoa.create({
      nome_completo: `Aluno ${randomUUID()}`,
      lattes_id: randomUUID(),
    });
    pessoaIdCriada = pessoaAluno.id;

    const aluno = await Aluno.create({
      pessoa_id: pessoaAluno.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2024,
    });
    alunoIdCriado = aluno.id;

    const orientacao = await Orientacao.create({
      docente_id: docente.id,
      aluno_id: aluno.id,
      nivel: "Mestrado",
      status: "Em andamento",
    });
    orientacaoIdCriada = orientacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/orientacoes/${orientacao.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aluno_id: 999999,
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe("ALUNO_NOT_FOUND");
    expect(body.error.details.id).toBe(999999);
  });

  test("retorna 400 quando status é vazio", async () => {
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

    const pessoaDocente = await Pessoa.create({
      nome_completo: `Docente ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    const docente = await Docente.create({
      pessoa_id: pessoaDocente.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });
    docenteIdCriado = docente.id;

    const pessoaAluno = await Pessoa.create({
      nome_completo: `Aluno ${randomUUID()}`,
      lattes_id: randomUUID(),
    });
    pessoaIdCriada = pessoaAluno.id;

    const aluno = await Aluno.create({
      pessoa_id: pessoaAluno.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2024,
    });
    alunoIdCriado = aluno.id;

    const orientacao = await Orientacao.create({
      docente_id: docente.id,
      aluno_id: aluno.id,
      nivel: "Mestrado",
      status: "Em andamento",
    });
    orientacaoIdCriada = orientacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/orientacoes/${orientacao.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.campo).toBe("status");
  });

  test("retorna 400 quando nenhum campo é informado", async () => {
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

    const pessoaDocente = await Pessoa.create({
      nome_completo: `Docente ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    const docente = await Docente.create({
      pessoa_id: pessoaDocente.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });
    docenteIdCriado = docente.id;

    const pessoaAluno = await Pessoa.create({
      nome_completo: `Aluno ${randomUUID()}`,
      lattes_id: randomUUID(),
    });
    pessoaIdCriada = pessoaAluno.id;

    const aluno = await Aluno.create({
      pessoa_id: pessoaAluno.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2024,
    });
    alunoIdCriado = aluno.id;

    const orientacao = await Orientacao.create({
      docente_id: docente.id,
      aluno_id: aluno.id,
      nivel: "Mestrado",
      status: "Em andamento",
    });
    orientacaoIdCriada = orientacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/orientacoes/${orientacao.id}`,
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
});

describe("DELETE /api/v1/orientacoes/:id", () => {
  test("exclui uma orientação", async () => {
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

    const pessoaDocente = await Pessoa.create({
      nome_completo: `Docente ${randomUUID()}`,
      lattes_id: randomUUID(),
    });

    const docente = await Docente.create({
      pessoa_id: pessoaDocente.id,
      programa_id: programa.id,
      categoria: "Permanente",
      ativo: 1,
    });
    docenteIdCriado = docente.id;

    const pessoaAluno = await Pessoa.create({
      nome_completo: `Aluno ${randomUUID()}`,
      lattes_id: randomUUID(),
    });
    pessoaIdCriada = pessoaAluno.id;

    const aluno = await Aluno.create({
      pessoa_id: pessoaAluno.id,
      programa_id: programa.id,
      nivel: "Mestrado",
      situacao: "Ativo",
      ano_ingresso: 2024,
    });
    alunoIdCriado = aluno.id;

    const orientacao = await Orientacao.create({
      docente_id: docente.id,
      aluno_id: aluno.id,
      nivel: "Mestrado",
      status: "Em andamento",
      titulo: "Título antigo",
      ano_inicio: 2024,
      ano_conclusao: 2026,
    });
    orientacaoIdCriada = orientacao.id;

    const response = await fetch(
      `${baseUrl}/api/v1/orientacoes/${orientacao.id}`,
      {
        method: "DELETE",
      },
    );

    expect(response.status).toBe(204);

    const orientacaoExcluida = await Orientacao.findByPk(orientacao.id);

    expect(orientacaoExcluida).toBeNull();

    orientacaoIdCriada = null;
  });

  test("deve retornar 404 ao tentar excluir uma orientação inexistente", async () => {
    const response = await fetch(`${baseUrl}/api/v1/orientacoes/999999`, {
      method: "DELETE",
    });

    expect(response.status).toBe(404);

    const body = await response.json();

    expect(body.error.code).toBe("ORIENTACAO_NOT_FOUND");
    expect(body.error.details.id).toBe(999999);
  });

  test("deve retornar 400 ao tentar excluir com id inválido", async () => {
    const response = await fetch(`${baseUrl}/api/v1/orientacoes/abc`, {
      method: "DELETE",
    });

    expect(response.status).toBe(400);

    const body = await response.json();

    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.campo).toBe("id");
  });
});
