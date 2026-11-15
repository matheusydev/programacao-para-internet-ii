import type { Product } from '../types';
import SearchBar from './SearchBar';
import ProductTable from './ProductTable';
import styles from './FilterableProductTable.module.css';

interface FilterableProductTableProps {
  products: Product[];
}

export default function FilterableProductTable({
  products,
}: FilterableProductTableProps) {
  return (
    <div className={styles.container}>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}