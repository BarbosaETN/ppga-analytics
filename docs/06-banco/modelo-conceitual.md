# Modelo Conceitual de Dados — PPGA Analytics

## 1. Objetivo

Este documento apresenta o **Modelo Conceitual de Dados** do PPGA Analytics.

O objetivo é representar as principais entidades do domínio do sistema e seus relacionamentos, sem definir ainda detalhes de implementação do banco de dados.

O modelo deverá servir como base para:

* modelo lógico;
* modelo físico;
* banco de dados;
* arquitetura do backend;
* implementação das regras de negócio.

---

# 2. Visão Geral do Domínio

O PPGA Analytics possui seis grandes áreas conceituais:

1. Estrutura institucional;
2. Currículos e ingestão de dados;
3. Informações acadêmicas;
4. Classificação e critérios;
5. Indicadores e análises;
6. Auditoria e rastreabilidade.

Visão geral:

```text
Instituição
    │
    └── Programa
          │
          └── Docente
                │
                ├── Currículo
                ├── Formação
                ├── Ensino
                ├── Pesquisa
                ├── Produção
                ├── Orientação
                └── Extensão
```

---

# 3. Entidades Principais

## 3.1 Instituição

Representa uma instituição de ensino superior que possui um ou mais Programas de Pós-Graduação.

### Responsabilidade

Manter a estrutura institucional à qual os programas pertencem.

---

## 3.2 Programa

Representa um Programa de Pós-Graduação.

### Responsabilidade

Organizar docentes, períodos e informações acadêmicas pertencentes ao programa.

### Relacionamento

Uma instituição pode possuir vários programas.

```text
INSTITUIÇÃO 1 ───── N PROGRAMA
```

---

## 3.3 Docente

Representa um professor/pesquisador vinculado a um Programa de Pós-Graduação.

### Responsabilidade

Centralizar as informações acadêmicas relacionadas ao docente.

### Relacionamentos

Um programa possui vários docentes.

```text
PROGRAMA 1 ───── N DOCENTE
```

Um docente pode possuir várias informações acadêmicas.

---

# 4. Currículo e Ingestão

## 4.1 Currículo

Representa o currículo acadêmico do docente obtido a partir do Currículo Lattes.

O currículo deverá permitir preservar informações históricas relacionadas às diferentes versões/importações do documento.

### Relacionamento

```text
DOCENTE 1 ───── N CURRÍCULO
```

---

## 4.2 Importação

Representa uma operação de envio e processamento de um currículo.

Uma importação deverá permitir identificar:

* currículo de origem;
* arquivo;
* usuário responsável;
* data;
* status;
* versão do parser utilizada.

### Relacionamento

```text
CURRÍCULO 1 ───── N IMPORTAÇÃO
```

Um mesmo currículo poderá ser importado ou processado várias vezes.

---

## 4.3 Processamento

Representa uma execução do pipeline de processamento de um Currículo Lattes.

O processamento deverá permitir acompanhar:

* início;
* conclusão;
* status;
* erros;
* alertas;
* quantidade de dados processados.

### Relacionamento

```text
IMPORTAÇÃO 1 ───── N PROCESSAMENTO
```

---

## 4.4 Versão do Parser

Representa uma versão específica do mecanismo responsável pela interpretação dos Currículos Lattes.

### Responsabilidade

Permitir identificar qual versão do parser foi utilizada para gerar determinado resultado.

### Relacionamento

```text
PARSER_VERSÃO 1 ───── N PROCESSAMENTO
```

---

# 5. Informações Acadêmicas

## 5.1 Formação

Representa uma formação acadêmica do docente.

Exemplos:

* graduação;
* especialização;
* mestrado;
* doutorado;
* pós-doutorado.

### Relacionamento

```text
DOCENTE 1 ───── N FORMAÇÃO
```

---

## 5.2 Atividade de Ensino

Representa uma atividade relacionada ao Ensino realizada pelo docente.

Exemplos:

* disciplina;
* atividade de graduação;
* atividade de mestrado;
* atividade de doutorado.

### Relacionamentos

```text
DOCENTE 1 ───── N ATIVIDADE_ENSINO

PERÍODO 1 ───── N ATIVIDADE_ENSINO
```

---

## 5.3 Projeto de Pesquisa

Representa um projeto de pesquisa do qual docentes podem participar.

### Relacionamento

Um projeto pode possuir vários docentes e um docente pode participar de vários projetos.

```text
DOCENTE N ───── N PROJETO_PESQUISA
```

Esse relacionamento deverá ser representado posteriormente por uma entidade associativa.

---

## 5.4 Produção

Representa uma produção acadêmica ou técnica.

Exemplos:

* artigo;
* livro;
* capítulo;
* trabalho em evento;
* produção técnica;
* patente;
* registro.

### Relacionamento

Uma produção pode possuir vários autores e um docente pode possuir várias produções.

```text
DOCENTE N ───── N PRODUÇÃO
```

O relacionamento deverá ser representado por uma entidade associativa denominada conceitualmente **Autoria**.

---

## 5.5 Autoria

Representa a participação de um docente em uma determinada produção.

### Responsabilidade

Permitir preservar informações como:

* docente;
* produção;
* ordem de autoria;
* participação.

### Relacionamento

```text
DOCENTE 1 ───── N AUTORIA N ───── 1 PRODUÇÃO
```

---

## 5.6 Orientação

Representa uma orientação acadêmica realizada pelo docente.

Exemplos:

* iniciação;
* mestrado;
* doutorado;
* supervisão;
* outras orientações relevantes.

### Relacionamento

```text
DOCENTE 1 ───── N ORIENTAÇÃO
```

---

## 5.7 Atividade de Extensão

Representa uma atividade de extensão associada a um docente.

### Relacionamentos

```text
DOCENTE 1 ───── N ATIVIDADE_EXTENSÃO

PERÍODO 1 ───── N ATIVIDADE_EXTENSÃO
```

---

## 5.8 Projeto de Extensão

Representa um projeto de extensão que pode envolver vários docentes.

### Relacionamento

```text
DOCENTE N ───── N PROJETO_EXTENSÃO
```

Esse relacionamento deverá ser representado posteriormente por uma entidade associativa.

---

# 6. Período

## 6.1 Período

Representa uma unidade temporal utilizada para organizar e analisar informações acadêmicas.

Um período poderá representar, por exemplo:

```text
2026
2026.1
2026.2
```

A definição exata do formato será realizada posteriormente no modelo lógico.

### Responsabilidade

Permitir:

* análise histórica;
* comparação entre períodos;
* associação de atividades;
* cálculo de indicadores.

### Relacionamentos

```text
PERÍODO 1 ───── N ATIVIDADE_ENSINO
PERÍODO 1 ───── N ATIVIDADE_EXTENSÃO
PERÍODO 1 ───── N RESULTADO_INDICADOR
```

---

# 7. Classificação

## 7.1 Critério

Representa uma regra ou conjunto de critérios utilizados para avaliar ou classificar informações acadêmicas.

Exemplos:

* classificação de produção;
* critérios de qualidade;
* parâmetros institucionais.

### Responsabilidade

Definir os critérios utilizados nas classificações e análises.

---

## 7.2 Classificação

Representa a aplicação de um critério a uma determinada produção.

### Relacionamentos

```text
PRODUÇÃO 1 ───── N CLASSIFICAÇÃO

CRITÉRIO 1 ───── N CLASSIFICAÇÃO
```

Uma produção poderá possuir diferentes classificações ao longo do tempo ou de acordo com diferentes versões de critérios.

---

# 8. Indicadores

## 8.1 Indicador

Representa uma métrica utilizada para analisar o desempenho acadêmico.

Um indicador deverá possuir uma definição e uma regra de cálculo.

Exemplos conceituais:

* produção científica;
* produção qualificada;
* atividades de Ensino;
* atividades de Extensão;
* orientações.

### Responsabilidade

Definir o que deve ser medido.

---

## 8.2 Resultado do Indicador

Representa o resultado de um indicador calculado para determinado contexto.

O contexto poderá envolver:

* docente;
* programa;
* período;
* dimensão acadêmica.

### Relacionamentos

```text
INDICADOR 1 ───── N RESULTADO_INDICADOR

PERÍODO 1 ───── N RESULTADO_INDICADOR
```

---

# 9. Rastreabilidade

## 9.1 Fonte do Dado

Representa a origem de uma informação utilizada pelo sistema.

A fonte poderá identificar:

* currículo;
* importação;
* seção;
* página;
* referência original;
* processamento responsável.

### Objetivo

Permitir responder:

> "De onde veio esse dado?"

Exemplo conceitual:

```text
RESULTADO
   ↓
DADO ACADÊMICO
   ↓
FONTE DO DADO
   ↓
IMPORTAÇÃO
   ↓
CURRÍCULO
   ↓
PDF ORIGINAL
```

---

# 10. Auditoria

## 10.1 Usuário

Representa uma pessoa autorizada a utilizar o sistema.

---

## 10.2 Auditoria

Representa uma operação relevante realizada no sistema.

Poderá registrar:

* usuário;
* operação;
* entidade afetada;
* data;
* alteração realizada.

### Relacionamento

```text
USUÁRIO 1 ───── N AUDITORIA
```

---

# 11. Relacionamentos Principais

O modelo conceitual pode ser resumido da seguinte forma:

```text
INSTITUIÇÃO
    │
    │ 1:N
    ▼
PROGRAMA
    │
    │ 1:N
    ▼
DOCENTE
    │
    ├─────────────── 1:N ─────────────── FORMAÇÃO
    │
    ├─────────────── 1:N ─────────────── ATIVIDADE_ENSINO
    │
    ├─────────────── 1:N ─────────────── ORIENTAÇÃO
    │
    ├─────────────── 1:N ─────────────── ATIVIDADE_EXTENSÃO
    │
    │
    ├─────────────── N:N ─────────────── PROJETO_PESQUISA
    │
    ├─────────────── N:N ─────────────── PROJETO_EXTENSÃO
    │
    └─────────────── N:N ─────────────── PRODUÇÃO
                                      │
                                      │ 1:N
                                      ▼
                                CLASSIFICAÇÃO
                                      │
                                      │ N:1
                                      ▼
                                   CRITÉRIO
```

---

# 12. Núcleo de Ingestão

O fluxo de ingestão deverá ser representado conceitualmente por:

```text
DOCENTE
   │
   ▼
CURRÍCULO
   │
   ▼
IMPORTAÇÃO
   │
   ▼
PROCESSAMENTO
   │
   ▼
PARSER_VERSÃO
   │
   ▼
DADOS ACADÊMICOS
```

---

# 13. Núcleo de Análise

Após a estruturação dos dados:

```text
DADOS ACADÊMICOS
       │
       ├───────────────► CLASSIFICAÇÃO
       │                       │
       │                       ▼
       │                    CRITÉRIO
       │
       └───────────────► INDICADORES
                              │
                              ▼
                       RESULTADO_INDICADOR
                              │
                              ▼
                           PERÍODO
```

---

# 14. Núcleo de Rastreabilidade

A rastreabilidade deverá seguir conceitualmente:

```text
INDICADOR
    ↓
RESULTADO
    ↓
DADOS UTILIZADOS
    ↓
FONTE DO DADO
    ↓
PROCESSAMENTO
    ↓
IMPORTAÇÃO
    ↓
CURRÍCULO
    ↓
PDF ORIGINAL
```

---

# 15. Visão Conceitual Completa

```text
                           ┌──────────────┐
                           │ INSTITUIÇÃO  │
                           └──────┬───────┘
                                  │
                                  │ 1:N
                                  ▼
                           ┌──────────────┐
                           │   PROGRAMA   │
                           └──────┬───────┘
                                  │
                                  │ 1:N
                                  ▼
                           ┌──────────────┐
                           │   DOCENTE    │
                           └──────┬───────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
       ┌───────────┐       ┌───────────────┐     ┌────────────┐
       │ FORMAÇÃO  │       │    ENSINO     │     │ ORIENTAÇÃO │
       └───────────┘       └───────────────┘     └────────────┘
                                  │
                                  ▼
                             ┌──────────┐
                             │ PERÍODO  │
                             └──────────┘

             ┌─────────────────────────────────────────┐
             │                                         │
             ▼                                         ▼
     ┌─────────────────┐                       ┌──────────────────┐
     │    PRODUÇÃO     │                       │ PROJETO PESQUISA │
     └────────┬────────┘                       └──────────────────┘
              │
              ▼
       ┌──────────────┐
       │ CLASSIFICAÇÃO│
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │   CRITÉRIO   │
       └──────────────┘


DOCENTE
   │
   ▼
CURRÍCULO
   │
   ▼
IMPORTAÇÃO
   │
   ▼
PROCESSAMENTO
   │
   ▼
PARSER_VERSÃO


DADOS ACADÊMICOS
       │
       ▼
   INDICADOR
       │
       ▼
RESULTADO_INDICADOR
       │
       ▼
     PERÍODO


DADOS
  │
  ▼
FONTE_DO_DADO
  │
  ▼
PROCESSAMENTO
  │
  ▼
IMPORTAÇÃO
  │
  ▼
CURRÍCULO
```

---

# 16. Decisões Conceituais

O modelo adota as seguintes decisões:

### DC-001 — Currículo não representa apenas o estado atual

O sistema deverá permitir preservar diferentes importações e versões dos dados.

### DC-002 — Importação é diferente de currículo

O currículo representa a fonte acadêmica, enquanto a importação representa uma operação de ingestão.

### DC-003 — Processamento é separado da importação

Uma importação poderá possuir diferentes execuções de processamento.

### DC-004 — Parser é versionado

Cada processamento deverá identificar a versão do parser utilizada.

### DC-005 — Produção possui múltiplos autores

O relacionamento entre docente e produção será muitos-para-muitos.

### DC-006 — Projetos podem possuir múltiplos docentes

Projetos de Pesquisa e Extensão deverão suportar múltiplos participantes.

### DC-007 — Classificação é separada da produção

Uma produção pode existir sem classificação.

### DC-008 — Indicador é separado dos dados

Indicadores deverão ser calculados a partir dos dados acadêmicos, e não armazenados dentro das entidades acadêmicas.

### DC-009 — Rastreabilidade é parte do domínio

A origem das informações deverá ser tratada como parte fundamental do modelo.

### DC-010 — Dados históricos devem ser preservados

Alterações de parser, critérios e processamentos não deverão eliminar informações históricas relevantes.

---

# 17. Fora do Escopo deste Modelo

Este documento não define ainda:

* tipos de dados;
* nomes definitivos das colunas;
* chaves primárias;
* chaves estrangeiras;
* índices;
* constraints;
* normalização física;
* tecnologia do banco;
* SQL;
* migrations.

Essas decisões serão realizadas na etapa de **Modelo Lógico de Dados**.

---

# 18. Próxima Etapa

Após a validação deste modelo conceitual, deverão ser realizadas as seguintes etapas:

```text
Modelo Conceitual
       ↓
Revisão das Entidades
       ↓
Atributos
       ↓
Cardinalidades
       ↓
Modelo Lógico
       ↓
Dicionário de Dados
       ↓
Modelo Físico
       ↓
Migrations
```

O modelo conceitual deverá ser validado pela equipe de desenvolvimento antes da criação das estruturas físicas do banco.
