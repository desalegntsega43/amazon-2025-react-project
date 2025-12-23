import { Link } from 'react-router-dom';
import { IoMenu } from 'react-icons/io5';
import styles from './SubNav.module.css';

const SubNav = () => {
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
    <div className={styles.subNav}>
      <div className={styles.menuContainer}>
        <div className={styles.menu}>
          <Link to="/products" className={`${styles.menuItem} ${styles.allMenu}`}>
            <IoMenu className={styles.menuIcon} />
            <span>All</span>
          </Link>
          {menuItems.slice(1).map((item, index) => (
            <Link 
              key={index} 
              to={item.path} 
              className={styles.menuItem}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubNav;
