'use strict';

import { QueryTypes } from 'sequelize';
import sequelize from './connection.js';

try {
    console.log('========== FOREIGN KEYS ==========\n');

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
        const foreignKeys = await sequelize.query(
            `PRAGMA foreign_key_list('${table.name}');`,
            {
                type: QueryTypes.SELECT
            }
        );

        if (foreignKeys.length > 0) {
            console.log(`\n${table.name}:`);

            for (const fk of foreignKeys) {
                console.log(
                    `  ${fk.from} -> ${fk.table}(${fk.to}) | ` +
                    `ON DELETE: ${fk.on_delete} | ` +
                    `ON UPDATE: ${fk.on_update}`
                );
            }
        }
    }

    console.log('\n========== CHECKS ==========\n');

    const definitions = await sequelize.query(`
        SELECT name, sql
        FROM sqlite_master
        WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
        AND name != 'SequelizeMeta'
        ORDER BY name;
    `, {
        type: QueryTypes.SELECT
    });

    for (const table of definitions) {
        if (table.sql?.includes('CHECK')) {
            console.log(`\n${table.name}:`);
            console.log(
                table.sql
                    .match(/CHECK\s*\([^)]*\)/gi)
                    ?.join('\n')
            );
        }
    }

    console.log('\n========== FOREIGN KEY CHECK ==========\n');

    const violations = await sequelize.query(
        'PRAGMA foreign_key_check;',
        {
            type: QueryTypes.SELECT
        }
    );

    if (violations.length === 0) {
        console.log('Nenhuma violação de Foreign Key encontrada.');
    } else {
        console.table(violations);
    }

} catch (error) {
    console.error('Erro ao verificar integridade:', error);
} finally {
    await sequelize.close();
}