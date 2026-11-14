import styles from './ProductTable.module.css'
import type { ReactElement } from 'react'
import type { Product } from '../../types/product'
import ProductCategoryRow from '../ProductCategoryRow/ProductCategoryRow'
import ProductRow from '../ProductRow/ProductRow'

interface ProductTableProps {
  products: Product[]
}

export default function ProductTable({ products }: ProductTableProps) {
  const rows: ReactElement[] = []
  let lastCategory: string | null = null

  products.forEach((product) => {
    // quando a categoria muda, insere uma linha de título antes do produto
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow category={product.category} key={product.category} />,
      )
    }
    rows.push(<ProductRow product={product} key={product.name} />)
    lastCategory = product.category
  })

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.header}>Name</th>
          <th className={`${styles.header} ${styles.price}`}>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}
