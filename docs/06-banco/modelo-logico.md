# Modelo Lógico de Dados --- PPGA Analytics

## 1. Objetivo

Transformar o modelo conceitual em uma estrutura lógica, definindo
entidades, atributos, PKs, FKs e relacionamentos. Ainda não são
definidos SQL, tipos específicos do SGBD, índices físicos ou migrations.

## 2. Premissas

-   MVP para um usuário em um computador.
-   Banco local.
-   PDF é entrada e XML é artefato intermediário.
-   PDF/XML não são persistidos permanentemente.
-   Apenas dados estruturados e metadados necessários são persistidos.
-   O parser transforma o XML de layout em dados de domínio.
-   Pessoas podem exercer papéis diferentes.
-   Produções podem ter vários autores.
-   Docentes e alunos precisam ser relacionados.
-   Processamentos e versões do parser precisam ser rastreáveis.

## 3. Estratégia de pessoas

Para evitar duplicidade, `PESSOA` representa a identidade de um
indivíduo. `DOCENTE` e `ALUNO` representam papéis acadêmicos dessa
pessoa.

``` text
PESSOA
  ├── DOCENTE
  └── ALUNO
```

Uma mesma pessoa poderá possuir ambos os papéis.

## 4. Entidades principais

### INSTITUICAO

-   `id` --- PK
-   `nome` --- obrigatório
-   `sigla`

Relacionamento: `INSTITUICAO 1:N PROGRAMA`.

### PROGRAMA

-   `id` --- PK
-   `instituicao_id` --- FK → `INSTITUICAO.id`
-   `nome` --- obrigatório
-   `sigla`

### PESSOA

-   `id` --- PK
-   `nome_completo` --- obrigatório
-   `identificador_lattes` --- único quando preenchido
-   `nome_normalizado`

O nome não deve ser usado isoladamente como identificador.

### DOCENTE

-   `id` --- PK
-   `pessoa_id` --- FK → `PESSOA.id`
-   `programa_id` --- FK → `PROGRAMA.id`
-   `categoria`
-   `ativo` --- obrigatório

Relacionamentos: `PESSOA 1:0..N DOCENTE`, `PROGRAMA 1:N DOCENTE`.

### ALUNO

-   `id` --- PK
-   `pessoa_id` --- FK → `PESSOA.id`
-   `programa_id` --- FK → `PROGRAMA.id`
-   `nivel`
-   `situacao`
-   `ano_ingresso`

Relacionamentos: `PESSOA 1:0..N ALUNO`, `PROGRAMA 1:N ALUNO`.

### PERIODO

-   `id` --- PK
-   `ano` --- obrigatório
-   `descricao`
-   `inicio`
-   `fim`

## 5. Ingestão

### IMPORTACAO

Representa a entrada de um currículo, sem armazenar o PDF.

-   `id` --- PK
-   `docente_id` --- FK → `DOCENTE.id`
-   `nome_arquivo_original`
-   `hash_arquivo`
-   `data_importacao` --- obrigatório
-   `status` --- obrigatório

### PROCESSAMENTO

Representa uma execução do pipeline.

-   `id` --- PK
-   `importacao_id` --- FK → `IMPORTACAO.id`
-   `parser_versao_id` --- FK → `PARSER_VERSAO.id`
-   `iniciado_em` --- obrigatório
-   `finalizado_em`
-   `status` --- obrigatório
-   `registros_processados`
-   `erros`
-   `alertas`

Relacionamento: `IMPORTACAO 1:N PROCESSAMENTO`.

### PARSER_VERSAO

-   `id` --- PK
-   `versao` --- obrigatório
-   `descricao`
-   `criado_em` --- obrigatório

## 6. Dados acadêmicos

### FORMACAO

-   `id` --- PK
-   `docente_id` --- FK → `DOCENTE.id`
-   `nivel` --- obrigatório
-   `curso`
-   `instituicao`
-   `ano_inicio`
-   `ano_conclusao`
-   `titulo`

### PRODUCAO

-   `id` --- PK
-   `tipo` --- obrigatório
-   `titulo` --- obrigatório
-   `ano`
-   `doi`
-   `isbn`
-   `periodico`
-   `evento`
-   `descricao`

### AUTORIA

Entidade associativa entre pessoa e produção.

-   `id` --- PK
-   `producao_id` --- FK → `PRODUCAO.id`
-   `pessoa_id` --- FK → `PESSOA.id`
-   `ordem_autoria`
-   `papel`

Relacionamento: `PESSOA 1:N AUTORIA N:1 PRODUCAO`.

### RELACAO_DOCENTE_ALUNO

Representa relações acadêmicas gerais.

-   `id` --- PK
-   `docente_id` --- FK → `DOCENTE.id`
-   `aluno_id` --- FK → `ALUNO.id`
-   `tipo_relacao` --- obrigatório
-   `inicio`
-   `fim`
-   `fonte_processamento_id` --- FK → `PROCESSAMENTO.id`

### ORIENTACAO

Especialização da relação docente--aluno para orientação.

-   `id` --- PK
-   `docente_id` --- FK → `DOCENTE.id`
-   `aluno_id` --- FK → `ALUNO.id`
-   `nivel`
-   `status` --- obrigatório
-   `titulo`
-   `ano_inicio`
-   `ano_conclusao`
-   `processamento_id` --- FK → `PROCESSAMENTO.id`

### ATIVIDADE_ENSINO

-   `id` --- PK
-   `docente_id` --- FK → `DOCENTE.id`
-   `periodo_id` --- FK → `PERIODO.id`
-   `tipo` --- obrigatório
-   `disciplina`
-   `nivel`
-   `descricao`
-   `processamento_id` --- FK → `PROCESSAMENTO.id`

### PROJETO_PESQUISA

-   `id` --- PK
-   `titulo` --- obrigatório
-   `descricao`
-   `ano_inicio`
-   `ano_fim`
-   `processamento_id` --- FK → `PROCESSAMENTO.id`

### PARTICIPACAO_PROJETO_PESQUISA

-   `id` --- PK
-   `projeto_id` --- FK → `PROJETO_PESQUISA.id`
-   `pessoa_id` --- FK → `PESSOA.id`
-   `papel`

### PROJETO_EXTENSAO

-   `id` --- PK
-   `titulo` --- obrigatório
-   `descricao`
-   `ano_inicio`
-   `ano_fim`
-   `processamento_id` --- FK → `PROCESSAMENTO.id`

### PARTICIPACAO_PROJETO_EXTENSAO

-   `id` --- PK
-   `projeto_id` --- FK → `PROJETO_EXTENSAO.id`
-   `pessoa_id` --- FK → `PESSOA.id`
-   `papel`

## 7. Classificação

### CRITERIO

-   `id` --- PK
-   `nome` --- obrigatório
-   `descricao`
-   `versao` --- obrigatório
-   `ativo` --- obrigatório

### CLASSIFICACAO

-   `id` --- PK
-   `producao_id` --- FK → `PRODUCAO.id`
-   `criterio_id` --- FK → `CRITERIO.id`
-   `classificacao` --- obrigatório
-   `pontuacao`
-   `calculado_em` --- obrigatório

As siglas e pontuações do rascunho ainda não são definitivas.

## 8. Indicadores

### INDICADOR

-   `id` --- PK
-   `nome` --- obrigatório
-   `descricao`
-   `tipo` --- obrigatório
-   `versao_regra` --- obrigatório
-   `ativo` --- obrigatório

### RESULTADO_INDICADOR

-   `id` --- PK
-   `indicador_id` --- FK → `INDICADOR.id`
-   `periodo_id` --- FK → `PERIODO.id`
-   `docente_id` --- FK → `DOCENTE.id`
-   `aluno_id` --- FK → `ALUNO.id`
-   `valor` --- obrigatório
-   `calculado_em` --- obrigatório

A combinação dos campos de contexto deverá ser refinada no modelo
físico.

## 9. Rastreabilidade

### ORIGEM_DADO

-   `id` --- PK
-   `processamento_id` --- FK → `PROCESSAMENTO.id`
-   `secao`
-   `referencia`
-   `identificador_origem`

A entidade não armazena PDF ou XML.

## 10. Auditoria

### USUARIO

-   `id` --- PK
-   `nome` --- obrigatório
-   `email` --- obrigatório
-   `senha_hash` --- obrigatório
-   `ativo` --- obrigatório

### AUDITORIA

-   `id` --- PK
-   `usuario_id` --- FK → `USUARIO.id`
-   `acao` --- obrigatório
-   `entidade` --- obrigatório
-   `entidade_id`
-   `data_hora` --- obrigatório
-   `detalhes`

## 11. Mapa de relacionamentos

``` text
INSTITUICAO 1:N PROGRAMA

PROGRAMA 1:N DOCENTE
PROGRAMA 1:N ALUNO

PESSOA 1:0..N DOCENTE
PESSOA 1:0..N ALUNO

DOCENTE 1:N FORMACAO
DOCENTE 1:N ATIVIDADE_ENSINO
DOCENTE 1:N ORIENTACAO
DOCENTE N:N PROJETO_PESQUISA
DOCENTE N:N PROJETO_EXTENSAO

PESSOA N:N PRODUCAO
      via AUTORIA

DOCENTE N:N ALUNO
      via RELACAO_DOCENTE_ALUNO

ALUNO N:N PRODUCAO
      via AUTORIA

IMPORTACAO 1:N PROCESSAMENTO
PARSER_VERSAO 1:N PROCESSAMENTO
PROCESSAMENTO 1:N ORIGEM_DADO

PRODUCAO 1:N CLASSIFICACAO
CRITERIO 1:N CLASSIFICACAO

INDICADOR 1:N RESULTADO_INDICADOR
PERIODO 1:N RESULTADO_INDICADOR
```

## 12. Regras de integridade lógica

-   Toda pessoa identificável deve possuir um registro único em
    `PESSOA`.
-   `identificador_lattes` deve ser único quando presente.
-   Todo docente deve estar associado a uma pessoa e a um programa.
-   Todo aluno deve estar associado a uma pessoa e a um programa.
-   Uma produção pode possuir múltiplos autores.
-   Uma pessoa pode participar de múltiplas produções.
-   Uma orientação deve possuir docente e aluno.
-   Dados extraídos devem poder ser relacionados ao processamento de
    origem.
-   Nenhuma entidade acadêmica deve depender da persistência do PDF/XML.
-   Uma classificação deve apontar para produção e critério.
-   Um resultado deve apontar para o indicador que o gerou.
-   Processamentos e versões do parser devem ser preservados.

## 13. Decisões ainda abertas

Ainda precisam ser validados:

1.  tipos exatos de produção;
2.  categorias de aluno;
3.  categorias de relação docente--aluno;
4.  critérios e pontuações definitivos;
5.  fórmulas dos indicadores;
6.  granularidade definitiva da origem;
7.  política de deduplicação;
8.  tipos físicos, índices e constraints;
9.  se Pesquisa e Extensão continuarão como entidades separadas no
    modelo físico.

## 14. Próxima etapa

``` text
Modelo Lógico
      ↓
Dicionário de Dados
      ↓
Modelo Físico
      ↓
Migrations
      ↓
Arquitetura Backend
```

O modelo lógico deve ser revisado pela equipe antes da implementação do
banco.
