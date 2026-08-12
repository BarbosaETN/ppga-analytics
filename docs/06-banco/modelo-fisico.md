# Modelo Físico de Dados --- PPGA Analytics

## 1. Objetivo

O Modelo Físico transforma o Modelo Lógico e o Dicionário de Dados em
uma especificação próxima da implementação real do banco.

Para o MVP do PPGA Analytics, considerando:

-   um único usuário;
-   um único computador;
-   banco local;
-   ausência de necessidade de servidor de banco remoto;
-   volume inicial de dezenas a milhares de currículos;

a tecnologia adotada como referência neste documento será:

> **SQLite 3**

A escolha poderá ser revisada caso a arquitetura final do backend
indique outra necessidade.

------------------------------------------------------------------------

# 2. Premissas físicas

## 2.1 Banco local

O banco será armazenado localmente no computador onde o PPGA Analytics
estiver instalado.

## 2.2 Arquivos Lattes

PDF e XML serão arquivos temporários.

O banco **não possuirá BLOBs para armazenar os documentos**.

Fluxo:

``` text
PDF temporário
     ↓
XML temporário
     ↓
Parser
     ↓
SQLite
     ↓
PDF/XML descartados
```

## 2.3 Integridade referencial

O SQLite deverá operar com:

``` sql
PRAGMA foreign_keys = ON;
```

## 2.4 Identificadores

As tabelas utilizarão:

``` text
INTEGER PRIMARY KEY
```

como identificador interno.

Isso aproveita o mecanismo de ROWID do SQLite e simplifica
relacionamentos e migrations.

## 2.5 Datas e horários

Datas serão armazenadas em formato ISO 8601 como `TEXT`.

Exemplo:

``` text
2026-08-12
```

Data/hora:

``` text
2026-08-12T19:30:00-03:00
```

------------------------------------------------------------------------

# 3. Convenções

-   nomes de tabelas: `snake_case`, singular;
-   nomes de colunas: `snake_case`;
-   PK: `id`;
-   FK: `<tabela>_id`;
-   booleanos: `INTEGER`, usando `0` e `1`;
-   JSON: `TEXT` contendo JSON válido;
-   textos: `TEXT`;
-   inteiros: `INTEGER`;
-   valores fracionários: `REAL`.

------------------------------------------------------------------------

# 4. Tabela `pessoa`

``` sql
CREATE TABLE pessoa (
    id INTEGER PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    identificador_lattes TEXT UNIQUE,
    nome_normalizado TEXT
);
```

### Restrições

-   `nome_completo` obrigatório.
-   `identificador_lattes` único quando preenchido.

### Índices

``` sql
CREATE INDEX idx_pessoa_nome_normalizado
ON pessoa(nome_normalizado);
```

------------------------------------------------------------------------

# 5. Tabela `instituicao`

``` sql
CREATE TABLE instituicao (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    sigla TEXT
);
```

------------------------------------------------------------------------

# 6. Tabela `programa`

``` sql
CREATE TABLE programa (
    id INTEGER PRIMARY KEY,
    instituicao_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    sigla TEXT,

    FOREIGN KEY (instituicao_id)
        REFERENCES instituicao(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
```

### Índices

``` sql
CREATE INDEX idx_programa_instituicao
ON programa(instituicao_id);
```

------------------------------------------------------------------------

# 7. Tabela `docente`

``` sql
CREATE TABLE docente (
    id INTEGER PRIMARY KEY,
    pessoa_id INTEGER NOT NULL,
    programa_id INTEGER NOT NULL,
    categoria TEXT,
    ativo INTEGER NOT NULL DEFAULT 1,

    FOREIGN KEY (pessoa_id)
        REFERENCES pessoa(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (programa_id)
        REFERENCES programa(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CHECK (ativo IN (0, 1))
);
```

### Índices

``` sql
CREATE INDEX idx_docente_pessoa
ON docente(pessoa_id);

CREATE INDEX idx_docente_programa
ON docente(programa_id);
```

### Restrição recomendada

A combinação abaixo deverá ser única:

``` text
pessoa_id + programa_id
```

Isso evita cadastrar a mesma pessoa duas vezes como docente do mesmo
programa.

------------------------------------------------------------------------

# 8. Tabela `aluno`

``` sql
CREATE TABLE aluno (
    id INTEGER PRIMARY KEY,
    pessoa_id INTEGER NOT NULL,
    programa_id INTEGER NOT NULL,
    nivel TEXT,
    situacao TEXT,
    ano_ingresso INTEGER,

    FOREIGN KEY (pessoa_id)
        REFERENCES pessoa(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    FOREIGN KEY (programa_id)
        REFERENCES programa(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
```

### Índices

``` sql
CREATE INDEX idx_aluno_pessoa
ON aluno(pessoa_id);

CREATE INDEX idx_aluno_programa
ON aluno(programa_id);
```

### Restrição recomendada

``` text
UNIQUE(pessoa_id, programa_id)
```

------------------------------------------------------------------------

# 9. Tabela `periodo`

``` sql
CREATE TABLE periodo (
    id INTEGER PRIMARY KEY,
    ano INTEGER NOT NULL,
    descricao TEXT,
    inicio TEXT,
    fim TEXT
);
```

------------------------------------------------------------------------

# 10. Tabela `parser_versao`

``` sql
CREATE TABLE parser_versao (
    id INTEGER PRIMARY KEY,
    versao TEXT NOT NULL UNIQUE,
    descricao TEXT,
    criado_em TEXT NOT NULL
);
```

------------------------------------------------------------------------

# 11. Tabela `importacao`

``` sql
CREATE TABLE importacao (
    id INTEGER PRIMARY KEY,
    docente_id INTEGER,
    nome_arquivo_original TEXT,
    hash_arquivo TEXT,
    data_importacao TEXT NOT NULL,
    status TEXT NOT NULL,

    FOREIGN KEY (docente_id)
        REFERENCES docente(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);
```

### Índices

``` sql
CREATE INDEX idx_importacao_docente
ON importacao(docente_id);

CREATE INDEX idx_importacao_hash
ON importacao(hash_arquivo);
```

### Observação

`hash_arquivo` identifica tecnicamente o arquivo recebido.

O arquivo em si não é armazenado.

------------------------------------------------------------------------

# 12. Tabela `processamento`

``` sql
CREATE TABLE processamento (
    id INTEGER PRIMARY KEY,
    importacao_id INTEGER NOT NULL,
    parser_versao_id INTEGER NOT NULL,
    iniciado_em TEXT NOT NULL,
    finalizado_em TEXT,
    status TEXT NOT NULL,
    registros_processados INTEGER,
    erros TEXT,
    alertas TEXT,

    FOREIGN KEY (importacao_id)
        REFERENCES importacao(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (parser_versao_id)
        REFERENCES parser_versao(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
```

### Índices

``` sql
CREATE INDEX idx_processamento_importacao
ON processamento(importacao_id);

CREATE INDEX idx_processamento_parser
ON processamento(parser_versao_id);

CREATE INDEX idx_processamento_status
ON processamento(status);
```

------------------------------------------------------------------------

# 13. Tabela `formacao`

``` sql
CREATE TABLE formacao (
    id INTEGER PRIMARY KEY,
    docente_id INTEGER NOT NULL,
    nivel TEXT NOT NULL,
    curso TEXT,
    instituicao TEXT,
    ano_inicio INTEGER,
    ano_conclusao INTEGER,
    titulo TEXT,

    FOREIGN KEY (docente_id)
        REFERENCES docente(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
```

### Índice

``` sql
CREATE INDEX idx_formacao_docente
ON formacao(docente_id);
```

------------------------------------------------------------------------

# 14. Tabela `producao`

``` sql
CREATE TABLE producao (
    id INTEGER PRIMARY KEY,
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    ano INTEGER,
    doi TEXT,
    isbn TEXT,
    periodico TEXT,
    evento TEXT,
    descricao TEXT
);
```

### Índices

``` sql
CREATE INDEX idx_producao_tipo
ON producao(tipo);

CREATE INDEX idx_producao_ano
ON producao(ano);

CREATE INDEX idx_producao_doi
ON producao(doi);
```

------------------------------------------------------------------------

# 15. Tabela `autoria`

``` sql
CREATE TABLE autoria (
    id INTEGER PRIMARY KEY,
    producao_id INTEGER NOT NULL,
    pessoa_id INTEGER NOT NULL,
    ordem_autoria INTEGER,
    papel TEXT,

    FOREIGN KEY (producao_id)
        REFERENCES producao(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (pessoa_id)
        REFERENCES pessoa(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    UNIQUE (producao_id, pessoa_id)
);
```

### Índices

``` sql
CREATE INDEX idx_autoria_producao
ON autoria(producao_id);

CREATE INDEX idx_autoria_pessoa
ON autoria(pessoa_id);
```

### Observação importante

A restrição `UNIQUE(producao_id, pessoa_id)` impede a mesma pessoa de
aparecer duas vezes na mesma produção.

------------------------------------------------------------------------

# 16. Tabela `relacao_docente_aluno`

``` sql
CREATE TABLE relacao_docente_aluno (
    id INTEGER PRIMARY KEY,
    docente_id INTEGER NOT NULL,
    aluno_id INTEGER NOT NULL,
    tipo_relacao TEXT NOT NULL,
    inicio TEXT,
    fim TEXT,
    fonte_processamento_id INTEGER,

    FOREIGN KEY (docente_id)
        REFERENCES docente(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (aluno_id)
        REFERENCES aluno(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (fonte_processamento_id)
        REFERENCES processamento(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);
```

### Índices

``` sql
CREATE INDEX idx_relacao_docente_aluno_docente
ON relacao_docente_aluno(docente_id);

CREATE INDEX idx_relacao_docente_aluno_aluno
ON relacao_docente_aluno(aluno_id);

CREATE INDEX idx_relacao_docente_aluno_tipo
ON relacao_docente_aluno(tipo_relacao);
```

------------------------------------------------------------------------

# 17. Tabela `orientacao`

``` sql
CREATE TABLE orientacao (
    id INTEGER PRIMARY KEY,
    docente_id INTEGER NOT NULL,
    aluno_id INTEGER NOT NULL,
    nivel TEXT,
    status TEXT NOT NULL,
    titulo TEXT,
    ano_inicio INTEGER,
    ano_conclusao INTEGER,
    processamento_id INTEGER,

    FOREIGN KEY (docente_id)
        REFERENCES docente(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (aluno_id)
        REFERENCES aluno(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (processamento_id)
        REFERENCES processamento(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);
```

### Índices

``` sql
CREATE INDEX idx_orientacao_docente
ON orientacao(docente_id);

CREATE INDEX idx_orientacao_aluno
ON orientacao(aluno_id);

CREATE INDEX idx_orientacao_status
ON orientacao(status);
```

------------------------------------------------------------------------

# 18. Tabela `atividade_ensino`

``` sql
CREATE TABLE atividade_ensino (
    id INTEGER PRIMARY KEY,
    docente_id INTEGER NOT NULL,
    periodo_id INTEGER,
    tipo TEXT NOT NULL,
    disciplina TEXT,
    nivel TEXT,
    descricao TEXT,
    processamento_id INTEGER,

    FOREIGN KEY (docente_id)
        REFERENCES docente(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (periodo_id)
        REFERENCES periodo(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    FOREIGN KEY (processamento_id)
        REFERENCES processamento(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);
```

### Índices

``` sql
CREATE INDEX idx_ensino_docente
ON atividade_ensino(docente_id);

CREATE INDEX idx_ensino_periodo
ON atividade_ensino(periodo_id);
```

------------------------------------------------------------------------

# 19. Tabela `projeto_pesquisa`

``` sql
CREATE TABLE projeto_pesquisa (
    id INTEGER PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT,
    ano_inicio INTEGER,
    ano_fim INTEGER,
    processamento_id INTEGER,

    FOREIGN KEY (processamento_id)
        REFERENCES processamento(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);
```

------------------------------------------------------------------------

# 20. Tabela `participacao_projeto_pesquisa`

``` sql
CREATE TABLE participacao_projeto_pesquisa (
    id INTEGER PRIMARY KEY,
    projeto_id INTEGER NOT NULL,
    pessoa_id INTEGER NOT NULL,
    papel TEXT,

    FOREIGN KEY (projeto_id)
        REFERENCES projeto_pesquisa(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (pessoa_id)
        REFERENCES pessoa(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    UNIQUE (projeto_id, pessoa_id)
);
```

------------------------------------------------------------------------

# 21. Tabela `projeto_extensao`

``` sql
CREATE TABLE projeto_extensao (
    id INTEGER PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT,
    ano_inicio INTEGER,
    ano_fim INTEGER,
    processamento_id INTEGER,

    FOREIGN KEY (processamento_id)
        REFERENCES processamento(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);
```

------------------------------------------------------------------------

# 22. Tabela `participacao_projeto_extensao`

``` sql
CREATE TABLE participacao_projeto_extensao (
    id INTEGER PRIMARY KEY,
    projeto_id INTEGER NOT NULL,
    pessoa_id INTEGER NOT NULL,
    papel TEXT,

    FOREIGN KEY (projeto_id)
        REFERENCES projeto_extensao(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (pessoa_id)
        REFERENCES pessoa(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    UNIQUE (projeto_id, pessoa_id)
);
```

------------------------------------------------------------------------

# 23. Tabela `criterio`

``` sql
CREATE TABLE criterio (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    versao TEXT NOT NULL,
    ativo INTEGER NOT NULL DEFAULT 1,

    CHECK (ativo IN (0, 1))
);
```

### Índice

``` sql
CREATE INDEX idx_criterio_ativo
ON criterio(ativo);
```

------------------------------------------------------------------------

# 24. Tabela `classificacao`

``` sql
CREATE TABLE classificacao (
    id INTEGER PRIMARY KEY,
    producao_id INTEGER NOT NULL,
    criterio_id INTEGER NOT NULL,
    classificacao TEXT NOT NULL,
    pontuacao REAL,
    calculado_em TEXT NOT NULL,

    FOREIGN KEY (producao_id)
        REFERENCES producao(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (criterio_id)
        REFERENCES criterio(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
```

### Índices

``` sql
CREATE INDEX idx_classificacao_producao
ON classificacao(producao_id);

CREATE INDEX idx_classificacao_criterio
ON classificacao(criterio_id);
```

------------------------------------------------------------------------

# 25. Tabela `indicador`

``` sql
CREATE TABLE indicador (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT NOT NULL,
    versao_regra TEXT NOT NULL,
    ativo INTEGER NOT NULL DEFAULT 1,

    CHECK (ativo IN (0, 1))
);
```

------------------------------------------------------------------------

# 26. Tabela `resultado_indicador`

``` sql
CREATE TABLE resultado_indicador (
    id INTEGER PRIMARY KEY,
    indicador_id INTEGER NOT NULL,
    periodo_id INTEGER,
    docente_id INTEGER,
    aluno_id INTEGER,
    valor REAL NOT NULL,
    calculado_em TEXT NOT NULL,

    FOREIGN KEY (indicador_id)
        REFERENCES indicador(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (periodo_id)
        REFERENCES periodo(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    FOREIGN KEY (docente_id)
        REFERENCES docente(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    FOREIGN KEY (aluno_id)
        REFERENCES aluno(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);
```

### Índices

``` sql
CREATE INDEX idx_resultado_indicador_indicador
ON resultado_indicador(indicador_id);

CREATE INDEX idx_resultado_indicador_periodo
ON resultado_indicador(periodo_id);

CREATE INDEX idx_resultado_indicador_docente
ON resultado_indicador(docente_id);

CREATE INDEX idx_resultado_indicador_aluno
ON resultado_indicador(aluno_id);
```

------------------------------------------------------------------------

# 27. Tabela `origem_dado`

``` sql
CREATE TABLE origem_dado (
    id INTEGER PRIMARY KEY,
    processamento_id INTEGER NOT NULL,
    secao TEXT,
    referencia TEXT,
    identificador_origem TEXT,

    FOREIGN KEY (processamento_id)
        REFERENCES processamento(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
```

### Índice

``` sql
CREATE INDEX idx_origem_dado_processamento
ON origem_dado(processamento_id);
```

------------------------------------------------------------------------

# 28. Tabela `usuario`

``` sql
CREATE TABLE usuario (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    ativo INTEGER NOT NULL DEFAULT 1,

    CHECK (ativo IN (0, 1))
);
```

------------------------------------------------------------------------

# 29. Tabela `auditoria`

``` sql
CREATE TABLE auditoria (
    id INTEGER PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    acao TEXT NOT NULL,
    entidade TEXT NOT NULL,
    entidade_id INTEGER,
    data_hora TEXT NOT NULL,
    detalhes TEXT,

    FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
```

### Índices

``` sql
CREATE INDEX idx_auditoria_usuario
ON auditoria(usuario_id);

CREATE INDEX idx_auditoria_entidade
ON auditoria(entidade, entidade_id);

CREATE INDEX idx_auditoria_data
ON auditoria(data_hora);
```

------------------------------------------------------------------------

# 30. Índices principais

Além dos índices individuais definidos nas tabelas, o banco deverá
priorizar consultas pelos seguintes campos:

``` text
pessoa.identificador_lattes
pessoa.nome_normalizado

docente.pessoa_id
docente.programa_id

aluno.pessoa_id
aluno.programa_id

producao.tipo
producao.ano
producao.doi

autoria.producao_id
autoria.pessoa_id

relacao_docente_aluno.docente_id
relacao_docente_aluno.aluno_id

orientacao.docente_id
orientacao.aluno_id

processamento.importacao_id
processamento.status

resultado_indicador.indicador_id
resultado_indicador.periodo_id
resultado_indicador.docente_id
resultado_indicador.aluno_id
```

------------------------------------------------------------------------

# 31. Integridade referencial

O banco deverá ser inicializado com:

``` sql
PRAGMA foreign_keys = ON;
```

### Estratégias utilizadas

  Situação                          Estratégia
  --------------------------------- ------------
  Registro filho depende do pai     `RESTRICT`
  Registro acadêmico dependente     `CASCADE`
  Histórico/opcional                `SET NULL`
  Associação de produção excluída   `CASCADE`
  Critério usado em classificação   `RESTRICT`

A política final deverá ser validada durante os testes das migrations.

------------------------------------------------------------------------

# 32. Tipos físicos adotados

  Necessidade       SQLite
  ----------------- ---------
  ID                INTEGER
  Texto             TEXT
  Booleano          INTEGER
  Número inteiro    INTEGER
  Pontuação/valor   REAL
  Data              TEXT
  Data/Hora         TEXT
  JSON              TEXT

------------------------------------------------------------------------

# 33. Observação sobre JSON

Campos como:

``` text
processamento.erros
processamento.alertas
auditoria.detalhes
```

poderão armazenar JSON como `TEXT`.

Exemplo:

``` json
{
  "codigo": "PARSER_001",
  "mensagem": "Seção não reconhecida",
  "pagina": 12
}
```

O uso de JSON deverá ser limitado a informações flexíveis, logs e
metadados.

Dados acadêmicos importantes não deverão ser escondidos dentro de JSON
quando possuírem estrutura própria no modelo.

------------------------------------------------------------------------

# 34. Observação sobre deduplicação

A POC demonstrou que nomes podem aparecer em diferentes contextos.

Portanto, o sistema não deverá criar automaticamente uma nova `PESSOA`
somente porque encontrou uma nova ocorrência textual.

O parser deverá trabalhar com:

``` text
identificador Lattes
       ↓
matching por identificador
       ↓
matching por nome normalizado
       ↓
evidências adicionais
       ↓
criação ou associação da pessoa
```

O algoritmo definitivo de matching será implementado no parser/serviço
de domínio, não no banco.

------------------------------------------------------------------------

# 35. Observação sobre documentos

Não existirão tabelas como:

``` text
pdf
xml
arquivo_lattes
documento
```

para armazenar permanentemente os currículos.

O banco armazenará somente:

``` text
IMPORTACAO
PROCESSAMENTO
PARSER_VERSAO
ORIGEM_DADO
DADOS_ACADEMICOS
```

Isso mantém o banco leve e independente dos arquivos originais.

------------------------------------------------------------------------

# 36. Fluxo físico de processamento

``` text
┌───────────────┐
│ PDF temporário│
└───────┬───────┘
        ↓
┌───────────────┐
│  IMPORTACAO   │
└───────┬───────┘
        ↓
┌───────────────┐
│ PROCESSAMENTO  │
└───────┬───────┘
        ↓
┌───────────────┐
│ XML temporário│
└───────┬───────┘
        ↓
┌───────────────┐
│    PARSER     │
└───────┬───────┘
        ↓
┌──────────────────────┐
│ DADOS ESTRUTURADOS   │
└──────────┬───────────┘
           ↓
        SQLite
           ↓
┌──────────────────────┐
│ PDF/XML são apagados │
└──────────────────────┘
```

------------------------------------------------------------------------

# 37. Estrutura inicial do banco

``` text
ppga_analytics.db
```

O arquivo deverá ficar em local definido pela configuração da aplicação
e não deverá ser versionado no Git.

No `.gitignore`:

``` text
*.db
*.sqlite
*.sqlite3
```

------------------------------------------------------------------------

# 38. Migrations

A criação das tabelas deverá ocorrer por migrations.

Não deverá ser utilizado apenas:

``` sql
CREATE TABLE ...
```

executado manualmente no computador de cada desenvolvedor.

As migrations deverão permitir:

-   criação inicial;
-   alteração de estrutura;
-   rollback quando suportado;
-   reprodução do banco;
-   sincronização entre os computadores dos três desenvolvedores.

------------------------------------------------------------------------

# 39. Seed inicial

Poderão existir seeds para:

-   usuário inicial;
-   tipos de produção;
-   critérios iniciais;
-   indicadores básicos.

Entretanto, critérios e pontuações que ainda não foram validados pelo
cliente não deverão ser colocados como regra definitiva.

------------------------------------------------------------------------

# 40. Estado atual

O Modelo Físico está baseado em SQLite e representa a primeira
implementação física proposta.

Antes de criar as migrations, a equipe deverá validar:

1.  entidades;
2.  FKs;
3.  cardinalidades;
4.  regras de exclusão;
5.  índices;
6.  campos de classificação;
7.  estrutura dos indicadores;
8.  estratégia de deduplicação;
9.  critérios do cliente.

------------------------------------------------------------------------

# 41. Próxima etapa

Após aprovação:

``` text
MODELO FÍSICO
      ↓
MIGRATIONS
      ↓
BANCO LOCAL
      ↓
REPOSITÓRIOS / ORM
      ↓
BACKEND
```

O banco físico deverá ser implementado somente após a equipe revisar
este documento.
