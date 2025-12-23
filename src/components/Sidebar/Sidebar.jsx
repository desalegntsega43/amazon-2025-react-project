import styles from './Sidebar.module.css';

const Sidebar = ({ filters, onFilterChange }) => {
  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 to $50', min: 25, max: 50 },
    { label: '$50 to $100', min: 50, max: 100 },
    { label: '$100 to $200', min: 100, max: 200 },
    { label: '$200 & Above', min: 200, max: Infinity }
  ];

  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Generic'];

  const handlePriceChange = (range) => {
    onFilterChange({
      ...filters,
      priceRange: filters.priceRange?.min === range.min && filters.priceRange?.max === range.max
        ? null
        : range
    });
  };

  const handleBrandChange = (brand) => {
    const currentBrands = filters.brands || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    onFilterChange({
      ...filters,
      brands: newBrands
    });
  };

  const clearFilters = () => {
    onFilterChange({ brands: [], priceRange: null });
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.filterSection}>
        <div className={styles.filterHeader}>
          <h3>Filters</h3>
          {(filters.brands?.length > 0 || filters.priceRange) && (
            <button onClick={clearFilters} className={styles.clearButton}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Price Filter */}
      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>Price</h4>
        <div className={styles.filterOptions}>
          {priceRanges.map((range, index) => (
            <label key={index} className={styles.filterOption}>
              <input
                type="checkbox"
                checked={
                  filters.priceRange?.min === range.min &&
                  filters.priceRange?.max === range.max
                }
                onChange={() => handlePriceChange(range)}
                className={styles.checkbox}
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>Brand</h4>
        <div className={styles.filterOptions}>
          {brands.map((brand) => (
            <label key={brand} className={styles.filterOption}>
              <input
                type="checkbox"
                checked={filters.brands?.includes(brand) || false}
                onChange={() => handleBrandChange(brand)}
                className={styles.checkbox}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>Customer Review</h4>
        <div className={styles.filterOptions}>
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className={styles.filterOption}>
              <input
                type="checkbox"
                checked={filters.minRating === rating}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    minRating: filters.minRating === rating ? null : rating
                  })
                }
                className={styles.checkbox}
              />
              <span className={styles.ratingLabel}>
                {'⭐'.repeat(rating)} & Up
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
