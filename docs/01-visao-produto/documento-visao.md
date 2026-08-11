# Documento de Visão — PPGA Analytics

## 1. Identificação do Projeto

**Nome:** PPGA Analytics
**Tipo:** Sistema de análise e gestão acadêmica para Programas de Pós-Graduação
**Versão:** 1.0
**Status:** Em especificação
**Instituição-piloto:** A definir/conforme projeto
**Equipe:** Equipe de desenvolvimento do projeto

---

# 2. Visão Geral

O **PPGA Analytics** é uma plataforma destinada ao apoio à gestão e análise de informações acadêmicas de Programas de Pós-Graduação.

O sistema tem como objetivo transformar dados acadêmicos, inicialmente obtidos a partir de **Currículos Lattes em formato PDF**, em informações estruturadas, indicadores e análises que permitam aos gestores acompanhar a atuação de docentes e do programa nas dimensões de:

* Ensino;
* Pesquisa;
* Extensão.

A solução deverá reduzir a dependência de processos manuais de consolidação de informações em planilhas e proporcionar uma visão centralizada, organizada e rastreável da produção acadêmica do programa.

---

# 3. Contexto

Programas de Pós-Graduação precisam acompanhar continuamente informações relacionadas à atuação de seus docentes, produção científica, atividades de ensino, pesquisa, extensão, orientações e demais atividades acadêmicas.

Grande parte dessas informações encontra-se distribuída em currículos acadêmicos e diferentes fontes de dados.

O processo manual de consolidação dessas informações pode exigir grande quantidade de tempo, apresentar riscos de inconsistências e dificultar a análise histórica.

Nesse contexto, o PPGA Analytics propõe centralizar e estruturar essas informações para facilitar o acompanhamento do desempenho acadêmico.

---

# 4. Problema

Atualmente, a análise das informações acadêmicas de um programa pode depender de:

* consultas individuais aos Currículos Lattes;
* coleta manual de informações;
* planilhas;
* consolidação de dados;
* classificação manual;
* conferência de informações;
* elaboração manual de relatórios.

Esse processo pode dificultar:

* acompanhamento contínuo;
* identificação de pontos de atenção;
* comparação entre períodos;
* análise individual de docentes;
* consolidação institucional;
* rastreabilidade dos indicadores.

---

# 5. Problema Central

O problema central que o PPGA Analytics pretende resolver é:

> **Como transformar informações acadêmicas dispersas em dados estruturados, indicadores e análises úteis para a gestão de um Programa de Pós-Graduação, reduzindo a dependência de processos manuais?**

---

# 6. Solução Proposta

O PPGA Analytics deverá permitir que usuários autorizados forneçam os **Currículos Lattes em formato PDF** dos docentes do programa.

O sistema deverá:

1. receber os arquivos;
2. validar os documentos;
3. extrair o conteúdo textual;
4. identificar as principais seções do currículo;
5. extrair informações relevantes;
6. normalizar os dados;
7. validar as informações;
8. identificar possíveis duplicidades e inconsistências;
9. armazenar os dados estruturados;
10. aplicar regras de negócio;
11. calcular indicadores;
12. apresentar dashboards e relatórios.

Fluxo conceitual:

```text
Currículo Lattes PDF
        ↓
      Upload
        ↓
 Validação do arquivo
        ↓
 Extração do texto
        ↓
 Identificação das seções
        ↓
 Extração estruturada
        ↓
    Normalização
        ↓
     Validação
        ↓
 Dados acadêmicos
        ↓
 Regras de negócio
        ↓
    Indicadores
        ↓
 Dashboard / Relatórios
```

---

# 7. Público-Alvo

O público-alvo principal do sistema é composto por:

* coordenadores de Programas de Pós-Graduação;
* gestores acadêmicos;
* responsáveis pelo acompanhamento institucional;
* administradores de programas;
* docentes, em funcionalidades específicas.

Em versões futuras, a solução poderá atender múltiplas instituições.

---

# 8. Usuário Principal

O principal usuário do MVP será o **coordenador ou gestor do Programa de Pós-Graduação**.

Esse usuário deverá conseguir:

* visualizar o desempenho do programa;
* consultar docentes;
* acompanhar Ensino, Pesquisa e Extensão;
* consultar produções acadêmicas;
* visualizar indicadores;
* acompanhar períodos;
* identificar pontos de atenção;
* gerar relatórios.

---

# 9. Dimensões de Análise

O sistema deverá estruturar a análise acadêmica em três dimensões principais.

## 9.1 Ensino

Informações relacionadas à atuação docente em atividades de ensino.

Exemplos:

* disciplinas;
* níveis de ensino;
* graduação;
* mestrado;
* doutorado;
* atividades acadêmicas;
* períodos de atuação.

---

## 9.2 Pesquisa

Informações relacionadas à produção e atuação científica.

Exemplos:

* artigos;
* livros;
* capítulos;
* projetos;
* orientações;
* teses;
* dissertações;
* produção técnica;
* demais produções acadêmicas relevantes.

---

## 9.3 Extensão

Informações relacionadas à participação em atividades e projetos de extensão.

A identificação de atividades de extensão deverá considerar que os Currículos Lattes podem apresentar essas informações de maneiras diferentes.

A ausência de uma ocorrência explícita de "Extensão" no currículo **não deverá ser interpretada automaticamente como ausência de atividades de extensão**.

---

# 10. Fonte Inicial de Dados

A principal fonte de dados do MVP será o **Currículo Lattes em formato PDF**.

O sistema deverá ser projetado para processar currículos exportados ou baixados pelos usuários autorizados.

A solução não dependerá inicialmente de integração automática com o Lattes.

### Fluxo inicial

```text
Professor/Universidade
        ↓
Download do Currículo Lattes
        ↓
Arquivo PDF
        ↓
Upload no PPGA Analytics
```

Integrações automáticas com fontes externas poderão ser avaliadas em versões futuras.

---

# 11. Processamento dos Currículos Lattes

O sistema deverá utilizar um pipeline de processamento composto por etapas independentes.

```text
PDF
 ↓
Extração
 ↓
Normalização
 ↓
Identificação de seções
 ↓
Parser especializado
 ↓
Validação
 ↓
Deduplicação
 ↓
Persistência
```

O processamento deverá priorizar informações relevantes para os indicadores definidos pelo MVP.

---

# 12. Informações Prioritárias

O MVP deverá priorizar a extração das seguintes informações:

### Identificação

* nome;
* ID Lattes;
* data de atualização;
* informações básicas.

### Formação

* graduação;
* especialização;
* mestrado;
* doutorado;
* pós-doutorado;
* instituição;
* período.

### Ensino

* disciplinas;
* nível;
* instituição;
* período;
* atividades relevantes.

### Pesquisa

* projetos;
* produções;
* artigos;
* livros;
* capítulos;
* orientações.

### Extensão

* projetos;
* atividades;
* participação docente;
* períodos, quando identificáveis.

### Outras informações acadêmicas

* produção técnica;
* bancas;
* eventos;
* patentes e registros, quando relevantes para o MVP.

---

# 13. Estratégia de Processamento

O sistema não deverá depender de posições fixas de páginas para interpretar os currículos.

A identificação das informações deverá utilizar:

* títulos de seções;
* padrões textuais;
* estrutura dos registros;
* contexto da informação.

Essa abordagem deverá permitir processar currículos com diferentes quantidades de páginas.

---

# 14. Dados Estruturados

As informações extraídas deverão ser transformadas em estruturas que possam ser utilizadas pelas demais funcionalidades do sistema.

Conceitualmente:

```text
PDF
 ↓
Texto bruto
 ↓
Dados estruturados
 ↓
Dados normalizados
 ↓
Dados validados
 ↓
Indicadores
```

O sistema deverá diferenciar dados brutos, dados processados e dados utilizados nas análises.

---

# 15. Rastreabilidade

As informações relevantes deverão manter vínculo com sua origem.

Sempre que tecnicamente possível, o sistema deverá permitir identificar:

* arquivo de origem;
* currículo;
* seção;
* página;
* data de importação;
* versão do parser;
* estado do dado.

Isso permitirá responder:

> **"De onde veio este dado?"**

---

# 16. Qualidade dos Dados

O sistema deverá tratar situações como:

* dados incompletos;
* dados inconsistentes;
* possíveis duplicidades;
* informações não identificadas;
* informações não classificadas.

O sistema deverá priorizar a confiabilidade dos dados em vez de tentar inferir informações ausentes.

---

# 17. Classificação da Produção

A quantidade de produção acadêmica não deverá representar, isoladamente, sua qualidade ou relevância.

O sistema deverá permitir aplicar critérios de classificação às produções.

Conceitualmente:

```text
Produção
    ↓
Critérios
    ↓
Classificação
    ↓
Indicadores
```

Os critérios definitivos deverão ser definidos e validados com os responsáveis pelo programa.

---

# 18. Indicadores

O sistema deverá transformar os dados acadêmicos em indicadores relacionados às dimensões de:

* Ensino;
* Pesquisa;
* Extensão.

Os indicadores poderão ser apresentados em diferentes níveis:

* docente;
* programa;
* período;
* dimensão;
* tipo de produção.

Os resultados deverão possuir critérios claramente definidos e ser rastreáveis.

---

# 19. Dashboard

O sistema deverá fornecer uma visão consolidada do programa.

O dashboard deverá permitir visualizar, quando aplicável:

* quantidade de docentes;
* indicadores de Ensino;
* indicadores de Pesquisa;
* indicadores de Extensão;
* produção acadêmica;
* evolução temporal;
* classificações;
* pontos de atenção.

---

# 20. Visão Individual do Docente

O sistema deverá permitir consultar informações individualizadas de cada docente.

A visão poderá apresentar:

* formação;
* Ensino;
* Pesquisa;
* Extensão;
* produção;
* orientações;
* projetos;
* classificações;
* evolução dos indicadores.

---

# 21. Histórico

O sistema deverá preservar informações suficientes para permitir análises históricas.

O usuário deverá poder:

* consultar períodos anteriores;
* comparar indicadores;
* observar evolução;
* identificar alterações nos critérios utilizados.

---

# 22. Relatórios

O sistema deverá permitir a geração de relatórios relacionados ao programa e aos docentes.

Os relatórios deverão apresentar:

* período;
* indicadores;
* dimensões analisadas;
* dados relevantes;
* classificações;
* pontos de atenção;
* critérios utilizados, quando aplicável.

---

# 23. Rastreabilidade dos Indicadores

Os indicadores deverão permitir identificar, sempre que aplicável:

```text
Indicador
   ↓
Regra utilizada
   ↓
Critério
   ↓
Dados utilizados
   ↓
Fonte original
```

Essa estrutura permitirá maior transparência e confiabilidade dos resultados.

---

# 24. Escopo do MVP

O MVP deverá contemplar:

* autenticação;
* usuários;
* programa;
* docentes;
* períodos;
* upload de Currículos Lattes em PDF;
* processamento dos currículos;
* extração de dados relevantes;
* Ensino;
* Pesquisa;
* Extensão;
* produção acadêmica;
* classificação;
* indicadores;
* dashboard;
* histórico;
* pontos de atenção;
* relatórios;
* rastreabilidade;
* validação com a instituição-piloto.

---

# 25. Fora do Escopo Inicial

Não fazem parte do MVP:

* integração automática com o Lattes;
* integração com todas as bases acadêmicas;
* benchmarking nacional;
* comparação automática entre universidades;
* inteligência artificial avançada;
* análises preditivas;
* recomendações automáticas;
* aplicativo mobile;
* arquitetura comercial multi-institucional;
* sistema SaaS completo;
* cobrança e assinaturas.

Essas funcionalidades poderão ser consideradas em versões futuras.

---

# 26. Instituição-Piloto

A primeira instituição que utilizar o sistema deverá atuar como ambiente de validação da solução.

Os dados e fluxos reais da instituição serão utilizados para:

* validar o processamento dos currículos;
* validar os indicadores;
* identificar inconsistências;
* validar dashboards;
* validar relatórios;
* coletar feedback dos usuários.

A instituição-piloto poderá posteriormente atuar como **case de validação do produto**.

---

# 27. Evolução Futura

Após a validação do MVP, o PPGA Analytics poderá evoluir para uma plataforma capaz de atender múltiplos programas e instituições.

Possíveis evoluções:

```text
MVP
 ↓
Integrações
 ↓
Automação
 ↓
Benchmarking
 ↓
Multi-instituição
 ↓
SaaS
 ↓
Escala comercial
```

A evolução deverá ocorrer de acordo com necessidades reais identificadas durante a utilização do MVP.

---

# 28. Hipótese de Valor

A principal hipótese do produto é:

> **Se dados acadêmicos atualmente dispersos puderem ser automaticamente estruturados e transformados em indicadores confiáveis, os gestores de Programas de Pós-Graduação poderão acompanhar seu desempenho com menor dependência de processos manuais.**

---

# 29. Critério de Sucesso

O MVP será considerado bem-sucedido quando a instituição-piloto conseguir utilizar o sistema para:

1. inserir os Currículos Lattes dos docentes;
2. processar os documentos;
3. estruturar as informações relevantes;
4. consultar Ensino, Pesquisa e Extensão;
5. analisar produções;
6. visualizar indicadores;
7. acompanhar períodos;
8. identificar pontos de atenção;
9. gerar relatórios.

O principal objetivo será demonstrar que o sistema consegue transformar os currículos acadêmicos em informações úteis para a gestão do programa.

---

# 30. Princípios do Produto

O PPGA Analytics deverá seguir os seguintes princípios:

1. **Quantidade não é sinônimo de qualidade.**
2. **Ausência de informação não significa ausência de atividade.**
3. **Indicadores devem possuir critérios explícitos.**
4. **Dados relevantes devem ser rastreáveis.**
5. **Resultados históricos devem preservar seu contexto.**
6. **O sistema deve apoiar decisões, não substituí-las.**
7. **A confiabilidade dos dados deve ser priorizada sobre inferências não comprovadas.**
8. **O MVP deve permanecer focado no problema central.**
