# Modelo Conceitual de Dados — PPGA Analytics

## 1. Objetivo

Representar as entidades e relacionamentos principais do PPGA Analytics sem definir ainda tipos de colunas, SQL ou detalhes físicos.

## 2. Premissas

1. O MVP será utilizado por um único usuário.
2. O MVP será executado em um único computador.
3. O banco será local no MVP.
4. PDFs e XMLs serão temporários.
5. Somente dados estruturados e metadados necessários serão persistidos.
6. Alunos fazem parte do domínio.
7. Produções podem envolver docentes e alunos.

## 3. Entidades

### Estrutura
- Instituição
- Programa
- Docente
- Aluno
- Período

### Ingestão
- Importação
- Processamento
- Versão do Parser

### Acadêmico
- Formação
- Atividade de Ensino
- Projeto de Pesquisa
- Produção
- Autoria/Participação
- Orientação
- Atividade de Extensão
- Projeto de Extensão

### Avaliação
- Critério
- Classificação
- Indicador
- Resultado do Indicador

### Controle
- Usuário
- Auditoria
- Fonte/Origem do Dado

## 4. Relacionamentos principais

```text
INSTITUIÇÃO 1:N PROGRAMA
PROGRAMA 1:N DOCENTE
PROGRAMA 1:N ALUNO

DOCENTE 1:N FORMAÇÃO
DOCENTE 1:N ATIVIDADE_ENSINO
DOCENTE 1:N ORIENTAÇÃO
DOCENTE 1:N ATIVIDADE_EXTENSÃO

DOCENTE N:N PROJETO_PESQUISA
DOCENTE N:N PROJETO_EXTENSÃO

DOCENTE N:N PRODUÇÃO
ALUNO N:N PRODUÇÃO

DOCENTE N:N ALUNO
```

Os relacionamentos N:N deverão ser materializados posteriormente por entidades associativas.

## 5. Produção e participantes

A produção acadêmica não deverá possuir apenas um docente.

Conceitualmente:

```text
DOCENTE ─────┐
             │
             ▼
       PARTICIPAÇÃO
             ▲
             │
ALUNO ───────┘
             │
             ▼
         PRODUÇÃO
```

A participação deverá permitir representar, quando necessário:

- autor;
- coautor;
- participante;
- outra natureza definida pelo domínio.

A ordem de autoria deverá ser preservada quando disponível.

## 6. Relação docente–aluno

A relação docente–aluno deverá poder representar diferentes contextos acadêmicos, principalmente:

- orientação;
- autoria conjunta;
- participação em projeto;
- outras relações identificadas e validadas.

Não deverá ser criada uma única relação genérica para substituir todas as relações específicas quando isso prejudicar a integridade do domínio.

## 7. Pipeline de ingestão

```text
PDF
 ↓
Importação
 ↓
Conversão PDF → XML
 ↓
Processamento
 ↓
Parser
 ↓
Normalização
 ↓
Dados estruturados
 ↓
Banco
```

PDF e XML não são entidades de armazenamento permanente.

## 8. Histórico de processamento

O sistema deverá preservar metadados de processamento, como:

- data;
- status;
- versão do parser;
- quantidade de registros;
- erros;
- alertas.

Isso permite rastrear a origem dos dados sem manter o PDF ou XML.

## 9. Classificação

```text
PRODUÇÃO 1:N CLASSIFICAÇÃO N:1 CRITÉRIO
```

Uma produção poderá ser classificada mais de uma vez conforme critérios/versões diferentes.

As pontuações do rascunho do cliente não serão definidas como regra definitiva neste modelo até validação.

## 10. Indicadores

```text
INDICADOR 1:N RESULTADO_INDICADOR
PERÍODO 1:N RESULTADO_INDICADOR
```

Um resultado poderá ser contextualizado por:

- programa;
- docente;
- aluno;
- período;
- dimensão acadêmica.

## 11. Rastreabilidade

A origem lógica deverá seguir:

```text
DADO ESTRUTURADO
      ↓
PROCESSAMENTO
      ↓
IMPORTAÇÃO
      ↓
DOCENTE
```

Quando possível, também deverão ser preservados:

- seção de origem;
- localização lógica;
- identificador da informação;
- versão do parser.

A rastreabilidade não dependerá da persistência do PDF/XML.

## 12. Visão conceitual

```text
                    INSTITUIÇÃO
                         │
                         ▼
                      PROGRAMA
                    /                            ▼           ▼
               DOCENTE       ALUNO
                 │  \         /  │
                 │   \       /   │
                 │    ▼     ▼    │
                 │   PARTICIPAÇÃO│
                 │        │      │
                 └────────┼──────┘
                          ▼
                       PRODUÇÃO
                          │
                          ▼
                    CLASSIFICAÇÃO
                          │
                          ▼
                       CRITÉRIO


DOCENTE ──1:N── FORMAÇÃO
DOCENTE ──1:N── ENSINO
DOCENTE ──1:N── ORIENTAÇÃO
DOCENTE ──1:N── EXTENSÃO

DOCENTE ──N:N── PROJETO_PESQUISA
DOCENTE ──N:N── PROJETO_EXTENSÃO


PDF
 ↓
IMPORTAÇÃO
 ↓
PROCESSAMENTO
 ↓
PARSER_VERSÃO
 ↓
DADOS ESTRUTURADOS
 ↓
BANCO


DADOS
 ↓
INDICADORES
 ↓
RESULTADO_INDICADOR
 ↓
PERÍODO
```

## 13. Fora do modelo conceitual

Ainda não estão definidos:

- tipos de dados;
- PK/FK;
- índices;
- constraints;
- tabelas físicas;
- tecnologia do banco;
- migrations.

Essas decisões pertencem ao modelo lógico/físico.
