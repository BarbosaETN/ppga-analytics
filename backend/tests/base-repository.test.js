'use strict';

import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';

import { Pessoa, sequelize } from '../src/database/index.js';
import BaseRepository from '../src/repositories/BaseRepository.js';

beforeAll(async () => {
    await sequelize.authenticate();
});

afterAll(async () => {
    await sequelize.close();
});

describe('BaseRepository', () => {
    test('executa operações CRUD', async () => {
        const repository = new BaseRepository(Pessoa);
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

            expect(pessoa.id).toBeDefined();

            const encontrada = await repository.findById(
                pessoa.id,
                { transaction }
            );

            expect(encontrada.nome_completo).toBe('Pessoa de teste');

            const pessoas = await repository.findAll({
                where: {
                    identificador_lattes: identificadorLattes
                },
                transaction
            });

            expect(pessoas).toHaveLength(1);

            const registrosAtualizados = await repository.update(
                {
                    nome_normalizado: 'pessoa de teste'
                },
                {
                    where: { id: pessoa.id },
                    transaction
                }
            );

            expect(registrosAtualizados).toBe(1);

            const registrosRemovidos = await repository.delete({
                where: { id: pessoa.id },
                transaction
            });

            expect(registrosRemovidos).toBe(1);

            const removida = await repository.findById(
                pessoa.id,
                { transaction }
            );

            expect(removida).toBeNull();
        } finally {
            await transaction.rollback();
        }
    });
});