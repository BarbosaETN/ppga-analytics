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
  ParticipacaoProjetoPesquisa,
  ProjetoPesquisa,
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
    await ParticipacaoProjetoPesquisa.destroy({
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
    await ProjetoPesquisa.destroy({
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