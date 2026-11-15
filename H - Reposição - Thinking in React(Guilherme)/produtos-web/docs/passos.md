# Passos do Thinking in React

## Passo 1 — Hierarquia de componentes

FilterableProductTable
├── SearchBar
└── ProductTable
    ├── ProductCategoryRow
    └── ProductRow

- FilterableProductTable: contém o app inteiro
- SearchBar: recebe a entrada do usuário
- ProductTable: exibe e filtra a lista conforme a entrada do usuário
- ProductCategoryRow: exibe o título de cada categoria
- ProductRow: exibe uma linha para cada produto

O cabeçalho (Name | Price) fica dentro de ProductTable, pois aparece dentro da tabela.

## Passo 3 — Estado mínimo

Dados do app:
1. Lista original de produtos -> vem por props, não é state
2. Texto da busca -> muda com o tempo e não é calculável: É STATE (filterText: string)
3. Valor do checkbox -> muda com o tempo e não é calculável: É STATE (inStockOnly: boolean)
4. Lista filtrada -> calculada a partir de 1, 2 e 3, não é state