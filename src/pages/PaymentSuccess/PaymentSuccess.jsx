import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './PaymentSuccess.module.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderTotal, orderItems, orderId, paymentStatus, isDemo } = location.state || {};

  useEffect(() => {
    // Redirect to home if no order data
    if (!orderTotal) {
      navigate('/', { replace: true });
    }
  }, [orderTotal, navigate]);

  const orderNumber = orderId || Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className={styles.successPage}>
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.checkIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#28a745"/>
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1>Payment Successful!</h1>
          <p className={styles.subtitle}>
            Thank you for your order. Your payment has been processed successfully.
            {isDemo && ' (Demo Mode - No real charge was made)'}
          </p>
          
          <div className={styles.orderDetails}>
            <h2>Order Details</h2>
            <div className={styles.detailRow}>
              <span>Order Number:</span>
              <span className={styles.orderNumber}>#{orderNumber}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Total Amount:</span>
              <span className={styles.amount}>${orderTotal?.toFixed(2)}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Items:</span>
              <span>{orderItems} item{orderItems !== 1 ? 's' : ''}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Payment Status:</span>
              <span className={styles.paymentStatus}>
                {paymentStatus === 'succeeded' ? '✅ Confirmed' : '⏳ Processing'}
              </span>
            </div>
          </div>
          
          <div className={styles.nextSteps}>
            <h3>What's Next?</h3>
            <ul>
              <li>You will receive an order confirmation email shortly</li>
              <li>Your items will be processed and shipped within 1-2 business days</li>
              <li>You can track your order status in your account</li>
            </ul>
          </div>
          
          <div className={styles.actions}>
            <button 
              onClick={() => navigate('/')} 
              className={styles.primaryButton}
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => navigate('/orders')} 
              className={styles.secondaryButton}
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;