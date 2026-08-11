# MVP — PPGA Analytics

## 1. Objetivo do MVP

O MVP (Minimum Viable Product) do **PPGA Analytics** tem como objetivo validar a capacidade do sistema de transformar Currículos Lattes em formato PDF em dados acadêmicos estruturados e, a partir desses dados, disponibilizar indicadores e análises úteis para a gestão de um Programa de Pós-Graduação.

O MVP deverá ser desenvolvido inicialmente para uma **instituição-piloto**, utilizando os Currículos Lattes reais dos docentes do programa.

O objetivo principal não é construir imediatamente uma plataforma comercial completa, mas validar:

> **PDF Lattes → dados estruturados → regras de negócio → indicadores → análise acadêmica.**

---

# 2. Problema que o MVP deve validar

O MVP deverá validar se é possível reduzir o trabalho manual necessário para:

* coletar Currículos Lattes;
* extrair informações acadêmicas;
* organizar dados;
* consolidar informações de docentes;
* acompanhar Ensino, Pesquisa e Extensão;
* analisar produção acadêmica;
* aplicar critérios de classificação;
* gerar indicadores;
* identificar pontos de atenção;
* gerar relatórios.

---

# 3. Hipótese do MVP

A hipótese principal é:

> **Se o PPGA Analytics conseguir processar automaticamente Currículos Lattes em PDF e transformar suas informações em dados estruturados e indicadores confiáveis, o sistema poderá reduzir significativamente o esforço manual de análise acadêmica de um Programa de Pós-Graduação.**

---

# 4. Usuário do MVP

O principal usuário será:

### Coordenador/Gestor do Programa de Pós-Graduação

Esse usuário deverá utilizar o sistema para:

* importar currículos;
* acompanhar docentes;
* analisar produção;
* consultar Ensino, Pesquisa e Extensão;
* visualizar indicadores;
* identificar pontos de atenção;
* gerar relatórios.

Outros perfis poderão existir para suporte ao funcionamento do sistema.

---

# 5. Ambiente do MVP

O MVP será inicialmente desenvolvido para uma única instituição-piloto.

A instituição deverá fornecer:

* Currículos Lattes dos docentes;
* informações necessárias para validação;
* critérios de análise;
* parâmetros dos indicadores;
* feedback sobre os resultados.

A instituição-piloto será utilizada como ambiente de validação e como primeiro caso de uso do sistema.

---

# 6. Entrada Principal

A entrada principal do MVP será:

**Currículo Lattes em formato PDF.**

O fluxo será:

```text id="n0n3rx"
Currículo Lattes
      ↓
Download pelo usuário
      ↓
Upload no sistema
      ↓
Validação
      ↓
Processamento
```

O MVP não dependerá de integração automática com o Lattes.

---

# 7. Funcionalidades Obrigatórias do MVP

## 7.1 Autenticação

O sistema deverá possuir:

* login;
* controle de acesso;
* perfis básicos de usuário.

---

## 7.2 Cadastro da instituição

O sistema deverá permitir representar a instituição-piloto.

---

## 7.3 Cadastro do programa

O sistema deverá permitir representar o Programa de Pós-Graduação analisado.

---

## 7.4 Cadastro de docentes

O sistema deverá permitir:

* cadastrar docentes;
* associar docentes ao programa;
* armazenar ID Lattes;
* consultar informações acadêmicas.

---

# 8. Importação de Currículos Lattes

Esta será uma das funcionalidades centrais do MVP.

O sistema deverá permitir:

1. selecionar um PDF;
2. validar o arquivo;
3. iniciar o processamento;
4. extrair o texto;
5. identificar as seções;
6. extrair informações;
7. normalizar os dados;
8. validar os registros;
9. identificar possíveis duplicidades;
10. persistir os dados.

Fluxo:

```text id="v5i4h6"
PDF
 ↓
Validação
 ↓
Extração
 ↓
Normalização
 ↓
Parser
 ↓
Dados estruturados
 ↓
Validação
 ↓
Banco
```

---

# 9. Informações Extraídas no MVP

O MVP deverá priorizar as seguintes informações.

## Identificação

* nome;
* ID Lattes;
* data de atualização;
* informações básicas.

## Formação

* graduação;
* especialização;
* mestrado;
* doutorado;
* pós-doutorado;
* instituição;
* períodos.

## Ensino

* disciplinas;
* nível;
* instituição;
* período.

## Pesquisa

* projetos;
* artigos;
* livros;
* capítulos;
* produção técnica;
* orientações.

## Extensão

* atividades identificáveis;
* projetos;
* participação;
* período, quando disponível.

## Informações acadêmicas complementares

* bancas;
* eventos;
* patentes e registros, quando relevantes.

---

# 10. Pipeline de Processamento

O MVP deverá implementar o seguinte pipeline:

```text id="n4l9mc"
┌───────────────────────┐
│ Currículo Lattes PDF  │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ Validação             │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ Extração de texto     │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ Normalização          │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ Identificação de      │
│ seções                │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ Parser especializado  │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ Deduplicação          │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ Validação             │
└───────────┬───────────┘
            ↓
┌───────────────────────┐
│ Persistência          │
└───────────────────────┘
```

---

# 11. Parser

O MVP deverá possuir parser modular para as principais seções.

A estrutura conceitual será:

```text id="u7h8ib"
LattesParser
│
├── IdentificationParser
├── FormationParser
├── TeachingParser
├── ResearchParser
├── PublicationParser
├── OrientationParser
├── ExtensionParser
└── TechnicalProductionParser
```

O parser deverá utilizar padrões estruturais e textuais, e não números de página fixos.

---

# 12. Qualidade dos Dados

O MVP deverá identificar:

* dados válidos;
* dados incompletos;
* dados não classificados;
* possíveis duplicidades;
* dados inconsistentes;
* informações não identificadas.

O sistema não deverá preencher automaticamente informações ausentes sem evidência suficiente.

---

# 13. Rastreabilidade

Cada informação relevante deverá possuir, quando tecnicamente possível:

* currículo de origem;
* importação;
* seção;
* página;
* versão do parser;
* estado do dado.

O objetivo é permitir que o usuário consiga verificar a origem das informações.

---

# 14. Produção Acadêmica

O MVP deverá permitir consultar a produção acadêmica dos docentes.

Inicialmente deverão ser consideradas:

* artigos;
* livros;
* capítulos;
* trabalhos em eventos;
* produção técnica;
* patentes/registros, quando aplicável.

---

# 15. Classificação da Produção

O MVP deverá permitir aplicar critérios de classificação às produções.

O fluxo será:

```text id="j3q6r4"
Produção
   ↓
Critério
   ↓
Classificação
   ↓
Indicador
```

A classificação deverá ser separada da extração.

Uma produção poderá existir sem classificação.

---

# 16. Ensino

O MVP deverá permitir visualizar atividades de Ensino dos docentes.

Deverá ser possível consultar:

* docente;
* disciplina;
* nível;
* período;
* instituição, quando disponível.

---

# 17. Pesquisa

O MVP deverá permitir visualizar informações relacionadas à Pesquisa.

Deverá incluir:

* projetos;
* produção acadêmica;
* orientações;
* produção técnica;
* informações relacionadas à atuação científica.

---

# 18. Extensão

O MVP deverá permitir visualizar atividades de Extensão identificadas.

O sistema deverá diferenciar:

```text id="y1as4e"
Atividade identificada
        ≠
Atividade não identificada
        ≠
Atividade não informada
```

A ausência de uma ocorrência explícita no Lattes não deverá ser utilizada isoladamente para afirmar que o docente não realizou atividades de Extensão.

---

# 19. Períodos

O MVP deverá permitir organizar os dados por períodos de análise.

Deverá ser possível:

* cadastrar períodos;
* associar dados aos períodos;
* consultar históricos;
* comparar resultados quando aplicável.

---

# 20. Indicadores

O MVP deverá disponibilizar indicadores relacionados às três dimensões principais:

### Ensino

Indicadores relacionados às atividades de ensino.

### Pesquisa

Indicadores relacionados à produção, projetos e orientações.

### Extensão

Indicadores relacionados às atividades de extensão identificadas.

Os critérios e fórmulas deverão ser definidos e validados com a instituição-piloto.

---

# 21. Dashboard

O MVP deverá possuir um dashboard principal contendo, quando aplicável:

* quantidade de docentes;
* indicadores de Ensino;
* indicadores de Pesquisa;
* indicadores de Extensão;
* produção acadêmica;
* evolução temporal;
* classificações;
* pontos de atenção.

---

# 22. Perfil do Docente

O MVP deverá possuir uma visão individual do docente.

Deverá apresentar:

```text id="ozf4n1"
Docente
├── Identificação
├── Formação
├── Ensino
├── Pesquisa
├── Extensão
├── Produção
├── Orientações
└── Indicadores
```

---

# 23. Pontos de Atenção

O MVP deverá identificar situações relevantes como:

* dados incompletos;
* produções não classificadas;
* indicadores abaixo de parâmetros definidos;
* variações relevantes;
* possíveis inconsistências.

Os pontos de atenção deverão apresentar a origem ou justificativa sempre que possível.

---

# 24. Relatórios

O MVP deverá permitir gerar:

### Relatório do Programa

Com informações consolidadas do programa.

### Relatório do Docente

Com informações acadêmicas individualizadas.

Os relatórios deverão identificar:

* período;
* indicadores;
* dimensões;
* critérios;
* informações relevantes.

---

# 25. Histórico

O MVP deverá preservar informações históricas suficientes para:

* consultar períodos anteriores;
* comparar resultados;
* acompanhar evolução;
* identificar alterações nos critérios.

---

# 26. Auditoria

O MVP deverá registrar operações críticas, incluindo:

* importações;
* reprocessamentos;
* alterações de classificação;
* alterações de critérios;
* alterações relevantes nos dados.

---

# 27. Validação do MVP

A validação deverá ocorrer utilizando os dados da instituição-piloto.

O processo deverá comparar:

```text id="d0ay4p"
Currículo original
       ↓
Dados extraídos
       ↓
Dados estruturados
       ↓
Indicadores
```

Os resultados deverão ser revisados por usuários responsáveis pelo programa.

---

# 28. Critérios de Aceitação do MVP

O MVP será considerado funcional quando conseguir:

### CA-01 — Importação

Receber um Currículo Lattes em PDF e processá-lo.

### CA-02 — Extração

Extrair informações acadêmicas relevantes.

### CA-03 — Estruturação

Transformar informações extraídas em dados estruturados.

### CA-04 — Validação

Identificar dados incompletos, inconsistentes e possíveis duplicidades.

### CA-05 — Ensino

Apresentar informações relacionadas ao Ensino.

### CA-06 — Pesquisa

Apresentar informações relacionadas à Pesquisa.

### CA-07 — Extensão

Apresentar informações de Extensão identificadas.

### CA-08 — Produção

Apresentar produção acadêmica dos docentes.

### CA-09 — Classificação

Permitir classificação das produções conforme critérios definidos.

### CA-10 — Indicadores

Calcular indicadores básicos.

### CA-11 — Dashboard

Apresentar indicadores de forma visual.

### CA-12 — Histórico

Permitir consulta por período.

### CA-13 — Relatórios

Gerar relatórios do programa e dos docentes.

### CA-14 — Rastreabilidade

Permitir identificar a origem de dados relevantes.

### CA-15 — Validação institucional

Permitir que a instituição-piloto valide os resultados.

---

# 29. O que NÃO faz parte do MVP

Para evitar crescimento descontrolado do escopo, ficam explicitamente fora do MVP:

## Integrações

* integração automática com o Lattes;
* APIs externas;
* integração com sistemas acadêmicos;
* integração com bases bibliográficas externas.

## Inteligência

* IA generativa;
* análises preditivas;
* recomendações automáticas;
* classificação automática avançada sem critérios validados.

## Comparações

* benchmarking nacional;
* ranking de universidades;
* comparação automática entre instituições.

## Produto comercial

* SaaS multi-institucional completo;
* cobrança;
* planos;
* assinaturas;
* marketplace;
* administração comercial.

## Plataformas

* aplicativo mobile;
* versão desktop;
* múltiplas interfaces especializadas.

Esses itens poderão ser avaliados após a validação do MVP.

---

# 30. Priorização

As funcionalidades do MVP serão classificadas em três níveis.

## Prioridade P0 — Essencial

Sem essas funcionalidades, o MVP não cumpre seu objetivo.

* autenticação;
* programa;
* docentes;
* upload de Lattes;
* processamento PDF;
* extração;
* normalização;
* validação;
* persistência;
* produção;
* Ensino;
* Pesquisa;
* Extensão;
* indicadores básicos;
* dashboard básico.

---

## Prioridade P1 — Importante

Necessárias para tornar o MVP realmente útil.

* classificação;
* histórico;
* pontos de atenção;
* relatórios;
* rastreabilidade;
* auditoria;
* reprocessamento.

---

## Prioridade P2 — Pós-MVP

Funcionalidades que podem aguardar validação inicial.

* benchmarking;
* integrações externas;
* IA avançada;
* análises preditivas;
* recomendações;
* multi-instituição;
* SaaS;
* aplicativo mobile.

---

# 31. Escopo Técnico do MVP

O MVP deverá ser composto, conceitualmente, por:

```text id="m83t6h"
┌─────────────────────────────┐
│         Interface           │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│            API              │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│       Regras de Negócio     │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│      Dados Acadêmicos       │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│          Banco              │
└─────────────────────────────┘

        PDF Lattes
             ↓
      Pipeline de ingestão
             ↓
      Dados acadêmicos
```

---

# 32. Estratégia de Entrega

O MVP deverá ser entregue de maneira incremental.

### Incremento 1 — Fundação

* projeto;
* banco;
* autenticação;
* instituição;
* programa;
* docentes.

### Incremento 2 — Lattes

* upload;
* extração;
* parser;
* normalização;
* validação;
* persistência.

### Incremento 3 — Dados acadêmicos

* Ensino;
* Pesquisa;
* produção;
* orientações;
* Extensão.

### Incremento 4 — Análise

* classificação;
* critérios;
* indicadores.

### Incremento 5 — Visualização

* dashboard;
* perfil do docente;
* pontos de atenção;
* histórico.

### Incremento 6 — Validação

* relatórios;
* auditoria;
* correções;
* reprocessamento;
* validação com a instituição-piloto.

---

# 33. Métricas de Validação

Durante a validação do MVP deverão ser observadas métricas como:

* quantidade de currículos processados;
* tempo de processamento;
* quantidade de registros extraídos;
* quantidade de registros válidos;
* quantidade de registros incompletos;
* quantidade de possíveis duplicidades;
* quantidade de erros;
* quantidade de correções manuais;
* precisão da extração das principais informações.

---

# 34. Critério de Sucesso do Produto

O MVP será considerado validado quando a instituição-piloto demonstrar que o sistema consegue substituir uma parcela relevante do trabalho manual de consolidação e análise dos Currículos Lattes.

O sucesso deverá considerar:

1. funcionamento técnico;
2. qualidade dos dados;
3. confiabilidade dos indicadores;
4. facilidade de uso;
5. redução do esforço manual;
6. utilidade para a gestão do programa.

---

# 35. Resultado Esperado

Ao final do MVP, o usuário deverá conseguir realizar o seguinte fluxo:

```text id="1v8s2a"
1. Entrar no sistema
        ↓
2. Selecionar o programa
        ↓
3. Cadastrar/selecionar docente
        ↓
4. Enviar o Currículo Lattes PDF
        ↓
5. Aguardar processamento
        ↓
6. Conferir resultado
        ↓
7. Consultar dados acadêmicos
        ↓
8. Classificar produções
        ↓
9. Visualizar indicadores
        ↓
10. Analisar pontos de atenção
        ↓
11. Consultar histórico
        ↓
12. Gerar relatório
```

---

# 36. Definição Final do MVP

O MVP do PPGA Analytics pode ser resumido como:

> **Uma aplicação capaz de receber Currículos Lattes em PDF de uma instituição-piloto, extrair e estruturar informações acadêmicas relevantes, organizar essas informações nas dimensões de Ensino, Pesquisa e Extensão e apresentar indicadores, análises e relatórios para apoiar a gestão de um Programa de Pós-Graduação.**

O MVP deverá priorizar **confiabilidade, rastreabilidade e validação do problema**, deixando funcionalidades comerciais e análises avançadas para etapas posteriores.
