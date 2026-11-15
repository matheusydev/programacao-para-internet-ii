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