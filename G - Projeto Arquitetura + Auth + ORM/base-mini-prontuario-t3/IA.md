# IA.md

## Tarefa: ambiente do gate no Windows · Trilha: ARQ · Rota: chat
- **Ferramenta/modelo:** Claude (claude.ai)
- **Prompt:** colei a saída de erro do `npm run gate` e pedi o diagnóstico.
- **Plano editado?** não se aplica (rota chat).
- **Evidência de pronto:** <cole a saída do gate que voltou a rodar> e
  `git diff gate.sh` vazio.
- **Revisão adversarial:** não houve.
- **O que EU decidi:** dois problemas de ambiente, nenhum de código.
  (1) O Git no Windows converteu o `gate.sh` para CRLF e o bash falhava
  com `$'\r': command not found`. Resolvi com `.gitattributes`
  (`*.sh text eol=lf`), sem editar o `gate.sh`, porque a régua não pode
  ser alterada. (2) O `bash` encontrado era o do WSL, que rodava o Node
  do Linux sobre um `node_modules` instalado no Windows (erro de
  binário do esbuild). Resolvi com `npm config set script-shell` apontando
  para o Git Bash, configuração do meu usuário, fora do repositório.

## Tarefa: ARQ-1 — Repository de Patient · Trilha: ARQ · Rota: chat
- **Ferramenta/modelo:** Claude (claude.ai)
- **Prompt (C-P-T-R-F-A):**
  - C: Node 22, Express 5, TS strict, better-sqlite3. `patients.service.ts`
    faz SQL direto com `import { db }`. A trilha ORM vai trocar o banco
    por Prisma atrás da mesma interface.
  - P: dev sênior fazendo refatoração em camadas (ports & adapters).
  - T: criar o port `PatientsRepository` e o adapter
    `SqlitePatientsRepository`, e tirar todo o SQL do service.
  - R: só libs do escopo; sem tocar `public/`, testes, `gate.sh` ou
    `.dependency-cruiser.cjs`; comportamento idêntico; SQL parametrizado.
  - F: arquivos completos, comentários em português, diff mínimo.
  - A: `npm run gate` sem regressão (mesmas 2 violações, nenhuma nova)
    e smoke test 100% verde sem alteração.
- **Plano editado?** Sim. Em vez de aplicar os 7 arquivos de uma vez,
  reordenei para que cada commit deixasse o gate no mesmo estado: port →
  adapter → controllers (`await` em função síncrona é inofensivo) →
  encounters.service → patients.service + app.ts juntos (um depende do
  outro). Resultado: 6 commits, todos com o smoke verde.
- **Evidência de pronto:**
  <cole a saída do gate SEM o app.ts (os 6 testes falhando com
  "PatientsRepository não configurado") e a saída final, verde>
- **Revisão adversarial:** <fica para o fim da trilha ARQ>
- **O que EU decidi:**
  - O port devolve `Promise` desde já, porque o Prisma é assíncrono e o
    ORM exige a mesma interface. Custo: `async/await` nos controllers e
    no encounters.service.
  - O port fala camelCase; snake_case fica preso no adapter.
  - Port e adapter em arquivos separados (o LEIA-ME sugeria um só), para
    o service importar só a interface (`import type`).
  - Injeção por configurador de módulo, montado no `app.ts`, e não por
    classe com construtor. Mantém a API pública do service e o diff
    mínimo. Custo: esquecer a montagem só aparece em execução, por isso
    o `repo()` falha com mensagem clara.
  - Mantive de propósito a violação do `encounters.controller` e o
    `getEncounterById` síncrono: pertencem ao ARQ-4/5 e ao ARQ-2.