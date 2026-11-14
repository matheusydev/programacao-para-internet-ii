import type { Product } from '../../types/product'
import SearchBar from '../SearchBar/SearchBar'
import ProductTable from '../ProductTable/ProductTable'
import styles from './FilterableProductTable.module.css'

interface FilterableProductTableProps {
  products: Product[]
}

export default function FilterableProductTable({ products }: FilterableProductTableProps) {
  return (
    <div className={styles.container}>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  )
}
