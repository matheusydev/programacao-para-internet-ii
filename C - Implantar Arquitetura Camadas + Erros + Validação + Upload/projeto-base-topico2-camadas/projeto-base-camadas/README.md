# Mini-Prontuário — Prontuário e Atendimentos Médicos

Projeto de **Programação para Internet II** — IFPI, Campus Teresina Central.
Refatoração de uma API REST inicialmente concentrada em `server.ts` para uma
arquitetura em camadas (Route → Controller → Service), com tratamento
centralizado de erros, validação com Zod e upload de foto de paciente.

## 1. Descrição do Projeto

Mini-Prontuário é uma aplicação web que implementa um sistema simplificado de
prontuário eletrônico: pacientes, atendimentos e upload de foto de paciente.

O sistema permite:
- listar, buscar e cadastrar pacientes;
- listar e cadastrar atendimentos de um paciente;
- fazer upload da foto de um paciente (`.jpg`/`.png`, até 2MB);
- exibir preview local da foto antes do envio;
- apresentar mensagens de erro da API de forma formatada, sem `alert()`;
- tratar respostas 404 de forma amigável;
- utilizar uma interface responsiva para diferentes tamanhos de tela.

## 2. Tecnologias Utilizadas

**Front-end**
- HTML5, CSS3 (BEM + design tokens), Bootstrap (CDN)
- JavaScript, organizado em `api.js`, `state.js`, `render.js`, `errors.js` e `app.js`
- `fetch` / `FormData` — comunicação com a API

**Back-end**
- Node.js, TypeScript, Express
- SQLite via `better-sqlite3`
- Zod — validação de schema
- Multer — upload de arquivos

**Testes**
- REST Client (`requests.http`) — testes das rotas HTTP
- Navegador — testes de interface, responsividade (~375px) e upload

**Controle de versão**
- Git / GitHub

> ⚠️ Nenhuma biblioteca além de `express`, `better-sqlite3`, `zod`, `multer`,
> `tsx`, `typescript` e Bootstrap por CDN deve ser adicionada ao projeto.

## 3. Versão do Node.js

```
Node.js v22.23.2 (mínimo v22)
```

O projeto usa dependências nativas (`better-sqlite3`), por isso a versão
recomendada deve ser mantida para garantir compatibilidade.

```bash
node -v
```

## 4. Instalação e Execução

```bash
npm install
npm run db:reset   # cria database/prontuario.db com pacientes fictícios
npm run dev        # sobe em http://localhost:3000
```

Verifique também `http://localhost:3000/api/health` — deve responder
`{"status":"ok"}`.

## 5. Estrutura de Arquivos

```
mini-prontuario/
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── prontuario.db          gerado por npm run db:reset (não versionado)
├── uploads/                   fotos de pacientes (não versionado)
├── public/
│   ├── index.html
│   ├── css/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   └── components.css
│   └── js/
│       ├── api.js             único arquivo que fala com a rede
│       ├── state.js           estado e ações — não conhece o DOM
│       ├── render.js          desenha o estado — não decide nada
│       ├── errors.js          renderApiError — tradução de erro de API pra UI
│       └── app.js             orquestra: evento → ação → estado → render
├── src/
│   ├── server.ts              monta o app e os routers, sem lógica de negócio
│   ├── database.ts            conexão SQLite
│   ├── routes/
│   │   ├── patients.routes.ts
│   │   └── encounters.routes.ts
│   ├── controllers/
│   │   ├── patients.controller.ts
│   │   └── encounters.controller.ts
│   ├── services/
│   │   ├── patients.service.ts
│   │   └── encounters.service.ts
│   ├── middlewares/
│   │   ├── validate.ts        validação genérica com Zod
│   │   ├── errorHandler.ts    tradução central de erro → resposta HTTP
│   │   └── upload.ts          configuração do Multer (diskStorage, fileFilter, limite 2MB)
│   ├── validation/
│   │   └── patients.schemas.ts
│   └── errors/
│       └── HttpError.ts       hierarquia de erros (BadRequest, NotFound, Conflict, UnprocessableEntity, PayloadTooLarge)
├── requests.http
├── package.json
└── README.md
```

## 6. Arquitetura em Camadas

```
Route      → só mapeia método + caminho, sem SQL/regra de negócio/validação
Controller → traduz HTTP ↔ domínio, decide o status de sucesso; sem SQL/regra de negócio
Service    → regra de negócio + SQL; não conhece req/res, não decide status HTTP
```

Erros de domínio (ex: paciente não encontrado) são lançados no Service como
subclasses de `HttpError` e capturados pelo `errorHandler`, que é o único
ponto do projeto responsável por transformar um erro em resposta HTTP.
Nenhum `res.status().json({ error })` manual sobrevive fora dele.

## 7. Frontend — Fluxo

```
usuário interage
      │
      ▼
   app.js  ──chama──►  state.js        (a ação muda o estado)
                            │
                            ▼
                        render.js      (a tela é redesenhada)
                            │
                            ▼
                           DOM
```

Comunicação com o backend: `app.js → api.js → Backend → SQLite`.
Erros de API retornados no contrato `{ error: { message, statusCode, details } }`
são traduzidos para a UI por `errors.js` (`renderApiError`), sem uso de `alert()`.

## 8. Principais Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/patients` | Listar pacientes |
| GET | `/api/patients/:id` | Buscar paciente |
| POST | `/api/patients` | Cadastrar paciente |
| GET | `/api/patients/:id/encounters` | Listar atendimentos |
| POST | `/api/patients/:id/encounters` | Criar atendimento |
| POST | `/api/patients/:id/photo` | Upload de foto do paciente (`.jpg`/`.png`, até 2MB) |
| GET | `/api/health` | Verifica se o servidor está no ar |

### Upload de foto — cenários tratados

| Cenário | Status |
|---|---|
| Sucesso (`.jpg`/`.png`, < 2MB) | 200, paciente com `photoUrl` |
| Paciente inexistente | 404 |
| Sem arquivo enviado | 422 |
| Arquivo maior que 2MB | 413 |
| Tipo inválido (checado por mimetype, não extensão) | rejeitado pelo `fileFilter` |

## 9. Banco de Dados

SQLite via `better-sqlite3`, entidades `patients` e `encounters`
relacionadas em 1:N. `npm run db:reset` recria `database/prontuario.db` a
partir de `schema.sql` e `seed.sql`.

## 10. Checklist de Entrega

- [x] `npm run check` (tsc --noEmit) sem erros
- [x] `requests.http` rodado do início ao fim, blocos 1–13
- [x] Nenhum `res.status().json({ error })` manual fora de `errorHandler.ts`
- [x] Upload de foto testado com 1 caso de sucesso e pelo menos 2 de falha

## 11. Justificativa Arquitetural — Nível 3

### Fronteira entre Controller e Service: quem decide "paciente não existe"

Inicialmente, o `getById` do Controller verificava `if (!patient)` e
respondia `404` diretamente. Tirei essa decisão do Controller e fiz o
Service lançar `NotFoundError` quando a consulta não encontra o registro:

```typescript
getById(id: string) {
  const row = db
    .prepare("SELECT id, name, birth_date, national_id, active, photo_path FROM patients WHERE id = ?")
    .get(id) as PatientRow | undefined;

  if (!row) {
    throw new NotFoundError(`O paciente ${id} não foi encontrado`, { patientId: id });
  }
  // ...
}
```

O Controller ficou reduzido a chamar o Service e responder `200` — o
`errorHandler` central cuida da tradução do erro para status HTTP:

```typescript
getById(req: Request, res: Response) {
  const patient = patientsService.getById(req.params.id as string);
  res.status(200).json(patient);
}
```

Na prática, isso evitou duplicação: quando implementei o `uploadPhoto`, o
`setPhoto` reaproveita esse mesmo `getById` (e portanto o mesmo
`NotFoundError`) para checar se o paciente existe antes de gravar a foto,
em vez de repetir a consulta e o `if` em cada novo Controller que precisar
dessa checagem.

## 12. Desenvolvimento

Projeto desenvolvido como atividade acadêmica da disciplina de Programação
para Internet II (TEC.1052) — IFPI, Campus Teresina Central, com controle
de versão via Git e GitHub.