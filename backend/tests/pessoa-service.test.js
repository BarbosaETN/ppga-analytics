'use strict';

import { describe, expect, jest, test } from '@jest/globals';

import PessoaService from '../src/services/PessoaService.js';

describe('PessoaService', () => {
    test('reutiliza uma pessoa já existente pelo Lattes', async () => {
        const pessoaExistente = {
            id: 1,
            nome_completo: 'Maria Silva',
            identificador_lattes: '123456789'
        };

        const pessoaRepository = {
            findByLattes: jest.fn().mockResolvedValue(pessoaExistente),
            create: jest.fn()
        };

        const service = new PessoaService(pessoaRepository);

        const resultado = await service.encontrarOuCriar({
            nome_completo: 'Maria Silva',
            identificador_lattes: '123456789'
        });

        expect(resultado).toEqual({
            pessoa: pessoaExistente,
            criada: false
        });

        expect(pessoaRepository.findByLattes).toHaveBeenCalledWith(
            '123456789',
            {}
        );

        expect(pessoaRepository.create).not.toHaveBeenCalled();
    });

    test('cria uma pessoa quando o Lattes ainda não existe', async () => {
        const pessoaCriada = {
            id: 2,
            nome_completo: 'João Souza',
            identificador_lattes: '987654321',
            nome_normalizado: 'joao souza'
        };

        const pessoaRepository = {
            findByLattes: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(pessoaCriada)
        };

        const service = new PessoaService(pessoaRepository);

        const resultado = await service.encontrarOuCriar({
            nome_completo: 'João Souza',
            identificador_lattes: '987654321',
            nome_normalizado: 'joao souza'
        });

        expect(resultado).toEqual({
            pessoa: pessoaCriada,
            criada: true
        });

        expect(pessoaRepository.create).toHaveBeenCalledWith(
            {
                nome_completo: 'João Souza',
                identificador_lattes: '987654321',
                nome_normalizado: 'joao souza'
            },
            {}
        );
    });

    test('rejeita dados sem nome completo', async () => {
        const pessoaRepository = {
            findByLattes: jest.fn(),
            create: jest.fn()
        };

        const service = new PessoaService(pessoaRepository);

        await expect(
            service.encontrarOuCriar({
                identificador_lattes: '123456789'
            })
        ).rejects.toThrow('nome_completo é obrigatório.');

        expect(pessoaRepository.findByLattes).not.toHaveBeenCalled();
        expect(pessoaRepository.create).not.toHaveBeenCalled();
    });
});