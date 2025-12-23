import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.name} className={styles.image} />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        
        <div className={styles.rating}>
          <span className={styles.stars}>
            {'⭐'.repeat(Math.floor(product.rating))}
          </span>
          <span className={styles.ratingText}>
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className={styles.price}>${product.price.toFixed(2)}</div>

        <button 
          className={styles.addButton}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
