# Dicionário de Dados --- PPGA Analytics

## 1. O que é este documento?

O Dicionário de Dados descreve **o significado de cada dado que será
armazenado no banco**.

Enquanto o Modelo Lógico responde:

> "Quais entidades/tabelas existem e como elas se relacionam?"

o Dicionário de Dados responde:

> "O que significa cada campo dessas tabelas, para que ele serve, se é
> obrigatório e quais regras ele possui?"

### Exemplo

No Modelo Lógico:

``` text
PESSOA
- id
- nome_completo
- identificador_lattes
```

No Dicionário de Dados:

  ----------------------------------------------------------------------------
  Campo                  Tipo lógico       Obrigatório       Descrição
  ---------------------- ----------------- ----------------- -----------------
  id                     Identificador     Sim               Identificador
                                                             único da pessoa

  nome_completo          Texto             Sim               Nome completo
                                                             identificado no
                                                             currículo

  identificador_lattes   Texto             Não               Identificador
                                                             Lattes, quando
                                                             disponível
  ----------------------------------------------------------------------------

Portanto, o Dicionário de Dados é uma **ponte entre a modelagem e a
implementação**.

Ele ajuda os desenvolvedores a implementar o banco de forma consistente
e evita que cada pessoa da equipe interprete um campo de maneira
diferente.

------------------------------------------------------------------------

# 2. Escopo

Este documento descreve os campos previstos no Modelo Lógico do PPGA
Analytics.

Ainda não define:

-   SQL;
-   tipo específico de PostgreSQL, MySQL, SQLite etc.;
-   tamanho físico definitivo das colunas;
-   índices físicos;
-   migrations;
-   detalhes de infraestrutura.

Essas decisões pertencem ao Modelo Físico.

------------------------------------------------------------------------

# 3. Convenções

  Termo       Significado
  ----------- ------------------------------
  PK          Chave Primária
  FK          Chave Estrangeira
  NN          Campo obrigatório
  UQ          Valor único
  NULL        Campo pode não possuir valor
  Texto       Informação textual
  Inteiro     Número inteiro
  Decimal     Número com casas decimais
  Data        Data
  Data/Hora   Data e horário
  Booleano    Verdadeiro/Falso

------------------------------------------------------------------------

# 4. PESSOA

Representa a identidade de uma pessoa encontrada ou cadastrada no
sistema.

  ----------------------------------------------------------------------------
  Campo                  Tipo lógico       Regras            Descrição
  ---------------------- ----------------- ----------------- -----------------
  id                     Inteiro/UUID      PK, NN            Identificador
                                                             interno único

  nome_completo          Texto             NN                Nome completo da
                                                             pessoa

  identificador_lattes   Texto             UQ, NULL          Identificador
                                                             Lattes quando
                                                             disponível

  nome_normalizado       Texto             NULL              Nome normalizado
                                                             para busca e
                                                             matching
  ----------------------------------------------------------------------------

### Observações

`nome_normalizado` não substitui o nome original.

O nome não deverá ser usado isoladamente como identificador de uma
pessoa.

------------------------------------------------------------------------

# 5. INSTITUICAO

Representa uma instituição de ensino ou organização relacionada ao
programa.

  Campo   Tipo lógico    Regras   Descrição
  ------- -------------- -------- ------------------------------
  id      Inteiro/UUID   PK, NN   Identificador da instituição
  nome    Texto          NN       Nome da instituição
  sigla   Texto          NULL     Sigla da instituição

------------------------------------------------------------------------

# 6. PROGRAMA

Representa o Programa de Pós-Graduação.

  Campo            Tipo lógico    Regras   Descrição
  ---------------- -------------- -------- ---------------------------
  id               Inteiro/UUID   PK, NN   Identificador do programa
  instituicao_id   Inteiro/UUID   FK, NN   Instituição responsável
  nome             Texto          NN       Nome do programa
  sigla            Texto          NULL     Sigla do programa

### FK

``` text
programa.instituicao_id
        ↓
instituicao.id
```

------------------------------------------------------------------------

# 7. DOCENTE

Representa o papel de docente exercido por uma pessoa no programa.

  -----------------------------------------------------------------------
  Campo             Tipo lógico       Regras            Descrição
  ----------------- ----------------- ----------------- -----------------
  id                Inteiro/UUID      PK, NN            Identificador do
                                                        docente

  pessoa_id         Inteiro/UUID      FK, NN            Pessoa que exerce
                                                        o papel

  programa_id       Inteiro/UUID      FK, NN            Programa ao qual
                                                        o docente está
                                                        associado

  categoria         Texto             NULL              Categoria ou tipo
                                                        de vínculo
                                                        acadêmico

  ativo             Booleano          NN                Indica se o
                                                        vínculo está
                                                        ativo
  -----------------------------------------------------------------------

### FKs

``` text
docente.pessoa_id
        ↓
pessoa.id

docente.programa_id
        ↓
programa.id
```

------------------------------------------------------------------------

# 8. ALUNO

Representa o papel de aluno exercido por uma pessoa.

  -----------------------------------------------------------------------
  Campo             Tipo lógico       Regras            Descrição
  ----------------- ----------------- ----------------- -----------------
  id                Inteiro/UUID      PK, NN            Identificador do
                                                        aluno

  pessoa_id         Inteiro/UUID      FK, NN            Pessoa que exerce
                                                        o papel

  programa_id       Inteiro/UUID      FK, NN            Programa ao qual
                                                        o aluno pertence

  nivel             Texto             NULL              Nível acadêmico,
                                                        como mestrado ou
                                                        doutorado

  situacao          Texto             NULL              Situação
                                                        acadêmica

  ano_ingresso      Inteiro           NULL              Ano de ingresso
                                                        no programa
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 9. PERIODO

Representa o período temporal utilizado nas análises.

  Campo       Tipo lógico    Regras   Descrição
  ----------- -------------- -------- --------------------------
  id          Inteiro/UUID   PK, NN   Identificador do período
  ano         Inteiro        NN       Ano de referência
  descricao   Texto          NULL     Descrição do período
  inicio      Data           NULL     Data inicial
  fim         Data           NULL     Data final

------------------------------------------------------------------------

# 10. IMPORTACAO

Representa uma operação de entrada de um currículo.

**Importante:** não armazena o PDF.

  -----------------------------------------------------------------------------
  Campo                   Tipo lógico       Regras            Descrição
  ----------------------- ----------------- ----------------- -----------------
  id                      Inteiro/UUID      PK, NN            Identificador da
                                                              importação

  docente_id              Inteiro/UUID      FK, NULL          Docente
                                                              relacionado ao
                                                              currículo

  nome_arquivo_original   Texto             NULL              Nome original do
                                                              arquivo recebido

  hash_arquivo            Texto             NULL              Hash usado para
                                                              identificação
                                                              técnica

  data_importacao         Data/Hora         NN                Momento da
                                                              importação

  status                  Texto             NN                Estado da
                                                              importação
  -----------------------------------------------------------------------------

O arquivo físico pode existir somente durante o processamento.

------------------------------------------------------------------------

# 11. PROCESSAMENTO

Representa uma execução do pipeline PDF → XML → Parser.

  -----------------------------------------------------------------------------
  Campo                   Tipo lógico       Regras            Descrição
  ----------------------- ----------------- ----------------- -----------------
  id                      Inteiro/UUID      PK, NN            Identificador do
                                                              processamento

  importacao_id           Inteiro/UUID      FK, NN            Importação que
                                                              originou o
                                                              processamento

  parser_versao_id        Inteiro/UUID      FK, NN            Versão do parser
                                                              utilizada

  iniciado_em             Data/Hora         NN                Momento de início

  finalizado_em           Data/Hora         NULL              Momento de
                                                              conclusão

  status                  Texto             NN                Estado do
                                                              processamento

  registros_processados   Inteiro           NULL              Quantidade de
                                                              registros
                                                              processados

  erros                   Texto/JSON        NULL              Erros encontrados

  alertas                 Texto/JSON        NULL              Alertas
                                                              encontrados
  -----------------------------------------------------------------------------

------------------------------------------------------------------------

# 12. PARSER_VERSAO

Identifica a versão do parser responsável pela extração.

  Campo       Tipo lógico    Regras   Descrição
  ----------- -------------- -------- ---------------------
  id          Inteiro/UUID   PK, NN   Identificador
  versao      Texto          NN       Versão do parser
  descricao   Texto          NULL     Descrição da versão
  criado_em   Data/Hora      NN       Data de criação

------------------------------------------------------------------------

# 13. FORMACAO

Representa uma formação acadêmica de um docente.

  -----------------------------------------------------------------------
  Campo             Tipo lógico       Regras            Descrição
  ----------------- ----------------- ----------------- -----------------
  id                Inteiro/UUID      PK, NN            Identificador

  docente_id        Inteiro/UUID      FK, NN            Docente

  nivel             Texto             NN                Nível da formação

  curso             Texto             NULL              Curso

  instituicao       Texto             NULL              Instituição onde
                                                        a formação foi
                                                        realizada

  ano_inicio        Inteiro           NULL              Ano de início

  ano_conclusao     Inteiro           NULL              Ano de conclusão

  titulo            Texto             NULL              Título ou
                                                        descrição da
                                                        formação
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 14. PRODUCAO

Representa uma produção acadêmica.

  Campo       Tipo lógico    Regras   Descrição
  ----------- -------------- -------- ----------------------------
  id          Inteiro/UUID   PK, NN   Identificador
  tipo        Texto          NN       Tipo da produção
  titulo      Texto          NN       Título da produção
  ano         Inteiro        NULL     Ano associado à produção
  doi         Texto          NULL     DOI
  isbn        Texto          NULL     ISBN quando aplicável
  periodico   Texto          NULL     Periódico relacionado
  evento      Texto          NULL     Evento relacionado
  descricao   Texto          NULL     Informações complementares

### Observação

O campo `tipo` deverá ser normalizado posteriormente. Os tipos
definitivos ainda dependem da validação dos requisitos do cliente.

------------------------------------------------------------------------

# 15. AUTORIA

Relaciona pessoas e produções.

  ---------------------------------------------------------------------------
  Campo             Tipo lógico       Regras            Descrição
  ----------------- ----------------- ----------------- ---------------------
  id                Inteiro/UUID      PK, NN            Identificador

  producao_id       Inteiro/UUID      FK, NN            Produção

  pessoa_id         Inteiro/UUID      FK, NN            Pessoa
                                                        autora/participante

  ordem_autoria     Inteiro           NULL              Posição da pessoa na
                                                        lista de autores

  papel             Texto             NULL              Papel exercido na
                                                        produção
  ---------------------------------------------------------------------------

### Regra

Uma produção pode ter vários autores e uma pessoa pode participar de
várias produções.

------------------------------------------------------------------------

# 16. RELACAO_DOCENTE_ALUNO

Representa uma relação acadêmica geral entre docente e aluno.

  ------------------------------------------------------------------------------
  Campo                    Tipo lógico       Regras            Descrição
  ------------------------ ----------------- ----------------- -----------------
  id                       Inteiro/UUID      PK, NN            Identificador

  docente_id               Inteiro/UUID      FK, NN            Docente

  aluno_id                 Inteiro/UUID      FK, NN            Aluno

  tipo_relacao             Texto             NN                Tipo da relação

  inicio                   Data              NULL              Início da relação

  fim                      Data              NULL              Fim da relação

  fonte_processamento_id   Inteiro/UUID      FK, NULL          Processamento que
                                                               identificou a
                                                               relação
  ------------------------------------------------------------------------------

Exemplos de relação:

-   orientação;
-   participação em projeto;
-   colaboração acadêmica;
-   outra relação validada.

------------------------------------------------------------------------

# 17. ORIENTACAO

Representa especificamente uma orientação acadêmica.

  Campo              Tipo lógico    Regras     Descrição
  ------------------ -------------- ---------- -------------------------
  id                 Inteiro/UUID   PK, NN     Identificador
  docente_id         Inteiro/UUID   FK, NN     Orientador
  aluno_id           Inteiro/UUID   FK, NN     Orientando
  nivel              Texto          NULL       Nível da orientação
  status             Texto          NN         Situação da orientação
  titulo             Texto          NULL       Título do trabalho
  ano_inicio         Inteiro        NULL       Ano de início
  ano_conclusao      Inteiro        NULL       Ano de conclusão
  processamento_id   Inteiro/UUID   FK, NULL   Processamento de origem

------------------------------------------------------------------------

# 18. ATIVIDADE_ENSINO

Representa uma atividade de Ensino.

  Campo              Tipo lógico    Regras     Descrição
  ------------------ -------------- ---------- -------------------------
  id                 Inteiro/UUID   PK, NN     Identificador
  docente_id         Inteiro/UUID   FK, NN     Docente responsável
  periodo_id         Inteiro/UUID   FK, NULL   Período
  tipo               Texto          NN         Tipo da atividade
  disciplina         Texto          NULL       Disciplina
  nivel              Texto          NULL       Nível de ensino
  descricao          Texto          NULL       Descrição
  processamento_id   Inteiro/UUID   FK, NULL   Processamento de origem

------------------------------------------------------------------------

# 19. PROJETO_PESQUISA

Representa um projeto de Pesquisa.

  Campo              Tipo lógico    Regras     Descrição
  ------------------ -------------- ---------- -------------------------
  id                 Inteiro/UUID   PK, NN     Identificador
  titulo             Texto          NN         Título
  descricao          Texto          NULL       Descrição
  ano_inicio         Inteiro        NULL       Ano inicial
  ano_fim            Inteiro        NULL       Ano final
  processamento_id   Inteiro/UUID   FK, NULL   Processamento de origem

------------------------------------------------------------------------

# 20. PARTICIPACAO_PROJETO_PESQUISA

Relaciona pessoas a projetos de Pesquisa.

  Campo        Tipo lógico    Regras   Descrição
  ------------ -------------- -------- ------------------
  id           Inteiro/UUID   PK, NN   Identificador
  projeto_id   Inteiro/UUID   FK, NN   Projeto
  pessoa_id    Inteiro/UUID   FK, NN   Participante
  papel        Texto          NULL     Papel no projeto

------------------------------------------------------------------------

# 21. PROJETO_EXTENSAO

Representa um projeto de Extensão.

  Campo              Tipo lógico    Regras     Descrição
  ------------------ -------------- ---------- -------------------------
  id                 Inteiro/UUID   PK, NN     Identificador
  titulo             Texto          NN         Título
  descricao          Texto          NULL       Descrição
  ano_inicio         Inteiro        NULL       Ano inicial
  ano_fim            Inteiro        NULL       Ano final
  processamento_id   Inteiro/UUID   FK, NULL   Processamento de origem

------------------------------------------------------------------------

# 22. PARTICIPACAO_PROJETO_EXTENSAO

Relaciona pessoas a projetos de Extensão.

  Campo        Tipo lógico    Regras   Descrição
  ------------ -------------- -------- ------------------
  id           Inteiro/UUID   PK, NN   Identificador
  projeto_id   Inteiro/UUID   FK, NN   Projeto
  pessoa_id    Inteiro/UUID   FK, NN   Participante
  papel        Texto          NULL     Papel no projeto

------------------------------------------------------------------------

# 23. CRITERIO

Representa uma regra ou conjunto de regras utilizado para avaliação.

  Campo       Tipo lógico    Regras   Descrição
  ----------- -------------- -------- ----------------------
  id          Inteiro/UUID   PK, NN   Identificador
  nome        Texto          NN       Nome do critério
  descricao   Texto          NULL     Descrição
  versao      Texto          NN       Versão do critério
  ativo       Booleano       NN       Indica se está ativo

As pontuações e categorias específicas do rascunho do cliente ainda não
estão congeladas.

------------------------------------------------------------------------

# 24. CLASSIFICACAO

Representa a aplicação de um critério sobre uma produção.

  Campo           Tipo lógico    Regras   Descrição
  --------------- -------------- -------- ----------------------------
  id              Inteiro/UUID   PK, NN   Identificador
  producao_id     Inteiro/UUID   FK, NN   Produção avaliada
  criterio_id     Inteiro/UUID   FK, NN   Critério aplicado
  classificacao   Texto          NN       Resultado da classificação
  pontuacao       Decimal        NULL     Pontuação obtida
  calculado_em    Data/Hora      NN       Momento do cálculo

------------------------------------------------------------------------

# 25. INDICADOR

Define um indicador calculável.

  Campo          Tipo lógico    Regras   Descrição
  -------------- -------------- -------- ----------------------------
  id             Inteiro/UUID   PK, NN   Identificador
  nome           Texto          NN       Nome do indicador
  descricao      Texto          NULL     Descrição
  tipo           Texto          NN       Dimensão/tipo do indicador
  versao_regra   Texto          NN       Versão da fórmula/regra
  ativo          Booleano       NN       Indica se está ativo

------------------------------------------------------------------------

# 26. RESULTADO_INDICADOR

Armazena o resultado de um indicador calculado.

  Campo          Tipo lógico    Regras     Descrição
  -------------- -------------- ---------- --------------------
  id             Inteiro/UUID   PK, NN     Identificador
  indicador_id   Inteiro/UUID   FK, NN     Indicador
  periodo_id     Inteiro/UUID   FK, NULL   Período analisado
  docente_id     Inteiro/UUID   FK, NULL   Docente analisado
  aluno_id       Inteiro/UUID   FK, NULL   Aluno analisado
  valor          Decimal        NN         Valor calculado
  calculado_em   Data/Hora      NN         Momento do cálculo

### Observação

Nem todo indicador será necessariamente de docente ou aluno. O modelo
físico deverá definir como representar indicadores de programa e outros
escopos.

------------------------------------------------------------------------

# 27. ORIGEM_DADO

Registra a origem lógica de um dado extraído.

  ----------------------------------------------------------------------------
  Campo                  Tipo lógico       Regras            Descrição
  ---------------------- ----------------- ----------------- -----------------
  id                     Inteiro/UUID      PK, NN            Identificador

  processamento_id       Inteiro/UUID      FK, NN            Processamento
                                                             responsável

  secao                  Texto             NULL              Seção do
                                                             currículo de onde
                                                             veio a informação

  referencia             Texto             NULL              Localização
                                                             lógica da
                                                             informação

  identificador_origem   Texto             NULL              Identificador
                                                             encontrado na
                                                             fonte
  ----------------------------------------------------------------------------

### Importante

Esta tabela não armazena o PDF nem o XML.

Ela permite manter rastreabilidade mesmo depois do descarte dos arquivos
temporários.

------------------------------------------------------------------------

# 28. USUARIO

Representa o usuário autorizado a operar o sistema.

  Campo        Tipo lógico    Regras   Descrição
  ------------ -------------- -------- -------------------------------------
  id           Inteiro/UUID   PK, NN   Identificador
  nome         Texto          NN       Nome do usuário
  email        Texto          NN, UQ   E-mail
  senha_hash   Texto          NN       Senha armazenada de forma protegida
  ativo        Booleano       NN       Situação do usuário

Embora o MVP tenha um único usuário, a entidade permite evolução futura.

------------------------------------------------------------------------

# 29. AUDITORIA

Registra ações relevantes realizadas no sistema.

  Campo         Tipo lógico    Regras   Descrição
  ------------- -------------- -------- -----------------------------
  id            Inteiro/UUID   PK, NN   Identificador
  usuario_id    Inteiro/UUID   FK, NN   Usuário que realizou a ação
  acao          Texto          NN       Ação realizada
  entidade      Texto          NN       Entidade afetada
  entidade_id   Inteiro/UUID   NULL     Registro afetado
  data_hora     Data/Hora      NN       Momento da ação
  detalhes      Texto/JSON     NULL     Informações adicionais

------------------------------------------------------------------------

# 30. Resumo das chaves estrangeiras

  Tabela                          FK                       Referência
  ------------------------------- ------------------------ ---------------------
  PROGRAMA                        instituicao_id           INSTITUICAO.id
  DOCENTE                         pessoa_id                PESSOA.id
  DOCENTE                         programa_id              PROGRAMA.id
  ALUNO                           pessoa_id                PESSOA.id
  ALUNO                           programa_id              PROGRAMA.id
  IMPORTACAO                      docente_id               DOCENTE.id
  PROCESSAMENTO                   importacao_id            IMPORTACAO.id
  PROCESSAMENTO                   parser_versao_id         PARSER_VERSAO.id
  FORMACAO                        docente_id               DOCENTE.id
  AUTORIA                         producao_id              PRODUCAO.id
  AUTORIA                         pessoa_id                PESSOA.id
  RELACAO_DOCENTE_ALUNO           docente_id               DOCENTE.id
  RELACAO_DOCENTE_ALUNO           aluno_id                 ALUNO.id
  RELACAO_DOCENTE_ALUNO           fonte_processamento_id   PROCESSAMENTO.id
  ORIENTACAO                      docente_id               DOCENTE.id
  ORIENTACAO                      aluno_id                 ALUNO.id
  ORIENTACAO                      processamento_id         PROCESSAMENTO.id
  ATIVIDADE_ENSINO                docente_id               DOCENTE.id
  ATIVIDADE_ENSINO                periodo_id               PERIODO.id
  ATIVIDADE_ENSINO                processamento_id         PROCESSAMENTO.id
  PROJETO_PESQUISA                processamento_id         PROCESSAMENTO.id
  PARTICIPACAO_PROJETO_PESQUISA   projeto_id               PROJETO_PESQUISA.id
  PARTICIPACAO_PROJETO_PESQUISA   pessoa_id                PESSOA.id
  PROJETO_EXTENSAO                processamento_id         PROCESSAMENTO.id
  PARTICIPACAO_PROJETO_EXTENSAO   projeto_id               PROJETO_EXTENSAO.id
  PARTICIPACAO_PROJETO_EXTENSAO   pessoa_id                PESSOA.id
  CLASSIFICACAO                   producao_id              PRODUCAO.id
  CLASSIFICACAO                   criterio_id              CRITERIO.id
  RESULTADO_INDICADOR             indicador_id             INDICADOR.id
  RESULTADO_INDICADOR             periodo_id               PERIODO.id
  RESULTADO_INDICADOR             docente_id               DOCENTE.id
  RESULTADO_INDICADOR             aluno_id                 ALUNO.id
  ORIGEM_DADO                     processamento_id         PROCESSAMENTO.id
  AUDITORIA                       usuario_id               USUARIO.id

------------------------------------------------------------------------

# 31. Regras de integridade

### DD-001 --- Identidade

`PESSOA` deve representar uma pessoa única sempre que houver informação
suficiente para identificação.

### DD-002 --- Lattes

`identificador_lattes` deve ser único quando disponível.

### DD-003 --- Papéis

Uma mesma pessoa poderá possuir registro como docente e aluno.

### DD-004 --- Produção

Uma produção pode possuir vários autores.

### DD-005 --- Autoria

A ordem de autoria deve ser preservada quando disponível no Lattes.

### DD-006 --- Docente--aluno

A existência de autoria conjunta não deve, sozinha, provar que uma
pessoa é aluno.

### DD-007 --- Orientação

Uma orientação constitui evidência explícita de uma relação
docente--aluno quando extraída dessa seção do currículo.

### DD-008 --- Dados ausentes

Ausência de informação no currículo não significa automaticamente
inexistência da atividade.

### DD-009 --- Arquivos

PDF e XML são temporários e não devem ser requisitos para consultar os
dados persistidos.

### DD-010 --- Rastreabilidade

Dados extraídos devem possuir vínculo com o processamento de origem
quando tecnicamente possível.

### DD-011 --- Parser

A versão do parser utilizada no processamento deve ser preservada.

### DD-012 --- Classificação

Critérios devem possuir versão para permitir reprodução dos resultados.

------------------------------------------------------------------------

# 32. Campos ainda sujeitos à validação

Os seguintes campos são provisórios e devem ser revisados antes do
Modelo Físico:

-   `DOCENTE.categoria`
-   `ALUNO.nivel`
-   `ALUNO.situacao`
-   `RELACAO_DOCENTE_ALUNO.tipo_relacao`
-   `PRODUCAO.tipo`
-   `PRODUCAO.evento`
-   `AUTORIA.papel`
-   `ATIVIDADE_ENSINO.tipo`
-   `ATIVIDADE_ENSINO.nivel`
-   `CRITERIO`
-   `CLASSIFICACAO.classificacao`
-   `INDICADOR.tipo`
-   regras de `RESULTADO_INDICADOR`

Isso evita transformar hipóteses atuais em estruturas rígidas do banco.

------------------------------------------------------------------------

# 33. Relação com o Modelo Lógico

O Dicionário de Dados deve ser lido junto do Modelo Lógico:

``` text
MODELO CONCEITUAL
      ↓
MODELO LÓGICO
      ↓
DICIONÁRIO DE DADOS
      ↓
MODELO FÍSICO
      ↓
BANCO / MIGRATIONS
```

O Modelo Lógico define **a estrutura**.

O Dicionário de Dados define **o significado dos dados**.

O Modelo Físico definirá **como essa estrutura será implementada no SGBD
escolhido**.
