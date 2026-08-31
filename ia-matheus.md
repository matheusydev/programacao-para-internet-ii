# Registro de Uso de IA

Este arquivo registra as interações relevantes com assistentes de IA
durante o desenvolvimento da Atividade — Mini-Prontuário
(Encontro 2: Patients / Encounters).

As sugestões foram analisadas antes de serem utilizadas no projeto,
seguindo o protocolo V.E.R.M.:

- Verifica
- Explica
- Reduz
- Marca

---

## Interação 1

**Ferramenta:** Claude — Sonnet 5

**Objetivo:** Completar as rotas `GET /api/patients/:id` e
`POST /api/patients` em `src/server.ts`, que ainda estavam marcadas
como TODO, e que estavam causando falha nos testes 3 a 9 do
`requests.http`.

**Pedido:** Enviei a tabela de testes que estavam falhando (3 a 9) e o
link do repositório, pedindo ajuda para identificar a causa e corrigir.

**Sugestão recebida:** A IA identificou que as rotas `GET /api/patients/:id`
e `POST /api/patients` não existiam no arquivo (apenas os TODOs
comentados), enquanto as rotas de `encounters` já estavam
implementadas. Sugeriu:

- Trocar o array fixo do `GET /api/patients` por uma consulta
  `SELECT * FROM patients ORDER BY name` no banco.
- Criar `GET /api/patients/:id` com `SELECT * FROM patients WHERE id = ?`,
  retornando `404` quando o paciente não existir.
- Criar `POST /api/patients` validando `name` (texto não vazio),
  `birthDate` (formato `AAAA-MM-DD` via regex) e `nationalId`
  (obrigatório), usando `req.body ?? {}` para não quebrar quando a
  requisição chega sem `Content-Type`, e inserindo com
  `db.prepare(...).run(...)` (consulta parametrizada).

**Decisão:** Aceita com adaptação.

Mantive a mesma lógica sugerida, mas ajustei o posicionamento das
rotas no arquivo para seguir a ordem já usada nas rotas de
`encounters` (verificação de existência antes de qualquer operação) e
conferi que os nomes das colunas batiam com o `schema.sql`
(`birth_date`, `national_id`).

**Validei:** Testes 3 a 9 do `requests.http`, com o servidor rodando
em `http://localhost:3000`:

- Paciente existente (`id=1`) → `200`
- Paciente inexistente (`id=9999`) → `404`
- Criação válida → `201`
- Sem `name` → `400`
- `name` só com espaços → `400`
- `birthDate` fora do formato → `400`
- Requisição sem `Content-Type` → `400` (em vez de erro `500`)

Também conferi que o `seed.sql`/`reset-db.ts` popula um paciente com
`id=1`, necessário para o teste 3 passar.

---

## Observação sobre o uso da IA

A IA foi utilizada como ferramenta de diagnóstico e apoio na
implementação das rotas faltantes. O código sugerido foi lido, testado
manualmente com o REST Client e ajustado à estrutura já existente no
projeto antes de ser mantido.