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

import Programa from '../src/database/models/programa.js';

import app from '../src/app.js';
import {
    Instituicao,
    sequelize
} from '../src/database/index.js';

let server;
let baseUrl;
let instituicaoIdCriada;

beforeAll(async () => {
    await new Promise(resolve => {
        server = app.listen(0, '127.0.0.1', resolve);
    });

    const { port } = server.address();

    baseUrl = `http://127.0.0.1:${port}`;
});

afterEach(async () => {
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

describe('POST /api/v1/instituicoes', () => {
    test('retorna erro de validação para instituição sem nome', async () => {
        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
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

    test('cria uma instituição válida no banco', async () => {
        const sigla = `INST-${randomUUID().slice(0, 8)}`;

        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: 'Instituição de Teste',
                    sigla
                })
            }
        );

        const body = await response.json();

        instituicaoIdCriada = body.data.id;

        expect(response.status).toBe(201);

        expect(body.data).toMatchObject({
            id: expect.any(Number),
            nome: 'Instituição de Teste',
            sigla
        });

        const instituicaoNoBanco =
            await Instituicao.findByPk(
                instituicaoIdCriada
            );

        expect(instituicaoNoBanco).not.toBeNull();

        expect(instituicaoNoBanco.nome).toBe(
            'Instituição de Teste'
        );
    });

    test('cria uma instituição sem sigla', async () => {
        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: 'Instituição sem sigla'
                })
            }
        );

        const body = await response.json();

        instituicaoIdCriada = body.data.id;

        expect(response.status).toBe(201);

        expect(body.data).toMatchObject({
            id: expect.any(Number),
            nome: 'Instituição sem sigla'
        });

        expect(body.data.sigla).toBeNull();
    });

    test('retorna erro de validação para nome contendo apenas espaços', async () => {
        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
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

describe('GET /api/v1/instituicoes', () => {
    test('retorna todas as instituições', async () => {
        const instituicao1 =
            await Instituicao.create({
                nome: 'Instituição GET 1'
            });

        const instituicao2 =
            await Instituicao.create({
                nome: 'Instituição GET 2'
            });

        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes`
        );

        const body = await response.json();

        expect(response.status).toBe(200);

        expect(body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: instituicao1.id,
                    nome: 'Instituição GET 1'
                }),
                expect.objectContaining({
                    id: instituicao2.id,
                    nome: 'Instituição GET 2'
                })
            ])
        );

        await Instituicao.destroy({
            where: {
                id: [
                    instituicao1.id,
                    instituicao2.id
                ]
            }
        });
    });
});

describe('GET /api/v1/instituicoes/:id', () => {
    test('retorna uma instituição pelo id', async () => {
        const instituicao =
            await Instituicao.create({
                nome: 'Instituição para consulta',
                sigla: 'INST'
            });

        instituicaoIdCriada = instituicao.id;

        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes/${instituicao.id}`
        );

        const body = await response.json();

        expect(response.status).toBe(200);

        expect(body.data).toMatchObject({
            id: instituicao.id,
            nome: 'Instituição para consulta',
            sigla: 'INST'
        });
    });

    test('retorna 404 quando a instituição não existe', async () => {
        const instituicaoInexistenteId = 999999999;

        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes/${instituicaoInexistenteId}`
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

    test('retorna 400 quando o id da instituição é inválido', async () => {
        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes/abc`
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
});

describe('PATCH /api/v1/instituicoes/:id', () => {
    test('atualiza uma instituição pelo id', async () => {
        const instituicao =
            await Instituicao.create({
                nome: 'Instituição antes da atualização',
                sigla: 'ANTES'
            });

        instituicaoIdCriada = instituicao.id;

        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes/${instituicao.id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: 'Instituição depois da atualização',
                    sigla: 'DEPOIS'
                })
            }
        );

        const body = await response.json();

        expect(response.status).toBe(200);

        expect(body.data).toMatchObject({
            id: instituicao.id,
            nome: 'Instituição depois da atualização',
            sigla: 'DEPOIS'
        });
    });

    test('retorna 404 ao tentar atualizar uma instituição que não existe', async () => {
        const instituicaoInexistenteId = 999999999;

        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes/${instituicaoInexistenteId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: 'Instituição inexistente'
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

    test('retorna 400 quando o id da instituição é inválido', async () => {
        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes/abc`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: 'Instituição inválida'
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
        const instituicao =
            await Instituicao.create({
                nome: 'Instituição sem alteração'
            });

        instituicaoIdCriada = instituicao.id;

        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes/${instituicao.id}`,
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

        expect(body).toEqual({
            error: {
                code: 'VALIDATION_ERROR',
                message:
                    'Nenhum campo válido para atualização foi informado.',
                details: {
                    campos_permitidos: [
                        'nome',
                        'sigla'
                    ]
                }
            }
        });
    });

    test('retorna 400 ao atualizar nome apenas com espaços', async () => {
        const instituicao =
            await Instituicao.create({
                nome: 'Instituição original'
            });

        instituicaoIdCriada = instituicao.id;

        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes/${instituicao.id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
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

describe('DELETE /api/v1/instituicoes/:id', () => {
    test('exclui uma instituição pelo id', async () => {
        const instituicao =
            await Instituicao.create({
                nome: 'Instituição para exclusão',
                sigla: 'DELETE'
            });

        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes/${instituicao.id}`,
            {
                method: 'DELETE'
            }
        );

        expect(response.status).toBe(204);

        const instituicaoExcluida =
            await Instituicao.findByPk(
                instituicao.id
            );

        expect(instituicaoExcluida).toBeNull();
    });

    test('retorna 404 ao tentar excluir uma instituição que não existe', async () => {
        const instituicaoInexistenteId = 999999999;

        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes/${instituicaoInexistenteId}`,
            {
                method: 'DELETE'
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

    test('retorna 400 quando o id da instituição é inválido ao excluir', async () => {
        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes/abc`,
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

    test('retorna erro ao tentar excluir uma instituição que possui programas relacionados', async () => {
        const instituicao =
            await Instituicao.create({
                nome: 'Instituição com programa',
                sigla: `INST-${randomUUID().slice(0, 8)}`
            });

        instituicaoIdCriada = instituicao.id;

        const programa =
            await Programa.create({
                instituicao_id: instituicao.id,
                nome: 'Programa relacionado',
                sigla: `PROG-${randomUUID().slice(0, 8)}`
            });

        const response = await fetch(
            `${baseUrl}/api/v1/instituicoes/${instituicao.id}`,
            {
                method: 'DELETE'
            }
        );

        const body = await response.json();

        expect(response.status).toBe(409);

        expect(body).toEqual({
            error: {
                code: 'INSTITUICAO_HAS_DEPENDENCIES',
                message:
                    'Não é possível excluir a instituição porque existem registros relacionados.',
                details: {
                    id: instituicao.id
                }
            }
        });

        await Programa.destroy({
            where: {
                id: programa.id
            }
        });
    });
});
