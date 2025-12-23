// Order service for managing orders with Firestore integration
// Automatically falls back to localStorage if Firebase is not configured

export const orderService = {
  // Save order to Firestore after successful payment
  async saveOrder(orderData) {
    try {
      // Check if Firebase is properly configured
      if (!process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID === 'your-project-id') {
        console.log('🔄 Firebase not configured, using localStorage');
        return this.saveOrderToLocalStorage(orderData);
      }

      // Use real Firestore when configured
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../firebase/config');
      
      console.log('☁️ Saving order to Firestore...');
      
      const order = {
        ...orderData,
        created: Math.floor(Date.now() / 1000), // Unix timestamp
        createdAt: serverTimestamp(),
        status: 'delivered',
        paymentStatus: 'paid'
      };

      // Save to Firestore: users/{userId}/orders/{orderId}
      const ordersRef = collection(db, 'users', orderData.userId, 'orders');
      const docRef = await addDoc(ordersRef, order);
      
      console.log('✅ Order saved to Firestore with ID:', docRef.id);
      
      return {
        success: true,
        orderId: docRef.id,
        isFirestore: true
      };
      
    } catch (error) {
      console.error('❌ Error saving order to Firestore:', error);
      console.log('🔄 Falling back to localStorage');
      
      // Fallback to localStorage on error
      return this.saveOrderToLocalStorage(orderData);
    }
  },

  // Fallback method: Save to localStorage
  async saveOrderToLocalStorage(orderData) {
    try {
      const order = {
        ...orderData,
        created: Math.floor(Date.now() / 1000), // Unix timestamp
        createdAt: new Date().toISOString(),
        status: 'delivered',
        paymentStatus: 'paid',
        id: 'order_' + Math.random().toString(36).substr(2, 9)
      };

      // Get existing orders for this user
      const userId = orderData.userId;
      const existingOrders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
      
      // Add new order
      existingOrders.unshift(order); // Add to beginning (newest first)
      
      // Save back to localStorage
      localStorage.setItem(`orders_${userId}`, JSON.stringify(existingOrders));
      
      console.log('✅ Order saved to localStorage with ID:', order.id);
      
      return {
        success: true,
        orderId: order.id,
        isFirestore: false
      };
    } catch (error) {
      console.error('❌ Error saving order to localStorage:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get order by ID
  async getOrder(orderId, userId) {
    try {
      // Check if Firebase is configured
      if (!process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID === 'your-project-id') {
        // Use localStorage
        const orders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
        const order = orders.find(o => o.id === orderId);
        
        return order ? { success: true, order } : { success: false, error: 'Order not found' };
      }

      // Use Firestore
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase/config');
      
      const orderDoc = await getDoc(doc(db, 'users', userId, 'orders', orderId));
      
      if (orderDoc.exists()) {
        return {
          success: true,
          order: { id: orderDoc.id, ...orderDoc.data() }
        };
      } else {
        return {
          success: false,
          error: 'Order not found'
        };
      }
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get all orders for a user
  async getUserOrders(userId) {
    try {
      // Check if Firebase is configured
      if (!process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID === 'your-project-id') {
        // Use localStorage
        const orders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
        return { success: true, orders };
      }

      // Use Firestore
      const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
      const { db } = await import('../firebase/config');
      
      const ordersRef = collection(db, 'users', userId, 'orders');
      const q = query(ordersRef, orderBy('created', 'desc'));
      const snapshot = await getDocs(q);
      
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { success: true, orders };
    } catch (error) {
      console.error('❌ Error fetching user orders:', error);
      return {
        success: false,
        error: error.message,
        orders: []
      };
    }
  }
};