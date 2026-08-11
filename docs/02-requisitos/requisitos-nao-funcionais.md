# Requisitos Não Funcionais — PPGA Analytics

## 1. Introdução

Este documento define os requisitos não funcionais do **PPGA Analytics**.

Os requisitos não funcionais estabelecem características de qualidade, restrições técnicas e critérios que deverão ser observados durante o desenvolvimento e operação do sistema.

Os requisitos foram definidos considerando:

* o Documento de Visão;
* os Requisitos Funcionais;
* as Regras de Negócio;
* o escopo do MVP;
* as análises realizadas sobre Currículos Lattes reais em formato PDF;
* a necessidade de evolução futura do sistema para múltiplas instituições.

Os requisitos estão identificados pelo padrão:

**RNF-XXX — Nome do requisito**

---

# 2. Desempenho

## RNF-001 — Tempo de resposta da interface

Operações comuns de navegação e consulta deverão apresentar resposta em tempo adequado para utilização cotidiana do sistema.

Como referência para o MVP, consultas simples deverão responder, em condições normais de operação, em até **2 segundos**.

---

## RNF-002 — Processamento de Currículos Lattes

O processamento de um Currículo Lattes deverá ocorrer de maneira eficiente, considerando que os documentos analisados possuem dezenas ou centenas de páginas.

O sistema não deverá exigir que o usuário mantenha a interface bloqueada durante todo o processamento.

---

## RNF-003 — Processamento assíncrono

Operações de processamento potencialmente demoradas, especialmente o processamento de PDFs, deverão ser executadas de forma assíncrona ou por mecanismo equivalente.

A interface deverá permanecer utilizável enquanto o processamento estiver em andamento.

---

## RNF-004 — Feedback de processamento

O sistema deverá informar ao usuário o estado do processamento de um currículo.

Os estados deverão incluir, quando aplicável:

* aguardando;
* processando;
* concluído;
* concluído com alertas;
* erro.

---

## RNF-005 — Processamento em lote

A arquitetura deverá permitir evolução para processamento de múltiplos Currículos Lattes em uma única operação.

O MVP poderá limitar a quantidade de arquivos processados simultaneamente conforme a capacidade da infraestrutura.

---

# 3. Escalabilidade

## RNF-006 — Crescimento da quantidade de docentes

A arquitetura deverá permitir aumento da quantidade de docentes e Currículos Lattes sem necessidade de alteração estrutural significativa do sistema.

---

## RNF-007 — Crescimento da quantidade de instituições

A arquitetura deverá ser preparada para futura evolução para múltiplas instituições e programas.

A implementação multi-institucional completa não é obrigatória no MVP.

---

## RNF-008 — Escalabilidade do processamento

O módulo responsável pelo processamento dos Currículos Lattes deverá permitir futura distribuição de tarefas de processamento.

---

## RNF-009 — Separação de responsabilidades

A arquitetura deverá manter separadas as responsabilidades de:

* extração;
* normalização;
* validação;
* persistência;
* aplicação de regras;
* cálculo de indicadores.

Essa separação deverá facilitar evolução e escalabilidade.

---

# 4. Confiabilidade

## RNF-010 — Integridade dos dados

O sistema deverá preservar a integridade dos dados acadêmicos durante:

* importação;
* processamento;
* atualização;
* armazenamento;
* cálculo dos indicadores.

---

## RNF-011 — Não inferência de dados ausentes

O sistema não deverá criar ou inferir automaticamente informações acadêmicas que não estejam suficientemente fundamentadas nos dados disponíveis.

---

## RNF-012 — Tratamento de informações incompletas

Informações incompletas deverão ser identificadas e armazenadas de forma que não sejam confundidas automaticamente com informações válidas e completas.

---

## RNF-013 — Processamento parcial

Falhas em uma determinada seção do currículo não deverão necessariamente causar perda das demais informações que puderem ser processadas corretamente.

---

## RNF-014 — Recuperação de falhas

Em caso de falha durante o processamento, o sistema deverá preservar informações suficientes para permitir diagnóstico e, quando aplicável, reprocessamento.

---

## RNF-015 — Reprocessamento seguro

O reprocessamento de um currículo não deverá gerar duplicações indevidas dos dados existentes.

---

# 5. Qualidade da Extração

## RNF-016 — Extração de texto

O sistema deverá utilizar mecanismo adequado para extração de texto de PDFs digitais.

---

## RNF-017 — Tratamento de encoding

O sistema deverá tratar caracteres e problemas de codificação que possam ocorrer durante a extração do PDF.

---

## RNF-018 — Tratamento de quebras de linha

O sistema deverá tratar quebras de linha e espaços artificiais gerados pela estrutura do PDF.

---

## RNF-019 — Independência de paginação

O parser não deverá depender de posições ou números de páginas fixos para identificar informações.

---

## RNF-020 — Identificação por estrutura

A identificação das informações deverá utilizar padrões textuais e estruturais das seções do Currículo Lattes.

---

## RNF-021 — Parser modular

O mecanismo de interpretação deverá ser modular, permitindo que diferentes seções do currículo possuam estratégias específicas de processamento.

---

## RNF-022 — Evolução do parser

A arquitetura deverá permitir evolução do parser sem necessidade de reconstrução dos demais componentes do sistema.

---

## RNF-023 — Compatibilidade com variações do Lattes

O parser deverá ser projetado considerando possíveis variações de conteúdo, tamanho e organização dos Currículos Lattes.

---

# 6. Segurança

## RNF-024 — Autenticação segura

O sistema deverá utilizar mecanismos seguros para autenticação dos usuários.

---

## RNF-025 — Armazenamento seguro de senhas

Senhas não deverão ser armazenadas em texto puro.

---

## RNF-026 — Controle de acesso

O sistema deverá restringir funcionalidades e dados de acordo com as permissões do usuário.

---

## RNF-027 — Proteção dos Currículos Lattes

Os arquivos enviados deverão ser tratados como dados acadêmicos potencialmente sensíveis e deverão possuir mecanismos adequados de proteção contra acesso não autorizado.

---

## RNF-028 — Isolamento de arquivos

Arquivos enviados não deverão ficar disponíveis diretamente por caminhos públicos sem mecanismos de autorização.

---

## RNF-029 — Validação de arquivos

O sistema deverá validar arquivos enviados antes de processá-los.

A validação deverá reduzir riscos associados a:

* arquivos inválidos;
* arquivos corrompidos;
* tipos de arquivo inesperados;
* arquivos maliciosos.

---

## RNF-030 — Proteção contra upload malicioso

O sistema deverá implementar mecanismos de proteção contra arquivos enviados com finalidade maliciosa.

---

## RNF-031 — Comunicação segura

A comunicação entre cliente e servidor deverá utilizar protocolo seguro, como HTTPS, em ambientes de produção.

---

## RNF-032 — Gestão de sessões

Sessões de usuários deverão possuir mecanismos adequados de expiração, invalidação e proteção.

---

## RNF-033 — Princípio do menor privilégio

Usuários e componentes do sistema deverão possuir somente as permissões necessárias para executar suas respectivas funções.

---

# 7. Privacidade e Proteção de Dados

## RNF-034 — Proteção de dados pessoais

O sistema deverá tratar informações pessoais presentes nos Currículos Lattes de acordo com a legislação aplicável.

---

## RNF-035 — Controle de acesso aos dados

Informações acadêmicas e pessoais deverão ser acessíveis somente a usuários autorizados.

---

## RNF-036 — Minimização de dados

O sistema deverá priorizar o armazenamento de informações necessárias para os objetivos do PPGA Analytics.

---

## RNF-037 — Retenção de arquivos

A política de retenção dos arquivos PDF deverá ser definida de acordo com as necessidades do projeto e requisitos legais aplicáveis.

---

## RNF-038 — Exclusão de arquivos

O sistema deverá permitir a aplicação de política de exclusão dos arquivos originais quando necessário.

A exclusão deverá considerar os requisitos de auditoria e rastreabilidade.

---

## RNF-039 — Auditoria

Operações relevantes sobre dados e arquivos deverão ser registradas para fins de auditoria.

---

# 8. Rastreabilidade

## RNF-040 — Origem dos dados

Informações relevantes extraídas deverão manter referência à fonte de origem quando tecnicamente possível.

---

## RNF-041 — Rastreabilidade por seção

O sistema deverá permitir identificar a seção do currículo que originou determinada informação.

---

## RNF-042 — Rastreabilidade por página

Quando tecnicamente possível, o sistema deverá preservar a página de origem da informação.

---

## RNF-043 — Rastreabilidade do processamento

O sistema deverá registrar:

* data do processamento;
* versão do parser;
* arquivo utilizado;
* resultado do processamento.

---

## RNF-044 — Rastreabilidade dos indicadores

Os indicadores deverão permitir rastrear:

```text
Indicador
    ↓
Regra
    ↓
Critério
    ↓
Dados utilizados
    ↓
Fonte
```

---

# 9. Versionamento

## RNF-045 — Versionamento do parser

Cada processamento deverá registrar a versão do parser utilizada.

---

## RNF-046 — Versionamento das regras

As regras utilizadas para classificação e cálculo dos indicadores deverão possuir identificação de versão.

---

## RNF-047 — Preservação histórica

Alterações nas regras não deverão apagar ou alterar silenciosamente resultados históricos já registrados.

---

## RNF-048 — Reprodutibilidade

Sempre que possível, o sistema deverá permitir identificar quais dados e versões de regras foram utilizados para gerar determinado resultado.

---

# 10. Manutenibilidade

## RNF-049 — Arquitetura modular

O sistema deverá possuir arquitetura modular, separando responsabilidades entre componentes.

---

## RNF-050 — Baixo acoplamento

Os componentes responsáveis pelo processamento dos Lattes deverão possuir baixo acoplamento em relação ao restante da aplicação.

---

## RNF-051 — Separação do parser e regras

O parser não deverá conter regras específicas de avaliação ou pontuação acadêmica.

---

## RNF-052 — Separação do cálculo de indicadores

O cálculo dos indicadores deverá ser independente da extração dos dados.

---

## RNF-053 — Código documentado

Componentes críticos deverão possuir documentação técnica suficiente para manutenção.

---

## RNF-054 — Padronização

O código deverá seguir padrões de desenvolvimento definidos pela equipe.

---

# 11. Testabilidade

## RNF-055 — Testes automatizados

Componentes críticos deverão possuir testes automatizados.

---

## RNF-056 — Testes do parser

O parser deverá possuir testes utilizando Currículos Lattes reais ou amostras representativas autorizadas.

---

## RNF-057 — Testes por seção

As principais seções do Lattes deverão possuir casos de teste independentes.

---

## RNF-058 — Testes de regressão

Alterações no parser deverão ser acompanhadas de testes de regressão para evitar perda de funcionalidades previamente implementadas.

---

## RNF-059 — Dataset de validação

Os cinco Currículos Lattes utilizados nas POCs deverão compor inicialmente o conjunto de testes e validação do processamento, respeitando as permissões de uso dos arquivos.

---

## RNF-060 — Validação manual

Resultados críticos do parser deverão ser comparados com os currículos originais durante o desenvolvimento e validação do sistema.

---

# 12. Usabilidade

## RNF-061 — Interface intuitiva

A interface deverá permitir que usuários administrativos realizem as principais tarefas sem necessidade de conhecimento técnico.

---

## RNF-062 — Feedback de erros

Mensagens de erro deverão ser claras e indicar, quando possível:

* o que aconteceu;
* qual operação falhou;
* como o usuário pode proceder.

---

## RNF-063 — Feedback de sucesso

Operações concluídas com sucesso deverão apresentar confirmação adequada ao usuário.

---

## RNF-064 — Visualização dos resultados

Informações e indicadores deverão ser apresentados de forma organizada e compreensível.

---

## RNF-065 — Status de importação

Durante o processamento de um Lattes, o usuário deverá conseguir identificar o estado atual da operação.

---

# 13. Disponibilidade

## RNF-066 — Disponibilidade do sistema

O sistema deverá permanecer disponível para as operações previstas durante o horário de utilização definido pela instituição.

---

## RNF-067 — Recuperação após falhas

Após falhas de infraestrutura, o sistema deverá permitir recuperação dos dados persistidos sem corrupção.

---

## RNF-068 — Backup

Dados persistidos deverão possuir mecanismo de backup adequado ao ambiente de produção.

---

## RNF-069 — Recuperação de backup

Deverá existir procedimento documentado para restauração dos dados a partir de backup.

---

# 14. Compatibilidade

## RNF-070 — Compatibilidade com navegadores

A aplicação web deverá ser compatível com versões recentes dos principais navegadores utilizados pelos usuários.

---

## RNF-071 — Compatibilidade com PDFs

O sistema deverá suportar Currículos Lattes em PDF digitalmente gerados dentro do formato definido para o projeto.

---

## RNF-072 — Evolução para novos formatos

A arquitetura deverá permitir futuramente a inclusão de outras fontes ou formatos de dados sem reconstrução completa do sistema.

---

# 15. Observabilidade

## RNF-073 — Registro de logs

O sistema deverá registrar eventos técnicos relevantes.

---

## RNF-074 — Logs de processamento

O processamento dos Currículos Lattes deverá gerar logs suficientes para identificar falhas e etapas executadas.

---

## RNF-075 — Monitoramento de erros

Falhas críticas deverão ser registradas de forma que possam ser identificadas e investigadas pela equipe responsável.

---

## RNF-076 — Métricas de processamento

O sistema deverá permitir futuramente medir informações como:

* quantidade de currículos processados;
* tempo médio de processamento;
* quantidade de registros extraídos;
* quantidade de erros;
* quantidade de alertas;
* quantidade de reprocessamentos.

---

# 16. Escalabilidade Futura

## RNF-077 — Processamento distribuído

A arquitetura deverá permitir futura utilização de filas ou workers para processamento distribuído de currículos.

---

## RNF-078 — Crescimento do banco

O modelo de persistência deverá permitir crescimento da quantidade de:

* instituições;
* programas;
* docentes;
* currículos;
* produções;
* períodos;
* indicadores.

---

## RNF-079 — Multi-instituição

A arquitetura deverá permitir evolução futura para múltiplas instituições sem necessidade de reconstrução completa da aplicação.

---

# 17. Interoperabilidade

## RNF-080 — API

As funcionalidades principais deverão ser disponibilizadas por uma camada de API bem definida, quando aplicável à arquitetura escolhida.

---

## RNF-081 — Estrutura de dados

Os dados deverão ser armazenados em estruturas que permitam integração futura com outros sistemas.

---

## RNF-082 — Exportação

O sistema deverá permitir exportar informações relevantes em formatos definidos pelo projeto.

---

# 18. Auditabilidade

## RNF-083 — Histórico de alterações

Alterações relevantes em informações acadêmicas deverão possuir histórico quando necessário.

---

## RNF-084 — Histórico de regras

O sistema deverá preservar histórico das versões de critérios e regras utilizados.

---

## RNF-085 — Identificação do responsável

Operações administrativas relevantes deverão registrar o usuário responsável.

---

# 19. Requisitos para o MVP

Os seguintes requisitos não funcionais possuem prioridade alta para o MVP:

* RNF-001 — Tempo de resposta;
* RNF-002 — Processamento de Currículos;
* RNF-003 — Processamento assíncrono;
* RNF-004 — Feedback de processamento;
* RNF-010 — Integridade;
* RNF-011 — Não inferência;
* RNF-012 — Dados incompletos;
* RNF-016 — Extração de texto;
* RNF-017 — Encoding;
* RNF-018 — Quebras de linha;
* RNF-019 — Independência de paginação;
* RNF-021 — Parser modular;
* RNF-024 — Autenticação;
* RNF-026 — Controle de acesso;
* RNF-027 — Proteção dos currículos;
* RNF-029 — Validação dos arquivos;
* RNF-034 — Proteção de dados pessoais;
* RNF-040 — Origem dos dados;
* RNF-043 — Rastreabilidade;
* RNF-045 — Versionamento do parser;
* RNF-051 — Separação parser/regras;
* RNF-055 — Testes automatizados;
* RNF-056 — Testes do parser;
* RNF-061 — Usabilidade;
* RNF-062 — Mensagens de erro;
* RNF-065 — Status de importação;
* RNF-073 — Logs;
* RNF-074 — Logs de processamento.

---

# 20. Critério Geral de Aceitação

Um requisito não funcional será considerado atendido quando a característica de qualidade correspondente puder ser demonstrada por meio de:

* testes;
* inspeção;
* métricas;
* validação com usuários;
* análise técnica;
* documentação;
* evidências de operação.

Quando o requisito possuir valor quantitativo, o valor deverá ser validado em ambiente representativo do uso esperado.

---

# 21. Princípios de Qualidade

O PPGA Analytics deverá priorizar:

1. **Confiabilidade dos dados.**
2. **Segurança das informações.**
3. **Rastreabilidade.**
4. **Manutenibilidade.**
5. **Testabilidade.**
6. **Evolução modular.**
7. **Desempenho adequado.**
8. **Transparência dos indicadores.**
9. **Separação entre dados e regras.**
10. **Capacidade de evolução para múltiplas instituições.**
bele