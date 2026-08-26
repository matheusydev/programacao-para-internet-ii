# Registro de Uso de IA

Este arquivo registra as interações relevantes com assistentes de IA durante o desenvolvimento da Atividade — Mini-Prontuário (Encontro 2: Patients / Encounters).

As sugestões foram analisadas antes de serem utilizadas no projeto, seguindo o protocolo V.E.R.M.:

* **Verifica**
* **Explica**
* **Reduz**
* **Marca**

---

## Interação 1

**Ferramenta:** ChatGPT — GPT-5.6 Luna

**Objetivo:** Auxiliar na implementação e integração da tela de detalhe do paciente, permitindo visualizar os atendimentos relacionados a um paciente e mantendo a separação entre comunicação, estado e renderização.

**Pedido:** Foi apresentado o código existente dos arquivos `app.js`, `state.js`, `render.js` e `api.js`, juntamente com os requisitos da atividade para a tela de detalhe do paciente e os atendimentos.

**Sugestão recebida:** A IA analisou a estrutura existente e orientou a utilização do fluxo:

`evento → ação → estado → render → tela`

Também foi orientado que:

* `api.js` permanecesse como a única camada responsável por chamadas `fetch`;
* `state.js` armazenasse o paciente selecionado e os atendimentos;
* `app.js` fizesse a orquestração dos eventos e ações;
* `render.js` fosse responsável apenas pela renderização;
* a seleção de um paciente disparasse a busca do paciente e posteriormente a busca de seus atendimentos;
* o estado de carregamento e os erros dos atendimentos fossem representados no estado;
* nenhum `fetch` fosse realizado diretamente pelos componentes de renderização.

**Decisão:** Aceita.

A estrutura sugerida foi mantida porque já correspondia à arquitetura proposta no projeto. Foram utilizadas as funções `getPatient()`, `listEncounters()` e as ações de estado relacionadas ao paciente selecionado e aos atendimentos.

**Validei:** O fluxo foi testado com o servidor em execução e com a aplicação acessando os endpoints da API. Também foi verificado que a tela de detalhe é exibida ao selecionar um paciente e que seus atendimentos são carregados posteriormente.

---

## Interação 2

**Ferramenta:** ChatGPT — GPT-5.6 Luna

**Objetivo:** Implementar o formulário de criação de um novo atendimento e fazer com que os erros retornados pelo backend fossem apresentados na própria tela.

**Pedido:** Foi apresentado o formulário de atendimento e o código de `app.js`, solicitando orientação para realizar o envio dos dados ao endpoint `POST /api/patients/:id/encounters`.

**Sugestão recebida:** A IA orientou:

* interceptar o evento `submit` do formulário;
* utilizar `event.preventDefault()` para impedir o envio tradicional da página;
* obter os valores utilizando `FormData`;
* montar o objeto `encounter` com `startedAt`, `chiefComplaint` e `notes`;
* chamar `createEncounter()` de `api.js`;
* atualizar o estado com o atendimento criado;
* limpar o formulário após uma criação bem-sucedida;
* utilizar `setFormError()` para armazenar e exibir mensagens de erro retornadas pelo backend.

**Decisão:** Aceita.

A implementação foi realizada mantendo a separação definida no projeto. O `app.js` apenas orquestra a ação, enquanto a comunicação HTTP continua concentrada em `api.js`.

**Validei:** O formulário foi testado com dados válidos e com dados inválidos. Em caso de sucesso, o atendimento aparece na lista e o formulário é limpo. Em caso de erro, a mensagem é apresentada na área destinada ao erro do formulário.

---

## Interação 3

**Ferramenta:** ChatGPT — GPT-5.6 Luna

**Objetivo:** Verificar e tratar corretamente respostas `404` no frontend, evitando que a aplicação apresentasse uma tela quebrada quando um paciente ou seus atendimentos não fossem encontrados.

**Pedido:** Foi apresentado o código de `api.js` contendo as funções `getPatient()`, `listEncounters()` e `createEncounter()`, solicitando uma avaliação do tratamento de erros e do requisito de `404` amigável.

**Sugestão recebida:** A IA orientou que cada função verificasse `response.ok` e tratasse especificamente `response.status === 404` quando necessário.

Para `getPatient()` e `listEncounters()`, foi utilizada uma mensagem amigável:

`Paciente não encontrado.`

Para `createEncounter()`, foi mantida a leitura da mensagem enviada pelo backend através do corpo JSON da resposta:

`data.error || "Não foi possível criar o atendimento."`

**Decisão:** Aceita.

A implementação foi mantida em `api.js`, evitando que o código de interface precisasse conhecer detalhes de HTTP.

**Validei:** Foram realizados testes com pacientes inexistentes e com requisições que retornavam erros do backend. A aplicação passou a apresentar mensagens compreensíveis ao usuário em vez de deixar a interface quebrar.

---

## Interação 4

**Ferramenta:** ChatGPT — GPT-5.6 Luna

**Objetivo:** Implementar e revisar o componente `.encounter-item` seguindo a nomenclatura BEM e os tokens CSS existentes no projeto.

**Pedido:** Foi apresentado o CSS existente e o requisito de criar um componente para representar cada atendimento, incluindo a necessidade de testar a interface em uma largura de aproximadamente 375px.

**Sugestão recebida:** A IA orientou a utilização do bloco BEM `.encounter-item` e de seus elementos:

* `.encounter-item__header`
* `.encounter-item__date`
* `.encounter-item__complaint`
* `.encounter-item__notes`

Também foi orientado o uso dos tokens já existentes, como `var(--espaco-4)`, `var(--cor-superficie)`, `var(--cor-borda)` e `var(--raio-md)`, evitando valores arbitrários quando já havia tokens disponíveis.

Para telas pequenas, foi utilizada uma media query específica para reduzir espaçamentos e tamanhos de fonte.

**Decisão:** Aceita com adaptação.

O componente foi ajustado ao CSS já existente no projeto e foram mantidos os tokens e a nomenclatura BEM.

**Validei:** A lista de atendimentos foi testada visualmente em uma resolução de aproximadamente **375px de largura**, verificando principalmente quebra de textos, datas, observações e largura dos cartões.

---

## Interação 5

**Ferramenta:** ChatGPT — GPT-5.6 Luna

**Objetivo:** Revisar a integração entre `app.js`, `state.js`, `render.js` e `api.js` para verificar se o requisito de que nenhum `fetch` fosse realizado fora de `api.js` estava sendo respeitado.

**Pedido:** Foi enviado o código dos quatro arquivos para verificar se a implementação estava seguindo a arquitetura definida para a atividade.

**Sugestão recebida:** A IA identificou a divisão das responsabilidades:

* `api.js`: comunicação com o backend;
* `state.js`: estado e ações;
* `render.js`: renderização;
* `app.js`: orquestração.

Foi reforçado que `app.js` deveria chamar funções de `api.js`, mas não realizar `fetch` diretamente.

**Decisão:** Aceita.

A estrutura foi mantida. As chamadas HTTP relacionadas aos pacientes e atendimentos permaneceram em `api.js`.

**Validei:** Foi feita uma revisão dos arquivos e confirmado que os `fetch` relacionados a Patients/Encounters estavam concentrados em `api.js`.

---

## Observação sobre o uso da IA

A IA foi utilizada como ferramenta de apoio para análise, implementação e revisão do código. As sugestões não foram incorporadas automaticamente: foram analisadas em relação ao escopo definido no Guia de Bolso da disciplina e adaptadas à estrutura existente do projeto.

As alterações relacionadas a Patients/Encounters foram verificadas por meio da execução da aplicação, testes das requisições da API e testes visuais da interface, incluindo a resolução de aproximadamente 375px para o componente `.encounter-item`.

Foi mantida a stack definida para a atividade, sem introdução de React, ORM, bibliotecas extras ou alteração desnecessária da arquitetura do projeto.

O uso da IA seguiu o protocolo V.E.R.M., mantendo o estudante como responsável pela decisão final sobre o código incorporado ao projeto.