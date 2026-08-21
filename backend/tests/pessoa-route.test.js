'use strict';

import { randomUUID } from 'node:crypto';
import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    test
} from '@jest/globals';

import app from '../src/app.js';
import { Pessoa, sequelize } from '../src/database/index.js';

let server;
let baseUrl;
let pessoaIdCriada;

beforeAll(async () => {
    await new Promise(resolve => {
        server = app.listen(0, '127.0.0.1', resolve);
    });

    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
});

afterEach(async () => {
    if (pessoaIdCriada) {
        await Pessoa.destroy({
            where: {
                id: pessoaIdCriada
            }
        });

        pessoaIdCriada = null;
    }
});

afterAll(async () => {
    await new Promise((resolve, reject) => {
        server.close(error => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });

    await sequelize.close();
});

describe('POST /api/v1/pessoas', () => {
    test('retorna erro de validação para pessoa sem nome completo', async () => {
        const response = await fetch(`${baseUrl}/api/v1/pessoas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body).toEqual({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'nome_completo é obrigatório.',
                details: {
                    campo: 'nome_completo'
                }
            }
        });
    });

    test('cria uma pessoa válida no banco', async () => {
        const identificadorLattes = `teste-api-${randomUUID()}`;

        const response = await fetch(`${baseUrl}/api/v1/pessoas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome_completo: 'Maria da Silva',
                identificador_lattes: identificadorLattes,
                nome_normalizado: 'maria da silva'
            })
        });

        const body = await response.json();
        pessoaIdCriada = body.data.id;

        expect(response.status).toBe(201);
        expect(body.meta).toEqual({
            criada: true
        });
        expect(body.data).toMatchObject({
            id: expect.any(Number),
            nome_completo: 'Maria da Silva',
            identificador_lattes: identificadorLattes,
            nome_normalizado: 'maria da silva'
        });

        const pessoaNoBanco = await Pessoa.findByPk(pessoaIdCriada);

        expect(pessoaNoBanco).not.toBeNull();
        expect(pessoaNoBanco.nome_completo).toBe('Maria da Silva');
    });

    test('reutiliza uma pessoa quando o identificador Lattes já existe', async () => {
        const identificadorLattes = `teste-api-${randomUUID()}`;

        const dadosPessoa = {
            nome_completo: 'João da Silva',
            identificador_lattes: identificadorLattes,
            nome_normalizado: 'joao da silva'
        };

        const primeiraResposta = await fetch(`${baseUrl}/api/v1/pessoas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosPessoa)
        });

        const primeiroBody = await primeiraResposta.json();
        pessoaIdCriada = primeiroBody.data.id;

        const segundaResposta = await fetch(`${baseUrl}/api/v1/pessoas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosPessoa)
        });

        const segundoBody = await segundaResposta.json();

        expect(primeiraResposta.status).toBe(201);
        expect(primeiroBody.meta).toEqual({
            criada: true
        });

        expect(segundaResposta.status).toBe(200);
        expect(segundoBody.meta).toEqual({
            criada: false
        });
        expect(segundoBody.data.id).toBe(primeiroBody.data.id);

        const quantidadeDePessoas = await Pessoa.count({
            where: {
                identificador_lattes: identificadorLattes
            }
        });

        expect(quantidadeDePessoas).toBe(1);
    });
});