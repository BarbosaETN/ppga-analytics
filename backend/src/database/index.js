import sequelize from "./connection.js";

export { sequelize };
export {
    default as models,
    Pessoa,
    Instituicao,
    Programa,
    Periodo,
    ParserVersao,
    Usuario,
    Docente,
    Aluno,
    Importacao,
    Processamento,
    Formacao,
    Producao,
    Autoria,
    RelacaoDocenteAluno,
    Orientacao,
    AtividadeEnsino,
    ProjetoPesquisa,
    ParticipacaoProjetoPesquisa,
    ProjetoExtensao,
    ParticipacaoProjetoExtensao,
    Criterio,
    Classificacao,
    Indicador,
    ResultadoIndicador,
    OrigemDado,
    Auditoria
} from './models/index.js';
