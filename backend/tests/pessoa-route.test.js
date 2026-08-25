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
import Instituicao from '../../backend/src/database/models/instituicao.js';
import Programa from '../../backend/src/database/models/programa.js';
import Docente from '../../backend/src/database/models/docente.js';

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

describe('GET /api/v1/pessoas/:id', () => {
    test('retorna uma pessoa pelo id', async () => {
        const pessoa = await Pessoa.create({
            nome_completo: 'Pessoa para consulta',
            identificador_lattes: `teste-api-${randomUUID()}`
        });

        pessoaIdCriada = pessoa.id;

        const response = await fetch(
            `${baseUrl}/api/v1/pessoas/${pessoa.id}`
        );

        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.data).toMatchObject({
            id: pessoa.id,
            nome_completo: 'Pessoa para consulta'
        });
    });

    test('retorna 404 quando a pessoa não existe', async () => {
        const pessoaInexistenteId = 999999999;

        const response = await fetch(
            `${baseUrl}/api/v1/pessoas/${pessoaInexistenteId}`
        );

        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body).toEqual({
            error: {
            code: 'PESSOA_NOT_FOUND',
                message: 'Pessoa não encontrada.',
                details: {
                    id: pessoaInexistenteId
                }
            }
        });
    });
});

describe('GET /api/v1/pessoas', () => {
    test('retorna todas as pessoas', async () => {
        await Pessoa.create({
            nome_completo: 'Pessoa 1',
            identificador_lattes: `teste-api-${randomUUID()}`
        });

        await Pessoa.create({
            nome_completo: 'Pessoa 2',
            identificador_lattes: `teste-api-${randomUUID()}`
        });

        const response = await fetch(
            `${baseUrl}/api/v1/pessoas`
        );

        const body = await response.json();

        expect(response.status).toBe(200);

        expect(body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    nome_completo: 'Pessoa 1'
                }),
                expect.objectContaining({
                    nome_completo: 'Pessoa 2'
                })
            ])
        );
    });
});

describe('PATCH /api/v1/pessoas/:id', () => {
    test('atualiza uma pessoa pelo id', async () => {
        const pessoa = await Pessoa.create({
            nome_completo: 'Pessoa antes da atualização',
            identificador_lattes: `teste-api-${randomUUID()}`
        });

        pessoaIdCriada = pessoa.id;

        const response = await fetch(
            `${baseUrl}/api/v1/pessoas/${pessoa.id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome_completo: 'Pessoa depois da atualização'
                })
            }
        );

        const body = await response.json();

        expect(response.status).toBe(200);

        expect(body.data).toMatchObject({
            id: pessoa.id,
            nome_completo: 'Pessoa depois da atualização'
        });
    });

    test('retorna 404 ao tentar atualizar uma pessoa que não existe', async () => {
        const pessoaInexistenteId = 999999999;

        const response = await fetch(
            `${baseUrl}/api/v1/pessoas/${pessoaInexistenteId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome_completo: 'Pessoa inexistente'
                })
            }
        );

        const body = await response.json();

        expect(response.status).toBe(404);

        expect(body).toEqual({
            error: {
                code: 'PESSOA_NOT_FOUND',
                message: 'Pessoa não encontrada.',
                details: {
                    id: pessoaInexistenteId
                }
            }
        });
    });

    test('retorna 400 quando o id da pessoa é inválido', async () => {
        const response = await fetch(
            `${baseUrl}/api/v1/pessoas/abc`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome_completo: 'Pessoa inválida'
                })
            }
        );

        const body = await response.json();

        expect(response.status).toBe(400);

        expect(body).toEqual({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'id deve ser um número inteiro positivo.',
                details: {
                    campo: 'id'
                }
            }
        });
    });

    test('retorna 400 quando nenhum campo válido é informado', async () => {
        const pessoa = await Pessoa.create({
            nome_completo: 'Pessoa sem alteração',
            identificador_lattes: `teste-api-${randomUUID()}`
        });

        pessoaIdCriada = pessoa.id;

        const response = await fetch(
            `${baseUrl}/api/v1/pessoas/${pessoa.id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            }
        );

        const body = await response.json();

        expect(response.status).toBe(400);

        expect(body.error.code).toBe('VALIDATION_ERROR');
    });

    test('retorna 409 quando o identificador Lattes já pertence a outra pessoa', async () => {
        const identificadorLattes = `teste-api-${randomUUID()}`;

        const pessoa1 = await Pessoa.create({
            nome_completo: 'Pessoa 1',
            identificador_lattes: identificadorLattes
        });

        const pessoa2 = await Pessoa.create({
            nome_completo: 'Pessoa 2',
            identificador_lattes: `teste-api-${randomUUID()}`
        });

        pessoaIdCriada = pessoa2.id;

        const response = await fetch(
            `${baseUrl}/api/v1/pessoas/${pessoa2.id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    identificador_lattes: identificadorLattes
                })
            }
        );

        const body = await response.json();

        expect(response.status).toBe(409);

        expect(body).toEqual({
            error: {
                code: 'LATTES_ALREADY_EXISTS',
                message:
                    'Identificador Lattes já está vinculado a outra pessoa.',
                details: {
                    identificador_lattes: identificadorLattes
                }
            }
        });

        await Pessoa.destroy({
            where: {
                id: pessoa1.id
            }
        });
    });
});

describe('DELETE /api/v1/pessoas/:id', () => {
    test('exclui uma pessoa pelo id', async () => {
        const pessoa = await Pessoa.create({
            nome_completo: 'Pessoa para exclusão',
            identificador_lattes: `teste-api-${randomUUID()}`
        });

        const response = await fetch(
            `${baseUrl}/api/v1/pessoas/${pessoa.id}`,
            {
                method: 'DELETE'
            }
        );

        expect(response.status).toBe(204);

        const pessoaExcluida = await Pessoa.findByPk(
            pessoa.id
        );

        expect(pessoaExcluida).toBeNull();
    });

    test('retorna 404 ao tentar excluir uma pessoa que não existe', async () => {
        const pessoaInexistenteId = 999999999;

        const response = await fetch(
            `${baseUrl}/api/v1/pessoas/${pessoaInexistenteId}`,
            {
                method: 'DELETE'
            }
        );

        const body = await response.json();

        expect(response.status).toBe(404);

        expect(body).toEqual({
            error: {
                code: 'PESSOA_NOT_FOUND',
                message: 'Pessoa não encontrada.',
                details: {
                    id: pessoaInexistenteId
                }
            }
        });
    });

    test('retorna 400 quando o id da pessoa é inválido ao excluir', async () => {
        const response = await fetch(
            `${baseUrl}/api/v1/pessoas/abc`,
            {
                method: 'DELETE'
            }
        );

        const body = await response.json();

        expect(response.status).toBe(400);

        expect(body).toEqual({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'id deve ser um número inteiro positivo.',
                details: {
                    campo: 'id'
                }
            }
        });
    });

    test('retorna erro ao tentar excluir uma pessoa que possui um docente relacionado', async () => {
        const instituicao = await Instituicao.create({
            nome: 'Instituição para teste',
            sigla: `TESTE-${randomUUID().slice(0, 8)}`
        });

        const programa = await Programa.create({
            instituicao_id: instituicao.id,
            nome: 'Programa para teste',
            sigla: `PROG-${randomUUID().slice(0, 8)}`
        });

        const pessoa = await Pessoa.create({
            nome_completo: 'Pessoa com docente',
            identificador_lattes: `teste-api-${randomUUID()}`
        });

        await Docente.create({
            pessoa_id: pessoa.id,
            programa_id: programa.id
        });

        const response = await fetch(
            `${baseUrl}/api/v1/pessoas/${pessoa.id}`,
            {
                method: 'DELETE'
            }
        );

        const body = await response.json();

        expect(response.status).toBe(409);

        expect(body.error.code).toBe('PESSOA_HAS_DEPENDENCIES');
        expect(body.error.message).toBe(
            'Não é possível excluir a pessoa porque existem registros relacionados.'
        );
    });
});