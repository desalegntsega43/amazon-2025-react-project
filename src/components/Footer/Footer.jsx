import DeploymentBadge from '../DeploymentBadge/DeploymentBadge';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h4>Amazon Clone</h4>
            <p>A fully responsive e-commerce application built with React</p>
          </div>
          
          <div className={styles.section}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/cart">Cart</a></li>
              <li><a href="/orders">Orders</a></li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h4>Tech Stack</h4>
            <ul>
              <li>React + Vite</li>
              <li>CSS Modules</li>
              <li>React Router</li>
              <li>Stripe Payments</li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h4>Deployment</h4>
            <DeploymentBadge variant="minimal" />
            <p className={styles.deploymentInfo}>
              Deployed on Netlify with continuous integration
            </p>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>&copy; 2024 Amazon Clone. Built for educational purposes.</p>
          </div>
          <div className={styles.deployment}>
            <DeploymentBadge />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;