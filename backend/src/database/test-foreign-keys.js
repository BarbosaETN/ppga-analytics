import sequelize from "./connection.js";

try {
    const result = await sequelize.query("PRAGMA foreign_keys;");

    console.log("Resultado:", result);

} catch (error) {
    console.error("Erro ao verificar foreign keys:", error);
} finally {
    await sequelize.close();
}