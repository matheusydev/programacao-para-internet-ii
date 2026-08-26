# Mini-Prontuário — Prontuário e Atendimentos Médicos

Projeto-fio da Semana 01 de **Programação para Internet II (TEC.1052)** — IFPI, Campus Teresina Central, atingido até o nível 2.

## 1. Descrição do Projeto

Mini-Prontuário é uma aplicação web que implementa um sistema simplificado de prontuário eletrônico: pacientes e, ao final da semana, atendimentos. O vocabulário (*Patient*, *Encounter*) é inspirado no padrão **HL7 FHIR** — não é implementado o FHIR em si, apenas nomeado como o mercado nomeia.

O sistema permite:
- listar pacientes cadastrados;
- pesquisar pacientes pelo nome;
- filtrar pacientes ativos;
- visualizar os dados de um paciente;
- visualizar os atendimentos de um paciente;
- cadastrar novos atendimentos;
- apresentar mensagens de erro retornadas pela API;
- tratar respostas 404 de forma amigável;
- utilizar uma interface responsiva para diferentes tamanhos de tela.

## 2. Tecnologias Utilizadas

**Front-end**
- HTML5 — estrutura das páginas
- CSS3 — estilização, com BEM e design tokens
- JavaScript — organizado em `api.js`, `state.js`, `render.js` e `app.js`
- fetch — comunicação com a API

**Back-end**
- Node.js
- TypeScript
- Express
- SQLite (via better-sqlite3)
- tsx

**Testes**
- REST Client — testes das rotas HTTP
- Navegador — testes da interface e responsividade (~375px)

**Controle de versão**
- Git
- GitHub

> ⚠️ **Regra de escopo da semana:** nenhuma biblioteca além de `express`, `better-sqlite3`, `tsx`, `typescript` e o Bootstrap por CDN. Isso vale para o desenvolvedor e para a IA — se o assistente sugerir Prisma, Zod, React, body-parser, dotenv ou cors, ele respondeu a uma pergunta que não é a desta semana.

## 3. Versão do Node.js

Este projeto foi desenvolvido e validado utilizando:

```
Node.js v22.23.2
```

Embora versões mais recentes do Node.js estejam disponíveis, o projeto utiliza dependências nativas, principalmente o better-sqlite3, e por isso recomenda-se manter a versão v22.23.2 (mínimo v22) para garantir compatibilidade e estabilidade.

Para verificar a versão instalada:

```bash
node -v
```

## 4. Antes da Primeira Aula

```bash
node -v          # precisa ser 22 ou maior
npm install
npm run db:reset # cria database/prontuario.db com 8 pacientes fictícios
npm run dev      # sobe em http://localhost:3000
```

Abra `http://localhost:3000`. Você deve ver o cabeçalho do Mini-Prontuário, o campo de busca e uma lista vazia — isso é esperado: as lacunas de código ainda não foram preenchidas.

Teste também `http://localhost:3000/api/health` — deve responder `{"status":"ok"}`.

### Extensões recomendadas do VS Code

| Extensão | Para quê |
|---|---|
| REST Client (`humao.rest-client`) | Executar o `requests.http` sem sair do editor |
| SQLite Viewer (`qwtel.sqlite-viewer`) | Abrir `database/prontuario.db` e ver as tabelas |
| Error Lens (`usernamehw.errorlens`) | Ver o erro do TypeScript na própria linha |

## 5. Estrutura de Arquivos

```
mini-prontuario/
├── database/
│   ├── schema.sql        estrutura das tabelas
│   ├── seed.sql          dados fictícios
│   └── prontuario.db     gerado por `npm run db:reset` (não versionado)
├── public/               tudo que o navegador recebe
│   ├── index.html        estrutura da página
│   ├── css/
│   │   ├── tokens.css      design tokens — as decisões de design com nome
│   │   ├── base.css        reset, tipografia, esqueleto
│   │   └── components.css  componentes de domínio em BEM
│   ├── js/
│   │   ├── api.js        ÚNICO arquivo que fala com a rede
│   │   ├── state.js      o estado e as ações — não conhece o DOM
│   │   ├── render.js     desenha o estado — não decide nada
│   │   └── app.js        orquestra: evento → ação → estado → render
│   └── mock/patients.json  usado no Encontro 1
├── scripts/reset-db.ts
├── src/
│   ├── database.ts       conexão SQLite
│   └── server.ts         rotas HTTP (um arquivo só, sem camadas — por enquanto)
├── requests.http         casos de teste da API
├── package.json
├── package-lock.json
└── README.md
```

- `database/` — arquivos relacionados ao banco de dados SQLite e sua configuração
- `public/` — arquivos disponibilizados pelo frontend
- `public/js/` — arquivos JavaScript da aplicação no navegador
- `scripts/` — scripts auxiliares (ex.: reset do banco)
- `src/` — backend da aplicação
- `node_modules/` — dependências instaladas (não deve ser versionado)

## 6. Arquitetura do Frontend

Fluxo principal:

```
  usuário digita
        │
        ▼
  app.js  ──chama──►  state.js       (a ação muda o estado)
                          │
                          │ notify()
                          ▼
                      render.js      (a tela é redesenhada)
                          │
                          ▼
                         DOM
```

O estado muda. A tela é consequência.

Comunicação com o backend:

```
app.js → api.js → Backend → SQLite
```

- **api.js** — único arquivo autorizado a usar `fetch`; realiza requisições HTTP, trata códigos de resposta e converte erros em mensagens compreensíveis (`listPatients()`, `getPatient(id)`, `listEncounters(patientId)`, `createEncounter(patientId, encounter)`).
- **state.js** — mantém o estado da aplicação (pacientes, termo de busca, paciente selecionado, atendimentos, mensagens de erro, etc.); não conhece o DOM.
- **render.js** — responsável pela renderização da interface e pelos templates de cartão de paciente, atendimento, estados vazios e erros; usa `escapeHtml()` para sanitizar dados antes de inserir via `innerHTML`.
- **app.js** — orquestra a aplicação: registra eventos, chama ações do estado, solicita dados via `api.js` e aciona a renderização; não mantém estado.

## 7. Lacunas do Projeto (TODOs)

Procure por `TODO` no projeto. Estão numeradas na ordem em que serão resolvidas:

| Marca | Arquivo | Quando |
|---|---|---|
| `TODO STATE-1` | `public/js/state.js` | Encontro 1 — Prática 1 |
| `TODO RENDER-1` | `public/js/render.js` | Encontro 1 — Prática 1 |
| `TODO STATE-2` | `public/js/state.js` | Encontro 1 — Prática 2 |
| `TODO CSS-1` e `TODO CSS-2` | `public/css/components.css` | Encontro 1 — Prática 3 |
| `TODO 1` | `src/server.ts` | Encontro 2 — Prática 1 |
| `TODO 2` / `TODO API-1` | `src/server.ts`, `public/js/api.js` | Encontro 2 — Prática 2 |
| `TODO 3` | `src/server.ts` | Encontro 2 — Prática 3 |
| `TODO ATIVIDADE 1` | `database/schema.sql` | Atividade extraclasse |

## 8. Atendimentos

Cada atendimento possui: `id`, `patient_id`, `started_at`, `chief_complaint`, `notes`.

No cadastro, o formulário utiliza `startedAt`, `chiefComplaint` e `notes`, seguindo o fluxo:

```
Formulário → FormData → createEncounter() → POST /api/patients/:id/encounters → Backend → SQLite
```

## 9. Tratamento de Erros

- **Paciente inexistente (404):** o `api.js` converte a resposta em "Paciente não encontrado.", evitando telas quebradas.
- **Erros de validação:** quando o backend retorna uma mensagem no corpo da resposta, ela é reaproveitada e exibida no formulário (`formError`).

## 10. Responsividade

Interface mobile-first, testada em aproximadamente 375px, com ajustes para datas, queixas, observações, espaçamento e largura dos cards. Utiliza `overflow-wrap: break-word;` para evitar que textos longos ultrapassem os limites do card.

## 11. Principais Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/patients | Listar pacientes |
| GET | /api/patients/:id | Buscar paciente |
| GET | /api/patients/:id/encounters | Listar atendimentos |
| POST | /api/patients/:id/encounters | Criar atendimento |
| GET | /api/health | Verifica se o servidor está no ar (`{"status":"ok"}`) |

Exemplo de corpo para criar atendimento:

```json
{
  "startedAt": "2026-08-24T09:30",
  "chiefComplaint": "Teste",
  "notes": "Observação do atendimento"
}
```

## 12. Banco de Dados

O projeto utiliza SQLite através da biblioteca better-sqlite3, com as entidades `patients` e `encounters` relacionadas em 1:N (cada atendimento pertence a um paciente).

`npm run db:reset` recria `database/prontuario.db` a partir de `schema.sql` e `seed.sql`, populando 8 pacientes fictícios.

## 13. Instalação e Execução

Clone o projeto e entre no diretório:

```bash
git clone <URL_DO_REPOSITORIO>
cd "A - Prontuário e Atendimentos Médicos - Fundamentos de Web Frontend e Backend/01-projeto-base"
```

Verifique a versão do Node.js (mínimo v22, recomendado v22.23.2):

```bash
node -v
```

Instale as dependências:

```bash
npm install
```

Recrie o banco de dados:

```bash
npm run db:reset
```

Execute o projeto:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## 14. Problemas Comuns

| Sintoma | Causa provável |
|---|---|
| `SQLITE_ERROR: no such table` | Rode `npm run db:reset` |
| `npm install` falha em `better-sqlite3` | Node desatualizado ou faltam ferramentas de build |

## 15. Observações Importantes

- Utilize preferencialmente o Node.js v22.23.2 (mínimo v22).
- O `node_modules` não deve ser commitado.
- O frontend deve realizar chamadas HTTP somente através de `api.js`.
- O estado deve permanecer centralizado em `state.js`.
- A renderização deve permanecer em `render.js`.
- O `app.js` deve atuar como camada de orquestração.
- Nenhuma biblioteca além das listadas na seção 2 deve ser adicionada ao projeto.

## 16. Desenvolvimento

Projeto desenvolvido como atividade acadêmica da disciplina de Programação para Internet II (TEC.1052) — IFPI, Campus Teresina Central, com controle de versão via Git e GitHub.
