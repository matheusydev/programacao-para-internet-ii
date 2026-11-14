import { useState } from 'react'
import type { Product } from '../../types/product'
import SearchBar from '../SearchBar/SearchBar'
import ProductTable from '../ProductTable/ProductTable'
import styles from './FilterableProductTable.module.css'

interface FilterableProductTableProps {
  products: Product[]
}

export default function FilterableProductTable({ products }: FilterableProductTableProps) {
  const [filterText] = useState<string>('')
  const [inStockOnly] = useState<boolean>(false)

  return (
    <div className={styles.container}>
      <SearchBar filterText={filterText} inStockOnly={inStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  )
}
