import type { Product } from '../../types/product'
import styles from './ProductRow.module.css'

interface ProductRowProps {
  product: Product
}

export default function ProductRow({ product }: ProductRowProps) {
  // produto fora de estoque aparece com o nome em vermelho
  const name = product.stocked ? (
    product.name
  ) : (
    <span className={styles.outOfStock}>{product.name}</span>
  )

  return (
    <tr>
      <td className={styles.cell}>{name}</td>
      <td className={`${styles.cell} ${styles.price}`}>{product.price}</td>
    </tr>
  )
}
