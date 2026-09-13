'use strict';

import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    test
} from '@jest/globals';

import { randomUUID } from 'node:crypto';

import app from '../src/app.js';
import {
    Instituicao,
    Programa,
    sequelize
} from '../src/database/index.js';

let server;
let baseUrl;
let programaIdCriado;
let instituicaoIdCriada;

beforeAll(async () => {
    await new Promise(resolve => {
        server = app.listen(
            0,
            '127.0.0.1',
            resolve
        );
    });

    const { port } = server.address();

    baseUrl = `http://127.0.0.1:${port}`;
});

afterEach(async () => {
    if (programaIdCriado) {
        await Programa.destroy({
            where: {
                id: programaIdCriado
            }
        });

        programaIdCriado = null;
    }

    if (instituicaoIdCriada) {
        await Instituicao.destroy({
            where: {
                id: instituicaoIdCriada
            }
        });

        instituicaoIdCriada = null;
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

describe('POST /api/v1/programas', () => {
    test('retorna erro de validação para programa sem nome', async () => {
        const instituicao =
            await Instituicao.create({
                nome: 'Instituição para teste',
                sigla: `INST-${randomUUID().slice(0, 8)}`
            });

        instituicaoIdCriada = instituicao.id;

        const response = await fetch(
            `${baseUrl}/api/v1/programas`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    instituicao_id: instituicao.id
                })
            }
        );

        const body = await response.json();

        expect(response.status).toBe(400);

        expect(body).toEqual({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'nome é obrigatório.',
                details: {
                    campo: 'nome'
                }
            }
        });
    });

    test('retorna 400 quando instituicao_id é inválido', async () => {
        const response = await fetch(
            `${baseUrl}/api/v1/programas`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    instituicao_id: 'abc',
                    nome: 'Programa inválido'
                })
            }
        );

        const body = await response.json();

        expect(response.status).toBe(400);

        expect(body).toEqual({
            error: {
                code: 'VALIDATION_ERROR',
                message:
                    'instituicao_id deve ser um número inteiro positivo.',
                details: {
                    campo: 'instituicao_id'
                }
            }
        });
    });

    test('retorna 404 quando a instituição não existe', async () => {
        const instituicaoInexistenteId =
            999999999;

        const response = await fetch(
            `${baseUrl}/api/v1/programas`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    instituicao_id:
                        instituicaoInexistenteId,
                    nome: 'Programa sem instituição'
                })
            }
        );

        const body = await response.json();

        expect(response.status).toBe(404);

        expect(body).toEqual({
            error: {
                code: 'INSTITUICAO_NOT_FOUND',
                message: 'Instituição não encontrada.',
                details: {
                    id: instituicaoInexistenteId
                }
            }
        });
    });

    test('cria um programa válido no banco', async () => {
        const instituicao =
            await Instituicao.create({
                nome: 'Instituição do Programa',
                sigla: `INST-${randomUUID().slice(0, 8)}`
            });

        instituicaoIdCriada = instituicao.id;

        const sigla =
            `PROG-${randomUUID().slice(0, 8)}`;

        const response = await fetch(
            `${baseUrl}/api/v1/programas`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    instituicao_id: instituicao.id,
                    nome: 'Programa de Teste',
                    sigla
                })
            }
        );

        const body = await response.json();

        programaIdCriado = body.data.id;

        expect(response.status).toBe(201);

        expect(body.data).toMatchObject({
            id: expect.any(Number),
            instituicao_id: instituicao.id,
            nome: 'Programa de Teste',
            sigla
        });

        const programaNoBanco =
            await Programa.findByPk(
                programaIdCriado
            );

        expect(programaNoBanco).not.toBeNull();

        expect(
            programaNoBanco.instituicao_id
        ).toBe(instituicao.id);
    });

    test('cria um programa sem sigla', async () => {
        const instituicao =
            await Instituicao.create({
                nome: 'Instituição sem sigla',
                sigla: `INST-${randomUUID().slice(0, 8)}`
            });

        instituicaoIdCriada = instituicao.id;

        const response = await fetch(
            `${baseUrl}/api/v1/programas`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            ,
                body: JSON.stringify({
                    instituicao_id: instituicao.id,
                    nome: 'Programa sem sigla'
                })
            }
        );

        const body = await response.json();

        programaIdCriado = body.data.id;

        expect(response.status).toBe(201);

        expect(body.data).toMatchObject({
            id: expect.any(Number),
            instituicao_id: instituicao.id,
            nome: 'Programa sem sigla',
            sigla: null
        });
    });

    test('retorna erro de validação para nome contendo apenas espaços', async () => {
        const instituicao =
            await Instituicao.create({
                nome: 'Instituição para espaços',
                sigla: `INST-${randomUUID().slice(0, 8)}`
            });

        instituicaoIdCriada = instituicao.id;

        const response = await fetch(
            `${baseUrl}/api/v1/programas`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    instituicao_id: instituicao.id,
                    nome: '     '
                })
            }
        );

        const body = await response.json();

        expect(response.status).toBe(400);

        expect(body).toEqual({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'nome é obrigatório.',
                details: {
                    campo: 'nome'
                }
            }
        });
    });
});