import type { Product } from '../../types/product'
import SearchBar from '../SearchBar/SearchBar'
import ProductTable from '../ProductTable/ProductTable'

interface FilterableProductTableProps {
  products: Product[]
}

export default function FilterableProductTable({ products }: FilterableProductTableProps) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  )
}
