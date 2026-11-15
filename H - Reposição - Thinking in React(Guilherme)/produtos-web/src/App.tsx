import FilterableProductTable from './components/FilterableProductTable';
import { PRODUCTS } from './data/products';

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}