import styles from './SearchBar.module.css'

interface SearchBarProps {
  filterText: string
  inStockOnly: boolean
}

export default function SearchBar({ filterText, inStockOnly }: SearchBarProps) {
  return (
    <form className={styles.form}>
      <input
        className={styles.input}
        type="text"
        value={filterText}
        placeholder="Search..."
      />
      <label className={styles.checkbox}>
        <input type="checkbox" checked={inStockOnly} /> Only show products in stock
      </label>
    </form>
  )
}
