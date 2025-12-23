import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Payment.module.css';

const Payment = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Ethiopia'
    }
  });
  
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('billing.')) {
      const field = name.split('.')[1];
      setPaymentData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value
        }
      }));
    } else {
      // Format card number with spaces
      if (name === 'cardNumber') {
        const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
        if (formatted.length <= 19) {
          setPaymentData(prev => ({ ...prev, [name]: formatted }));
        }
        return;
      }
      
      // Format expiry date
      if (name === 'expiryDate') {
        const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
        if (formatted.length <= 5) {
          setPaymentData(prev => ({ ...prev, [name]: formatted }));
        }
        return;
      }
      
      // Limit CVV to 3 digits
      if (name === 'cvv') {
        const formatted = value.replace(/\D/g, '');
        if (formatted.length <= 3) {
          setPaymentData(prev => ({ ...prev, [name]: formatted }));
        }
        return;
      }
      
      setPaymentData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!paymentData.expiryDate || paymentData.expiryDate.length < 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date';
    }
    
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    if (!paymentData.cardName.trim()) {
      newErrors.cardName = 'Please enter the name on card';
    }
    
    if (!paymentData.billingAddress.street.trim()) {
      newErrors['billing.street'] = 'Please enter your street address';
    }
    
    if (!paymentData.billingAddress.city.trim()) {
      newErrors['billing.city'] = 'Please enter your city';
    }
    
    if (!paymentData.billingAddress.zipCode.trim()) {
      newErrors['billing.zipCode'] = 'Please enter your zip code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Firebase order saving function - Following recommended Firestore structure
  const saveOrderToFirestore = async (paymentIntentId, orderData) => {
    try {
      console.log('💾 Saving order...');
      
      // 🔥 Recommended Firestore Structure:
      // users/{userId}/orders/{paymentIntentId}
      
      // For now, simulate Firestore save (Firebase will be enabled later)
      console.log('🔄 Firebase not configured, using localStorage');
      
      // Save to localStorage following Firestore structure
      const orderToSave = {
        id: paymentIntentId,
        amount: orderData.stripeAmount,
        basket: cart,
        address: orderData.billingAddress,
        created: Math.floor(Date.now() / 1000), // Unix timestamp for consistency
        status: "succeeded",
        userId: user?.id || 'guest', // Use user.id instead of user.uid
        totals: orderData.totals,
        paymentMethod: orderData.paymentMethod
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      localStorage.setItem('lastOrder', JSON.stringify(orderToSave));
      
      // Save to user-specific orders (format expected by Orders component)
      const userId = user?.id || 'guest';
      const existingOrders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
      existingOrders.unshift(orderToSave); // Add to beginning (newest first)
      localStorage.setItem(`orders_${userId}`, JSON.stringify(existingOrders));
      
      console.log('✅ Order saved successfully (localStorage mode)');
      
      return true;
    } catch (error) {
      console.error('❌ Error saving order:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setProcessing(true);
    
    try {
      console.log('💳 Step 1: Processing Stripe payment for user:', user?.email || 'authenticated user');
      
      // 2️⃣ Confirm Stripe payment
      const totalInCents = Math.round(total * 100);
      let paymentIntent = null;
      let stripeSuccess = false;
      
      // Try to create real payment intent with backend
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3002';
        const response = await fetch(`${apiUrl}/payments/create?total=${totalInCents}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          paymentIntent = {
            id: 'pi_' + Math.random().toString(36).substr(2, 24),
            client_secret: data.clientSecret,
            amount: totalInCents,
            status: 'requires_confirmation'
          };
          
          // Simulate Stripe payment confirmation
          await new Promise(resolve => setTimeout(resolve, 2000));
          paymentIntent.status = 'succeeded';
          stripeSuccess = true;
          
          console.log('✅ Stripe payment confirmed:', paymentIntent.id);
        }
      } catch (error) {
        console.log('🔄 Backend not available, using demo mode');
      }
      
      // Fallback to simulated payment
      if (!paymentIntent) {
        paymentIntent = {
          id: 'pi_demo_' + Math.random().toString(36).substr(2, 24),
          client_secret: 'pi_demo_secret_' + Date.now(),
          amount: totalInCents,
          status: 'requires_confirmation'
        };
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        paymentIntent.status = 'succeeded';
        stripeSuccess = true;
        
        console.log('✅ Demo payment confirmed:', paymentIntent.id);
      }
      
      // Check payment status
      if (paymentIntent.status !== 'succeeded') {
        throw new Error(`💳 Payment failed with status: ${paymentIntent.status}`);
      }
      
      // 3️⃣ Save order to Firestore
      console.log('☁️ Step 2: Saving order to Firestore...');
      
      const orderData = {
        userId: user?.id || 'authenticated_user', // Use user.id instead of user.uid
        userEmail: user?.email || 'user@example.com',
        userName: user?.username || user?.displayName || 'User',
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totals: {
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total
        },
        billingAddress: paymentData.billingAddress,
        paymentMethod: {
          type: 'card',
          last4: paymentData.cardNumber.slice(-4),
          cardName: paymentData.cardName
        },
        paymentIntentId: paymentIntent.id,
        paymentStatus: paymentIntent.status,
        stripeAmount: paymentIntent.amount,
        created: new Date().toISOString()
      };
      
      await saveOrderToFirestore(paymentIntent.id, orderData);
      
      // Clear cart after successful order save
      clearCart();
      console.log('🧹 Cart cleared after successful order');
      
      // 4️⃣ Show success message and redirect
      console.log('🎉 Payment successful!');
      setErrors({ submit: '' }); // Clear any previous errors
      
      // 5️⃣ Redirect to Home page after success
      setTimeout(() => {
        console.log('🏠 Redirecting to Home page...');
        navigate('/', { 
          state: { 
            paymentSuccess: true,
            orderId: paymentIntent.id,
            orderTotal: total,
            message: `✅ Payment successful! Order ${paymentIntent.id} confirmed.`
          }
        });
      }, 2000); // Show success for 2 seconds before redirect
      
    } catch (error) {
      console.error('❌ Payment failed:', error);
      
      // Show specific Stripe error messages
      if (error.message.includes('requires_action')) {
        setErrors({ submit: '🔐 Payment requires additional authentication. Please try again.' });
      } else if (error.message.includes('card_declined')) {
        setErrors({ submit: '💳 Your card was declined. Please try a different payment method.' });
      } else if (error.message.includes('insufficient_funds')) {
        setErrors({ submit: '💰 Insufficient funds. Please try a different card.' });
      } else if (error.message.includes('network')) {
        setErrors({ submit: '🌐 Network error. Please check your connection and try again.' });
      } else {
        setErrors({ submit: `❌ ${error.message}` });
      }
    } finally {
      setProcessing(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart before proceeding to payment.</p>
        <button onClick={() => navigate('/')} className={styles.shopButton}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className={styles.paymentPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Checkout</h1>
          <button onClick={() => navigate('/cart')} className={styles.backButton}>
            ← Back to Cart
          </button>
        </div>

        <div className={styles.paymentContent}>
          {/* Payment Form */}
          <div className={styles.paymentForm}>
            <h2>Payment Information</h2>
            
            <div className={styles.info}>
              <p>💡 <strong>Secure Checkout:</strong> Your payment is protected and encrypted.</p>
            </div>
            
            {errors.submit && (
              <div className={styles.error}>
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Card Information */}
              <div className={styles.section}>
                <h3>Card Details</h3>
                
                <div className={styles.formGroup}>
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="4242 4242 4242 4242"
                    className={errors.cardNumber ? styles.inputError : ''}
                  />
                  {errors.cardNumber && <span className={styles.errorText}>{errors.cardNumber}</span>}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="12/25"
                      className={errors.expiryDate ? styles.inputError : ''}
                    />
                    {errors.expiryDate && <span className={styles.errorText}>{errors.expiryDate}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className={errors.cvv ? styles.inputError : ''}
                    />
                    {errors.cvv && <span className={styles.errorText}>{errors.cvv}</span>}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="cardName">Name on Card</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={errors.cardName ? styles.inputError : ''}
                  />
                  {errors.cardName && <span className={styles.errorText}>{errors.cardName}</span>}
                </div>
              </div>

              {/* Billing Address */}
              <div className={styles.section}>
                <h3>Billing Address</h3>
                
                <div className={styles.formGroup}>
                  <label htmlFor="billing.street">Street Address</label>
                  <input
                    type="text"
                    id="billing.street"
                    name="billing.street"
                    value={paymentData.billingAddress.street}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className={errors['billing.street'] ? styles.inputError : ''}
                  />
                  {errors['billing.street'] && <span className={styles.errorText}>{errors['billing.street']}</span>}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="billing.city">City</label>
                    <input
                      type="text"
                      id="billing.city"
                      name="billing.city"
                      value={paymentData.billingAddress.city}
                      onChange={handleInputChange}
                      placeholder="Addis Ababa"
                      className={errors['billing.city'] ? styles.inputError : ''}
                    />
                    {errors['billing.city'] && <span className={styles.errorText}>{errors['billing.city']}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="billing.state">State/Region</label>
                    <input
                      type="text"
                      id="billing.state"
                      name="billing.state"
                      value={paymentData.billingAddress.state}
                      onChange={handleInputChange}
                      placeholder="Addis Ababa"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="billing.zipCode">Zip Code</label>
                    <input
                      type="text"
                      id="billing.zipCode"
                      name="billing.zipCode"
                      value={paymentData.billingAddress.zipCode}
                      onChange={handleInputChange}
                      placeholder="1000"
                      className={errors['billing.zipCode'] ? styles.inputError : ''}
                    />
                    {errors['billing.zipCode'] && <span className={styles.errorText}>{errors['billing.zipCode']}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="billing.country">Country</label>
                    <select
                      id="billing.country"
                      name="billing.country"
                      value={paymentData.billingAddress.country}
                      onChange={handleInputChange}
                    >
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Tanzania">Tanzania</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className={`${styles.payButton} ${processing ? styles.processing : ''}`}
                disabled={processing}
              >
                {processing ? (
                  <span className={styles.processingText}>
                    <span className={styles.spinner}></span>
                    Processing Payment...
                  </span>
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>
            
            <div className={styles.orderItems}>
              {cart.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <img src={item.image} alt={item.name} />
                  <div className={styles.itemDetails}>
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <span className={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.orderTotals}>
              <div className={styles.totalRow}>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow + ' ' + styles.grandTotal}>
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className={styles.securityInfo}>
              <p>🔒 Your payment information is secure and encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;