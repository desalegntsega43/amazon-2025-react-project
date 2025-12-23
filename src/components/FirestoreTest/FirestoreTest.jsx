import { useState } from 'react';
import { testFirestoreConnection, testOrderCreation, runAllTests } from '../../utils/testFirestore';
import styles from './FirestoreTest.module.css';

const FirestoreTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      const results = await runAllTests();
      setTestResults(results);
    } catch (error) {
      setTestResults({
        overall: false,
        error: error.message
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleTestConnection = async () => {
    setIsRunning(true);
    const result = await testFirestoreConnection();
    setTestResults({ connection: result });
    setIsRunning(false);
  };

  const handleTestOrders = async () => {
    setIsRunning(true);
    const result = await testOrderCreation();
    setTestResults({ orders: result });
    setIsRunning(false);
  };

  return (
    <div className={styles.testContainer}>
      <h3>🔥 Firestore Connection Test</h3>
      <p>Use this to verify your Firebase/Firestore setup is working correctly.</p>
      
      <div className={styles.buttonGroup}>
        <button 
          onClick={handleRunTests} 
          disabled={isRunning}
          className={styles.primaryButton}
        >
          {isRunning ? '🔄 Running Tests...' : '🚀 Run All Tests'}
        </button>
        
        <button 
          onClick={handleTestConnection} 
          disabled={isRunning}
          className={styles.secondaryButton}
        >
          Test Connection
        </button>
        
        <button 
          onClick={handleTestOrders} 
          disabled={isRunning}
          className={styles.secondaryButton}
        >
          Test Orders
        </button>
      </div>

      {testResults && (
        <div className={styles.results}>
          <h4>Test Results:</h4>
          
          {testResults.connection && (
            <div className={`${styles.result} ${testResults.connection.success ? styles.success : styles.error}`}>
              <strong>Connection Test:</strong> {testResults.connection.success ? '✅ PASSED' : '❌ FAILED'}
              {testResults.connection.projectId && (
                <div>Project: {testResults.connection.projectId}</div>
              )}
              {testResults.connection.error && (
                <div className={styles.errorMessage}>{testResults.connection.error}</div>
              )}
            </div>
          )}
          
          {testResults.orders && (
            <div className={`${styles.result} ${testResults.orders.success ? styles.success : styles.error}`}>
              <strong>Order Test:</strong> {testResults.orders.success ? '✅ PASSED' : '❌ FAILED'}
              {testResults.orders.orderId && (
                <div>Order ID: {testResults.orders.orderId}</div>
              )}
              {testResults.orders.isFirestore !== undefined && (
                <div>Storage: {testResults.orders.isFirestore ? '🔥 Firestore' : '💾 localStorage'}</div>
              )}
              {testResults.orders.error && (
                <div className={styles.errorMessage}>{testResults.orders.error}</div>
              )}
            </div>
          )}
          
          {testResults.overall !== undefined && (
            <div className={`${styles.overall} ${testResults.overall ? styles.success : styles.error}`}>
              <strong>Overall Result:</strong> {testResults.overall ? '🎉 ALL TESTS PASSED!' : '❌ Some tests failed'}
            </div>
          )}
          
          {testResults.error && (
            <div className={styles.errorMessage}>
              <strong>Error:</strong> {testResults.error}
            </div>
          )}
        </div>
      )}
      
      <div className={styles.instructions}>
        <h4>📋 Next Steps:</h4>
        <ul>
          <li>✅ <strong>All tests pass:</strong> Your Firestore is ready for production!</li>
          <li>❌ <strong>Connection fails:</strong> Check your .env file and Firebase config</li>
          <li>⚠️ <strong>Using localStorage:</strong> Update .env with real Firebase values</li>
          <li>📚 <strong>Need help:</strong> Check FIRESTORE_TROUBLESHOOTING.md</li>
        </ul>
      </div>
    </div>
  );
};

export default FirestoreTest;