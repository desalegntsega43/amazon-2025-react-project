import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ReactCountryFlag from 'react-country-flag';
import { IoLocationOutline } from 'react-icons/io5';
import { IoSearchOutline } from 'react-icons/io5';
import { IoCartOutline } from 'react-icons/io5';
import { IoChevronDown } from 'react-icons/io5';
import styles from './Header.module.css';

const Header = () => {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const [searchCategory, setSearchCategory] = useState('All Departments');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality can be implemented here
  };

  const categories = [
    { value: 'All Departments', label: 'All Departments' },
    { value: 'Arts & Crafts', label: 'Arts & Crafts' },
    { value: 'Automotive', label: 'Automotive' },
    { value: 'Baby', label: 'Baby' },
    { value: 'Beauty & Personal Care', label: 'Beauty & Personal Care' },
    { value: 'Books', label: 'Books' },
    { value: "Boys' Fashion", label: "Boys' Fashion" },
    { value: 'Computers', label: 'Computers' },
    { value: 'Deals', label: 'Deals' },
    { value: 'Digital Music', label: 'Digital Music' },
    { value: 'Electronics', label: 'Electronics' },
    { value: "Girls' Fashion", label: "Girls' Fashion" },
    { value: 'Health & Household', label: 'Health & Household' },
    { value: 'Home & Kitchen', label: 'Home & Kitchen' },
    { value: 'Industrial & Scientific', label: 'Industrial & Scientific' },
    { value: 'Kindle Store', label: 'Kindle Store' },
    { value: 'Luggage', label: 'Luggage' },
    { value: "Men's Fashion", label: "Men's Fashion" },
    { value: 'Movies & TV', label: 'Movies & TV' },
    { value: 'Music, CDs & Vinyl', label: 'Music, CDs & Vinyl' },
    { value: 'Pet Supplies', label: 'Pet Supplies' },
    { value: 'Sports & Outdoors', label: 'Sports & Outdoors' },
    { value: 'Tools & Home Improvement', label: 'Tools & Home Improvement' },
    { value: 'Toys & Games', label: 'Toys & Games' },
    { value: 'Video Games', label: 'Video Games' },
    { value: "Women's Fashion", label: "Women's Fashion" }
  ];

  // Get display text for the select button
  const getDisplayText = () => {
    if (searchCategory === 'All Departments') return 'All';
    return searchCategory;
  };

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
            alt="Amazon"
            className={styles.logoImage}
          />
        </Link>

        {/* Deliver to */}
        <div className={styles.deliver}>
          <IoLocationOutline className={styles.locationIcon} />
          <div className={styles.deliverInfo}>
            <span className={styles.deliverLabel}>Deliver to</span>
            <span className={styles.deliverCountry}>Ethiopia</span>
          </div>
        </div>

        {/* Search Bar */}
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <div className={styles.selectWrapper}>
            <span className={styles.selectDisplay}>{getDisplayText()}</span>
            <select 
              className={styles.searchCategory}
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <IoChevronDown className={styles.selectArrow} />
          </div>
          <input
            type="text"
            placeholder="Search Amazon"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <IoSearchOutline />
          </button>
        </form>

        {/* Language Selector */}
        <div className={styles.language}>
          <ReactCountryFlag 
            countryCode="GB" 
            svg
            className={styles.flag}
            style={{
              width: '1.5em',
              height: '1.5em',
            }}
          />
          <span className={styles.langText}>EN</span>
          <IoChevronDown className={styles.dropdownArrow} />
        </div>

        {/* Account & Lists */}
        <div 
          className={styles.account}
          onMouseEnter={() => user && setShowAccountMenu(true)}
          onMouseLeave={() => setShowAccountMenu(false)}
        >
          {user ? (
            <div 
              className={styles.accountLink}
              onClick={() => setShowAccountMenu(!showAccountMenu)}
            >
              <span className={styles.accountGreeting}>Hello, {user.username}</span>
              <div className={styles.accountMain}>
                <span className={styles.accountText}>Account & Lists</span>
                <IoChevronDown className={styles.dropdownArrow} />
              </div>
            </div>
          ) : (
            <Link to="/auth" className={styles.accountLink}>
              <span className={styles.accountGreeting}>Hello, sign in</span>
              <div className={styles.accountMain}>
                <span className={styles.accountText}>Account & Lists</span>
                <IoChevronDown className={styles.dropdownArrow} />
              </div>
            </Link>
          )}

          {showAccountMenu && user && (
            <div className={styles.accountDropdown}>
              <Link to="/account" className={styles.dropdownLink}>
                Your Account
              </Link>
              <Link to="/orders" className={styles.dropdownLink}>
                Your Orders
              </Link>
              <div className={styles.divider}></div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                  setShowAccountMenu(false);
                  navigate('/auth');
                }}
                className={styles.logoutButton}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Returns & Orders */}
        <Link to="/orders" className={styles.returns}>
          <span className={styles.returnsLabel}>Returns</span>
          <span className={styles.returnsMain}>& Orders</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className={styles.cart}>
          <div className={styles.cartIconWrapper}>
            <IoCartOutline className={styles.cartIcon} />
            <span className={styles.cartCount}>{getCartCount()}</span>
          </div>
          <span className={styles.cartText}>Cart</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
