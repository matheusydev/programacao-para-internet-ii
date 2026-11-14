import styles from './ProductTable.module.css'
import type { ReactElement } from 'react'
import type { Product } from '../../types/product'
import ProductCategoryRow from '../ProductCategoryRow/ProductCategoryRow'
import ProductRow from '../ProductRow/ProductRow'

interface ProductTableProps {
  products: Product[]
  filterText: string
  inStockOnly: boolean
}

export default function ProductTable({ products, filterText, inStockOnly }: ProductTableProps) {
  const rows: ReactElement[] = []
  let lastCategory: string | null = null

  products.forEach((product) => {
    // filtro 1: o nome precisa conter o texto da busca (sem diferenciar maiúsculas)
    if (!product.name.toLowerCase().includes(filterText.toLowerCase())) {
      return
    }
    // filtro 2: se o checkbox estiver marcado, pula quem está fora de estoque
    if (inStockOnly && !product.stocked) {
      return
    }

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
