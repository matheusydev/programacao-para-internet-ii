import type { Product } from '../types';
import styles from './ProductRow.module.css';

interface ProductRowProps {
  product: Product;
}

export default function ProductRow({ product }: ProductRowProps) {
  // Produto sem estoque: nome em vermelho
  const nameClass = product.stocked ? undefined : styles.outOfStock;

  return (
    <tr>
      <td className={nameClass}>{product.name}</td>
      <td>{product.price}</td>
    </tr>
  );
}