import sequelize from './connection.js';

try {
    const [rows] = await sequelize.query(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
        ORDER BY name;
    `);

    console.table(rows);

} catch (error) {
    console.error(error);
} finally {
    await sequelize.close();
}