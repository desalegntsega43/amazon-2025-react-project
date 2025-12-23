import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Cart.module.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className={styles.cart}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <button onClick={() => navigate('/products')} className={styles.shopButton}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      // Redirect to auth page with return path to payment
      navigate('/auth', { 
        state: { 
          from: { pathname: '/payment' },
          message: 'Please sign in to complete your checkout'
        }
      });
    } else {
      // User is authenticated, proceed to payment
      navigate('/payment');
    }
  };

  return (
    <div className={styles.cart}>
      <div className={styles.container}>
        <h1 className={styles.title}>Shopping Cart</h1>

        <div className={styles.content}>
          <div className={styles.items}>
            {cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img src={item.image} alt={item.name} className={styles.itemImage} />
                
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>

                <div className={styles.itemActions}>
                  <div className={styles.quantity}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.quantityButton}
                    >
                      -
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.quantityButton}
                    >
                      +
                    </button>
                  </div>
                  <div className={styles.itemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            {/* User Status */}
            {isAuthenticated && user ? (
              <div className={styles.userStatus}>
                <span className={styles.userIcon}>👤</span>
                <span className={styles.userInfo}>
                  Signed in as <strong>{user.username || user.email}</strong>
                </span>
              </div>
            ) : (
              <div className={styles.guestStatus}>
                <span className={styles.guestIcon}>🔓</span>
                <span className={styles.guestInfo}>
                  Sign in required for checkout
                </span>
              </div>
            )}
            
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            
            <div className={styles.summaryTotal}>
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>

            <button onClick={handleCheckout} className={styles.checkoutButton}>
              {isAuthenticated ? 'Proceed to Checkout' : 'Sign In & Checkout'}
            </button>

            <button onClick={clearCart} className={styles.clearButton}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
