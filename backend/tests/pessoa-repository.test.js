'use strict';

import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';

import { sequelize } from '../src/database/index.js';
import PessoaRepository from '../src/repositories/PessoaRepository.js';

beforeAll(async () => {
    await sequelize.authenticate();
});

afterAll(async () => {
    await sequelize.close();
});

describe('PessoaRepository', () => {
    test('encontra uma pessoa pelo identificador Lattes', async () => {
        const repository = new PessoaRepository();
        const transaction = await sequelize.transaction();
        const identificadorLattes = `teste-${randomUUID()}`;

        try {
            const pessoa = await repository.create(
                {
                    nome_completo: 'Pessoa de teste',
                    identificador_lattes: identificadorLattes
                },
                { transaction }
            );

            const encontrada = await repository.findByLattes(
                identificadorLattes,
                { transaction }
            );

            expect(encontrada).not.toBeNull();
            expect(encontrada.id).toBe(pessoa.id);
            expect(encontrada.nome_completo).toBe('Pessoa de teste');
        } finally {
            await transaction.rollback();
        }
    });

    test('retorna null quando o Lattes não existe', async () => {
        const repository = new PessoaRepository();

        const pessoa = await repository.findByLattes(
            `inexistente-${randomUUID()}`
        );

        expect(pessoa).toBeNull();
    });
});