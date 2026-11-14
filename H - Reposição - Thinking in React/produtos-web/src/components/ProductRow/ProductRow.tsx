import type { Product } from '../../types/product'

interface ProductRowProps {
  product: Product
}

export default function ProductRow({ product }: ProductRowProps) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: 'red' }}>{product.name}</span>
  )

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  )
}
