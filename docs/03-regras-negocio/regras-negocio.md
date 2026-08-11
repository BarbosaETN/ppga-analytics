# Regras de Negócio — PPGA Analytics

## 1. Introdução

Este documento define as regras de negócio que deverão orientar o funcionamento do **PPGA Analytics**.

As regras estabelecem condições, restrições e comportamentos que deverão ser respeitados independentemente da tecnologia utilizada na implementação.

As regras estão identificadas pelo padrão:

**RN-XXX — Nome da regra**

---

# 2. Princípios Gerais

## RN-001 — Dados devem ser baseados em fontes identificáveis

Informações acadêmicas utilizadas pelo sistema deverão possuir uma fonte identificável sempre que tecnicamente possível.

No MVP, a principal fonte será o Currículo Lattes em formato PDF.

---

## RN-002 — O sistema não deverá inventar informações

O sistema não deverá criar, completar ou inferir informações acadêmicas sem evidência suficiente na fonte de dados ou em uma regra explicitamente definida.

---

## RN-003 — Ausência de informação não significa ausência de atividade

A ausência de determinada informação no Currículo Lattes não deverá ser interpretada automaticamente como inexistência da atividade correspondente.

Exemplo:

```text id="z3m9km"
"Extensão não identificada"
        ≠
"Docente não realizou extensão"
```

---

## RN-004 — Dados extraídos e dados interpretados deverão ser separados

O sistema deverá diferenciar:

* informação extraída;
* informação normalizada;
* informação validada;
* informação classificada;
* indicador calculado.

---

## RN-005 — O parser não deverá tomar decisões de avaliação

O processamento do Currículo Lattes deverá identificar e estruturar informações.

A atribuição de qualidade, pontuação ou classificação acadêmica deverá ocorrer em etapa posterior.

---

# 3. Regras de Importação do Lattes

## RN-006 — Formato de entrada

O MVP deverá aceitar Currículos Lattes em formato PDF conforme os padrões definidos pelo sistema.

---

## RN-007 — Validação antes do processamento

Um arquivo deverá ser validado antes que seu conteúdo seja processado.

Arquivos inválidos deverão ser rejeitados e o usuário deverá ser informado.

---

## RN-008 — Identificação do currículo

Cada importação deverá ser associada a um docente identificado ou deverá permanecer pendente de associação até que a identificação seja confirmada.

---

## RN-009 — Identificação por dados do currículo

Quando possível, a associação do currículo deverá considerar informações como:

* nome;
* ID Lattes;
* demais identificadores disponíveis.

---

## RN-010 — Arquivo corrompido

Arquivos que não possam ser lidos ou processados deverão ser marcados como erro de importação.

---

## RN-011 — Falha parcial

A falha na interpretação de uma seção não deverá obrigatoriamente invalidar as informações corretamente extraídas de outras seções.

---

## RN-012 — Processamento completo

Uma importação somente deverá ser considerada totalmente concluída quando todas as etapas previstas para aquele processamento tiverem sido executadas.

---

## RN-013 — Processamento com alertas

Quando houver dados processados corretamente, mas também existirem inconsistências ou informações não classificadas, o processamento poderá ser concluído com alertas.

---

## RN-014 — Reprocessamento

Um currículo poderá ser reprocessado quando:

* o processamento anterior falhar;
* uma nova versão do parser estiver disponível;
* o usuário autorizado solicitar;
* houver necessidade de atualização dos dados.

---

# 4. Regras de Identificação das Seções

## RN-015 — Identificação por estrutura

As seções do Currículo Lattes deverão ser identificadas por títulos, padrões e contexto, e não por número fixo de página.

---

## RN-016 — Independência de paginação

Alterações no número de páginas do currículo não deverão, por si só, impedir a identificação das informações.

---

## RN-017 — Processamento específico por seção

Cada tipo de informação poderá possuir regras específicas de extração.

Exemplo:

```text id="r7d1pk"
Formação → regra de formação
Artigos → regra de produção
Orientações → regra de orientação
Ensino → regra de ensino
```

---

# 5. Regras de Normalização

## RN-018 — Padronização

Informações equivalentes apresentadas em formatos diferentes deverão ser normalizadas quando houver segurança suficiente para isso.

Exemplo:

```text
Administração
ADMINISTRAÇÃO
Administração.
```

poderão representar a mesma informação.

---

## RN-019 — Preservação do valor original

A normalização não deverá eliminar desnecessariamente o valor original extraído.

Quando relevante, o sistema deverá preservar a informação original para rastreabilidade.

---

## RN-020 — Datas

Datas e períodos deverão ser armazenados em formato padronizado sempre que puderem ser identificados corretamente.

---

## RN-021 — Informações incompletas

Informações incompletas não deverão ser automaticamente preenchidas com valores inventados.

---

# 6. Regras de Identificação de Duplicidades

## RN-022 — Verificação de duplicidade

O sistema deverá verificar possíveis duplicidades antes de criar registros duplicados.

---

## RN-023 — Critérios de duplicidade

A identificação poderá utilizar combinações de:

* DOI;
* título;
* autores;
* ano;
* periódico;
* identificadores;
* demais informações disponíveis.

---

## RN-024 — Não exclusão automática

Uma possível duplicidade não deverá ser excluída automaticamente quando não houver certeza suficiente.

---

## RN-025 — Registro de suspeita

Registros suspeitos deverão poder ser marcados como:

**POSSÍVEL_DUPLICIDADE**

---

# 7. Regras de Formação

## RN-026 — Múltiplas formações

Um docente poderá possuir múltiplas formações acadêmicas.

---

## RN-027 — Nível da formação

Cada formação deverá possuir seu respectivo nível quando identificável.

Exemplos:

* Graduação;
* Especialização;
* Mestrado;
* Doutorado;
* Pós-Doutorado.

---

## RN-028 — Período da formação

Quando disponível, o período da formação deverá ser associado ao registro correspondente.

---

# 8. Regras de Ensino

## RN-029 — Múltiplas atividades

Um docente poderá possuir diversas atividades de Ensino.

---

## RN-030 — Nível de Ensino

Cada atividade deverá possuir um nível quando identificável.

---

## RN-031 — Ensino por período

Atividades de Ensino deverão ser associadas ao período correspondente quando essa informação estiver disponível.

---

## RN-032 — Ensino não identificado

Quando o sistema não conseguir determinar corretamente o nível ou período, o registro deverá ser marcado como incompleto ou não classificado, conforme o caso.

---

# 9. Regras de Pesquisa

## RN-033 — Múltiplas produções

Um docente poderá possuir múltiplas produções acadêmicas.

---

## RN-034 — Tipificação da produção

Cada produção deverá possuir um tipo quando identificável.

---

## RN-035 — Produção sem classificação

Uma produção poderá existir no sistema mesmo que ainda não tenha sido classificada quanto à qualidade.

---

## RN-036 — Produção não encontrada

A ausência de uma determinada categoria de produção no currículo não deverá ser automaticamente interpretada como inexistência absoluta da produção.

---

## RN-037 — Produção compartilhada

Uma produção poderá possuir múltiplos autores.

---

## RN-038 — Ordem dos autores

Quando disponível, a ordem dos autores deverá ser preservada.

---

## RN-039 — Projetos de Pesquisa

Um projeto de Pesquisa poderá possuir múltiplos docentes participantes.

---

# 10. Regras de Orientações

## RN-040 — Múltiplas orientações

Um docente poderá possuir múltiplas orientações.

---

## RN-041 — Situação da orientação

Quando identificável, a orientação deverá ser classificada como:

* em andamento;
* concluída.

---

## RN-042 — Nível da orientação

Quando disponível, deverá ser identificado o nível da orientação.

---

# 11. Regras de Extensão

## RN-043 — Extensão identificada

Quando uma atividade de Extensão puder ser identificada com segurança, ela deverá ser registrada.

---

## RN-044 — Extensão não identificada

Quando o sistema não encontrar evidência suficiente de uma atividade de Extensão, deverá registrar a situação como **não identificada** em vez de assumir ausência de atividade.

---

## RN-045 — Extensão não informada

Quando a informação não estiver disponível na fonte, deverá ser diferenciada de uma atividade inexistente.

---

## RN-046 — Classificação de Extensão

Uma atividade somente deverá ser classificada como Extensão quando houver evidência suficiente ou regra específica que justifique a classificação.

---

# 12. Regras de Produção Técnica e Outras Atividades

## RN-047 — Produção técnica

Produções técnicas deverão ser armazenadas separadamente da produção bibliográfica quando a distinção puder ser identificada.

---

## RN-048 — Bancas

Participações em bancas deverão ser diferenciadas das orientações e demais atividades acadêmicas.

---

## RN-049 — Eventos

Participações em eventos deverão possuir classificação própria quando utilizadas pelos indicadores.

---

## RN-050 — Patentes e registros

Patentes e registros deverão ser armazenados como tipos específicos de produção quando identificados.

---

# 13. Regras de Qualidade dos Dados

## RN-051 — Estado do dado

Informações processadas deverão possuir estado quando necessário.

Estados possíveis:

* VÁLIDO;
* INCOMPLETO;
* NÃO_CLASSIFICADO;
* POSSÍVEL_DUPLICIDADE;
* INCONSISTENTE;
* NÃO_IDENTIFICADO.

---

## RN-052 — Dados incompletos

Dados incompletos não deverão ser utilizados em cálculos que dependam das informações ausentes.

---

## RN-053 — Dados inconsistentes

Dados identificados como inconsistentes deverão ser sinalizados antes de serem utilizados em indicadores afetados.

---

## RN-054 — Dados não classificados

Dados não classificados poderão permanecer armazenados, mas deverão ser diferenciados dos dados classificados.

---

## RN-055 — Validação manual

Informações críticas poderão ser submetidas à validação manual de usuários autorizados.

---

# 14. Regras de Rastreabilidade

## RN-056 — Fonte da informação

Informações extraídas deverão manter referência à importação de origem.

---

## RN-057 — Página de origem

Quando possível, deverá ser armazenada a página do PDF relacionada à informação.

---

## RN-058 — Seção de origem

Deverá ser registrada a seção do currículo da qual a informação foi extraída quando possível.

---

## RN-059 — Versão do parser

Cada processamento deverá registrar a versão do parser utilizada.

---

## RN-060 — Histórico de processamento

O sistema deverá manter histórico suficiente para identificar quando e como determinado currículo foi processado.

---

# 15. Regras de Classificação

## RN-061 — Classificação baseada em critérios

A classificação de uma produção deverá utilizar critérios previamente definidos.

---

## RN-062 — Classificação independente da extração

A classificação não deverá fazer parte da etapa de extração do PDF.

---

## RN-063 — Produção sem classificação

Uma produção sem classificação deverá permanecer identificada como não classificada.

---

## RN-064 — Classificação manual

Quando permitido, usuários autorizados poderão alterar ou atribuir classificações manualmente.

---

## RN-065 — Justificativa da classificação

Alterações manuais de classificação deverão possuir justificativa quando exigido pelo perfil ou pelo processo de auditoria.

---

## RN-066 — Versionamento da classificação

Toda classificação deverá estar associada à versão dos critérios utilizados.

---

# 16. Regras de Indicadores

## RN-067 — Indicador baseado em dados estruturados

Indicadores deverão ser calculados a partir de dados estruturados e validados.

---

## RN-068 — Indicador por período

Indicadores deverão estar associados ao período correspondente.

---

## RN-069 — Indicador por dimensão

Indicadores deverão identificar a dimensão à qual pertencem:

* Ensino;
* Pesquisa;
* Extensão.

---

## RN-070 — Indicador por docente

Quando aplicável, indicadores poderão ser calculados individualmente por docente.

---

## RN-071 — Indicador consolidado

Indicadores poderão ser consolidados para representar o desempenho do programa.

---

## RN-072 — Dados insuficientes

Quando não houver dados suficientes para calcular um indicador de maneira confiável, o sistema não deverá inventar um resultado.

O indicador deverá ser marcado como indisponível, incompleto ou equivalente.

---

## RN-073 — Reprocessamento de indicadores

Alterações nos dados ou critérios poderão exigir o recálculo dos indicadores afetados.

---

# 17. Regras de Histórico

## RN-074 — Preservação histórica

Resultados históricos deverão ser preservados.

---

## RN-075 — Mudança de regra

Uma alteração de regra não deverá modificar silenciosamente resultados históricos já consolidados.

---

## RN-076 — Identificação da versão da regra

Resultados deverão permitir identificar a versão das regras utilizadas.

---

## RN-077 — Comparação entre períodos

Comparações entre períodos deverão considerar diferenças relevantes nas regras utilizadas.

---

# 18. Regras de Importação e Atualização

## RN-078 — Atualização do currículo

Uma nova importação poderá representar uma atualização do Currículo Lattes de um docente.

---

## RN-079 — Histórico de versões

O sistema deverá preservar informações suficientes para identificar diferentes importações do mesmo currículo.

---

## RN-080 — Não sobrescrever silenciosamente

Uma nova importação não deverá apagar silenciosamente dados históricos ou informações necessárias para auditoria.

---

## RN-081 — Reprocessamento controlado

Quando uma nova versão do parser for utilizada, o processamento deverá ser identificado como uma nova versão do processamento.

---

# 19. Regras de Usuários e Permissões

## RN-082 — Controle de acesso

Usuários somente poderão executar operações compatíveis com suas permissões.

---

## RN-083 — Administração

Operações administrativas deverão ser restritas a usuários autorizados.

---

## RN-084 — Alteração de critérios

Alterações em critérios e regras deverão ser restritas a perfis autorizados.

---

## RN-085 — Alteração de dados acadêmicos

Alterações manuais de dados acadêmicos deverão ser restritas conforme o perfil do usuário.

---

# 20. Regras de Auditoria

## RN-086 — Registro de alterações relevantes

Alterações relevantes deverão possuir registro de auditoria.

---

## RN-087 — Identificação do usuário

O sistema deverá registrar o usuário responsável por operações administrativas relevantes.

---

## RN-088 — Histórico de classificação

Alterações manuais em classificações deverão manter histórico quando aplicável.

---

# 21. Regras de Segurança dos Arquivos

## RN-089 — Arquivo deve ser validado

Nenhum PDF deverá ser processado antes de passar pelas validações de segurança e integridade definidas pelo sistema.

---

## RN-090 — Arquivo não confiável

Arquivos considerados inválidos ou potencialmente maliciosos deverão ser rejeitados.

---

## RN-091 — Acesso ao arquivo

O arquivo original somente poderá ser acessado por usuários e componentes autorizados.

---

# 22. Regras de Processamento

## RN-092 — Pipeline ordenado

O processamento deverá seguir a sequência lógica:

```text
Validação
    ↓
Extração
    ↓
Normalização
    ↓
Identificação
    ↓
Estruturação
    ↓
Deduplicação
    ↓
Validação
    ↓
Persistência
```

---

## RN-093 — Dados brutos antes da interpretação

Sempre que necessário para rastreabilidade, o sistema deverá preservar os dados extraídos antes das transformações posteriores.

---

## RN-094 — Falha isolada

Uma falha em uma etapa específica deverá ser registrada sem comprometer desnecessariamente informações já processadas corretamente.

---

## RN-095 — Conclusão com alertas

Um processamento poderá ser concluído com alertas quando os dados principais tiverem sido processados, mas existirem informações incompletas, não classificadas ou inconsistentes.

---

# 23. Regras de Validação com a Instituição-Piloto

## RN-096 — Validação com dados reais

Os resultados do processamento deverão ser validados com os dados reais da instituição-piloto.

---

## RN-097 — Divergências

Divergências identificadas entre o currículo original e os dados processados deverão ser registradas.

---

## RN-098 — Correção

Dados incorretos poderão ser corrigidos por usuários autorizados.

---

## RN-099 — Feedback

Divergências encontradas durante a validação deverão ser utilizadas para melhorar o parser e as regras do sistema.

---

# 24. Regras de Escopo do MVP

## RN-100 — Foco no problema principal

O MVP deverá priorizar:

* importação dos Currículos Lattes;
* estruturação dos dados;
* Ensino;
* Pesquisa;
* Extensão;
* produção acadêmica;
* classificação;
* indicadores;
* visualização;
* relatórios.

---

## RN-101 — Funcionalidades futuras

Funcionalidades como:

* integração automática com o Lattes;
* benchmarking entre universidades;
* inteligência artificial avançada;
* análises preditivas;
* recomendações automáticas;
* arquitetura SaaS completa;

não deverão ser utilizadas como dependências obrigatórias do MVP.

---

# 25. Regras de Evolução

## RN-102 — Parser evolutivo

O parser deverá permitir inclusão de novos padrões e seções sem reconstrução completa do sistema.

---

## RN-103 — Novos tipos de produção

O sistema deverá permitir a inclusão de novos tipos de produção acadêmica.

---

## RN-104 — Novos indicadores

O sistema deverá permitir criação de novos indicadores sem necessidade de alterar os dados históricos existentes.

---

## RN-105 — Novas instituições

A arquitetura deverá permitir futura expansão para diferentes instituições.

---

# 26. Princípios Fundamentais

## RN-106 — Confiabilidade acima de completude

Quando houver conflito entre extrair mais informações e manter a confiabilidade dos dados, a confiabilidade deverá ser priorizada.

---

## RN-107 — Transparência

Indicadores e classificações deverão possuir critérios identificáveis.

---

## RN-108 — Rastreabilidade

Informações relevantes deverão poder ser relacionadas à sua origem.

---

## RN-109 — Separação entre dados e regras

Dados acadêmicos não deverão depender diretamente das regras de avaliação utilizadas para analisá-los.

---

## RN-110 — Evolução sem perda histórica

Alterações no parser, critérios ou indicadores não deverão eliminar informações históricas relevantes.

---

# 27. Regra Geral de Consistência

Sempre que uma informação não puder ser determinada com segurança suficiente, o sistema deverá:

1. preservar a informação disponível;
2. identificar sua limitação;
3. evitar inferência não fundamentada;
4. permitir validação ou correção quando aplicável.

A confiabilidade do PPGA Analytics deverá prevalecer sobre a tentativa de produzir resultados completos artificialmente.
