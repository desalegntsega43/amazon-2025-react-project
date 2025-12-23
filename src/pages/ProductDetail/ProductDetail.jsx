import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import productsData from '../../data/products.json';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = productsData.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Product not found</h2>
          <button onClick={() => navigate('/products')} className={styles.backButton}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert('Product added to cart!');
  };

  return (
    <div className={styles.productDetail}>
      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.backLink}>
          ← Back
        </button>

        <div className={styles.content}>
          <div className={styles.imageSection}>
            <img src={product.image} alt={product.name} className={styles.image} />
          </div>

          <div className={styles.infoSection}>
            <h1 className={styles.title}>{product.name}</h1>

            <div className={styles.rating}>
              <span className={styles.stars}>
                {'⭐'.repeat(Math.floor(product.rating))}
              </span>
              <span className={styles.ratingText}>
                {product.rating} out of 5
              </span>
              <span className={styles.reviews}>
                ({product.reviews} reviews)
              </span>
            </div>

            <div className={styles.price}>${product.price.toFixed(2)}</div>

            <div className={styles.category}>
              <strong>Category:</strong> {product.category}
            </div>

            <div className={styles.description}>
              <h3>About this item</h3>
              <p>{product.description}</p>
            </div>

            <div className={styles.actions}>
              <button onClick={handleAddToCart} className={styles.addButton}>
                Add to Cart
              </button>
              <button onClick={() => navigate('/cart')} className={styles.buyButton}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
