import { useState } from 'react';
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
  const [filterText, setFilterText] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
}