import { useState, useEffect } from 'react';
import { useHealthCheck } from '../../hooks/useApi';
import styles from './DeploymentStatus.module.css';

const DeploymentStatus = () => {
  const { status, lastCheck, checkHealth } = useHealthCheck();
  const [deploymentInfo, setDeploymentInfo] = useState({});

  useEffect(() => {
    setDeploymentInfo({
      environment: process.env.NODE_ENV,
      frontendUrl: process.env.REACT_APP_FRONTEND_URL || window.location.origin,
      apiUrl: process.env.REACT_APP_API_URL || process.env.REACT_APP_PRODUCTION_API_URL,
      stripeConfigured: !!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
      firebaseConfigured: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
      buildTime: new Date().toISOString()
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#28a745';
      case 'unhealthy': return '#dc3545';
      default: return '#ffc107';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'unhealthy': return '❌';
      default: return '🔄';
    }
  };

  return (
    <div className={styles.deploymentStatus}>
      <div className={styles.header}>
        <h3>🚀 Deployment Status</h3>
        <button onClick={checkHealth} className={styles.refreshBtn}>
          🔄 Refresh
        </button>
      </div>

      {/* Frontend Status */}
      <div className={styles.statusSection}>
        <h4>Frontend (Netlify)</h4>
        <div className={styles.statusGrid}>
          <div className={styles.statusItem}>
            <span className={styles.label}>Status:</span>
            <span className={styles.value}>✅ Deployed</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.label}>URL:</span>
            <a 
              href="https://capable-salamander-c75e58.netlify.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.link}
            >
              https://capable-salamander-c75e58.netlify.app
            </a>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.label}>Environment:</span>
            <span className={styles.value}>{deploymentInfo.environment}</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.label}>Build Time:</span>
            <span className={styles.value}>
              {new Date(deploymentInfo.buildTime).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Backend Status */}
      <div className={styles.statusSection}>
        <h4>Backend API</h4>
        <div className={styles.statusGrid}>
          <div className={styles.statusItem}>
            <span className={styles.label}>Status:</span>
            <span 
              className={styles.value}
              style={{ color: getStatusColor(status) }}
            >
              {getStatusIcon(status)} {status}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.label}>API URL:</span>
            <span className={styles.value}>
              {deploymentInfo.apiUrl || 'Not configured'}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.label}>Last Check:</span>
            <span className={styles.value}>
              {lastCheck ? lastCheck.toLocaleTimeString() : 'Never'}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.label}>CORS:</span>
            <span className={styles.value}>
              {status === 'healthy' ? '✅ Configured' : '⚠️ Check configuration'}
            </span>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className={styles.statusSection}>
        <h4>Services Configuration</h4>
        <div className={styles.statusGrid}>
          <div className={styles.statusItem}>
            <span className={styles.label}>Stripe:</span>
            <span className={styles.value}>
              {deploymentInfo.stripeConfigured ? '✅ Configured' : '❌ Not configured'}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.label}>Firebase:</span>
            <span className={styles.value}>
              {deploymentInfo.firebaseConfigured ? '✅ Configured' : '❌ Not configured'}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.label}>Authentication:</span>
            <span className={styles.value}>✅ Local Storage</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.label}>Orders:</span>
            <span className={styles.value}>
              {deploymentInfo.firebaseConfigured ? '✅ Firestore' : '⚠️ Local Storage'}
            </span>
          </div>
        </div>
      </div>

      {/* Deployment Links */}
      <div className={styles.linksSection}>
        <h4>Quick Links</h4>
        <div className={styles.links}>
          <a 
            href="https://capable-salamander-c75e58.netlify.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.deployLink}
          >
            🌐 Live Site
          </a>
          <a 
            href="https://app.netlify.com/sites/capable-salamander-c75e58" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.deployLink}
          >
            ⚙️ Netlify Dashboard
          </a>
          <a 
            href="https://dashboard.stripe.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.deployLink}
          >
            💳 Stripe Dashboard
          </a>
          <a 
            href="https://console.firebase.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.deployLink}
          >
            🔥 Firebase Console
          </a>
        </div>
      </div>

      {/* Next Steps */}
      {status !== 'healthy' && (
        <div className={styles.nextSteps}>
          <h4>⚠️ Next Steps</h4>
          <ul>
            <li>Deploy your backend to Heroku, Railway, or Vercel</li>
            <li>Update REACT_APP_PRODUCTION_API_URL with your backend URL</li>
            <li>Configure CORS on backend to allow Netlify domain</li>
            <li>Test the complete payment flow</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DeploymentStatus;