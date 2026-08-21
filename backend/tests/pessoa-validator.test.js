'use strict';

import { describe, expect, test } from '@jest/globals';

import AppError from '../src/errors/AppError.js';

import { validarDadosPessoa } from '../src/validators/pessoa.validator.js';

describe('validarDadosPessoa', () => {
    test('normaliza os campos de texto', () => {
        const dados = validarDadosPessoa({
            nome_completo: '  Maria da Silva  ',
            identificador_lattes: '  123456789  ',
            nome_normalizado: '  maria da silva  '
        });

        expect(dados).toEqual({
            nome_completo: 'Maria da Silva',
            identificador_lattes: '123456789',
            nome_normalizado: 'maria da silva'
        });
    });

    test('transforma campos opcionais vazios em null', () => {
        const dados = validarDadosPessoa({
            nome_completo: 'Maria da Silva',
            identificador_lattes: '   ',
            nome_normalizado: ''
        });

        expect(dados).toEqual({
            nome_completo: 'Maria da Silva',
            identificador_lattes: null,
            nome_normalizado: null
        });
    });

    test('rejeita pessoa sem nome completo', () => {
        try {
            validarDadosPessoa({
                identificador_lattes: '123456789'
            });
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.statusCode).toBe(400);
            expect(error.code).toBe('VALIDATION_ERROR');
            expect(error.details).toEqual({
                campo: 'nome_completo'
            });

            return;
        }

        throw new Error('Era esperado um erro de validação.');
    });
});