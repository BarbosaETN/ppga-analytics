'use strict';

import { QueryTypes } from 'sequelize';
import sequelize from './connection.js';

try {
    const tables = await sequelize.query(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
        AND name != 'SequelizeMeta'
        ORDER BY name;
    `, {
        type: QueryTypes.SELECT
    });

    for (const table of tables) {
        const tableName = table.name;

        const columns = await sequelize.query(
            `PRAGMA table_info('${tableName}');`,
            {
                type: QueryTypes.SELECT
            }
        );

        const foreignKeys = await sequelize.query(
            `PRAGMA foreign_key_list('${tableName}');`,
            {
                type: QueryTypes.SELECT
            }
        );

        const indexes = await sequelize.query(
            `PRAGMA index_list('${tableName}');`,
            {
                type: QueryTypes.SELECT
            }
        );

        console.log(`\n========== ${tableName} ==========`);

        console.log(
            'Colunas:',
            columns.map(column => column.name).join(', ')
        );

        console.log(
            'FKs:',
            foreignKeys.length
                ? foreignKeys.map(
                    fk => `${fk.from} -> ${fk.table}(${fk.to})`
                ).join(' | ')
                : 'Nenhuma'
        );

        console.log(
            'Índices:',
            indexes.length
                ? indexes.map(index => index.name).join(', ')
                : 'Nenhum'
        );
    }

} catch (error) {
    console.error('Erro ao verificar schema:', error);
} finally {
    await sequelize.close();
}