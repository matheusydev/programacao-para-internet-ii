import styles from './SearchBar.module.css';

export default function SearchBar() {
  return (
    <form className={styles.form}>
      <input
        type="text"
        placeholder="Search..."
        className={styles.input}
      />
      <label className={styles.label}>
        <input type="checkbox" /> Only show products in stock
      </label>
    </form>
  );
}