# Requisitos Funcionais — PPGA Analytics

## 1. Introdução

Este documento define os requisitos funcionais do **PPGA Analytics**, descrevendo as funcionalidades que o sistema deverá disponibilizar aos seus usuários.

Os requisitos foram definidos com base no Documento de Visão, nas Regras de Negócio, no escopo do MVP e nas análises realizadas sobre Currículos Lattes reais em formato PDF.

Os requisitos estão organizados por módulos funcionais e identificados pelo padrão:

**RF-XXX — Nome do requisito**

---

# 2. Autenticação e Usuários

## RF-001 — Cadastro de usuário

O sistema deverá permitir que usuários autorizados sejam cadastrados.

O cadastro deverá conter, no mínimo:

* nome;
* e-mail;
* senha;
* perfil de acesso.

---

## RF-002 — Autenticação

O sistema deverá permitir que usuários cadastrados realizem login utilizando suas credenciais.

---

## RF-003 — Encerramento de sessão

O sistema deverá permitir que o usuário encerre sua sessão.

---

## RF-004 — Controle de acesso

O sistema deverá controlar o acesso às funcionalidades de acordo com o perfil do usuário.

---

## RF-005 — Gerenciamento de usuários

Usuários com permissão administrativa deverão poder:

* cadastrar usuários;
* consultar usuários;
* alterar dados;
* alterar permissões;
* desativar usuários.

---

## RF-006 — Perfis de acesso

O sistema deverá suportar, inicialmente, os seguintes perfis:

* Administrador;
* Coordenador;
* Docente.

---

# 3. Instituições e Programas

## RF-007 — Cadastro de instituição

O sistema deverá permitir o cadastro de instituições de ensino.

---

## RF-008 — Consulta de instituição

O sistema deverá permitir consultar os dados da instituição cadastrada.

---

## RF-009 — Cadastro de programa

O sistema deverá permitir cadastrar Programas de Pós-Graduação.

---

## RF-010 — Associação entre programa e instituição

O sistema deverá associar cada programa a uma instituição.

---

## RF-011 — Consulta de programa

O sistema deverá permitir consultar os dados de um programa.

---

## RF-012 — Edição de programa

Usuários autorizados deverão poder alterar informações do programa.

---

# 4. Períodos de Análise

## RF-013 — Cadastro de período

O sistema deverá permitir cadastrar períodos utilizados nas análises acadêmicas.

---

## RF-014 — Consulta de períodos

O sistema deverá permitir consultar os períodos cadastrados.

---

## RF-015 — Associação de dados ao período

O sistema deverá permitir associar informações acadêmicas ao período correspondente.

---

## RF-016 — Consulta histórica

O sistema deverá permitir consultar informações de diferentes períodos.

---

# 5. Docentes

## RF-017 — Cadastro de docente

O sistema deverá permitir cadastrar docentes vinculados ao programa.

---

## RF-018 — Associação entre docente e programa

O sistema deverá permitir associar docentes a Programas de Pós-Graduação.

---

## RF-019 — Consulta de docentes

O sistema deverá permitir listar e consultar os docentes vinculados ao programa.

---

## RF-020 — Edição de docente

Usuários autorizados deverão poder alterar informações cadastrais dos docentes.

---

## RF-021 — Identificação Lattes do docente

O sistema deverá permitir armazenar o identificador Lattes do docente.

---

## RF-022 — Consulta do perfil acadêmico

O sistema deverá apresentar uma visão consolidada das informações acadêmicas de um docente.

---

# 6. Importação de Currículo Lattes

## RF-023 — Upload de Currículo Lattes

O sistema deverá permitir que usuários autorizados enviem Currículos Lattes em formato PDF.

---

## RF-024 — Validação do arquivo

O sistema deverá validar o arquivo enviado antes de iniciar seu processamento.

A validação deverá considerar, no mínimo:

* formato;
* tipo do arquivo;
* tamanho;
* integridade básica;
* possibilidade de extração textual.

---

## RF-025 — Identificação da importação

Cada processo de importação deverá possuir um identificador único.

---

## RF-026 — Registro da importação

O sistema deverá registrar informações sobre cada importação realizada.

Deverão ser armazenados, quando aplicável:

* arquivo;
* nome do arquivo;
* docente relacionado;
* data da importação;
* usuário responsável;
* status;
* versão do parser.

---

## RF-027 — Extração de texto do PDF

O sistema deverá extrair o conteúdo textual do Currículo Lattes enviado.

---

## RF-028 — Verificação da extração

O sistema deverá verificar se o arquivo possui conteúdo textual suficiente para processamento.

Caso a extração não seja possível ou seja insuficiente, o sistema deverá informar o problema ao usuário.

---

## RF-029 — Normalização do texto

O sistema deverá normalizar o conteúdo extraído antes da interpretação dos dados.

A normalização poderá incluir:

* espaços;
* quebras de linha;
* caracteres;
* encoding;
* padrões recorrentes;
* separação de conteúdos.

---

## RF-030 — Identificação de seções

O sistema deverá identificar as principais seções do Currículo Lattes por meio de padrões textuais e estruturais.

Entre as seções de interesse estão:

* Identificação;
* Formação acadêmica/titulação;
* Atuação profissional;
* Ensino;
* Projetos de pesquisa;
* Produção bibliográfica;
* Produção técnica;
* Orientações;
* Bancas;
* Eventos;
* Extensão, quando identificável.

---

## RF-031 — Processamento independente das seções

O sistema deverá processar as principais seções do currículo de forma independente, permitindo tratamento específico para cada tipo de informação.

---

## RF-032 — Processamento sem dependência de páginas fixas

O sistema não deverá depender de números de páginas fixos para identificar as informações do currículo.

---

## RF-033 — Extração de identificação

O sistema deverá extrair, quando disponível:

* nome;
* ID Lattes;
* data da última atualização;
* informações básicas relevantes.

---

## RF-034 — Extração de formação

O sistema deverá extrair informações relacionadas à formação acadêmica do docente.

Deverão ser consideradas, quando disponíveis:

* nível;
* curso;
* instituição;
* área;
* período;
* ano de conclusão.

---

## RF-035 — Extração de atuação profissional

O sistema deverá extrair informações relevantes relacionadas à atuação profissional e acadêmica do docente.

---

# 7. Ensino

## RF-036 — Extração de atividades de Ensino

O sistema deverá identificar atividades de Ensino presentes no Currículo Lattes.

---

## RF-037 — Cadastro de atividade de Ensino

O sistema deverá permitir armazenar atividades de Ensino identificadas ou cadastradas.

---

## RF-038 — Classificação do nível de Ensino

O sistema deverá permitir classificar atividades de Ensino por nível.

Os níveis deverão incluir, quando aplicáveis:

* Graduação;
* Mestrado;
* Doutorado.

Outros níveis poderão ser armazenados quando identificados.

---

## RF-039 — Associação da atividade ao docente

Cada atividade de Ensino deverá poder ser associada ao docente responsável.

---

## RF-040 — Associação da atividade ao período

O sistema deverá permitir associar atividades de Ensino ao respectivo período.

---

## RF-041 — Consulta de atividades de Ensino

O sistema deverá permitir consultar atividades de Ensino por:

* docente;
* período;
* nível;
* programa.

---

# 8. Pesquisa

## RF-042 — Extração de projetos de Pesquisa

O sistema deverá identificar projetos de Pesquisa presentes no Currículo Lattes.

---

## RF-043 — Cadastro de projeto de Pesquisa

O sistema deverá permitir armazenar projetos de Pesquisa.

---

## RF-044 — Associação de docentes a projetos

O sistema deverá permitir associar docentes aos projetos de Pesquisa.

---

## RF-045 — Extração de produção acadêmica

O sistema deverá identificar produções acadêmicas presentes no Currículo Lattes.

---

## RF-046 — Cadastro de produção acadêmica

O sistema deverá permitir armazenar produções acadêmicas estruturadas.

---

## RF-047 — Classificação do tipo de produção

O sistema deverá permitir classificar produções de acordo com seu tipo.

O MVP deverá suportar, no mínimo:

* artigo;
* livro;
* capítulo de livro;
* trabalho em evento;
* produção técnica;
* patente ou registro, quando aplicável;
* outros tipos relevantes.

---

## RF-048 — Dados bibliográficos da produção

O sistema deverá armazenar, quando disponíveis:

* título;
* autores;
* ano;
* periódico ou veículo;
* volume;
* número;
* páginas;
* DOI;
* ISSN;
* evento;
* demais identificadores relevantes.

---

## RF-049 — Associação entre produção e docente

O sistema deverá permitir associar uma produção aos docentes que participam dela.

---

## RF-050 — Ordem dos autores

Quando essa informação estiver disponível, o sistema deverá preservar a ordem dos autores da produção.

---

## RF-051 — Extração de orientações

O sistema deverá identificar orientações e supervisões presentes no Currículo Lattes.

---

## RF-052 — Cadastro de orientação

O sistema deverá permitir armazenar informações de orientações.

Deverão ser consideradas, quando disponíveis:

* orientando;
* título;
* nível;
* situação;
* período;
* instituição.

---

## RF-053 — Classificação de orientação

O sistema deverá permitir diferenciar orientações em andamento e concluídas.

---

# 9. Extensão

## RF-054 — Identificação de atividades de Extensão

O sistema deverá identificar informações relacionadas à Extensão quando elas puderem ser determinadas a partir do currículo.

---

## RF-055 — Cadastro de atividade de Extensão

O sistema deverá permitir armazenar atividades de Extensão identificadas.

---

## RF-056 — Cadastro de projeto de Extensão

O sistema deverá permitir armazenar projetos de Extensão.

---

## RF-057 — Associação de docentes à Extensão

O sistema deverá permitir associar docentes a atividades e projetos de Extensão.

---

## RF-058 — Associação da Extensão ao período

O sistema deverá permitir associar atividades e projetos de Extensão ao respectivo período.

---

## RF-059 — Estado da informação de Extensão

O sistema deverá permitir diferenciar situações como:

* informação identificada;
* informação não identificada;
* informação não informada;
* informação não classificada.

---

# 10. Produção Técnica e Outras Atividades

## RF-060 — Extração de produção técnica

O sistema deverá identificar informações relacionadas à produção técnica quando disponíveis.

---

## RF-061 — Cadastro de produção técnica

O sistema deverá permitir armazenar produções técnicas.

---

## RF-062 — Extração de bancas

O sistema deverá identificar participações em bancas quando relevantes para o escopo do sistema.

---

## RF-063 — Extração de eventos

O sistema deverá identificar participações relevantes em eventos acadêmicos.

---

## RF-064 — Extração de patentes e registros

O sistema deverá permitir identificar patentes e registros quando presentes no currículo.

---

# 11. Validação e Qualidade dos Dados

## RF-065 — Validação de dados obrigatórios

O sistema deverá validar a presença dos dados obrigatórios antes de utilizá-los em operações dependentes dessas informações.

---

## RF-066 — Identificação de dados incompletos

O sistema deverá identificar registros que não possuam informações suficientes.

---

## RF-067 — Identificação de inconsistências

O sistema deverá identificar informações potencialmente inconsistentes.

---

## RF-068 — Identificação de possíveis duplicidades

O sistema deverá identificar registros que apresentem características de possível duplicidade.

---

## RF-069 — Preservação de possíveis duplicidades

O sistema não deverá excluir automaticamente um registro somente por existir suspeita de duplicidade.

---

## RF-070 — Status do dado

O sistema deverá permitir identificar o estado de processamento de informações.

Os estados deverão contemplar, no mínimo:

* válido;
* incompleto;
* não classificado;
* possível duplicidade;
* inconsistente;
* não identificado.

---

## RF-071 — Validação pós-processamento

O sistema deverá realizar validações após a extração e normalização dos dados.

---

# 12. Rastreabilidade

## RF-072 — Registro da fonte

O sistema deverá registrar a fonte de origem dos dados extraídos.

---

## RF-073 — Registro da seção de origem

O sistema deverá permitir identificar a seção do currículo de onde uma informação foi extraída.

---

## RF-074 — Registro da página de origem

Quando tecnicamente possível, o sistema deverá registrar a página do PDF de onde uma informação foi extraída.

---

## RF-075 — Registro do texto original

O sistema deverá permitir preservar o conteúdo original associado a informações relevantes quando necessário para auditoria.

---

## RF-076 — Versionamento do processamento

O sistema deverá registrar a versão do parser utilizada em cada processamento.

---

## RF-077 — Consulta da origem do dado

Usuários autorizados deverão poder consultar a origem de informações relevantes.

---

# 13. Processo de Importação

## RF-078 — Processamento assíncrono

O sistema deverá permitir que o processamento de Currículos Lattes seja realizado de forma que operações longas não bloqueiem desnecessariamente a interface do usuário.

---

## RF-079 — Status do processamento

O sistema deverá apresentar o status da importação.

Os estados poderão incluir:

* aguardando;
* processando;
* concluído;
* concluído com alertas;
* erro.

---

## RF-080 — Relatório de processamento

Após o processamento, o sistema deverá apresentar um resumo contendo:

* status;
* informações identificadas;
* quantidade de registros;
* alertas;
* erros;
* possíveis duplicidades;
* dados não identificados.

---

## RF-081 — Processamento parcial

Quando uma seção não puder ser processada, o sistema deverá permitir, quando seguro, que as demais seções válidas continuem sendo processadas.

---

## RF-082 — Registro de erros

O sistema deverá registrar erros ocorridos durante o processamento.

---

## RF-083 — Reprocessamento

Usuários autorizados deverão poder solicitar o reprocessamento de um currículo quando necessário.

---

# 14. Classificação da Produção

## RF-084 — Cadastro de critérios

Usuários autorizados deverão poder cadastrar critérios de classificação.

---

## RF-085 — Consulta de critérios

O sistema deverá permitir consultar os critérios cadastrados.

---

## RF-086 — Edição de critérios

Usuários autorizados deverão poder alterar critérios conforme suas permissões.

---

## RF-087 — Classificação de produção

O sistema deverá permitir aplicar critérios às produções acadêmicas.

---

## RF-088 — Classificação manual

Usuários autorizados deverão poder classificar manualmente uma produção quando necessário.

---

## RF-089 — Registro da justificativa

O sistema deverá permitir registrar os critérios utilizados ou justificativa associada à classificação.

---

## RF-090 — Produção não classificada

O sistema deverá permitir identificar produções que ainda não possuem classificação.

---

## RF-091 — Versionamento de critérios

O sistema deverá permitir identificar a versão dos critérios utilizados em uma classificação.

---

# 15. Indicadores

## RF-092 — Cadastro de indicador

Usuários autorizados deverão poder cadastrar e configurar indicadores.

---

## RF-093 — Definição do indicador

Cada indicador deverá possuir, quando aplicável:

* nome;
* descrição;
* dimensão;
* fórmula ou regra;
* período;
* critérios utilizados.

---

## RF-094 — Cálculo de indicadores de Ensino

O sistema deverá calcular indicadores relacionados ao Ensino.

---

## RF-095 — Cálculo de indicadores de Pesquisa

O sistema deverá calcular indicadores relacionados à Pesquisa.

---

## RF-096 — Cálculo de indicadores de Extensão

O sistema deverá calcular indicadores relacionados à Extensão.

---

## RF-097 — Indicadores individuais

O sistema deverá calcular indicadores por docente.

---

## RF-098 — Indicadores do programa

O sistema deverá calcular indicadores consolidados do programa.

---

## RF-099 — Indicadores por período

O sistema deverá permitir calcular e consultar indicadores associados a diferentes períodos.

---

## RF-100 — Indicadores por dimensão

O sistema deverá permitir consultar indicadores separadamente para:

* Ensino;
* Pesquisa;
* Extensão.

---

## RF-101 — Indicadores de qualidade

O sistema deverá permitir utilizar classificações de produção no cálculo de indicadores de qualidade.

---

## RF-102 — Reprocessamento de indicadores

O sistema deverá permitir recalcular indicadores quando dados ou critérios forem alterados.

---

## RF-103 — Rastreabilidade do indicador

O sistema deverá permitir identificar:

* dados utilizados;
* critérios;
* regra;
* período;
* versão da regra.

---

# 16. Dashboard

## RF-104 — Dashboard do programa

O sistema deverá apresentar um dashboard consolidado do programa.

---

## RF-105 — Cards de indicadores

O dashboard deverá apresentar os principais indicadores de forma resumida.

---

## RF-106 — Visualização de Ensino, Pesquisa e Extensão

O dashboard deverá permitir visualizar separadamente as três dimensões.

---

## RF-107 — Gráficos de evolução

O sistema deverá apresentar visualizações da evolução dos indicadores ao longo do tempo.

---

## RF-108 — Dashboard do docente

O sistema deverá apresentar uma visão individual do desempenho acadêmico do docente.

---

## RF-109 — Filtro por período

O sistema deverá permitir filtrar informações por período.

---

## RF-110 — Filtro por docente

O sistema deverá permitir filtrar informações por docente.

---

## RF-111 — Filtro por dimensão

O sistema deverá permitir filtrar informações por Ensino, Pesquisa ou Extensão.

---

## RF-112 — Filtro por tipo de produção

O sistema deverá permitir filtrar produções por tipo.

---

## RF-113 — Filtro por classificação

O sistema deverá permitir filtrar produções por classificação.

---

# 17. Análises e Pontos de Atenção

## RF-114 — Identificação de dados incompletos

O sistema deverá identificar dados incompletos que possam afetar as análises.

---

## RF-115 — Identificação de produção não classificada

O sistema deverá identificar produções ainda não classificadas.

---

## RF-116 — Identificação de indicadores abaixo de parâmetros

O sistema deverá identificar indicadores abaixo de parâmetros previamente definidos.

---

## RF-117 — Identificação de variações relevantes

O sistema deverá permitir identificar variações relevantes nos indicadores ao longo do tempo.

---

## RF-118 — Exibição de pontos de atenção

O sistema deverá apresentar pontos de atenção no dashboard e/ou relatórios.

---

## RF-119 — Justificativa dos pontos de atenção

O sistema deverá permitir identificar o indicador ou critério que originou um ponto de atenção.

---

# 18. Histórico e Comparações

## RF-120 — Armazenamento de resultados históricos

O sistema deverá preservar resultados de indicadores de períodos anteriores.

---

## RF-121 — Consulta histórica

O sistema deverá permitir consultar indicadores históricos.

---

## RF-122 — Comparação entre períodos

O sistema deverá permitir comparar resultados de diferentes períodos.

---

## RF-123 — Identificação de mudanças de critérios

O sistema deverá informar quando períodos comparados utilizarem critérios diferentes.

---

# 19. Relatórios

## RF-124 — Relatório do programa

O sistema deverá permitir gerar relatório consolidado do programa.

---

## RF-125 — Relatório do docente

O sistema deverá permitir gerar relatório individual do docente.

---

## RF-126 — Inclusão de indicadores

Os relatórios deverão apresentar os indicadores relevantes para o contexto selecionado.

---

## RF-127 — Inclusão das dimensões acadêmicas

Os relatórios deverão apresentar informações relacionadas a Ensino, Pesquisa e Extensão quando aplicável.

---

## RF-128 — Inclusão dos critérios

Os relatórios deverão apresentar ou identificar os critérios utilizados nos indicadores quando necessário.

---

## RF-129 — Inclusão do período

Os relatórios deverão identificar claramente o período analisado.

---

## RF-130 — Exportação de relatório

O sistema deverá permitir exportar relatórios em formato definido para o MVP.

---

# 20. Auditoria

## RF-131 — Registro de operações críticas

O sistema deverá registrar operações críticas realizadas pelos usuários.

---

## RF-132 — Registro de alterações de critérios

O sistema deverá registrar alterações realizadas nos critérios.

---

## RF-133 — Registro de alterações de dados

O sistema deverá registrar alterações relevantes realizadas nos dados acadêmicos.

---

## RF-134 — Consulta de auditoria

Usuários autorizados deverão poder consultar registros de auditoria.

---

# 21. Administração

## RF-135 — Configuração do sistema

Usuários administradores deverão poder configurar parâmetros gerais do sistema.

---

## RF-136 — Configuração de critérios

Usuários autorizados deverão poder configurar critérios utilizados nas análises.

---

## RF-137 — Gerenciamento de parâmetros

O sistema deverá permitir o gerenciamento de parâmetros utilizados pelos indicadores.

---

# 22. Validação com a Instituição-Piloto

## RF-138 — Execução de processamento com dados reais

O sistema deverá permitir processar Currículos Lattes fornecidos pela instituição-piloto.

---

## RF-139 — Validação dos resultados

Usuários autorizados deverão poder consultar os dados extraídos para validação.

---

## RF-140 — Identificação de divergências

O sistema deverá permitir identificar divergências entre os dados processados e as informações presentes no currículo original.

---

## RF-141 — Correção de dados

Usuários autorizados deverão poder corrigir informações identificadas como incorretas ou incompletas, respeitando as regras de auditoria.

---

## RF-142 — Reprocessamento após correção

O sistema deverá permitir reprocessar indicadores após alterações relevantes nos dados.

---

# 23. Requisitos Funcionais Futuros

Os requisitos abaixo não fazem parte do escopo obrigatório do MVP.

## RF-143 — Integração automática com fontes externas

O sistema poderá futuramente integrar-se automaticamente a fontes acadêmicas externas.

---

## RF-144 — Benchmarking entre programas

O sistema poderá futuramente permitir comparações entre diferentes programas.

---

## RF-145 — Benchmarking institucional

O sistema poderá futuramente permitir comparações entre instituições.

---

## RF-146 — Suporte multi-institucional

O sistema poderá futuramente permitir o gerenciamento de múltiplas instituições.

---

## RF-147 — Inteligência Artificial

O sistema poderá futuramente utilizar técnicas de Inteligência Artificial para análises avançadas.

---

## RF-148 — Análises preditivas

O sistema poderá futuramente gerar análises preditivas baseadas no histórico acadêmico.

---

## RF-149 — Recomendações automáticas

O sistema poderá futuramente gerar recomendações baseadas nos indicadores.

---

# 24. Resumo dos Requisitos

| Módulo                       |      Requisitos |
| ---------------------------- | --------------: |
| Autenticação e usuários      | RF-001 a RF-006 |
| Instituições e programas     | RF-007 a RF-012 |
| Períodos                     | RF-013 a RF-016 |
| Docentes                     | RF-017 a RF-022 |
| Importação Lattes            | RF-023 a RF-035 |
| Ensino                       | RF-036 a RF-041 |
| Pesquisa                     | RF-042 a RF-053 |
| Extensão                     | RF-054 a RF-059 |
| Produção e outras atividades | RF-060 a RF-064 |
| Qualidade dos dados          | RF-065 a RF-071 |
| Rastreabilidade              | RF-072 a RF-077 |
| Processo de importação       | RF-078 a RF-083 |
| Classificação                | RF-084 a RF-091 |
| Indicadores                  | RF-092 a RF-103 |
| Dashboard                    | RF-104 a RF-113 |
| Análises                     | RF-114 a RF-119 |
| Histórico                    | RF-120 a RF-123 |
| Relatórios                   | RF-124 a RF-130 |
| Auditoria                    | RF-131 a RF-134 |
| Administração                | RF-135 a RF-137 |
| Validação                    | RF-138 a RF-142 |
| Futuro                       | RF-143 a RF-149 |

---

# 25. Critério Geral de Aceitação

Um requisito funcional será considerado atendido quando:

1. a funcionalidade estiver implementada;
2. seus fluxos principais estiverem funcionando;
3. as regras de negócio relacionadas estiverem sendo respeitadas;
4. os dados produzidos forem consistentes;
5. os casos de erro relevantes forem tratados;
6. testes correspondentes tiverem sido realizados;
7. o comportamento observado estiver de acordo com o requisito especificado.

---

# 26. Princípios Funcionais

Os requisitos funcionais do PPGA Analytics deverão respeitar os seguintes princípios:

1. O sistema deverá priorizar dados confiáveis.
2. O sistema deverá diferenciar ausência de informação de ausência de atividade.
3. O processamento do Lattes deverá ser rastreável.
4. O parser não deverá ser responsável por decisões analíticas.
5. Os critérios de classificação deverão ser independentes da extração.
6. Os indicadores deverão ser derivados de dados estruturados.
7. Os resultados deverão preservar seu contexto histórico.
8. O usuário deverá conseguir compreender a origem dos indicadores.
9. O sistema deverá permitir evolução das regras sem reconstrução completa do produto.
10. O MVP deverá permanecer focado na validação do problema central.
