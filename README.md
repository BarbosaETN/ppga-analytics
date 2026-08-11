# PPGA Analytics

Sistema web para automatizar a análise da produção acadêmica de docentes de programas de pós-graduação, transformando dados do Currículo Lattes em informações estruturadas, indicadores e visualizações para apoio à gestão acadêmica.

> **Status:** Em desenvolvimento — fase de especificação e validação técnica.

---

## 📌 Sobre o projeto

O **PPGA Analytics** tem como objetivo reduzir o trabalho manual envolvido na análise da produção acadêmica de docentes de programas de pós-graduação.

Atualmente, informações acadêmicas podem estar distribuídas em diferentes seções do Currículo Lattes, tornando a análise, comparação e consolidação dos dados um processo demorado e sujeito a inconsistências.

A proposta do sistema é permitir que os dados acadêmicos sejam importados, estruturados e posteriormente utilizados para gerar indicadores e informações úteis para gestores de programas de pós-graduação.

O sistema utiliza os dados do **Currículo Lattes** como principal fonte de informações e considera referências da **CAPES — Área 27** para apoiar a organização dos indicadores.

> O PPGA Analytics é uma ferramenta de **apoio à gestão e análise interna**. Ele não tem como objetivo reproduzir ou substituir a avaliação oficial da CAPES.

---

## 🎯 Objetivos

- Automatizar parte da análise manual de Currículos Lattes;
- Estruturar informações da produção acadêmica dos docentes;
- Facilitar a consulta e organização dos dados acadêmicos;
- Gerar indicadores internos para apoio à gestão;
- Permitir análises comparativas entre docentes;
- Disponibilizar dashboards e visualizações;
- Facilitar a geração de relatórios;
- Apoiar coordenações e gestores na tomada de decisões.

---

## 👥 Público-alvo

O sistema é direcionado principalmente para:

- Administradores;
- Coordenações de programas de pós-graduação;
- Secretarias acadêmicas;
- Docentes;
- Pró-Reitorias.

---

## 🚀 MVP

O MVP tem como objetivo validar a capacidade do sistema de transformar dados acadêmicos brutos em informações estruturadas e indicadores úteis para gestores.

### Funcionalidades previstas

- Cadastro e gerenciamento de usuários;
- Importação de Currículo Lattes;
- Extração e estruturação dos dados acadêmicos;
- Armazenamento da produção acadêmica;
- Consulta e filtragem dos dados;
- Indicadores acadêmicos;
- Dashboards;
- Rankings internos;
- Comparação entre docentes;
- Geração de relatórios.

### Entrada de dados

Na primeira versão, o usuário deverá:

1. Acessar o sistema;
2. Baixar o Currículo Lattes do docente;
3. Enviar o arquivo PDF ao sistema;
4. O sistema realizará a extração e estruturação das informações;
5. Os dados poderão ser utilizados para análises e indicadores.

A integração automática com o Currículo Lattes **não faz parte do MVP**.

---

## 🔬 Validação técnica

Foram realizadas POCs para avaliar a viabilidade da extração e estruturação dos dados presentes nos Currículos Lattes.

### POC 1

Avaliação inicial da abordagem de processamento dos arquivos e extração das informações.

### POC 2

A segunda POC foi realizada utilizando **5 Currículos Lattes em PDF**.

Foram avaliados:

- Extração de texto;
- Identificação do nome do pesquisador;
- Identificação do ID Lattes;
- Identificação das principais seções;
- Formação acadêmica;
- Ensino;
- Projetos;
- Artigos;
- Orientações;
- Produção técnica;
- Bancas;
- Eventos.

A POC demonstrou a viabilidade da extração das principais informações.

Alguns pontos ainda exigem tratamento específico, principalmente:

- Dados de extensão;
- Ruídos provenientes da extração;
- Duplicidades;
- Normalização das informações;
- Regras específicas para classificação dos dados.

---

## 📊 Produção acadêmica

O sistema deverá estruturar diferentes categorias de produção acadêmica, permitindo posteriormente a criação de indicadores e análises.

Entre as informações consideradas estão:

- Formação;
- Ensino;
- Projetos;
- Artigos;
- Orientações;
- Produção técnica;
- Bancas;
- Eventos;
- Extensão.

---

## 📈 Indicadores e análises

Os dados estruturados poderão ser utilizados para gerar informações como:

- Indicadores de produção acadêmica;
- Comparativos entre docentes;
- Rankings internos;
- Evolução da produção;
- Distribuição da produção por categoria;
- Dashboards gerenciais;
- Relatórios analíticos.

Os indicadores têm finalidade **gerencial e interna**, não representando uma nota ou avaliação oficial da CAPES.

---

## 🗺️ Roadmap

### MVP

- [x] Definição da visão do projeto
- [x] Levantamento dos requisitos
- [x] Definição das regras de negócio
- [x] Definição do MVP
- [x] Criação do backlog inicial
- [x] POCs de extração de dados
- [ ] Arquitetura do sistema
- [ ] Modelagem de dados
- [ ] Implementação do backend
- [ ] Implementação do processamento de Currículos Lattes
- [ ] Implementação do frontend
- [ ] Indicadores
- [ ] Dashboards
- [ ] Rankings
- [ ] Comparativos
- [ ] Relatórios
- [ ] Testes
- [ ] Validação do MVP

---

## 🔮 V2

Funcionalidades planejadas para versões futuras:

- Inteligência Artificial;
- Integração com Scopus;
- Integração com Web of Science;
- Integração com ORCID;
- Aplicativo móvel;
- Notificações automáticas;
- Análises preditivas.

Essas funcionalidades **não fazem parte do escopo atual do MVP**.

---

## 🏗️ Arquitetura

A arquitetura do sistema ainda está em definição.

A documentação do projeto está sendo construída de forma incremental, acompanhando as validações e decisões técnicas.

Documentos relacionados:

- [`Documento de Visão`](docs/documento-visao.md)
- [`Requisitos Funcionais`](docs/requisitos-funcionais.md)
- [`Requisitos Não Funcionais`](docs/requisitos-nao-funcionais.md)
- [`Regras de Negócio`](docs/regras-negocio.md)
- [`MVP`](docs/mvp.md)
- [`Backlog`](docs/backlog.md)

> Os caminhos acima devem ser ajustados caso os arquivos estejam organizados em outra estrutura no repositório.

---

## 🧪 Estado atual

O projeto encontra-se em fase de **especificação e validação técnica**.

Até o momento foram concluídas as principais etapas de definição do produto e realizadas POCs para validar a extração de informações dos Currículos Lattes.

O próximo estágio envolve a definição da arquitetura, modelagem do sistema e início da implementação do MVP.

---

## 🤝 Contribuidores

Projeto desenvolvido de forma colaborativa.

Contribuidores:

- Estevan Saldanha
- Ana Paula Carvalho
- Bruno Alexandre Damasceno

---

## 📄 Documentação

A documentação técnica e funcional do projeto está sendo mantida dentro do próprio repositório.

A documentação contempla:

- Visão do produto;
- Requisitos funcionais;
- Requisitos não funcionais;
- Regras de negócio;
- Definição do MVP;
- Backlog;
- POCs e validações técnicas;
- Arquitetura;
- Modelagem;
- Decisões técnicas.

---

## 📌 Observação

O PPGA Analytics está em desenvolvimento e sua arquitetura, tecnologias e funcionalidades podem ser refinadas conforme novas validações técnicas e necessidades do projeto.
