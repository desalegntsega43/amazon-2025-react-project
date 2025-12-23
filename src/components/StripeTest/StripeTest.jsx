import { useState } from 'react';
import StripePayment from '../StripePayment/StripePayment';
import apiService from '../../services/apiService';
import styles from './StripeTest.module.css';

const StripeTest = () => {
  const [testAmount, setTestAmount] = useState(2999); // $29.99
  const [testResults, setTestResults] = useState([]);
  const [showPayment, setShowPayment] = useState(false);

  const addResult = (test, success, message, data = null) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testBackendConnection = async () => {
    try {
      const result = await apiService.healthCheck();
      addResult(
        'Backend Connection',
        result.success,
        result.success ? 'Backend is healthy' : result.error,
        result.data
      );
    } catch (error) {
      addResult('Backend Connection', false, error.message);
    }
  };

  const testPaymentIntent = async () => {
    try {
      const result = await apiService.createPaymentIntent(testAmount);
      addResult(
        'Payment Intent Creation',
        result.success,
        result.success 
          ? `Payment intent created for $${testAmount / 100}` 
          : result.error,
        result.data
      );
    } catch (error) {
      addResult('Payment Intent Creation', false, error.message);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    addResult(
      'Stripe Payment',
      true,
      `Payment succeeded! ID: ${paymentIntent.id}`,
      paymentIntent
    );
    setShowPayment(false);
  };

  const handlePaymentError = (error) => {
    addResult('Stripe Payment', false, error);
    setShowPayment(false);
  };

  const runAllTests = async () => {
    setTestResults([]);
    await testBackendConnection();
    await testPaymentIntent();
  };

  return (
    <div className={styles.stripeTest}>
      <div className={styles.header}>
        <h2>🔧 Stripe Integration Test</h2>
        <p>Test your Stripe payment integration end-to-end</p>
      </div>

      {/* Test Controls */}
      <div className={styles.controls}>
        <div className={styles.amountControl}>
          <label>Test Amount:</label>
          <select 
            value={testAmount} 
            onChange={(e) => setTestAmount(parseInt(e.target.value))}
          >
            <option value={999}>$9.99</option>
            <option value={2999}>$29.99</option>
            <option value={4999}>$49.99</option>
            <option value={9999}>$99.99</option>
          </select>
        </div>

        <div className={styles.buttons}>
          <button onClick={runAllTests} className={styles.primaryButton}>
            🧪 Run Backend Tests
          </button>
          <button onClick={testBackendConnection} className={styles.secondaryButton}>
            Test Connection
          </button>
          <button onClick={testPaymentIntent} className={styles.secondaryButton}>
            Test Payment Intent
          </button>
          <button 
            onClick={() => setShowPayment(!showPayment)} 
            className={styles.paymentButton}
          >
            {showPayment ? 'Hide Payment Form' : '💳 Test Real Payment'}
          </button>
        </div>
      </div>

      {/* Stripe Payment Form */}
      {showPayment && (
        <div className={styles.paymentSection}>
          <h3>💳 Test Stripe Payment</h3>
          <p>Use test card: 4242 4242 4242 4242</p>
          <StripePayment
            amount={testAmount}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className={styles.results}>
          <h3>📋 Test Results</h3>
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`${styles.result} ${result.success ? styles.success : styles.error}`}
            >
              <div className={styles.resultHeader}>
                <span>{result.success ? '✅' : '❌'}</span>
                <strong>{result.test}</strong>
                <span className={styles.timestamp}>{result.timestamp}</span>
              </div>
              <div className={styles.resultMessage}>{result.message}</div>
              {result.data && (
                <details className={styles.resultData}>
                  <summary>View Data</summary>
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Configuration Info */}
      <div className={styles.config}>
        <h3>⚙️ Configuration</h3>
        <div className={styles.configInfo}>
          <div><strong>API URL:</strong> {process.env.REACT_APP_API_URL}</div>
          <div><strong>Stripe Key:</strong> {process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Not Set'}</div>
          <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
        </div>
      </div>

      {/* Instructions */}
      <div className={styles.instructions}>
        <h3>📚 Setup Instructions</h3>
        <ol>
          <li>Get your Stripe publishable key from <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer">Stripe Dashboard</a></li>
          <li>Add it to your .env file: <code>REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...</code></li>
          <li>Make sure your backend is running on the correct port</li>
          <li>Test with card number: 4242 4242 4242 4242</li>
        </ol>
      </div>
    </div>
  );
};

export default StripeTest;