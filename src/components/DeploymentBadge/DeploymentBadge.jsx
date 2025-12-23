import styles from './DeploymentBadge.module.css';

const DeploymentBadge = ({ variant = 'default' }) => {
  const deploymentUrl = 'https://capable-salamander-c75e58.netlify.app';
  
  if (variant === 'minimal') {
    return (
      <a 
        href={deploymentUrl}
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.minimalBadge}
        title="View Live Site"
      >
        🌐 Live
      </a>
    );
  }

  if (variant === 'button') {
    return (
      <a 
        href={deploymentUrl}
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.buttonBadge}
      >
        🚀 View Live Site
      </a>
    );
  }

  return (
    <div className={styles.deploymentBadge}>
      <div className={styles.badgeContent}>
        <div className={styles.status}>
          <span className={styles.indicator}></span>
          <span className={styles.statusText}>Live</span>
        </div>
        <a 
          href={deploymentUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.deploymentLink}
        >
          capable-salamander-c75e58.netlify.app
        </a>
      </div>
      <div className={styles.provider}>
        <span className={styles.providerText}>Deployed on</span>
        <span className={styles.netlifyLogo}>Netlify</span>
      </div>
    </div>
  );
};

export default DeploymentBadge;