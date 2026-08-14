# Contrato da API --- PPGA Analytics

## 1. Objetivo

Definir o contrato HTTP entre o frontend e o backend do PPGA Analytics.

O contrato estabelece:

-   endpoints;
-   métodos HTTP;
-   parâmetros;
-   payloads;
-   respostas;
-   códigos HTTP;
-   formato de erros;
-   regras gerais de comunicação.

O objetivo é permitir que **frontend e backend sejam desenvolvidos em
paralelo** sem que um lado dependa da implementação interna do outro.

------------------------------------------------------------------------

# 2. Padrão da API

## Base URL

Durante o desenvolvimento:

``` text
http://localhost:3000/api
```

A porta poderá ser alterada por configuração.

## Formato

``` text
REST
JSON
UTF-8
```

Exceção:

-   upload de PDF utiliza `multipart/form-data`.

## Convenção

Endpoints utilizarão:

``` text
/api/<recurso>
```

IDs serão enviados na URL:

``` text
/api/docentes/15
```

------------------------------------------------------------------------

# 3. Princípios

### API não expõe o banco

O frontend não acessará:

``` text
SQLite
Sequelize
Models
Repositories
```

diretamente.

Fluxo:

``` text
Frontend
   ↓ HTTP
API
   ↓
Services
   ↓
Repositories
   ↓
Sequelize
   ↓
SQLite
```

### API não expõe arquivos intermediários

PDF e XML são detalhes internos do processamento.

O frontend recebe informações sobre:

-   importação;
-   processamento;
-   resultado;
-   erros;
-   alertas.

Não recebe o XML interno como requisito do sistema.

------------------------------------------------------------------------

# 4. Headers

## Requisições JSON

``` http
Content-Type: application/json
```

## Upload

``` http
Content-Type: multipart/form-data
```

## Autenticação

Caso a autenticação seja habilitada no MVP:

``` http
Authorization: Bearer <token>
```

A estratégia definitiva de autenticação ainda é uma decisão arquitetural
aberta.

------------------------------------------------------------------------

# 5. Formato padrão de sucesso

Quando aplicável:

``` json
{
  "data": {}
}
```

Listagens:

``` json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

------------------------------------------------------------------------

# 6. Formato padrão de erro

``` json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Descrição amigável do erro.",
    "details": []
  }
}
```

Exemplo:

``` json
{
  "error": {
    "code": "PROCESSAMENTO_FALHOU",
    "message": "Não foi possível processar o currículo.",
    "details": [
      {
        "arquivo": "curriculo-03.pdf",
        "motivo": "XML inválido"
      }
    ]
  }
}
```

Informações internas como stack trace não devem ser enviadas ao
frontend.

------------------------------------------------------------------------

# 7. Códigos HTTP

  Código   Uso
  -------- --------------------------------------
  200      Operação concluída
  201      Recurso criado
  202      Operação aceita para processamento
  204      Operação concluída sem conteúdo
  400      Requisição inválida
  401      Não autenticado
  403      Acesso proibido
  404      Recurso não encontrado
  409      Conflito
  422      Dados semanticamente inválidos
  500      Erro interno
  503      Serviço temporariamente indisponível

------------------------------------------------------------------------

# 8. Importações

A importação é o principal fluxo do sistema.

## 8.1 Criar importação

``` http
POST /api/importacoes
```

### Content-Type

``` text
multipart/form-data
```

### Campo

``` text
files[]
```

Pode receber múltiplos PDFs.

Exemplo conceitual:

``` text
files[]
├── lattes-01.pdf
├── lattes-02.pdf
├── lattes-03.pdf
└── lattes-04.pdf
```

### Resposta

``` http
202 Accepted
```

``` json
{
  "data": {
    "importacaoId": 42,
    "status": "RECEBIDA",
    "arquivos": [
      {
        "nome": "lattes-01.pdf",
        "status": "AGUARDANDO_PROCESSAMENTO"
      },
      {
        "nome": "lattes-02.pdf",
        "status": "AGUARDANDO_PROCESSAMENTO"
      }
    ]
  }
}
```

------------------------------------------------------------------------

# 9. Iniciar processamento

``` http
POST /api/importacoes/:id/processar
```

### Exemplo

``` http
POST /api/importacoes/42/processar
```

### Resposta

``` http
202 Accepted
```

``` json
{
  "data": {
    "importacaoId": 42,
    "status": "PROCESSANDO"
  }
}
```

O processamento poderá ocorrer de forma assíncrona.

O frontend não deverá ficar bloqueado esperando o parser terminar.

------------------------------------------------------------------------

# 10. Consultar importação

``` http
GET /api/importacoes/:id
```

### Resposta

``` json
{
  "data": {
    "id": 42,
    "status": "CONCLUIDA",
    "dataImportacao": "2026-08-12T20:30:00-03:00",
    "arquivos": 14,
    "processamento": {
      "status": "CONCLUIDO",
      "registrosProcessados": 1382,
      "erros": 0,
      "alertas": 9
    }
  }
}
```

------------------------------------------------------------------------

# 11. Listar importações

``` http
GET /api/importacoes
```

### Query parameters

``` text
page
limit
status
```

Exemplo:

``` http
GET /api/importacoes?page=1&limit=20&status=CONCLUIDA
```

------------------------------------------------------------------------

# 12. Processamentos

## Consultar processamento

``` http
GET /api/processamentos/:id
```

### Resposta

``` json
{
  "data": {
    "id": 73,
    "importacaoId": 42,
    "status": "CONCLUIDO",
    "parserVersao": "1.0.0",
    "iniciadoEm": "2026-08-12T20:31:00-03:00",
    "finalizadoEm": "2026-08-12T20:34:12-03:00",
    "registrosProcessados": 1382,
    "erros": 0,
    "alertas": 9
  }
}
```

------------------------------------------------------------------------

# 13. Docentes

## Listar docentes

``` http
GET /api/docentes
```

### Query parameters

``` text
page
limit
search
programaId
ativo
```

Exemplo:

``` http
GET /api/docentes?search=Celso&ativo=true
```

### Resposta

``` json
{
  "data": [
    {
      "id": 1,
      "nome": "Nome do Docente",
      "identificadorLattes": "XXXXXXXXXXXXXXX",
      "categoria": "Docente Permanente",
      "ativo": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

## Consultar docente

``` http
GET /api/docentes/:id
```

A resposta poderá incluir:

-   dados pessoais;
-   formação;
-   produções;
-   orientações;
-   atividades de ensino;
-   projetos;
-   indicadores.

------------------------------------------------------------------------

# 14. Alunos

## Listar alunos

``` http
GET /api/alunos
```

### Query parameters

``` text
page
limit
search
programaId
nivel
situacao
```

## Consultar aluno

``` http
GET /api/alunos/:id
```

------------------------------------------------------------------------

# 15. Relações docente--aluno

## Listar relações

``` http
GET /api/relacoes-docente-aluno
```

### Filtros

``` text
docenteId
alunoId
tipoRelacao
```

## Consultar relação

``` http
GET /api/relacoes-docente-aluno/:id
```

------------------------------------------------------------------------

# 16. Orientações

## Listar orientações

``` http
GET /api/orientacoes
```

### Filtros

``` text
docenteId
alunoId
nivel
status
anoInicio
anoConclusao
```

## Consultar orientação

``` http
GET /api/orientacoes/:id
```

------------------------------------------------------------------------

# 17. Produções

## Listar produções

``` http
GET /api/producoes
```

### Filtros

``` text
page
limit
search
tipo
ano
docenteId
alunoId
```

## Consultar produção

``` http
GET /api/producoes/:id
```

### Resposta

``` json
{
  "data": {
    "id": 100,
    "tipo": "ARTIGO",
    "titulo": "Título da produção",
    "ano": 2025,
    "doi": "10.xxxx/xxxxx",
    "autores": [
      {
        "pessoaId": 1,
        "nome": "Autor 1",
        "ordem": 1
      }
    ]
  }
}
```

------------------------------------------------------------------------

# 18. Formação

## Listar formações de um docente

``` http
GET /api/docentes/:id/formacoes
```

------------------------------------------------------------------------

# 19. Ensino

## Listar atividades de ensino

``` http
GET /api/atividades-ensino
```

### Filtros

``` text
docenteId
periodoId
tipo
nivel
```

------------------------------------------------------------------------

# 20. Pesquisa

## Listar projetos de pesquisa

``` http
GET /api/projetos/pesquisa
```

### Filtros

``` text
pessoaId
ano
```

## Consultar projeto

``` http
GET /api/projetos/pesquisa/:id
```

------------------------------------------------------------------------

# 21. Extensão

## Listar projetos de extensão

``` http
GET /api/projetos/extensao
```

### Filtros

``` text
pessoaId
ano
```

## Consultar projeto

``` http
GET /api/projetos/extensao/:id
```

------------------------------------------------------------------------

# 22. Critérios de avaliação

## Listar critérios

``` http
GET /api/criterios
```

## Consultar critério

``` http
GET /api/criterios/:id
```

Os critérios serão versionados.

Exemplo:

``` json
{
  "data": {
    "id": 1,
    "nome": "Classificação de Produção",
    "versao": "1.0",
    "ativo": true
  }
}
```

------------------------------------------------------------------------

# 23. Classificações

## Listar classificações

``` http
GET /api/classificacoes
```

### Filtros

``` text
producaoId
criterioId
classificacao
```

## Consultar classificação

``` http
GET /api/classificacoes/:id
```

------------------------------------------------------------------------

# 24. Indicadores

## Listar indicadores

``` http
GET /api/indicadores
```

## Consultar indicador

``` http
GET /api/indicadores/:id
```

## Consultar resultados

``` http
GET /api/indicadores/:id/resultados
```

### Filtros

``` text
periodoId
docenteId
alunoId
```

### Resposta

``` json
{
  "data": {
    "indicador": {
      "id": 1,
      "nome": "Produção Acadêmica",
      "versaoRegra": "1.0"
    },
    "resultados": [
      {
        "docenteId": 1,
        "periodoId": 2025,
        "valor": 18.5
      }
    ]
  }
}
```

------------------------------------------------------------------------

# 25. Dashboard

O dashboard poderá utilizar endpoints específicos ou combinar endpoints
existentes.

Uma primeira proposta:

``` http
GET /api/dashboard/resumo
```

### Resposta

``` json
{
  "data": {
    "docentes": 14,
    "alunos": 87,
    "producoes": 1382,
    "orientacoes": 117,
    "projetosPesquisa": 42,
    "projetosExtensao": 18
  }
}
```

Outro endpoint:

``` http
GET /api/dashboard/producao
```

para dados destinados a gráficos de produção.

------------------------------------------------------------------------

# 26. Relatórios

Relatórios são consultas agregadas e não necessariamente correspondem
diretamente a uma tabela.

Exemplos:

``` http
GET /api/relatorios/docentes
GET /api/relatorios/producao
GET /api/relatorios/orientacoes
GET /api/relatorios/ensino
GET /api/relatorios/pesquisa
GET /api/relatorios/extensao
```

A estrutura final deverá ser refinada conforme os critérios de avaliação
fornecidos pelo cliente.

------------------------------------------------------------------------

# 27. Paginação

Listagens deverão utilizar paginação.

Exemplo:

``` http
GET /api/producoes?page=2&limit=50
```

Resposta:

``` json
{
  "data": [],
  "meta": {
    "page": 2,
    "limit": 50,
    "total": 1382,
    "totalPages": 28
  }
}
```

------------------------------------------------------------------------

# 28. Busca

Campos de busca deverão ser tratados pelo backend.

Exemplo:

``` http
GET /api/docentes?search=Maria
```

O frontend não deverá baixar todos os docentes para filtrar localmente
quando a quantidade puder crescer.

------------------------------------------------------------------------

# 29. Ordenação

Quando necessário:

``` text
sortBy
sortOrder
```

Exemplo:

``` http
GET /api/producoes?sortBy=ano&sortOrder=desc
```

Valores aceitos deverão ser definidos por endpoint para evitar consultas
arbitrárias.

------------------------------------------------------------------------

# 30. Validação de upload

A API deverá validar:

-   extensão;
-   MIME type quando disponível;
-   tamanho máximo;
-   quantidade máxima;
-   arquivo vazio;
-   arquivo corrompido.

Exemplo de erro:

``` json
{
  "error": {
    "code": "ARQUIVO_INVALIDO",
    "message": "O arquivo informado não é um PDF válido."
  }
}
```

------------------------------------------------------------------------

# 31. Estados de importação

Estados sugeridos:

``` text
RECEBIDA
PROCESSANDO
CONCLUIDA
CONCLUIDA_COM_ALERTAS
FALHOU
```

Fluxo:

``` text
RECEBIDA
   ↓
PROCESSANDO
   ↓
CONCLUIDA
```

ou:

``` text
PROCESSANDO
   ↓
CONCLUIDA_COM_ALERTAS
```

ou:

``` text
PROCESSANDO
   ↓
FALHOU
```

------------------------------------------------------------------------

# 32. Estados de processamento

``` text
AGUARDANDO
PROCESSANDO
CONCLUIDO
CONCLUIDO_COM_ALERTAS
FALHOU
```

O frontend deverá conseguir consultar o estado sem precisar conhecer o
funcionamento interno do parser.

------------------------------------------------------------------------

# 33. Idempotência e reprocessamento

O sistema deverá evitar duplicação quando o mesmo currículo for
importado novamente.

O backend deverá utilizar o `hash_arquivo` como uma das informações para
detectar o mesmo arquivo.

Porém:

``` text
mesmo arquivo ≠ necessariamente mesmos dados
```

Por isso, a estratégia de reprocessamento deverá permitir atualizar os
dados quando o currículo tiver sido modificado.

A regra definitiva será implementada no `ImportacaoService`.

------------------------------------------------------------------------

# 34. Reprocessamento

Endpoint proposto:

``` http
POST /api/processamentos/:id/reprocessar
```

### Resposta

``` http
202 Accepted
```

``` json
{
  "data": {
    "processamentoAnteriorId": 73,
    "novoProcessamentoId": 74,
    "status": "AGUARDANDO"
  }
}
```

O reprocessamento deverá registrar a nova versão do parser.

------------------------------------------------------------------------

# 35. Versionamento da API

A primeira versão será:

``` text
/api/v1
```

Exemplo:

``` http
GET /api/v1/docentes
```

A partir daqui, o contrato pode evoluir sem quebrar versões anteriores.

------------------------------------------------------------------------

# 36. Contrato de resposta de listagem

Todas as listagens deverão seguir estrutura consistente:

``` json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

------------------------------------------------------------------------

# 37. Contrato de erro de validação

``` json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Existem dados inválidos.",
    "details": [
      {
        "field": "email",
        "message": "E-mail inválido."
      }
    ]
  }
}
```

------------------------------------------------------------------------

# 38. Saúde da API

Endpoint:

``` http
GET /api/v1/health
```

Resposta:

``` json
{
  "data": {
    "status": "ok",
    "database": "ok"
  }
}
```

Esse endpoint será útil para desenvolvimento e diagnóstico da aplicação.

------------------------------------------------------------------------

# 39. Segurança da API

Mesmo em ambiente local:

-   validar todos os inputs;
-   não aceitar caminhos de arquivo arbitrários;
-   não expor stack trace;
-   validar upload;
-   proteger credenciais;
-   utilizar hash para senhas;
-   limitar tamanho de payload;
-   utilizar queries parametrizadas/ORM.

------------------------------------------------------------------------

# 40. Contrato mínimo do MVP

Os endpoints prioritários para a primeira versão são:

``` text
GET  /api/v1/health

POST /api/v1/importacoes
GET  /api/v1/importacoes
GET  /api/v1/importacoes/:id
POST /api/v1/importacoes/:id/processar

GET  /api/v1/processamentos/:id
POST /api/v1/processamentos/:id/reprocessar

GET  /api/v1/docentes
GET  /api/v1/docentes/:id
GET  /api/v1/docentes/:id/formacoes

GET  /api/v1/alunos
GET  /api/v1/alunos/:id

GET  /api/v1/relacoes-docente-aluno
GET  /api/v1/orientacoes

GET  /api/v1/producoes
GET  /api/v1/producoes/:id

GET  /api/v1/atividades-ensino

GET  /api/v1/projetos/pesquisa
GET  /api/v1/projetos/extensao

GET  /api/v1/criterios
GET  /api/v1/classificacoes

GET  /api/v1/indicadores
GET  /api/v1/indicadores/:id/resultados

GET  /api/v1/dashboard/resumo
```

------------------------------------------------------------------------

# 41. O que o contrato não define

Este documento não define:

-   implementação interna dos Services;
-   implementação dos Repositories;
-   SQL;
-   Models Sequelize;
-   algoritmo do parser;
-   fórmula definitiva dos indicadores;
-   tecnologia definitiva do frontend;
-   layout das telas.

Esses itens pertencem às respectivas camadas.

------------------------------------------------------------------------

# 42. Regra de ouro

O contrato deve permitir que o frontend saiba:

> "O que posso pedir à API e o que vou receber?"

Sem precisar saber:

> "Como o backend fez isso?"

Da mesma forma, o backend deve poder mudar:

``` text
Sequelize
Parser
SQL
estrutura interna
```

sem quebrar o contrato público da API.

------------------------------------------------------------------------

# 43. Próxima etapa

Com o contrato aprovado:

``` text
Arquitetura
      ↓
Contrato da API ✅
      ↓
Estrutura do projeto
      ↓
Configuração Node.js
      ↓
Express
      ↓
Sequelize + SQLite
      ↓
Migrations
      ↓
Models
      ↓
Services / Repositories
      ↓
Parser
      ↓
Endpoints
      ↓
Frontend
```

A implementação deverá começar pelos endpoints e contratos do MVP,
deixando funcionalidades secundárias para etapas posteriores.
