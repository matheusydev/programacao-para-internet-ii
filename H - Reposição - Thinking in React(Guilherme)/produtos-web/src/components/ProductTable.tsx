import type { ReactNode } from 'react';
import type { Product } from '../types';
import ProductCategoryRow from './ProductCategoryRow';
import ProductRow from './ProductRow';
import styles from './ProductTable.module.css';

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const rows: ReactNode[] = [];
  let lastCategory: string | null = null;

  products.forEach((product) => {
    // Quando a categoria muda, insere uma linha de título antes
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          key={product.category}
          category={product.category}
        />,
      );
    }
    rows.push(<ProductRow key={product.name} product={product} />);
    lastCategory = product.category;
  });

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.headerCell}>Name</th>
          <th className={styles.headerCell}>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}