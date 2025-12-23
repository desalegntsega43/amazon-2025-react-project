// API Test Component - Demonstrates API usage
import { useState } from 'react';
import { useHealthCheck, usePayment, useMutation } from '../../hooks/useApi';
import apiService from '../../services/apiService';
import styles from './ApiTest.module.css';

const ApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Use health check hook
  const { status, lastCheck, checkHealth } = useHealthCheck();
  
  // Use payment hook
  const { createPaymentIntent, loading: paymentLoading, error: paymentError } = usePayment();
  
  // Use mutation hook for order creation
  const { mutate: createOrder, loading: orderLoading, error: orderError } = useMutation(
    (orderData) => apiService.createOrder(orderData)
  );

  const addTestResult = (test, success, message, data = null) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Health Check
    try {
      const healthResult = await apiService.healthCheck();
      addTestResult(
        'Health Check',
        healthResult.success,
        healthResult.success ? 'API server is healthy' : healthResult.error,
        healthResult.data
      );
    } catch (error) {
      addTestResult('Health Check', false, error.message);
    }

    // Test 2: Payment Intent Creation
    try {
      const paymentResult = await createPaymentIntent(2999); // $29.99
      addTestResult(
        'Payment Intent',
        true,
        'Payment intent created successfully',
        paymentResult
      );
    } catch (error) {
      addTestResult('Payment Intent', false, error.message);
    }

    // Test 3: Product Fetch (if endpoint exists)
    try {
      const productsResult = await apiService.getAllProducts();
      addTestResult(
        'Get Products',
        productsResult.success,
        productsResult.success 
          ? `Fetched ${productsResult.data?.length || 0} products`
          : productsResult.error,
        productsResult.data
      );
    } catch (error) {
      addTestResult('Get Products', false, error.message);
    }

    // Test 4: Order Creation (demo)
    try {
      const demoOrder = {
        userId: 'demo-user-123',
        items: [
          { id: 1, name: 'Test Product', price: 29.99, quantity: 1 }
        ],
        total: 29.99,
        paymentIntentId: 'pi_demo_123'
      };
      
      const orderResult = await createOrder(demoOrder);
      addTestResult(
        'Create Order',
        true,
        'Demo order created successfully',
        orderResult
      );
    } catch (error) {
      addTestResult('Create Order', false, error.message);
    }

    setIsRunning(false);
  };

  const testSpecificEndpoint = async (endpoint, method = 'GET') => {
    try {
      const result = await apiService.makeRequest(method, endpoint);
      addTestResult(
        `${method} ${endpoint}`,
        result.success,
        result.success ? 'Request successful' : result.error,
        result.data
      );
    } catch (error) {
      addTestResult(`${method} ${endpoint}`, false, error.message);
    }
  };

  return (
    <div className={styles.apiTest}>
      <div className={styles.header}>
        <h2>🔧 API Test Dashboard</h2>
        <p>Test your backend API connections and endpoints</p>
      </div>

      {/* API Status */}
      <div className={styles.statusSection}>
        <h3>📊 API Status</h3>
        <div className={styles.statusCard}>
          <div className={`${styles.statusIndicator} ${styles[status]}`}>
            {status === 'healthy' ? '✅' : status === 'unhealthy' ? '❌' : '🔄'}
          </div>
          <div className={styles.statusInfo}>
            <strong>Status:</strong> {status}
            <br />
            <strong>Base URL:</strong> {apiService.getBaseURL()}
            <br />
            <strong>Last Check:</strong> {lastCheck?.toLocaleTimeString() || 'Never'}
          </div>
          <button onClick={checkHealth} className={styles.refreshButton}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Test Controls */}
      <div className={styles.controlsSection}>
        <h3>🧪 API Tests</h3>
        <div className={styles.controls}>
          <button 
            onClick={runAllTests} 
            disabled={isRunning}
            className={styles.primaryButton}
          >
            {isRunning ? '🔄 Running Tests...' : '🚀 Run All Tests'}
          </button>
          
          <button 
            onClick={() => testSpecificEndpoint('/health')}
            className={styles.secondaryButton}
          >
            Test Health
          </button>
          
          <button 
            onClick={() => testSpecificEndpoint('/payments/create?total=1000', 'POST')}
            className={styles.secondaryButton}
          >
            Test Payment
          </button>
          
          <button 
            onClick={() => setTestResults([])}
            className={styles.clearButton}
          >
            Clear Results
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className={styles.resultsSection}>
          <h3>📋 Test Results</h3>
          <div className={styles.results}>
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`${styles.result} ${result.success ? styles.success : styles.error}`}
              >
                <div className={styles.resultHeader}>
                  <span className={styles.resultIcon}>
                    {result.success ? '✅' : '❌'}
                  </span>
                  <strong>{result.test}</strong>
                  <span className={styles.timestamp}>{result.timestamp}</span>
                </div>
                <div className={styles.resultMessage}>
                  {result.message}
                </div>
                {result.data && (
                  <details className={styles.resultData}>
                    <summary>View Response Data</summary>
                    <pre>{JSON.stringify(result.data, null, 2)}</pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Configuration */}
      <div className={styles.configSection}>
        <h3>⚙️ Configuration</h3>
        <div className={styles.configInfo}>
          <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
          <div><strong>API URL:</strong> {process.env.REACT_APP_API_URL || 'Not set'}</div>
          <div><strong>Production URL:</strong> {process.env.REACT_APP_PRODUCTION_API_URL || 'Not set'}</div>
          <div><strong>Timeout:</strong> 10 seconds</div>
        </div>
      </div>

      {/* Loading States */}
      {(paymentLoading || orderLoading) && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Processing API request...</p>
        </div>
      )}

      {/* Error Display */}
      {(paymentError || orderError) && (
        <div className={styles.errorAlert}>
          <strong>Error:</strong> {paymentError || orderError}
        </div>
      )}
    </div>
  );
};

export default ApiTest;