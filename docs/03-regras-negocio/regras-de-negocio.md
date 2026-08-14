# Regras de Negócio — PPGA Analytics

## 1. Princípios

### RN-001 — Fonte confiável
Dados acadêmicos deverão ser derivados de fontes processadas pelo sistema.

### RN-002 — Não inferência
O sistema não deverá inventar informações.

### RN-003 — Ausência não equivale a inexistência
A ausência de uma informação no currículo não deverá, sozinha, significar que a atividade não existe.

### RN-004 — Separação de etapas
Extração, normalização, classificação e cálculo de indicadores são etapas distintas.

## 2. Importação

### RN-005 — Entrada
O currículo recebido no MVP será um PDF.

### RN-006 — Extração Python
O PDF deverá ser processado pelo componente de extração desenvolvido em Python.

### RN-007 — JSON de saída
O parser Python deverá entregar ao backend Node.js um JSON padronizado contendo os dados extraídos e normalizados.

### RN-008 — Arquivo temporário
O PDF deverá ser tratado como arquivo temporário e descartado após o processamento, salvo necessidade técnica temporária devidamente controlada. O JSON de comunicação não deverá ser tratado como armazenamento permanente de arquivos.

### RN-009 — Processamento
Cada execução deverá possuir status e identificação.

### RN-010 — Reprocessamento
Reprocessamentos deverão ser identificados e não deverão duplicar indevidamente os dados.

## 3. Docentes e alunos

### RN-011 — Docente
Um programa poderá possuir vários docentes.

### RN-012 — Aluno
O sistema deverá representar alunos relacionados ao programa e às atividades acadêmicas identificadas.

### RN-013 — Relação docente–aluno
Uma relação entre docente e aluno deverá ser registrada quando houver evidência suficiente.

### RN-014 — Natureza da relação
A relação deverá poder distinguir contextos como autoria, orientação, participação em projeto ou outro papel definido pelo domínio.

### RN-015 — Produção compartilhada
Uma produção poderá possuir múltiplos docentes e alunos associados.

### RN-016 — Autoria
A autoria deverá preservar, quando disponível, a ordem dos autores.

## 4. Produção

### RN-017 — Produção independente
Uma produção poderá existir sem classificação.

### RN-018 — Tipificação
A produção deverá possuir tipo quando identificável.

### RN-019 — Duplicidade
Possíveis duplicidades deverão ser sinalizadas antes de exclusão.

### RN-020 — Dados incompletos
Dados insuficientes não deverão ser completados artificialmente.

## 5. Ensino, Pesquisa e Extensão

### RN-021 — Ensino
Atividades de Ensino deverão ser associadas ao docente e período quando identificáveis.

### RN-022 — Pesquisa
Projetos de Pesquisa poderão possuir múltiplos participantes.

### RN-023 — Extensão
Atividades de Extensão identificadas deverão ser armazenadas separadamente.

### RN-024 — Orientação
Orientações deverão registrar docente e aluno quando essas informações forem identificáveis.

## 6. Classificação

### RN-025 — Critério
Toda classificação deverá utilizar critério definido.

### RN-026 — Separação
O parser não deverá decidir sozinho a pontuação ou classificação acadêmica.

### RN-027 — Versionamento
Classificações deverão identificar os critérios utilizados.

### RN-028 — Critérios ainda não confirmados
Siglas, pontuações ou categorias presentes em rascunhos do cliente não deverão ser transformadas em regras definitivas sem evidência suficiente.

## 7. Indicadores

### RN-029 — Dados estruturados
Indicadores deverão ser calculados sobre dados estruturados.

### RN-030 — Período
Indicadores deverão identificar o período de análise.

### RN-031 — Docente
Indicadores poderão ser calculados por docente.

### RN-032 — Aluno
Indicadores poderão considerar a atuação acadêmica do aluno.

### RN-033 — Relação docente–aluno
Indicadores poderão considerar relações entre docentes, alunos e produção.

### RN-034 — Dados insuficientes
O sistema não deverá produzir resultados artificiais quando os dados forem insuficientes.

## 8. Rastreabilidade

### RN-035 — Processamento de origem
Dados deverão poder ser relacionados ao processamento que os originou.

### RN-036 — Versão do parser
O processamento deverá registrar a versão do parser.

### RN-037 — Fonte lógica
Quando disponível, deverão ser preservados seção, referência ou localização lógica da informação extraída.

### RN-038 — Arquivo original
A rastreabilidade não deverá depender da persistência permanente do PDF ou do JSON de comunicação.

## 9. Histórico

### RN-039 — Histórico de processamento
Processamentos anteriores poderão ser mantidos como metadados e histórico técnico.

### RN-040 — Histórico acadêmico
Dados acadêmicos relevantes deverão possuir período ou contexto temporal quando disponível.

### RN-041 — Regras
Mudanças de critérios não deverão alterar silenciosamente resultados históricos consolidados.

## 10. Operação

### RN-042 — Usuário único
O MVP será operado inicialmente por um único usuário.

### RN-043 — Computador único
O MVP será executado inicialmente em um único computador.

### RN-044 — Futuro
A restrição de usuário/computador único é uma decisão de escopo inicial, não uma regra que deverá impedir evolução futura.
