# Arquitetura do Sistema --- PPGA Analytics

## 1. Objetivo

Definir a arquitetura técnica do PPGA Analytics a partir dos requisitos,
POCs e modelos de dados já aprovados.

### Stack inicial

  Camada                    Tecnologia
  ------------------------- --------------------
  Linguagem do backend      JavaScript
  Runtime                   Node.js
  Framework HTTP            Express.js
  ORM                       Sequelize
  Banco de dados            SQLite
  Parser                    JavaScript/Node.js
  Entrada                   PDF
  Conversão intermediária   XML
  Frontend                  A definir
  API                       REST

------------------------------------------------------------------------

# 2. Contexto do sistema

O PPGA Analytics será inicialmente executado em um único computador e
utilizado por um único usuário.

A aplicação deverá:

1.  receber um ou vários PDFs de Currículos Lattes;
2.  processar os arquivos;
3.  converter os PDFs para XML;
4.  interpretar o XML;
5.  extrair dados acadêmicos;
6.  normalizar e relacionar os dados;
7.  persistir os dados estruturados no SQLite;
8.  executar critérios e indicadores;
9.  apresentar os resultados ao usuário;
10. permitir análises posteriores sem depender dos PDFs/XML originais.

------------------------------------------------------------------------

# 3. Visão geral da arquitetura

``` text
┌─────────────────────────────────────────────────────┐
│                    USUÁRIO                          │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                  FRONTEND                           │
│                                                     │
│ Dashboard • Importação • Docentes • Alunos         │
│ Produções • Indicadores • Avaliações • Relatórios   │
└────────────────────────┬────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────┐
│              BACKEND — NODE.JS                     │
│                                                     │
│ Routes → Controllers → Services → Repositories      │
│                    │                                │
│                    ▼                                │
│             Domínio / Regras                        │
│                    │                                │
│                    ▼                                │
│                  Parser                              │
└───────────────┬───────────────────┬─────────────────┘
                │                   │
                ▼                   ▼
       Conversor PDF → XML       Sequelize
                │                   │
                ▼                   ▼
          XML temporário       SQLite local
                                    │
                                    ▼
                              ppga_analytics.db
```

------------------------------------------------------------------------

# 4. Arquitetura em camadas

A aplicação será organizada em camadas para separar responsabilidades.

``` text
Presentation
     ↓
Application
     ↓
Domain
     ↓
Infrastructure
```

No backend Node.js:

``` text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Sequelize
  ↓
SQLite
```

O parser ficará como um módulo especializado dentro da camada de
domínio/aplicação.

------------------------------------------------------------------------

# 5. Frontend

O frontend será responsável pela interface do usuário.

Principais funcionalidades previstas:

-   Dashboard;
-   importação de currículos;
-   acompanhamento do processamento;
-   listagem de docentes;
-   listagem de alunos;
-   visualização de produções;
-   relações docente--aluno;
-   orientações;
-   Ensino;
-   Pesquisa;
-   Extensão;
-   classificações;
-   indicadores;
-   gráficos;
-   relatórios.

O frontend não deverá acessar o SQLite diretamente.

``` text
Frontend
   ↓
HTTP
   ↓
API
   ↓
Backend
   ↓
Banco
```

------------------------------------------------------------------------

# 6. Backend

O backend será desenvolvido em:

``` text
Node.js
JavaScript
Express.js
Sequelize
SQLite
```

Responsabilidades:

-   autenticação/autorização quando necessária;
-   recebimento dos arquivos;
-   controle das importações;
-   execução do processamento;
-   comunicação com o parser;
-   persistência;
-   regras de negócio;
-   cálculos;
-   indicadores;
-   consultas;
-   relatórios;
-   auditoria.

------------------------------------------------------------------------

# 7. Routes

As routes definem os endpoints da API.

Exemplos:

``` text
POST   /api/importacoes
GET    /api/importacoes
GET    /api/importacoes/:id
POST   /api/importacoes/:id/processar

GET    /api/docentes
GET    /api/docentes/:id

GET    /api/alunos
GET    /api/alunos/:id

GET    /api/producoes
GET    /api/producoes/:id

GET    /api/orientacoes

GET    /api/indicadores
GET    /api/indicadores/:id/resultados

GET    /api/avaliacoes
```

Os endpoints definitivos serão definidos durante o contrato da API.

------------------------------------------------------------------------

# 8. Controllers

Controllers recebem as requisições HTTP e devolvem respostas.

Responsabilidades:

-   validar entrada básica;
-   chamar o Service;
-   definir status HTTP;
-   formatar resposta;
-   encaminhar erros.

O Controller não deverá:

-   executar SQL;
-   conter regra complexa de negócio;
-   interpretar XML;
-   calcular indicadores diretamente.

Exemplo conceitual:

``` javascript
async function importar(req, res) {
    const resultado = await importacaoService.importar(req.file);

    return res.status(201).json(resultado);
}
```

------------------------------------------------------------------------

# 9. Services

Services concentram as regras de aplicação e negócio.

Exemplos:

``` text
ImportacaoService
ProcessamentoService
DocenteService
AlunoService
ProducaoService
OrientacaoService
AvaliacaoService
IndicadorService
RelatorioService
```

Exemplo:

``` text
ImportacaoService
      ↓
ProcessamentoService
      ↓
ParserService
      ↓
PersistenciaService
```

------------------------------------------------------------------------

# 10. Parser

O parser é um componente central do sistema.

Pipeline:

``` text
PDF
 ↓
Conversor
 ↓
XML
 ↓
XML Parser
 ↓
Normalização
 ↓
Validação
 ↓
Objetos de domínio
 ↓
Persistência
```

O parser não deverá acessar diretamente os Controllers.

Também não deverá conhecer detalhes de HTTP.

------------------------------------------------------------------------

# 11. Estrutura interna do parser

O parser deverá ser dividido em etapas.

``` text
PDF Converter
      ↓
XML Reader
      ↓
Section Extractor
      ↓
Domain Extractors
      ↓
Normalizer
      ↓
Matcher
      ↓
Validator
      ↓
Structured Data
```

### PDF Converter

Converte o PDF para XML.

### XML Reader

Lê a estrutura XML.

### Section Extractor

Identifica seções do currículo:

-   Produção;
-   Orientação;
-   Ensino;
-   Pesquisa;
-   Extensão;
-   Formação etc.

### Domain Extractors

Extraem entidades específicas.

Exemplo:

``` text
ArticleExtractor
OrientationExtractor
ResearchProjectExtractor
TeachingExtractor
ExtensionExtractor
```

### Normalizer

Normaliza:

-   nomes;
-   datas;
-   tipos;
-   textos;
-   identificadores.

### Matcher

Tenta relacionar pessoas existentes com novas ocorrências.

Prioridade:

``` text
Lattes ID
   ↓
identificador confiável
   ↓
nome normalizado
   ↓
evidências adicionais
```

### Validator

Verifica se os dados extraídos possuem consistência mínima antes da
persistência.

------------------------------------------------------------------------

# 12. Repositories

Repositories isolam a persistência.

Exemplos:

``` text
PessoaRepository
DocenteRepository
AlunoRepository
ProducaoRepository
AutoriaRepository
OrientacaoRepository
ProjetoRepository
IndicadorRepository
```

Responsabilidade:

``` text
Service
   ↓
Repository
   ↓
Sequelize Model
   ↓
SQLite
```

O Service não deverá executar consultas SQL diretamente.

------------------------------------------------------------------------

# 13. Sequelize

O Sequelize será utilizado como ORM.

Responsabilidades:

-   definição dos Models;
-   relacionamentos;
-   consultas;
-   transações;
-   persistência;
-   integração com SQLite.

Exemplo conceitual:

``` javascript
class Pessoa extends Model {}

Pessoa.init(
    {
        nomeCompleto: DataTypes.STRING,
        identificadorLattes: DataTypes.STRING,
        nomeNormalizado: DataTypes.STRING
    },
    {
        sequelize,
        modelName: "Pessoa"
    }
);
```

As migrations do banco deverão continuar sendo a fonte de verdade da
evolução do schema.

Não utilizar `sequelize.sync()` como mecanismo principal de evolução do
banco em produção.

------------------------------------------------------------------------

# 14. Models

Os Models representam as tabelas do banco.

Exemplos:

``` text
Pessoa
Instituicao
Programa
Docente
Aluno
Periodo
ParserVersao
Importacao
Processamento
Formacao
Producao
Autoria
RelacaoDocenteAluno
Orientacao
AtividadeEnsino
ProjetoPesquisa
ParticipacaoProjetoPesquisa
ProjetoExtensao
ParticipacaoProjetoExtensao
Criterio
Classificacao
Indicador
ResultadoIndicador
OrigemDado
Usuario
Auditoria
```

------------------------------------------------------------------------

# 15. Migrations + Sequelize

A arquitetura deverá separar:

``` text
Migrations
     ↓
estrutura do banco

Models
     ↓
representação das tabelas no código
```

Não confundir:

``` text
Migration ≠ Model
```

A migration cria/altera a tabela.

O Model permite que o código JavaScript trabalhe com essa tabela através
do Sequelize.

------------------------------------------------------------------------

# 16. Transações

Importações devem utilizar transações quando houver múltiplas gravações
relacionadas.

Exemplo:

``` text
Importação
   ↓
Processamento
   ↓
Pessoa
   ↓
Docente
   ↓
Produção
   ↓
Autoria
   ↓
Orientação
```

Se uma etapa crítica falhar:

``` text
BEGIN
   ↓
operações
   ↓
ERRO
   ↓
ROLLBACK
```

Se tudo funcionar:

``` text
BEGIN
   ↓
operações
   ↓
SUCESSO
   ↓
COMMIT
```

------------------------------------------------------------------------

# 17. Fluxo completo de importação

``` text
Usuário
  │
  │ seleciona PDFs
  ▼
Frontend
  │
  │ POST /api/importacoes
  ▼
ImportacaoController
  │
  ▼
ImportacaoService
  │
  ▼
Arquivo temporário
  │
  ▼
Conversor PDF → XML
  │
  ▼
ProcessamentoService
  │
  ▼
Parser
  │
  ├── identifica seções
  ├── extrai dados
  ├── normaliza
  ├── relaciona pessoas
  └── valida
  │
  ▼
Repositories
  │
  ▼
Sequelize
  │
  ▼
SQLite
  │
  ▼
resultado da importação
  │
  ▼
Frontend
```

------------------------------------------------------------------------

# 18. Tratamento de arquivos temporários

Os PDFs e XMLs não serão persistidos permanentemente.

Exemplo:

``` text
/temp
   └── importacao-123/
       ├── curriculo-01.pdf
       └── curriculo-01.xml
```

Após o processamento:

``` text
processamento concluído
        ↓
dados persistidos
        ↓
arquivos temporários removidos
```

Em caso de erro:

``` text
erro
 ↓
registrar erro
 ↓
preservar metadados do processamento
 ↓
remover arquivos temporários
```

A retenção temporária de arquivos deverá ser definida pela
implementação.

------------------------------------------------------------------------

# 19. Tratamento de erros

A API deverá possuir tratamento centralizado.

Estrutura conceitual:

``` text
Erro
 ↓
Service/Controller
 ↓
Error Middleware
 ↓
HTTP Response
```

Exemplo:

``` json
{
    "error": {
        "code": "PROCESSAMENTO_FALHOU",
        "message": "Não foi possível processar o currículo."
    }
}
```

Erros técnicos detalhados devem ser registrados internamente quando
necessário.

------------------------------------------------------------------------

# 20. Validação

A validação ocorrerá em diferentes níveis.

### Entrada

Verificar:

-   extensão;
-   tamanho;
-   quantidade de arquivos;
-   arquivo legível.

### Parser

Verificar:

-   XML válido;
-   seções reconhecidas;
-   campos obrigatórios;
-   inconsistências.

### Domínio

Verificar:

-   relações válidas;
-   identificadores;
-   duplicidades;
-   regras de negócio.

### Banco

Garantir:

-   PK;
-   FK;
-   UNIQUE;
-   NOT NULL;
-   CHECK.

------------------------------------------------------------------------

# 21. Segurança

Mesmo sendo uma aplicação local, deverão existir cuidados básicos:

-   não armazenar senha em texto puro;
-   utilizar hash de senha;
-   validar arquivos recebidos;
-   evitar path traversal;
-   limitar tamanho dos arquivos;
-   não expor detalhes internos dos erros;
-   validar entradas da API;
-   proteger operações administrativas.

------------------------------------------------------------------------

# 22. Observabilidade

O sistema deverá registrar:

-   início do processamento;
-   fim do processamento;
-   quantidade de registros;
-   erros;
-   alertas;
-   versão do parser;
-   origem lógica dos dados.

Exemplo:

``` text
Processamento #42
Parser: 1.2.0
Currículos: 14
Produções: 1.382
Orientações: 117
Alertas: 9
Erros: 0
Status: CONCLUIDO
```

------------------------------------------------------------------------

# 23. Estrutura de pastas proposta

``` text
ppga-analytics/
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │
│   ├── routes/
│   │
│   ├── controllers/
│   │
│   ├── services/
│   │
│   ├── repositories/
│   │
│   ├── models/
│   │
│   ├── database/
│   │   ├── connection.js
│   │   └── index.js
│   │
│   ├── migrations/
│   │
│   ├── parser/
│   │   ├── converters/
│   │   ├── readers/
│   │   ├── extractors/
│   │   ├── normalizers/
│   │   ├── matchers/
│   │   └── validators/
│   │
│   ├── domain/
│   │
│   ├── middlewares/
│   │
│   ├── utils/
│   │
│   └── errors/
│
├── frontend/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── parser/
│
├── temp/
│
├── docs/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

------------------------------------------------------------------------

# 24. Responsabilidade das principais pastas

  Pasta            Responsabilidade
  ---------------- --------------------------------
  `routes`         Endpoints
  `controllers`    HTTP
  `services`       Regras de aplicação
  `repositories`   Persistência
  `models`         Models Sequelize
  `database`       Conexão e configuração
  `migrations`     Evolução do schema
  `parser`         PDF/XML → domínio
  `domain`         Regras e estruturas de domínio
  `middlewares`    Interceptadores HTTP
  `errors`         Erros da aplicação
  `tests`          Testes

------------------------------------------------------------------------

# 25. Dependências conceituais

A regra principal será:

``` text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Models/Sequelize
  ↓
SQLite
```

E:

``` text
Services
  ↓
Parser
```

Não:

``` text
Controller
  ↓
SQL
```

nem:

``` text
Parser
  ↓
SQLite diretamente
```

------------------------------------------------------------------------

# 26. Contratos entre camadas

Cada camada deverá possuir responsabilidade clara.

### Controller

Entrada/saída HTTP.

### Service

Orquestração e regras.

### Parser

Extração e transformação.

### Repository

Persistência.

### Model

Mapeamento ORM.

### Database

Conexão.

------------------------------------------------------------------------

# 27. Estratégia de testes

## Unitários

Testar:

-   normalização;
-   matching;
-   regras de classificação;
-   cálculo de indicadores;
-   extractors individuais.

## Integração

Testar:

-   Service + Repository;
-   Repository + SQLite;
-   transações;
-   migrations.

## Parser

Testar com os cinco Lattes usados nas POCs.

Criar fixtures:

``` text
tests/parser/fixtures/
├── lattes-01.xml
├── lattes-02.xml
├── lattes-03.xml
├── lattes-04.xml
└── lattes-05.xml
```

## End-to-end

Testar:

``` text
upload
 ↓
processamento
 ↓
persistência
 ↓
consulta
 ↓
resultado
```

------------------------------------------------------------------------

# 28. Estratégia de desenvolvimento com 3 devs

Uma divisão inicial possível:

### Desenvolvedor 1 --- Backend/Infraestrutura

Responsável por:

-   Express;
-   configuração;
-   Sequelize;
-   SQLite;
-   migrations;
-   Models;
-   Repositories;
-   estrutura da API.

### Desenvolvedor 2 --- Parser

Responsável por:

-   PDF → XML;
-   leitura XML;
-   extractors;
-   normalização;
-   matching;
-   validação;
-   testes dos cinco Lattes.

### Desenvolvedor 3 --- Frontend

Responsável por:

-   interface;
-   importação;
-   dashboard;
-   telas de docentes;
-   alunos;
-   produção;
-   indicadores;
-   gráficos;
-   integração com API.

### Responsabilidade compartilhada

Os três devem participar de:

-   revisão de contratos;
-   integração;
-   testes;
-   code review;
-   decisões de domínio.

------------------------------------------------------------------------

# 29. Fluxo Git recomendado

``` text
main
  │
  └── develop
       │
       ├── feature/backend-...
       ├── feature/parser-...
       └── feature/frontend-...
```

Pull Requests deverão ser utilizados para integração.

Nenhum desenvolvedor deve depender do arquivo SQLite de outro
desenvolvedor.

Cada máquina gera seu próprio banco através das migrations.

------------------------------------------------------------------------

# 30. Decisões arquiteturais

### ADR-001 --- Banco local

**Decisão:** SQLite.

**Motivo:** MVP local, um usuário, um computador e baixo overhead
operacional.

### ADR-002 --- ORM

**Decisão:** Sequelize.

**Motivo:** integração madura com Node.js/JavaScript e suporte ao
SQLite.

### ADR-003 --- Linguagem

**Decisão:** JavaScript.

**Motivo:** padronização do backend e integração com o ecossistema
Node.js.

### ADR-004 --- Parser separado

**Decisão:** parser como módulo isolado.

**Motivo:** parsing de Lattes possui complexidade própria e precisa ser
testado independentemente da API.

### ADR-005 --- Arquivos temporários

**Decisão:** PDF/XML não serão persistidos.

**Motivo:** reduzir armazenamento e manter o banco focado em dados
estruturados.

------------------------------------------------------------------------

# 31. Decisões ainda abertas

Ainda precisam ser definidos:

1.  framework definitivo do frontend;
2.  biblioteca/conversor específico PDF → XML;
3.  biblioteca específica de validação de entrada;
4.  estratégia de autenticação para o MVP;
5.  execução síncrona ou assíncrona dos processamentos;
6.  formato definitivo dos contratos da API;
7.  mecanismo de gráficos;
8.  estratégia final de empacotamento/distribuição da aplicação;
9.  regras definitivas de classificação;
10. fórmulas dos indicadores.

------------------------------------------------------------------------

# 32. Arquitetura alvo

``` text
                         ┌─────────────────┐
                         │     USUÁRIO     │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    FRONTEND     │
                         └────────┬────────┘
                                  │ REST
                                  ▼
┌──────────────────────────────────────────────────────┐
│                   NODE.JS / EXPRESS                  │
│                                                      │
│ Routes → Controllers → Services → Repositories       │
│                         │              │              │
│                         │              ▼              │
│                         │          Sequelize          │
│                         │              │              │
│                         │              ▼              │
│                         │           SQLite            │
│                         │                             │
│                         ▼                             │
│                       Parser                          │
│                         │                             │
│                  PDF → XML → Dados                   │
└──────────────────────────────────────────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ ppga_analytics  │
                         │      .db        │
                         └─────────────────┘
```

------------------------------------------------------------------------

# 33. Próxima etapa

Depois da aprovação desta arquitetura:

``` text
Arquitetura
     ↓
Contrato da API
     ↓
Estrutura inicial do projeto
     ↓
Configuração Node + Express
     ↓
Sequelize + SQLite
     ↓
Migrations
     ↓
Models
     ↓
Parser
     ↓
Endpoints
     ↓
Frontend
```

A implementação deverá começar pela infraestrutura e pelos contratos,
evitando que backend, parser e frontend evoluam com interfaces
incompatíveis.
