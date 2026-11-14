import styles from './SearchBar.module.css'

export default function SearchBar() {
  return (
    <form className={styles.form}>
      <input className={styles.input} type="text" placeholder="Search..." />
      <label className={styles.checkbox}>
        <input type="checkbox" /> Only show products in stock
      </label>
    </form>
  )
}
