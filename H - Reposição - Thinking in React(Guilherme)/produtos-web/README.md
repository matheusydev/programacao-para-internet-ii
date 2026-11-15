# produtos-web

Tabela de produtos pesquisável feita com **React + TypeScript + Vite**, seguindo o exemplo
["Thinking in React"](https://react.dev/learn/thinking-in-react) da documentação oficial do React.

Atividade de reposição de feriado — TADS / IFPI.

## Link da aplicação

🔗 **Deploy:** <https://produtos-web-gamma.vercel.app/>

## Funcionalidades

- Lista de produtos agrupada por categoria
- Busca por nome (ignora maiúsculas e minúsculas)
- Filtro "Only show products in stock" (apenas em estoque)
- Produtos sem estoque aparecem em vermelho

## Tecnologias

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) (totalmente tipado)
- [Vite](https://vite.dev/) 8
- CSS Modules

## Estrutura de componentes

```
FilterableProductTable
├── SearchBar
└── ProductTable
    ├── ProductCategoryRow
    └── ProductRow
```

## Como rodar localmente

Pré-requisito: Node.js 20.19+ (ou 22.12+).

```bash
git clone https://github.com/matheusydev/programacao-para-internet-ii.git
cd "programacao-para-internet-ii/H - Reposição - Thinking in React(Guilherme)/produtos-web"
npm install
npm run dev
```

Acesse http://localhost:5173

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Verifica tipos e gera a pasta `dist` |
| `npm run preview` | Testa o build localmente |

## Autor

<Guilherme Alves Barbosa> — [Guilherme Alves Barbosa](https://github.com/Guilherme-sta)