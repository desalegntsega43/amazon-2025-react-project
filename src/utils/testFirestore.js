// Firestore Testing Utility
// Use this to test your Firebase/Firestore connection

export const testFirestoreConnection = async () => {
  console.log('🧪 Testing Firestore Connection...');
  
  try {
    // Check environment variables
    const requiredEnvVars = [
      'REACT_APP_FIREBASE_API_KEY',
      'REACT_APP_FIREBASE_AUTH_DOMAIN',
      'REACT_APP_FIREBASE_PROJECT_ID',
      'REACT_APP_FIREBASE_STORAGE_BUCKET',
      'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
      'REACT_APP_FIREBASE_APP_ID'
    ];

    const missingVars = requiredEnvVars.filter(envVar => 
      !process.env[envVar] || process.env[envVar].includes('your-') || process.env[envVar].includes('REPLACE')
    );

    if (missingVars.length > 0) {
      console.error('❌ Missing or placeholder environment variables:', missingVars);
      console.log('📝 Please update your .env file with actual Firebase values');
      return { success: false, error: 'Environment variables not configured' };
    }

    console.log('✅ Environment variables loaded');
    console.log('🔥 Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);

    // Test Firebase initialization
    const { db } = await import('../firebase/config');
    console.log('✅ Firebase initialized successfully');

    // Test Firestore write
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    
    const testData = {
      message: 'Firestore connection test',
      timestamp: serverTimestamp(),
      testId: Math.random().toString(36).substr(2, 9)
    };

    console.log('📝 Testing Firestore write...');
    const docRef = await addDoc(collection(db, 'test'), testData);
    console.log('✅ Test document written with ID:', docRef.id);

    // Test Firestore read
    const { doc, getDoc } = await import('firebase/firestore');
    console.log('📖 Testing Firestore read...');
    const docSnap = await getDoc(doc(db, 'test', docRef.id));
    
    if (docSnap.exists()) {
      console.log('✅ Test document read successfully:', docSnap.data());
    } else {
      console.log('❌ Test document not found');
    }

    // Clean up test document
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'test', docRef.id));
    console.log('🧹 Test document cleaned up');

    console.log('🎉 Firestore connection test completed successfully!');
    return { success: true, projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID };

  } catch (error) {
    console.error('❌ Firestore connection test failed:', error);
    
    // Provide specific error guidance
    if (error.code === 'permission-denied') {
      console.log('💡 Fix: Update your Firestore security rules to allow writes');
    } else if (error.code === 'not-found') {
      console.log('💡 Fix: Make sure Firestore database is created in Firebase Console');
    } else if (error.message.includes('API key')) {
      console.log('💡 Fix: Check your Firebase API key in .env file');
    } else if (error.message.includes('project')) {
      console.log('💡 Fix: Verify your Firebase project ID in .env file');
    }

    return { success: false, error: error.message };
  }
};

// Test order creation specifically
export const testOrderCreation = async (userId = 'test-user') => {
  console.log('🛒 Testing Order Creation...');
  
  try {
    const { orderService } = await import('../services/orderService');
    
    const testOrder = {
      userId: userId,
      basket: [
        {
          id: 1,
          title: 'Test Product',
          price: 29.99,
          quantity: 1,
          image: 'https://via.placeholder.com/100x100?text=Test'
        }
      ],
      amount: 2999, // $29.99 in cents
      stripeTransactionId: 'test_' + Date.now(),
      totals: {
        subtotal: 29.99,
        shipping: 0,
        tax: 2.40,
        total: 32.39
      }
    };

    const result = await orderService.saveOrder(testOrder);
    
    if (result.success) {
      console.log('✅ Test order created successfully:', result.orderId);
      console.log('🔥 Using:', result.isFirestore ? 'Firestore' : 'localStorage');
      return { success: true, orderId: result.orderId, isFirestore: result.isFirestore };
    } else {
      console.error('❌ Test order creation failed:', result.error);
      return { success: false, error: result.error };
    }

  } catch (error) {
    console.error('❌ Order creation test failed:', error);
    return { success: false, error: error.message };
  }
};

// Run all tests
export const runAllTests = async () => {
  console.log('🚀 Running All Firestore Tests...\n');
  
  const connectionTest = await testFirestoreConnection();
  console.log('\n' + '='.repeat(50) + '\n');
  
  const orderTest = await testOrderCreation();
  console.log('\n' + '='.repeat(50) + '\n');
  
  const results = {
    connection: connectionTest,
    orders: orderTest,
    overall: connectionTest.success && orderTest.success
  };
  
  if (results.overall) {
    console.log('🎉 ALL TESTS PASSED! Your Firestore setup is working correctly.');
    console.log('✅ Ready for production deployment!');
  } else {
    console.log('❌ Some tests failed. Please check the errors above.');
    console.log('📚 See FIRESTORE_TROUBLESHOOTING.md for help');
  }
  
  return results;
};

// Usage in browser console:
// import { runAllTests } from './utils/testFirestore';
// runAllTests();