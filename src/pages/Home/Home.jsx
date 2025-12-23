import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import productsData from '../../data/products.json';
import styles from './Home.module.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [shuffledProducts, setShuffledProducts] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const location = useLocation();

  // Check for payment success message
  useEffect(() => {
    if (location.state?.paymentSuccess) {
      setShowSuccessMessage(true);
      // Hide message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  }, [location.state]);

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Shuffle all products on component mount
  useEffect(() => {
    setShuffledProducts(shuffleArray(productsData));
  }, []);

  const heroSlides = [
    {
      id: 1,
      title: 'Beauty products',
      subtitle: 'Explore top sellers',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop&q=80',
      link: '/products'
    },
    {
      id: 2,
      title: 'Shop Gaming essentials',
      subtitle: '',
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&h=400&fit=crop&q=80',
      link: '/products'
    },
    {
      id: 3,
      title: 'Shop holiday gift guides',
      subtitle: '',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=400&fit=crop&q=80',
      link: '/products'
    },
    {
      id: 4,
      title: 'Shop Books',
      subtitle: 'explore titles',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&h=400&fit=crop&q=80',
      link: '/products'
    },
    {
      id: 5,
      title: 'New arrivals in Toys',
      subtitle: '',
      image: 'https://images.unsplash.com/photo-1558877385-8c1b8e6e8b8f?w=1200&h=400&fit=crop&q=80',
      link: '/products'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className={styles.home}>
      {/* Payment Success Message */}
      {showSuccessMessage && (
        <div className={styles.successBanner}>
          <div className={styles.successContent}>
            <span className={styles.successIcon}>🎉</span>
            <div className={styles.successText}>
              <h3>Payment Successful!</h3>
              <p>
                {location.state?.message || 'Your order has been confirmed and is being processed.'}
              </p>
            </div>
            <button 
              onClick={() => setShowSuccessMessage(false)}
              className={styles.closeButton}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <section className={styles.heroCarousel}>
        <div className={styles.carouselContainer}>
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
            >
              <img src={slide.image} alt={slide.title} />
              <div className={styles.slideContent}>
                <h2 className={styles.slideTitle}>{slide.title}</h2>
                {slide.subtitle && <p className={styles.slideSubtitle}>{slide.subtitle}</p>}
              </div>
            </div>
          ))}
          
          <button className={styles.prevButton} onClick={prevSlide}>
            ❮
          </button>
          <button className={styles.nextButton} onClick={nextSlide}>
            ❯
          </button>

          <div className={styles.indicators}>
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${index === currentSlide ? styles.activeIndicator : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        <div className={styles.categoryCardsOverlay}>
          <div className={styles.categoryCardsGrid}>
            <Link to="/products" className={styles.categoryBox}>
              <h3 className={styles.categoryTitle}>Electronics</h3>
              <div className={styles.categoryImageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop" 
                  alt="Electronics"
                />
              </div>
              <span className={styles.shopNowLink}>Shop now</span>
            </Link>

            <Link to="/products" className={styles.categoryBox}>
              <h3 className={styles.categoryTitle}>Discover fashion trends</h3>
              <div className={styles.categoryImageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=300&fit=crop" 
                  alt="Fashion"
                />
              </div>
              <span className={styles.shopNowLink}>Shop now</span>
            </Link>

            <Link to="/products" className={styles.categoryBox}>
              <h3 className={styles.categoryTitle}>Men's Clothing</h3>
              <div className={styles.categoryImageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&h=300&fit=crop" 
                  alt="Men's Clothing"
                />
              </div>
              <span className={styles.shopNowLink}>Shop now</span>
            </Link>

            <Link to="/products" className={styles.categoryBox}>
              <h3 className={styles.categoryTitle}>Jewelery</h3>
              <div className={styles.categoryImageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop" 
                  alt="Jewelery"
                />
              </div>
              <span className={styles.shopNowLink}>Shop now</span>
            </Link>
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className={styles.allProducts}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Popular Products</h2>
          <div className={styles.productGrid}>
            {shuffledProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
