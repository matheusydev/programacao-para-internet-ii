import { useState } from 'react'
import type { Product } from '../../types/product'
import SearchBar from '../SearchBar/SearchBar'
import ProductTable from '../ProductTable/ProductTable'
import styles from './FilterableProductTable.module.css'

interface FilterableProductTableProps {
  products: Product[]
}

export default function FilterableProductTable({ products }: FilterableProductTableProps) {
  // Passo 3: o estado mínimo da interface
  // Passo 4: ele fica aqui, no pai comum de SearchBar e ProductTable
  const [filterText, setFilterText] = useState<string>('')
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)

  return (
    <div className={styles.container}>
      {/* Passo 5: a SearchBar recebe as funções que mudam o estado do pai */}
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  )
}