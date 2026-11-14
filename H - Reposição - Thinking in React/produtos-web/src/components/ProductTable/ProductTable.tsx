import type { Product } from '../../types/product'
import ProductCategoryRow from '../ProductCategoryRow/ProductCategoryRow'
import ProductRow from '../ProductRow/ProductRow'

interface ProductTableProps {
  products: Product[]
}

export default function ProductTable({ products }: ProductTableProps) {
  const exemplo = products[0]

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <ProductCategoryRow category={exemplo.category} />
        <ProductRow product={exemplo} />
      </tbody>
    </table>
  )
}
