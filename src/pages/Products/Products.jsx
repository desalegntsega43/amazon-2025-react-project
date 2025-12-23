import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import Sidebar from '../../components/Sidebar/Sidebar';
import productsData from '../../data/products.json';
import styles from './Products.module.css';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [shuffledProducts, setShuffledProducts] = useState([]);
  const [filters, setFilters] = useState({ brands: [], priceRange: null, minRating: null });

  const categories = ['All', ...new Set(productsData.map(p => p.category))];

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Shuffle products on component mount
  useEffect(() => {
    setShuffledProducts(shuffleArray(productsData));
  }, []);

  // Apply filters
  let filteredProducts = selectedCategory === 'All'
    ? shuffledProducts
    : shuffledProducts.filter(p => p.category === selectedCategory);

  // Apply price range filter
  if (filters.priceRange) {
    filteredProducts = filteredProducts.filter(
      p => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
    );
  }

  // Apply brand filter (for demo, we'll filter by category as proxy)
  if (filters.brands && filters.brands.length > 0) {
    // In a real app, products would have a brand field
    // For now, this is a placeholder
  }

  // Apply rating filter
  if (filters.minRating) {
    filteredProducts = filteredProducts.filter(p => p.rating >= filters.minRating);
  }

  // Apply sorting
  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className={styles.products}>
      <div className={styles.container}>
        <h1 className={styles.title}>All Products</h1>

        <div className={styles.topFilters}>
          <div className={styles.filterGroup}>
            <label>Category:</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.select}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Sort by:</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.select}
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div className={styles.resultCount}>
            {filteredProducts.length} results
          </div>
        </div>

        <div className={styles.contentWrapper}>
          <Sidebar filters={filters} onFilterChange={setFilters} />

          <div className={styles.productsSection}>
            <div className={styles.productGrid}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className={styles.noProducts}>
                <p>No products found matching your filters.</p>
                <button 
                  onClick={() => setFilters({ brands: [], priceRange: null, minRating: null })}
                  className={styles.resetButton}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
