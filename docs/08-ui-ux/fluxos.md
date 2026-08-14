# Fluxos de Usuário — PPGA Analytics

## 1. Importação e processamento

```text
Usuário
  ↓
Seleciona 1..N PDFs
  ↓
Frontend envia POST /importacoes
  ↓
Backend cria importação
  ↓
Backend inicia processamento
  ↓
Backend envia PDF ao parser Python
  ↓
Python extrai dados
  ↓
Python devolve JSON
  ↓
Backend valida e persiste
  ↓
PDF temporário é descartado
  ↓
Usuário acompanha status
  ↓
Dashboard/consultas disponíveis
```

## 2. Erro de processamento

```text
PDF
 ↓
Python
 ↓
Erro/alerta
 ↓
Backend registra processamento
 ↓
Frontend exibe mensagem clara
```

## 3. Consulta de docente

```text
Dashboard
 ↓
Docentes
 ↓
Seleciona docente
 ↓
Perfil
 ├── Formação
 ├── Ensino
 ├── Pesquisa
 ├── Extensão
 ├── Produções
 ├── Orientações
 ├── Relações com alunos
 └── Indicadores
```

## 4. Consulta de aluno

```text
Alunos
 ↓
Seleciona aluno
 ↓
Perfil
 ├── Programa
 ├── Orientações
 ├── Produções
 ├── Relações com docentes
 └── Indicadores disponíveis
```

## 5. Dashboard

O dashboard deverá apresentar dados consolidados e pontos de atenção sem exigir conhecimento técnico.

## 6. Regra de interface

O frontend nunca chama Python diretamente. Toda comunicação ocorre com o backend Node.js.
