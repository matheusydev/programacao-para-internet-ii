import styles from './SearchBar.module.css';

interface SearchBarProps {
  filterText: string;
  inStockOnly: boolean;
  onFilterTextChange: (value: string) => void;
  onInStockOnlyChange: (value: boolean) => void;
}

export default function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}: SearchBarProps) {
  return (
    <form className={styles.form}>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        className={styles.input}
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label className={styles.label}>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />{' '}
        Only show products in stock
      </label>
    </form>
  );
}