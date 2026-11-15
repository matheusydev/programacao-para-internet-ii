import styles from './ProductCategoryRow.module.css';

interface ProductCategoryRowProps {
  category: string;
}

export default function ProductCategoryRow({ category }: ProductCategoryRowProps) {
  return (
    <tr>
      <th colSpan={2} className={styles.categoryRow}>
        {category}
      </th>
    </tr>
  );
}