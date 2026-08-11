# Backlog — PPGA Analytics

## 1. Objetivo

Este documento apresenta o backlog inicial do **PPGA Analytics**, organizado a partir do Documento de Visão, Requisitos Funcionais, Requisitos Não Funcionais, Regras de Negócio, definição do MVP e resultados das POCs realizadas com Currículos Lattes reais em formato PDF.

O backlog representa o conjunto de trabalhos necessários para construir e validar o MVP.

---

# 2. Convenções

## Prioridades

| Prioridade | Significado           |
| ---------- | --------------------- |
| P0         | Essencial para o MVP  |
| P1         | Importante para o MVP |
| P2         | Pós-MVP               |

## Status

| Status      | Significado                 |
| ----------- | --------------------------- |
| BACKLOG     | Ainda não iniciado          |
| READY       | Pronto para desenvolvimento |
| IN_PROGRESS | Em desenvolvimento          |
| REVIEW      | Em revisão                  |
| DONE        | Concluído                   |
| BLOCKED     | Bloqueado                   |

---

# 3. Visão Geral dos Épicos

| ID    | Épico                             | Prioridade |
| ----- | --------------------------------- | ---------- |
| EP-01 | Fundação do Projeto               | P0         |
| EP-02 | Autenticação e Usuários           | P0         |
| EP-03 | Instituição, Programa e Docentes  | P0         |
| EP-04 | Importação de Currículos Lattes   | P0         |
| EP-05 | Pipeline de Processamento         | P0         |
| EP-06 | Extração e Estruturação Acadêmica | P0         |
| EP-07 | Qualidade e Rastreabilidade       | P0         |
| EP-08 | Ensino                            | P0         |
| EP-09 | Pesquisa e Produção               | P0         |
| EP-10 | Extensão                          | P0         |
| EP-11 | Classificação e Critérios         | P1         |
| EP-12 | Indicadores                       | P0         |
| EP-13 | Dashboard                         | P0         |
| EP-14 | Histórico e Pontos de Atenção     | P1         |
| EP-15 | Relatórios                        | P1         |
| EP-16 | Auditoria                         | P1         |
| EP-17 | Validação com Instituição-Piloto  | P0         |
| EP-18 | Infraestrutura e Qualidade        | P0         |
| EP-19 | Funcionalidades Futuras           | P2         |

---

# 4. EP-01 — Fundação do Projeto

## US-001 — Criar estrutura inicial do projeto

**Prioridade:** P0
**Status:** BACKLOG

Criar a estrutura inicial da aplicação, separando adequadamente:

* frontend;
* backend;
* banco de dados;
* serviços;
* processamento;
* testes;
* configurações.

### Critérios de aceite

* projeto inicial executável;
* estrutura documentada;
* ambiente de desenvolvimento configurado.

---

## US-002 — Configurar controle de versão

**Prioridade:** P0

Configurar repositório Git e estratégia básica de branches.

### Critérios de aceite

* repositório criado;
* `.gitignore` configurado;
* README inicial;
* branch principal definida.

---

## US-003 — Configurar variáveis de ambiente

**Prioridade:** P0

Centralizar configurações sensíveis e específicas de ambiente.

### Critérios de aceite

* variáveis documentadas;
* credenciais fora do código;
* arquivo de exemplo configurado.

---

## US-004 — Configurar banco de dados

**Prioridade:** P0

Configurar conexão e estrutura inicial do banco.

### Critérios de aceite

* banco acessível;
* conexão funcionando;
* migrations configuradas.

---

# 5. EP-02 — Autenticação e Usuários

## US-005 — Criar entidade de usuário

**Prioridade:** P0

Criar estrutura de persistência para usuários.

---

## US-006 — Implementar cadastro

**Prioridade:** P0

Permitir cadastro de usuários autorizados.

---

## US-007 — Implementar login

**Prioridade:** P0

Permitir autenticação utilizando credenciais.

---

## US-008 — Implementar controle de acesso

**Prioridade:** P0

Implementar autorização baseada em perfil.

---

## US-009 — Implementar perfis

**Prioridade:** P0

Criar inicialmente:

* Administrador;
* Coordenador;
* Docente.

---

# 6. EP-03 — Instituição, Programa e Docentes

## US-010 — Criar entidade Instituição

**Prioridade:** P0

---

## US-011 — Criar entidade Programa

**Prioridade:** P0

---

## US-012 — Associar Programa à Instituição

**Prioridade:** P0

---

## US-013 — Criar entidade Docente

**Prioridade:** P0

Deverá contemplar, no mínimo:

* nome;
* ID Lattes;
* programa;
* data da última atualização.

---

## US-014 — Associar docente ao programa

**Prioridade:** P0

---

## US-015 — Criar tela de docentes

**Prioridade:** P0

Permitir:

* listar;
* consultar;
* cadastrar;
* editar docentes.

---

# 7. EP-04 — Importação de Currículos Lattes

## US-016 — Upload de PDF

**Prioridade:** P0

Permitir envio de Currículo Lattes em PDF.

### Critérios de aceite

* aceitar PDF;
* rejeitar formatos inválidos;
* informar erros;
* registrar importação.

---

## US-017 — Validar arquivo

**Prioridade:** P0

Validar:

* extensão;
* MIME type;
* tamanho;
* integridade;
* possibilidade de leitura.

---

## US-018 — Criar registro de importação

**Prioridade:** P0

Registrar:

* arquivo;
* docente;
* usuário;
* data;
* status;
* versão do parser.

---

## US-019 — Exibir status da importação

**Prioridade:** P0

Exibir:

```text
Aguardando
Processando
Concluído
Concluído com alertas
Erro
```

---

## US-020 — Permitir reprocessamento

**Prioridade:** P1

Permitir reprocessar um currículo quando necessário.

---

# 8. EP-05 — Pipeline de Processamento

## US-021 — Implementar extração de texto

**Prioridade:** P0

Extrair texto do PDF.

---

## US-022 — Implementar normalização

**Prioridade:** P0

Normalizar:

* espaços;
* quebras;
* caracteres;
* encoding;
* padrões recorrentes.

---

## US-023 — Identificar seções

**Prioridade:** P0

Identificar seções relevantes do Lattes.

---

## US-024 — Criar arquitetura modular do parser

**Prioridade:** P0

Criar:

```text
LattesParser
├── IdentificationParser
├── FormationParser
├── TeachingParser
├── ResearchParser
├── PublicationParser
├── OrientationParser
├── ExtensionParser
└── TechnicalProductionParser
```

---

## US-025 — Implementar processamento assíncrono

**Prioridade:** P0

Evitar bloqueio da interface durante o processamento.

---

## US-026 — Implementar processamento parcial

**Prioridade:** P1

Permitir que falhas em uma seção não eliminem informações válidas das demais.

---

# 9. EP-06 — Extração e Estruturação Acadêmica

## US-027 — Extrair identificação

**Prioridade:** P0

Extrair:

* nome;
* ID Lattes;
* atualização.

---

## US-028 — Extrair formação

**Prioridade:** P0

Extrair:

* graduação;
* especialização;
* mestrado;
* doutorado;
* pós-doutorado.

---

## US-029 — Extrair atuação profissional

**Prioridade:** P1

---

## US-030 — Extrair Ensino

**Prioridade:** P0

---

## US-031 — Extrair projetos de Pesquisa

**Prioridade:** P0

---

## US-032 — Extrair produção bibliográfica

**Prioridade:** P0

Extrair principalmente:

* artigos;
* livros;
* capítulos;
* trabalhos em eventos.

---

## US-033 — Extrair autores

**Prioridade:** P0

Preservar:

* autores;
* ordem dos autores;
* relação com docente.

---

## US-034 — Extrair orientações

**Prioridade:** P0

Diferenciar:

* em andamento;
* concluídas;
* nível.

---

## US-035 — Extrair produção técnica

**Prioridade:** P1

---

## US-036 — Extrair bancas

**Prioridade:** P1

---

## US-037 — Extrair eventos

**Prioridade:** P1

---

## US-038 — Extrair patentes e registros

**Prioridade:** P1

---

# 10. EP-07 — Qualidade e Rastreabilidade

## US-039 — Criar estados dos dados

**Prioridade:** P0

Implementar:

```text
VÁLIDO
INCOMPLETO
NÃO_CLASSIFICADO
POSSÍVEL_DUPLICIDADE
INCONSISTENTE
NÃO_IDENTIFICADO
```

---

## US-040 — Implementar detecção de duplicidade

**Prioridade:** P0

Utilizar combinações de:

* DOI;
* título;
* autores;
* ano;
* periódico;
* identificadores.

---

## US-041 — Preservar possíveis duplicidades

**Prioridade:** P0

Não excluir automaticamente registros suspeitos.

---

## US-042 — Registrar origem do dado

**Prioridade:** P0

Registrar:

* arquivo;
* importação;
* seção;
* página, quando possível.

---

## US-043 — Registrar texto original

**Prioridade:** P1

Preservar trecho original quando necessário para auditoria.

---

## US-044 — Versionar parser

**Prioridade:** P0

Registrar a versão utilizada em cada processamento.

---

## US-045 — Criar relatório de processamento

**Prioridade:** P1

Exibir:

* quantidade de registros;
* erros;
* alertas;
* dados incompletos;
* possíveis duplicidades.

---

# 11. EP-08 — Ensino

## US-046 — Criar entidade AtividadeEnsino

**Prioridade:** P0

---

## US-047 — Associar Ensino ao docente

**Prioridade:** P0

---

## US-048 — Associar Ensino ao período

**Prioridade:** P0

---

## US-049 — Classificar nível de Ensino

**Prioridade:** P0

Suportar:

* graduação;
* mestrado;
* doutorado.

---

## US-050 — Criar consulta de Ensino

**Prioridade:** P0

Permitir consulta por:

* docente;
* período;
* nível.

---

# 12. EP-09 — Pesquisa e Produção

## US-051 — Criar entidade Produção

**Prioridade:** P0

---

## US-052 — Criar relação Produção-Docente

**Prioridade:** P0

Permitir múltiplos autores.

---

## US-053 — Criar entidade ProjetoPesquisa

**Prioridade:** P0

---

## US-054 — Associar docentes aos projetos

**Prioridade:** P0

---

## US-055 — Criar entidade Orientação

**Prioridade:** P0

---

## US-056 — Classificar orientação

**Prioridade:** P0

Diferenciar:

* andamento;
* concluída.

---

## US-057 — Criar consulta de produção

**Prioridade:** P0

Permitir filtros por:

* docente;
* período;
* tipo;
* classificação.

---

# 13. EP-10 — Extensão

## US-058 — Criar entidade AtividadeExtensao

**Prioridade:** P0

---

## US-059 — Criar entidade ProjetoExtensao

**Prioridade:** P1

---

## US-060 — Associar docente à Extensão

**Prioridade:** P0

---

## US-061 — Associar Extensão ao período

**Prioridade:** P0

---

## US-062 — Diferenciar estados da Extensão

**Prioridade:** P0

O sistema deverá diferenciar:

* identificada;
* não identificada;
* não informada;
* não classificada.

---

# 14. EP-11 — Classificação e Critérios

## US-063 — Criar entidade Critério

**Prioridade:** P1

---

## US-064 — Criar classificação

**Prioridade:** P1

---

## US-065 — Associar classificação à produção

**Prioridade:** P1

---

## US-066 — Permitir classificação manual

**Prioridade:** P1

---

## US-067 — Registrar justificativa

**Prioridade:** P1

---

## US-068 — Versionar critérios

**Prioridade:** P1

---

# 15. EP-12 — Indicadores

## US-069 — Criar entidade Indicador

**Prioridade:** P0

---

## US-070 — Criar regras de cálculo

**Prioridade:** P0

---

## US-071 — Criar indicadores de Ensino

**Prioridade:** P0

---

## US-072 — Criar indicadores de Pesquisa

**Prioridade:** P0

---

## US-073 — Criar indicadores de Extensão

**Prioridade:** P0

---

## US-074 — Criar indicadores por docente

**Prioridade:** P0

---

## US-075 — Criar indicadores consolidados

**Prioridade:** P0

---

## US-076 — Criar indicadores por período

**Prioridade:** P0

---

## US-077 — Implementar rastreabilidade dos indicadores

**Prioridade:** P1

Permitir identificar:

```text
Indicador
 ↓
Regra
 ↓
Critério
 ↓
Dados
 ↓
Fonte
```

---

## US-078 — Implementar versionamento das regras

**Prioridade:** P1

---

## US-079 — Implementar recálculo

**Prioridade:** P1

Recalcular indicadores após alteração de dados ou regras.

---

# 16. EP-13 — Dashboard

## US-080 — Criar dashboard principal

**Prioridade:** P0

---

## US-081 — Criar cards de indicadores

**Prioridade:** P0

---

## US-082 — Criar visualização Ensino/Pesquisa/Extensão

**Prioridade:** P0

---

## US-083 — Criar gráficos históricos

**Prioridade:** P1

---

## US-084 — Criar dashboard do docente

**Prioridade:** P0

---

## US-085 — Criar filtros

**Prioridade:** P0

Filtros:

* período;
* docente;
* dimensão;
* produção;
* classificação.

---

# 17. EP-14 — Histórico e Pontos de Atenção

## US-086 — Criar histórico de indicadores

**Prioridade:** P1

---

## US-087 — Comparar períodos

**Prioridade:** P1

---

## US-088 — Identificar dados incompletos

**Prioridade:** P1

---

## US-089 — Identificar produção não classificada

**Prioridade:** P1

---

## US-090 — Identificar indicadores abaixo de parâmetros

**Prioridade:** P1

---

## US-091 — Identificar variações relevantes

**Prioridade:** P1

---

## US-092 — Criar painel de pontos de atenção

**Prioridade:** P1

---

# 18. EP-15 — Relatórios

## US-093 — Criar relatório do programa

**Prioridade:** P1

---

## US-094 — Criar relatório do docente

**Prioridade:** P1

---

## US-095 — Incluir indicadores

**Prioridade:** P1

---

## US-096 — Incluir critérios

**Prioridade:** P1

---

## US-097 — Incluir período

**Prioridade:** P1

---

## US-098 — Exportar relatório

**Prioridade:** P1

---

# 19. EP-16 — Auditoria

## US-099 — Registrar importações

**Prioridade:** P1

---

## US-100 — Registrar alterações

**Prioridade:** P1

---

## US-101 — Registrar alterações de classificação

**Prioridade:** P1

---

## US-102 — Registrar alterações de critérios

**Prioridade:** P1

---

## US-103 — Criar consulta de auditoria

**Prioridade:** P1

---

# 20. EP-17 — Validação com Instituição-Piloto

## US-104 — Processar os cinco Lattes da POC

**Prioridade:** P0

Utilizar os cinco currículos já empregados na validação inicial como dataset de testes, observando as permissões aplicáveis.

---

## US-105 — Comparar dados extraídos com os PDFs

**Prioridade:** P0

Validar:

* identificação;
* formação;
* artigos;
* orientações;
* Ensino;
* Pesquisa;
* Extensão.

---

## US-106 — Registrar erros do parser

**Prioridade:** P0

---

## US-107 — Corrigir padrões identificados

**Prioridade:** P0

---

## US-108 — Criar testes de regressão

**Prioridade:** P0

Cada correção importante deverá gerar um caso de teste para evitar regressões.

---

## US-109 — Validar indicadores com a instituição

**Prioridade:** P0

---

## US-110 — Coletar feedback

**Prioridade:** P0

Registrar:

* problemas;
* divergências;
* sugestões;
* necessidades;
* funcionalidades futuras.

---

# 21. EP-18 — Infraestrutura e Qualidade

## US-111 — Configurar testes automatizados

**Prioridade:** P0

---

## US-112 — Criar testes unitários do parser

**Prioridade:** P0

---

## US-113 — Criar testes de integração

**Prioridade:** P0

---

## US-114 — Criar testes de processamento completo

**Prioridade:** P0

Validar:

```text
PDF
 ↓
Parser
 ↓
Banco
 ↓
Indicadores
```

---

## US-115 — Configurar logs

**Prioridade:** P0

---

## US-116 — Configurar tratamento de erros

**Prioridade:** P0

---

## US-117 — Configurar backup

**Prioridade:** P1

---

## US-118 — Configurar ambiente de produção

**Prioridade:** P1

---

## US-119 — Documentar instalação

**Prioridade:** P1

---

# 22. EP-19 — Funcionalidades Futuras

As tarefas abaixo não fazem parte do MVP inicial.

## FUT-001 — Integração automática com Lattes

**Prioridade:** P2

---

## FUT-002 — Integração com bases acadêmicas

**Prioridade:** P2

---

## FUT-003 — Benchmarking entre programas

**Prioridade:** P2

---

## FUT-004 — Benchmarking entre instituições

**Prioridade:** P2

---

## FUT-005 — Inteligência Artificial para análise

**Prioridade:** P2

---

## FUT-006 — Análises preditivas

**Prioridade:** P2

---

## FUT-007 — Recomendações automáticas

**Prioridade:** P2

---

## FUT-008 — Arquitetura multi-institucional

**Prioridade:** P2

---

## FUT-009 — SaaS

**Prioridade:** P2

---

## FUT-010 — Aplicativo mobile

**Prioridade:** P2

---

# 23. Ordem de Desenvolvimento Recomendada

O backlog deverá ser executado seguindo dependências técnicas.

```text
FASE 1 — Fundação
│
├── Projeto
├── Banco
├── Autenticação
└── Estrutura inicial
        ↓
FASE 2 — Domínio
│
├── Instituição
├── Programa
├── Docentes
└── Períodos
        ↓
FASE 3 — LATTES
│
├── Upload
├── Validação
├── Extração
├── Normalização
└── Parser
        ↓
FASE 4 — DADOS
│
├── Formação
├── Ensino
├── Pesquisa
├── Produção
├── Orientações
└── Extensão
        ↓
FASE 5 — QUALIDADE
│
├── Deduplicação
├── Validação
├── Rastreabilidade
└── Versionamento
        ↓
FASE 6 — ANÁLISE
│
├── Critérios
├── Classificação
└── Indicadores
        ↓
FASE 7 — VISUALIZAÇÃO
│
├── Dashboard
├── Docente
├── Histórico
└── Pontos de atenção
        ↓
FASE 8 — SAÍDA
│
├── Relatórios
└── Auditoria
        ↓
FASE 9 — VALIDAÇÃO
│
├── Dados reais
├── Correções
├── Testes
└── Feedback
```

---

# 24. Dependências Críticas

As principais dependências são:

### Parser → Dados

O processamento do Lattes precisa existir antes da construção dos indicadores.

### Dados → Indicadores

Indicadores dependem de dados estruturados e validados.

### Critérios → Classificação

A classificação depende da definição dos critérios.

### Classificação → Indicadores de qualidade

Indicadores que consideram qualidade dependem da classificação.

### Períodos → Histórico

A análise histórica depende da existência de períodos.

### Rastreabilidade → Auditoria

A auditoria depende da capacidade de rastrear origem e alterações.

---

# 25. Backlog Prioritário do MVP

Se precisarmos reduzir o backlog ao **menor conjunto possível capaz de provar o produto**, a ordem será:

### Sprint/Etapa 1

* US-001
* US-002
* US-003
* US-004
* US-005
* US-006
* US-007
* US-008

### Sprint/Etapa 2

* US-010
* US-011
* US-012
* US-013
* US-014
* US-015

### Sprint/Etapa 3

* US-016
* US-017
* US-018
* US-019
* US-021
* US-022
* US-023
* US-024

### Sprint/Etapa 4

* US-027
* US-028
* US-030
* US-031
* US-032
* US-033
* US-034
* US-039
* US-042
* US-044

### Sprint/Etapa 5

* US-046
* US-047
* US-048
* US-049
* US-051
* US-052
* US-055
* US-056
* US-058
* US-060
* US-061
* US-062

### Sprint/Etapa 6

* US-063
* US-064
* US-065
* US-069
* US-070
* US-071
* US-072
* US-073
* US-074
* US-075

### Sprint/Etapa 7

* US-080
* US-081
* US-082
* US-084
* US-085

### Sprint/Etapa 8

* US-086
* US-088
* US-089
* US-093
* US-094
* US-098

### Sprint/Etapa 9

* US-104
* US-105
* US-106
* US-107
* US-108
* US-109
* US-110

---

# 26. Definition of Done

Uma tarefa somente deverá ser considerada **DONE** quando:

* implementação concluída;
* testes realizados;
* erros críticos corrigidos;
* integração com os demais componentes validada;
* documentação atualizada quando necessária;
* comportamento compatível com os requisitos;
* código revisado quando aplicável.

---

# 27. Definition of Done do MVP

O MVP completo será considerado concluído quando:

* os cinco Lattes de validação puderem ser processados;
* os dados principais forem extraídos;
* os dados forem persistidos;
* Ensino, Pesquisa e Extensão puderem ser consultados;
* produções puderem ser classificadas;
* indicadores puderem ser calculados;
* dashboard estiver funcionando;
* histórico estiver disponível;
* relatórios puderem ser gerados;
* rastreabilidade estiver funcionando;
* erros relevantes forem tratados;
* instituição-piloto validar os resultados.

---

# 28. Resultado Esperado do Backlog

Ao concluir o backlog prioritário, o PPGA Analytics deverá permitir:

```text
              CURRÍCULO LATTES
                     │
                     ▼
                  UPLOAD
                     │
                     ▼
                PROCESSAMENTO
                     │
                     ▼
              DADOS ESTRUTURADOS
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
        ENSINO     PESQUISA   EXTENSÃO
          │          │          │
          └──────────┼──────────┘
                     ▼
                CLASSIFICAÇÃO
                     │
                     ▼
                 INDICADORES
                     │
              ┌──────┴──────┐
              ▼             ▼
          DASHBOARD      RELATÓRIOS
```

---

# 29. Princípio do Backlog

O backlog deverá seguir o princípio:

> **Primeiro provar o núcleo do produto; depois ampliar o produto.**

O desenvolvimento deverá priorizar a capacidade de transformar Currículos Lattes em dados confiáveis e úteis para análise acadêmica antes da implementação de funcionalidades comerciais ou avançadas.

Isso permitirá validar o produto com a instituição-piloto antes de assumir os custos e riscos de uma plataforma destinada a múltiplas universidades.
