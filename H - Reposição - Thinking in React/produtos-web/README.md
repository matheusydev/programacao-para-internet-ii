# Produtos Web — Pensando em React

> Implementação do exemplo **[Pensando em React](https://react.dev/learn/thinking-in-react)** da documentação oficial do React: uma tabela de produtos com campo de busca e filtro de estoque, construída com React, TypeScript e CSS Modules, seguindo os 5 passos do tutorial.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS Modules](https://img.shields.io/badge/CSS_Modules-000000?style=for-the-badge&logo=cssmodules&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

🔗 **Aplicação publicada:** [produtos-web-matheus.vercel.app](https://produtos-web-matheus.vercel.app)

---

## Sumário

- [Descrição Geral](#descrição-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura de Componentes](#arquitetura-de-componentes)
- [Os 5 Passos do Tutorial no Código](#os-5-passos-do-tutorial-no-código)
- [Modelo de Dados](#modelo-de-dados)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Deploy](#deploy)
- [Fluxo de Trabalho com Git](#fluxo-de-trabalho-com-git)

---

## Descrição Geral

Este projeto foi desenvolvido para a disciplina **Programação para Internet II** e reproduz, em TypeScript, o exemplo central do artigo *Pensando em React*: transformar um mockup de interface em uma aplicação React a partir de uma lista de produtos vinda de uma "API" (dados estáticos).

A aplicação exibe os produtos agrupados por categoria e permite filtrá-los em tempo real:

- **Busca por nome** — a tabela é filtrada a cada tecla digitada, sem diferenciar maiúsculas e minúsculas
- **Somente em estoque** — um checkbox esconde os produtos indisponíveis
- **Destaque visual** — produtos fora de estoque aparecem com o nome em vermelho
- **Categorias dinâmicas** — a linha de título de uma categoria só aparece se algum produto dela passar no filtro

### Objetivos de aprendizagem

- Decompor uma interface em uma hierarquia de componentes com responsabilidade única
- Diferenciar **props** (dados recebidos do pai) de **estado** (dados que mudam com a interação)
- Identificar o **estado mínimo** e calcular o restante durante a renderização
- Implementar o **fluxo de dados inverso** com funções de callback tipadas
- Isolar estilos por componente com **CSS Modules**
- Publicar uma SPA com integração contínua na **Vercel**

---

## Tecnologias Utilizadas

### Frontend

| Tecnologia | Versão | Descrição |
|---|---|---|
| **React** | 19 | Biblioteca para construção de interfaces baseadas em componentes |
| **TypeScript** | 6 | Tipagem estática: interfaces para o modelo de dados, para as props e `useState` tipado |
| **CSS Modules** | — | Estilos com escopo local: cada componente tem seu próprio `.module.css` |

### Ferramentas de desenvolvimento

| Tecnologia | Versão | Descrição |
|---|---|---|
| **Vite** | 8 | Servidor de desenvolvimento com HMR e build de produção (template `react-ts`) |
| **ESLint** | 10 | Análise estática do código, com regras para React Hooks |
| **Node.js / npm** | 20.19+ | Ambiente de execução e gerenciador de pacotes |

### Infraestrutura

| Tecnologia | Descrição |
|---|---|
| **Git + GitHub** | Versionamento com uma branch por passo, Pull Requests e Conventional Commits |
| **Vercel** | Hospedagem da SPA com deploy automático a cada merge na `main` |

---

## Arquitetura de Componentes

A interface é dividida em cinco componentes. O estado fica no topo da árvore e desce por props; as alterações sobem por meio de funções de callback.

```
┌──────────────────────────────────────────────────────────────┐
│                    FilterableProductTable                    │
│                                                              │
│   estado:  filterText: string     inStockOnly: boolean       │
└───────────────┬──────────────────────────────┬───────────────┘
                │                              │
   filterText,  │  ▲ onFilterTextChange()      │  products,
   inStockOnly  │  │ onInStockOnlyChange()     │  filterText,
                ▼  │                           ▼  inStockOnly
┌──────────────────────────────┐   ┌───────────────────────────┐
│          SearchBar           │   │       ProductTable        │
│                              │   │                           │
│  input de texto + checkbox   │   │  filtra e agrupa as linhas│
└──────────────────────────────┘   └─────────────┬─────────────┘
                                                 │
                                   ┌─────────────┴─────────────┐
                                   ▼                           ▼
                        ┌────────────────────┐     ┌────────────────────┐
                        │ ProductCategoryRow │     │     ProductRow     │
                        │ título da categoria│     │  nome + preço      │
                        └────────────────────┘     └────────────────────┘
```

### Responsabilidade de cada componente

| Componente | Props | Responsabilidade |
|---|---|---|
| `FilterableProductTable` | `products` | Guarda o estado dos filtros e conecta `SearchBar` e `ProductTable` |
| `SearchBar` | `filterText`, `inStockOnly`, `onFilterTextChange`, `onInStockOnlyChange` | Exibe os controles e avisa o pai quando o usuário interage |
| `ProductTable` | `products`, `filterText`, `inStockOnly` | Aplica os filtros e monta as linhas, inserindo uma categoria sempre que ela muda |
| `ProductCategoryRow` | `category` | Renderiza a linha de título de uma categoria |
| `ProductRow` | `product` | Renderiza um produto, em vermelho quando está fora de estoque |

### Fluxo de dados a cada interação

1. O usuário digita na busca ou marca o checkbox
2. O `onChange` da `SearchBar` chama a callback recebida do pai (`onFilterTextChange` / `onInStockOnlyChange`)
3. A `FilterableProductTable` atualiza o estado com `setFilterText` / `setInStockOnly`
4. O React renderiza a árvore de novo, e os filhos recebem os valores atualizados por props
5. A `ProductTable` recalcula a lista filtrada e a tabela é atualizada na tela

---

## Os 5 Passos do Tutorial no Código

| Passo | Conceito | Onde está |
|---|---|---|
| **1** — Separar a interface em componentes | Princípio da responsabilidade única | `src/components/` (uma pasta por componente) |
| **2** — Versão estática com props | Dados descem do pai para os filhos; listas com `key` | `ProductTable.tsx` (`forEach` + `ProductCategoryRow`) |
| **3** — Encontrar o estado mínimo | Guardar só o necessário e calcular o resto | `FilterableProductTable.tsx` (`useState`) |
| **4** — Decidir onde o estado fica | Pai comum mais próximo de quem usa o estado | `FilterableProductTable.tsx` → props para os filhos |
| **5** — Fluxo de dados inverso | Filho altera o estado do pai via callback | `SearchBar.tsx` (`onChange` → `on...Change`) |

### Passo 3 — Análise do estado mínimo

| Dado | Muda com o tempo? | Vem por props? | Pode ser calculado? | É estado? |
|---|---|---|---|---|
| Lista original de produtos | Não | Sim | — | ❌ |
| Texto da busca | Sim | Não | Não | ✅ `filterText` |
| Valor do checkbox | Sim | Não | Não | ✅ `inStockOnly` |
| Lista filtrada | — | — | Sim | ❌ |

### Passo 5 — Callbacks tipadas

```tsx
interface SearchBarProps {
  filterText: string
  inStockOnly: boolean
  onFilterTextChange: (filterText: string) => void
  onInStockOnlyChange: (inStockOnly: boolean) => void
}
```

---

## Modelo de Dados

Os produtos seguem a interface `Product` e são os mesmos dados do exemplo da documentação:

```ts
export interface Product {
  category: string
  price: string
  stocked: boolean
  name: string
}
```

```ts
{ category: 'Fruits', price: '$1', stocked: true, name: 'Apple' }
```

| Categoria | Produtos | Fora de estoque |
|---|---|---|
| Fruits | Apple, Dragonfruit, Passionfruit | Passionfruit |
| Vegetables | Spinach, Pumpkin, Peas | Pumpkin |

---

## Estrutura do Projeto

```
produtos-web/
│
├── public/
│   └── favicon.svg                         # Ícone da aba
│
├── src/
│   ├── components/
│   │   ├── FilterableProductTable/
│   │   │   ├── FilterableProductTable.tsx         # Raiz: estado dos filtros
│   │   │   └── FilterableProductTable.module.css
│   │   ├── SearchBar/
│   │   │   ├── SearchBar.tsx                      # Busca + checkbox (callbacks)
│   │   │   └── SearchBar.module.css
│   │   ├── ProductTable/
│   │   │   ├── ProductTable.tsx                   # Filtra e agrupa as linhas
│   │   │   └── ProductTable.module.css
│   │   ├── ProductCategoryRow/
│   │   │   ├── ProductCategoryRow.tsx             # Linha de título da categoria
│   │   │   └── ProductCategoryRow.module.css
│   │   └── ProductRow/
│   │       ├── ProductRow.tsx                     # Linha de produto
│   │       └── ProductRow.module.css
│   │
│   ├── data/
│   │   └── products.ts                     # Dados de exemplo da documentação
│   ├── types/
│   │   └── product.ts                      # Interface Product
│   │
│   ├── App.tsx                             # Renderiza a FilterableProductTable
│   ├── main.tsx                            # Ponto de entrada da aplicação
│   └── index.css                           # Estilos globais (reset e fonte)
│
├── index.html                              # Página única da SPA
├── vite.config.ts                          # Configuração do Vite
├── tsconfig.json                           # Configuração do TypeScript
├── eslint.config.js                        # Regras do ESLint
└── package.json                            # Dependências e scripts
```

---

## Como Executar o Projeto

### Pré-requisitos

- **Node.js 20.19+** ou **22.12+** (verifique com `node -v`)
- **Git**

---

### Passo 1 — Clonar o repositório

```bash
git clone https://github.com/matheusydev/programacao-para-internet-ii.git
cd "programacao-para-internet-ii/H - Reposição - Thinking in React/produtos-web"
```

---

### Passo 2 — Instalar as dependências

```bash
npm ci
```

O `npm ci` instala exatamente as versões registradas no `package-lock.json`, sem alterá-lo.

---

### Passo 3 — Executar em modo de desenvolvimento

```bash
npm run dev
```

Acesse **http://localhost:5173**. As alterações no código aparecem na hora, sem recarregar a página (HMR).

---

### Passo 4 — Gerar e testar a versão de produção

```bash
npm run build
npm run preview
```

O `build` verifica os tipos com `tsc -b` e gera a pasta `dist/`. O `preview` serve essa pasta em **http://localhost:4173**, exatamente como ela será publicada.

---

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Verificação de tipos + build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Análise estática com ESLint |

> **ATENÇÃO:** o `npm run dev` não verifica tipos — ele apenas traduz o código. Rode `npm run build` antes de abrir um Pull Request: um erro de TypeScript que passa despercebido no modo de desenvolvimento faz o deploy falhar na Vercel.

---

## Deploy

A aplicação está publicada na **Vercel**, integrada ao repositório do GitHub:

| Configuração | Valor |
|---|---|
| Framework Preset | Vite |
| Root Directory | `H - Reposição - Thinking in React/produtos-web` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Production Branch | `main` |

- **Merge na `main`** → novo deploy de produção em [produtos-web-matheus.vercel.app](https://produtos-web-matheus.vercel.app)
- **Push em outras branches** → deploy de *preview* com URL própria, sem afetar a produção

---

## Fluxo de Trabalho com Git

Cada passo do tutorial foi desenvolvido em uma branch própria e integrado à `main` por Pull Request, com mensagens no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/).

| Passo | Branch | Principais commits |
|---|---|---|
| 1 | `feat/componentes-tabela-produtos` | `chore: cria projeto com Vite` · `feat: cria interface Product e dados de exemplo` · `feat: separa a interface em componentes` |
| 2 | `feat/tabela-produtos-estatica` | `feat: implementa versão estática com props` · `feat: estiliza componentes com CSS Modules` |
| 3 e 4 | `feat/estado-filtros` | `feat: define estado mínimo com filterText e inStockOnly` · `feat: filtra produtos por texto e estoque na ProductTable` |
| 5 | `feat/callbacks-barra-busca` | `feat: implementa fluxo de dados inverso na SearchBar` |
| — | `docs/readme` | `docs: adiciona README com link do deploy e mapa dos passos` |

---

## Referências

- [Pensando em React — documentação oficial](https://react.dev/learn/thinking-in-react)
- [Documentação do Vite](https://vite.dev/guide/)
- [CSS Modules no Vite](https://vite.dev/guide/features.html#css-modules)
- [React com TypeScript](https://react.dev/learn/typescript)