/**
 * ALTERNATIVE APPROACH: Pure CSS Horizontal Scroll
 * This version uses only CSS without JavaScript scroll buttons
 * Better for mobile-first design with touch scrolling
 */

import { Link } from 'react-router-dom';
import styles from './SubNav.alternative.module.css';

const SubNavAlternative = () => {
  const menuItems = [
    { label: 'All', path: '/products' },
    { label: "Today's Deals", path: '/products' },
    { label: 'Prime Video', path: '/products' },
    { label: 'Registry', path: '/products' },
    { label: 'Gift Cards', path: '/products' },
    { label: 'Customer Service', path: '/products' },
    { label: 'Sell', path: '/products' },
  ];

  return (
    <nav className={styles.subNav}>
      <div className={styles.menu}>
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            to={item.path} 
            className={styles.menuItem}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default SubNavAlternative;
