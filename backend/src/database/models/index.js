import Pessoa from './pessoa.js';
import Instituicao from './instituicao.js';
import Programa from './programa.js';
import Periodo from './periodo.js';
import ParserVersao from './parser-versao.js';
import Usuario from './usuario.js';
import Docente from './docente.js';
import Aluno from './aluno.js';
import Importacao from './importacao.js';
import Processamento from './processamento.js';
import Formacao from './formacao.js';
import Producao from './producao.js';
import Autoria from './autoria.js';
import RelacaoDocenteAluno from './relacao-docente-aluno.js';
import Orientacao from './orientacao.js';
import AtividadeEnsino from './atividade-ensino.js';
import ProjetoPesquisa from './projeto-pesquisa.js';
import ParticipacaoProjetoPesquisa from './participacao-projeto-pesquisa.js';
import ProjetoExtensao from './projeto-extensao.js';
import ParticipacaoProjetoExtensao from './participacao-projeto-extensao.js';
import Criterio from './criterio.js';
import Classificacao from './classificacao.js';
import Indicador from './indicador.js';
import ResultadoIndicador from './resultado-indicador.js';
import OrigemDado from './origem-dado.js';
import Auditoria from './auditoria.js';

Instituicao.hasMany(Programa, {
    foreignKey: 'instituicao_id',
    as: 'programas'
});
Programa.belongsTo(Instituicao, {
    foreignKey: 'instituicao_id',
    as: 'instituicao'
});

Pessoa.hasMany(Docente, {
    foreignKey: 'pessoa_id',
    as: 'docencias'
});
Docente.belongsTo(Pessoa, {
    foreignKey: 'pessoa_id',
    as: 'pessoa'
});
Programa.hasMany(Docente, {
    foreignKey: 'programa_id',
    as: 'docentes'
});
Docente.belongsTo(Programa, {
    foreignKey: 'programa_id',
    as: 'programa'
});

Pessoa.hasMany(Aluno, {
    foreignKey: 'pessoa_id',
    as: 'matriculas'
});
Aluno.belongsTo(Pessoa, {
    foreignKey: 'pessoa_id',
    as: 'pessoa'
});
Programa.hasMany(Aluno, {
    foreignKey: 'programa_id',
    as: 'alunos'
});
Aluno.belongsTo(Programa, {
    foreignKey: 'programa_id',
    as: 'programa'
});

Docente.hasMany(Importacao, {
    foreignKey: 'docente_id',
    as: 'importacoes'
});
Importacao.belongsTo(Docente, {
    foreignKey: 'docente_id',
    as: 'docente'
});

Importacao.hasMany(Processamento, {
    foreignKey: 'importacao_id',
    as: 'processamentos'
});
Processamento.belongsTo(Importacao, {
    foreignKey: 'importacao_id',
    as: 'importacao'
});
ParserVersao.hasMany(Processamento, {
    foreignKey: 'parser_versao_id',
    as: 'processamentos'
});
Processamento.belongsTo(ParserVersao, {
    foreignKey: 'parser_versao_id',
    as: 'parserVersao'
});

Docente.hasMany(Formacao, {
    foreignKey: 'docente_id',
    as: 'formacoes'
});
Formacao.belongsTo(Docente, {
    foreignKey: 'docente_id',
    as: 'docente'
});

Pessoa.hasMany(Autoria, {
    foreignKey: 'pessoa_id',
    as: 'autorias'
});
Autoria.belongsTo(Pessoa, {
    foreignKey: 'pessoa_id',
    as: 'pessoa'
});
Producao.hasMany(Autoria, {
    foreignKey: 'producao_id',
    as: 'autorias'
});
Autoria.belongsTo(Producao, {
    foreignKey: 'producao_id',
    as: 'producao'
});
Pessoa.belongsToMany(Producao, {
    through: Autoria,
    foreignKey: 'pessoa_id',
    otherKey: 'producao_id',
    as: 'producoes'
});
Producao.belongsToMany(Pessoa, {
    through: Autoria,
    foreignKey: 'producao_id',
    otherKey: 'pessoa_id',
    as: 'autores'
});

Docente.hasMany(RelacaoDocenteAluno, {
    foreignKey: 'docente_id',
    as: 'relacoesComAlunos'
});
RelacaoDocenteAluno.belongsTo(Docente, {
    foreignKey: 'docente_id',
    as: 'docente'
});
Aluno.hasMany(RelacaoDocenteAluno, {
    foreignKey: 'aluno_id',
    as: 'relacoesComDocentes'
});
RelacaoDocenteAluno.belongsTo(Aluno, {
    foreignKey: 'aluno_id',
    as: 'aluno'
});
Processamento.hasMany(RelacaoDocenteAluno, {
    foreignKey: 'fonte_processamento_id',
    as: 'relacoesDocenteAluno'
});
RelacaoDocenteAluno.belongsTo(Processamento, {
    foreignKey: 'fonte_processamento_id',
    as: 'processamentoOrigem'
});

Docente.hasMany(Orientacao, {
    foreignKey: 'docente_id',
    as: 'orientacoes'
});
Orientacao.belongsTo(Docente, {
    foreignKey: 'docente_id',
    as: 'docente'
});
Aluno.hasMany(Orientacao, {
    foreignKey: 'aluno_id',
    as: 'orientacoes'
});
Orientacao.belongsTo(Aluno, {
    foreignKey: 'aluno_id',
    as: 'aluno'
});
Processamento.hasMany(Orientacao, {
    foreignKey: 'processamento_id',
    as: 'orientacoes'
});
Orientacao.belongsTo(Processamento, {
    foreignKey: 'processamento_id',
    as: 'processamento'
});

Docente.hasMany(AtividadeEnsino, {
    foreignKey: 'docente_id',
    as: 'atividadesEnsino'
});
AtividadeEnsino.belongsTo(Docente, {
    foreignKey: 'docente_id',
    as: 'docente'
});
Periodo.hasMany(AtividadeEnsino, {
    foreignKey: 'periodo_id',
    as: 'atividadesEnsino'
});
AtividadeEnsino.belongsTo(Periodo, {
    foreignKey: 'periodo_id',
    as: 'periodo'
});
Processamento.hasMany(AtividadeEnsino, {
    foreignKey: 'processamento_id',
    as: 'atividadesEnsino'
});
AtividadeEnsino.belongsTo(Processamento, {
    foreignKey: 'processamento_id',
    as: 'processamento'
});

Processamento.hasMany(ProjetoPesquisa, {
    foreignKey: 'processamento_id',
    as: 'projetosPesquisa'
});
ProjetoPesquisa.belongsTo(Processamento, {
    foreignKey: 'processamento_id',
    as: 'processamento'
});
ProjetoPesquisa.hasMany(ParticipacaoProjetoPesquisa, {
    foreignKey: 'projeto_id',
    as: 'participacoes'
});
ParticipacaoProjetoPesquisa.belongsTo(ProjetoPesquisa, {
    foreignKey: 'projeto_id',
    as: 'projeto'
});
Pessoa.hasMany(ParticipacaoProjetoPesquisa, {
    foreignKey: 'pessoa_id',
    as: 'participacoesProjetosPesquisa'
});
ParticipacaoProjetoPesquisa.belongsTo(Pessoa, {
    foreignKey: 'pessoa_id',
    as: 'pessoa'
});
Pessoa.belongsToMany(ProjetoPesquisa, {
    through: ParticipacaoProjetoPesquisa,
    foreignKey: 'pessoa_id',
    otherKey: 'projeto_id',
    as: 'projetosPesquisa'
});
ProjetoPesquisa.belongsToMany(Pessoa, {
    through: ParticipacaoProjetoPesquisa,
    foreignKey: 'projeto_id',
    otherKey: 'pessoa_id',
    as: 'participantes'
});

Processamento.hasMany(ProjetoExtensao, {
    foreignKey: 'processamento_id',
    as: 'projetosExtensao'
});
ProjetoExtensao.belongsTo(Processamento, {
    foreignKey: 'processamento_id',
    as: 'processamento'
});
ProjetoExtensao.hasMany(ParticipacaoProjetoExtensao, {
    foreignKey: 'projeto_id',
    as: 'participacoes'
});
ParticipacaoProjetoExtensao.belongsTo(ProjetoExtensao, {
    foreignKey: 'projeto_id',
    as: 'projeto'
});
Pessoa.hasMany(ParticipacaoProjetoExtensao, {
    foreignKey: 'pessoa_id',
    as: 'participacoesProjetosExtensao'
});
ParticipacaoProjetoExtensao.belongsTo(Pessoa, {
    foreignKey: 'pessoa_id',
    as: 'pessoa'
});
Pessoa.belongsToMany(ProjetoExtensao, {
    through: ParticipacaoProjetoExtensao,
    foreignKey: 'pessoa_id',
    otherKey: 'projeto_id',
    as: 'projetosExtensao'
});
ProjetoExtensao.belongsToMany(Pessoa, {
    through: ParticipacaoProjetoExtensao,
    foreignKey: 'projeto_id',
    otherKey: 'pessoa_id',
    as: 'participantes'
});

Producao.hasMany(Classificacao, {
    foreignKey: 'producao_id',
    as: 'classificacoes'
});
Classificacao.belongsTo(Producao, {
    foreignKey: 'producao_id',
    as: 'producao'
});
Criterio.hasMany(Classificacao, {
    foreignKey: 'criterio_id',
    as: 'classificacoes'
});
Classificacao.belongsTo(Criterio, {
    foreignKey: 'criterio_id',
    as: 'criterio'
});

Indicador.hasMany(ResultadoIndicador, {
    foreignKey: 'indicador_id',
    as: 'resultados'
});
ResultadoIndicador.belongsTo(Indicador, {
    foreignKey: 'indicador_id',
    as: 'indicador'
});
Periodo.hasMany(ResultadoIndicador, {
    foreignKey: 'periodo_id',
    as: 'resultadosIndicadores'
});
ResultadoIndicador.belongsTo(Periodo, {
    foreignKey: 'periodo_id',
    as: 'periodo'
});
Docente.hasMany(ResultadoIndicador, {
    foreignKey: 'docente_id',
    as: 'resultadosIndicadores'
});
ResultadoIndicador.belongsTo(Docente, {
    foreignKey: 'docente_id',
    as: 'docente'
});
Aluno.hasMany(ResultadoIndicador, {
    foreignKey: 'aluno_id',
    as: 'resultadosIndicadores'
});
ResultadoIndicador.belongsTo(Aluno, {
    foreignKey: 'aluno_id',
    as: 'aluno'
});

Processamento.hasMany(OrigemDado, {
    foreignKey: 'processamento_id',
    as: 'origensDados'
});
OrigemDado.belongsTo(Processamento, {
    foreignKey: 'processamento_id',
    as: 'processamento'
});

Usuario.hasMany(Auditoria, {
    foreignKey: 'usuario_id',
    as: 'auditorias'
});
Auditoria.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    as: 'usuario'
});

const models = {
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
};

export {
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
};

export default models;
