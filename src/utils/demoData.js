// Demo data utilities for testing the application

export const createDemoOrder = (userId) => {
  const demoOrder = {
    id: 'demo_order_' + Math.random().toString(36).substr(2, 9),
    amount: 129997, // $1299.97 in cents
    basket: [
      {
        id: 1,
        title: "Apple iPhone 15 Pro - 128GB",
        price: 999.99,
        quantity: 1,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop"
      },
      {
        id: 2,
        title: "Samsung Galaxy Buds Pro - Wireless Earbuds",
        price: 199.99,
        quantity: 1,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop"
      },
      {
        id: 3,
        title: "Apple Watch Series 9 - 45mm",
        price: 399.99,
        quantity: 1,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300&h=300&fit=crop"
      }
    ],
    created: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 7), // Random time within last week
    status: "delivered",
    userId: userId,
    totals: {
      subtotal: 1599.97,
      shipping: 0,
      tax: 127.99,
      total: 1727.96
    },
    paymentMethod: {
      type: 'card',
      last4: '4242',
      cardName: 'Demo User'
    }
  };

  // Save to localStorage
  const existingOrders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
  existingOrders.unshift(demoOrder);
  localStorage.setItem(`orders_${userId}`, JSON.stringify(existingOrders));
  
  console.log('✅ Demo order created for user:', userId);
  return demoOrder;
};

export const clearDemoOrders = (userId) => {
  localStorage.removeItem(`orders_${userId}`);
  console.log('🧹 Demo orders cleared for user:', userId);
};