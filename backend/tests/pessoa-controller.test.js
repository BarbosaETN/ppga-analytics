'use strict';

import { describe, expect, jest, test } from '@jest/globals';

import PessoaController from '../src/controllers/PessoaController.js';

function criarResposta() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
}

describe('PessoaController', () => {
    test('retorna 201 quando uma pessoa é criada', async () => {
        const pessoa = {
            id: 1,
            nome_completo: 'Maria Silva'
        };

        const pessoaService = {
            encontrarOuCriar: jest.fn().mockResolvedValue({
                pessoa,
                criada: true
            })
        };

        const controller = new PessoaController(pessoaService);
        const req = {
            body: {
                nome_completo: 'Maria Silva'
            }
        };
        const res = criarResposta();
        const next = jest.fn();

        await controller.criar(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            data: pessoa,
            meta: {
                criada: true
            }
        });
    });

    test('retorna 200 quando a pessoa já existe', async () => {
        const pessoaService = {
            encontrarOuCriar: jest.fn().mockResolvedValue({
                pessoa: {
                    id: 1,
                    nome_completo: 'Maria Silva'
                },
                criada: false
            })
        };

        const controller = new PessoaController(pessoaService);
        const req = {
            body: {
                nome_completo: 'Maria Silva',
                identificador_lattes: '123456789'
            }
        };
        const res = criarResposta();
        const next = jest.fn();

        await controller.criar(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('encaminha erros ao middleware global', async () => {
        const error = new Error('Erro de teste');

        const pessoaService = {
            encontrarOuCriar: jest.fn().mockRejectedValue(error)
        };

        const controller = new PessoaController(pessoaService);
        const res = criarResposta();
        const next = jest.fn();

        await controller.criar({ body: {} }, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
    });
});