import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createDemoOrder, clearDemoOrders } from "../../utils/demoData";
import styles from "./Orders.module.css";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Load orders from Firestore (currently localStorage for demo)
  const fetchOrdersFromFirestore = async () => {
    try {
      // Check if Firebase is properly configured
      if (!process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID === 'your-project-id') {
        console.log('🔄 Firebase not configured, using localStorage');
        // Fallback to localStorage
        const userOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
        return userOrders.map((order) => ({
          id: order.id || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          items: order.basket || [],
          totalAmount: order.amount || 0,
          stripeTransactionId: order.id,
          timestamp: order.created || Math.floor(Date.now() / 1000),
          status: order.status || 'delivered',
          paymentStatus: 'paid',
          createdAt: new Date(order.created * 1000).toISOString(),
          billingAddress: order.address,
          paymentMethod: order.paymentMethod,
          totals: order.totals
        }));
      }

      // Use real Firestore when configured
      const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
      const { db } = await import('../../firebase/config');
      
      console.log('☁️ Fetching orders from Firestore...');
      
      const ordersRef = collection(db, 'users', user.id, 'orders');
      const q = query(ordersRef, orderBy('created', 'desc'));
      const snapshot = await getDocs(q);
      
      const firestoreOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        userId: user.id,
        items: doc.data().basket || [],
        totalAmount: doc.data().amount || 0,
        stripeTransactionId: doc.data().stripeTransactionId || doc.id,
        timestamp: doc.data().created || Math.floor(Date.now() / 1000),
        status: doc.data().status || 'delivered',
        paymentStatus: doc.data().paymentStatus || 'paid',
        createdAt: doc.data().createdAt || new Date().toISOString(),
        billingAddress: doc.data().address,
        paymentMethod: doc.data().paymentMethod,
        totals: doc.data().totals
      }));
      
      console.log(`✅ Loaded ${firestoreOrders.length} orders from Firestore`);
      return firestoreOrders;
      
    } catch (error) {
      console.error('❌ Error fetching orders from Firestore:', error);
      console.log('🔄 Falling back to localStorage');
      
      // Fallback to localStorage on error
      const userOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
      return userOrders.map((order) => ({
        id: order.id || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        items: order.basket || [],
        totalAmount: order.amount || 0,
        stripeTransactionId: order.id,
        timestamp: order.created || Math.floor(Date.now() / 1000),
        status: order.status || 'delivered',
        paymentStatus: 'paid',
        createdAt: new Date(order.created * 1000).toISOString(),
        billingAddress: order.address,
        paymentMethod: order.paymentMethod,
        totals: order.totals
      }));
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      let fetchedOrders = await fetchOrdersFromFirestore();
      
      // Apply status filter
      if (filterStatus !== 'all') {
        fetchedOrders = fetchedOrders.filter(order => 
          order.status.toLowerCase() === filterStatus
        );
      }
      
      // Apply sorting
      fetchedOrders.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return b.timestamp - a.timestamp;
          case 'oldest':
            return a.timestamp - b.timestamp;
          case 'highest':
            return b.totalAmount - a.totalAmount;
          case 'lowest':
            return a.totalAmount - b.totalAmount;
          default:
            return 0;
        }
      });
      
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle demo order creation (development only)
  const handleCreateDemoOrder = () => {
    if (user) {
      createDemoOrder(user.id);
      loadOrders(); // Refresh orders after creating demo
    }
  };

  const handleClearOrders = () => {
    if (user) {
      clearDemoOrders(user.id);
      setOrders([]);
    }
  };

  // Toggle order details expansion
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Get status display properties
  const getStatusDisplay = (status) => {
    const statusMap = {
      'paid': { icon: '✅', color: '#28a745', label: 'Paid' },
      'shipped': { icon: '🚚', color: '#007bff', label: 'Shipped' },
      'delivered': { icon: '📦', color: '#28a745', label: 'Delivered' },
      'processing': { icon: '⏳', color: '#ffc107', label: 'Processing' },
      'cancelled': { icon: '❌', color: '#dc3545', label: 'Cancelled' }
    };
    return statusMap[status.toLowerCase()] || statusMap['delivered'];
  };

  // Calculate order statistics
  const getOrderStats = () => {
    const allOrders = JSON.parse(localStorage.getItem(`orders_${user?.id}`) || '[]');
    const totalOrders = allOrders.length;
    const totalSpent = allOrders.reduce((sum, order) => sum + (order.amount || 0), 0) / 100;
    const avgOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    return { totalOrders, totalSpent, avgOrder };
  };

  // Load orders when component mounts or dependencies change
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadOrders();
  }, [user, filterStatus, sortBy]);

  // Loading state
  if (loading) {
    return (
      <div className={styles.orders}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your order history...</p>
        </div>
      </div>
    );
  }

  const stats = getOrderStats();

  return (
    <div className={styles.orders}>
      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>My Orders</h1>
          <p className={styles.pageSubtitle}>
            View your complete purchase history and order details
          </p>
        </div>

        {/* Order Statistics Dashboard */}
        {stats.totalOrders > 0 && (
          <div className={styles.statsSection}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.totalOrders}</span>
              <span className={styles.statLabel}>Total Orders</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>${stats.totalSpent.toFixed(2)}</span>
              <span className={styles.statLabel}>Total Spent</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>${stats.avgOrder.toFixed(2)}</span>
              <span className={styles.statLabel}>Average Order</span>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        {stats.totalOrders > 0 && (
          <div className={styles.controlsBar}>
            <div className={styles.filterGroup}>
              <label>Filter by Status:</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Orders</option>
                <option value="delivered">Delivered</option>
                <option value="shipped">Shipped</option>
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className={styles.sortGroup}>
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>
        )}

        {/* Development Demo Controls */}
        {process.env.NODE_ENV === 'development' && (
          <div className={styles.devControls}>
            <button onClick={handleCreateDemoOrder} className={styles.demoBtn}>
              + Create Demo Order
            </button>
            <button onClick={handleClearOrders} className={styles.clearBtn}>
              Clear All Orders
            </button>
          </div>
        )}

        {/* Orders List or Empty State */}
        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <h3 className={styles.emptyTitle}>
              {filterStatus === 'all' ? 'You have no past orders yet' : `No ${filterStatus} orders found`}
            </h3>
            <p className={styles.emptyMessage}>
              {filterStatus === 'all' 
                ? 'When you make your first purchase, your order history will appear here.'
                : `You don't have any ${filterStatus} orders. Try adjusting your filter.`
              }
            </p>
            {filterStatus === 'all' && (
              <Link to="/products" className={styles.shopNowBtn}>
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.ordersContainer}>
            <div className={styles.ordersHeader}>
              <h2>Order History ({orders.length} {orders.length === 1 ? 'order' : 'orders'})</h2>
            </div>
            
            <div className={styles.ordersList}>
              {orders.map((order) => {
                const statusDisplay = getStatusDisplay(order.status);
                const isExpanded = expandedOrder === order.id;
                
                return (
                  <div key={order.id} className={styles.orderCard}>
                    {/* Order Summary Header */}
                    <div className={styles.orderSummary}>
                      <div className={styles.orderBasicInfo}>
                        <div className={styles.orderDate}>
                          <strong>Order placed:</strong> {' '}
                          {new Date(order.timestamp * 1000).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className={styles.orderTotal}>
                          <strong>Total:</strong> ${(order.totalAmount / 100).toFixed(2)}
                        </div>
                        <div className={styles.orderStatus} style={{ color: statusDisplay.color }}>
                          {statusDisplay.icon} {statusDisplay.label}
                        </div>
                      </div>
                      
                      <div className={styles.orderActions}>
                        <div className={styles.orderId}>
                          <small>Order ID: {order.id}</small>
                          <button 
                            className={styles.copyBtn}
                            onClick={() => navigator.clipboard.writeText(order.id)}
                            title="Copy Order ID"
                          >
                            📋
                          </button>
                        </div>
                        <button 
                          className={styles.expandBtn}
                          onClick={() => toggleOrderDetails(order.id)}
                        >
                          {isExpanded ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Order Details */}
                    {isExpanded && (
                      <div className={styles.orderDetails}>
                        <h4>Items Purchased ({order.items.length})</h4>
                        <div className={styles.itemsList}>
                          {order.items.map((item, index) => (
                            <div key={index} className={styles.orderItem}>
                              <div className={styles.itemImage}>
                                <img 
                                  src={item.image || 'https://via.placeholder.com/60x60?text=Item'} 
                                  alt={item.title || item.name}
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/60x60?text=Item';
                                  }}
                                />
                              </div>
                              <div className={styles.itemInfo}>
                                <h5>{item.title || item.name}</h5>
                                <div className={styles.itemMeta}>
                                  <span className={styles.itemPrice}>${item.price}</span>
                                  {item.quantity && (
                                    <span className={styles.itemQty}>Qty: {item.quantity}</span>
                                  )}
                                </div>
                                {item.rating && (
                                  <div className={styles.itemRating}>
                                    {'⭐'.repeat(Math.floor(item.rating))} ({item.rating})
                                  </div>
                                )}
                              </div>
                              <div className={styles.itemActions}>
                                <button className={styles.buyAgainBtn}>Buy Again</button>
                                <button className={styles.reviewBtn}>Write Review</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Order Actions */}
                        <div className={styles.orderActionButtons}>
                          <button className={styles.primaryBtn}>View Invoice</button>
                          <button className={styles.secondaryBtn}>Track Package</button>
                          <button className={styles.secondaryBtn}>Return Items</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;