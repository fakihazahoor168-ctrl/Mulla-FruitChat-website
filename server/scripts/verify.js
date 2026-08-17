const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function runTests() {
  console.log('--- STARTING BACKEND REST API ENDPOINT TESTS ---');
  let token = '';
  let testItemId = '';
  let testOrderId = '';

  try {
    // 1. Check Server is online
    console.log(`Checking API server status at: ${BASE_URL}...`);
    const homeRes = await fetch(`${BASE_URL}/`);
    if (!homeRes.ok) throw new Error('API Server is offline or not responding');
    console.log('✅ Server is ONLINE.');

    // 2. Test Admin Login
    console.log('Testing Admin Login (POST /api/admin/login)...');
    const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    
    if (!loginRes.ok) {
      const errData = await loginRes.json();
      throw new Error(`Admin login failed: ${JSON.stringify(errData)}`);
    }
    const loginData = await loginRes.json();
    token = loginData.token;
    if (!token) throw new Error('JWT Token not received');
    console.log('✅ Admin login SUCCESSFUL. JWT received.');

    // 3. Test Get Menu
    console.log('Testing Fetch Menu (GET /api/menu)...');
    const menuRes = await fetch(`${BASE_URL}/api/menu`);
    if (!menuRes.ok) throw new Error('Failed to fetch menu');
    const menuItems = await menuRes.json();
    console.log(`✅ Menu fetched. Found ${menuItems.length} menu items.`);

    // 4. Test Add Menu Item (Protected)
    console.log('Testing Create Menu Item (POST /api/menu) [Protected]...');
    const createItemRes = await fetch(`${BASE_URL}/api/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        nameEnglish: 'Verification Test Item',
        nameUrdu: 'ٹیسٹ آئٹم',
        category: 'Burgers',
        price: 299,
        isAvailable: true,
        isSpecial: true
      })
    });

    if (!createItemRes.ok) {
      const err = await createItemRes.json();
      throw new Error(`Menu item creation failed: ${JSON.stringify(err)}`);
    }
    const newItem = await createItemRes.json();
    testItemId = newItem._id;
    console.log(`✅ Menu item created. ID: ${testItemId}`);

    // 5. Test Update Menu Item (Protected)
    console.log(`Testing Update Menu Item (PUT /api/menu/${testItemId}) [Protected]...`);
    const updateItemRes = await fetch(`${BASE_URL}/api/menu/${testItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        nameEnglish: 'Verification Test Item (Updated)',
        nameUrdu: 'ٹیسٹ آئٹم (تبدیل شدہ)',
        category: 'Burgers',
        price: 349,
        isAvailable: false,
        isSpecial: false
      })
    });

    if (!updateItemRes.ok) throw new Error('Menu item update failed');
    const updatedItem = await updateItemRes.json();
    if (updatedItem.price !== 349 || updatedItem.isAvailable !== false) {
      throw new Error('Menu item updates did not match expected values');
    }
    console.log('✅ Menu item updated successfully.');

    // 6. Test Place Order
    console.log('Testing Place Order (POST /api/orders)...');
    const placeOrderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Test Customer',
        phone: '03009998877',
        address: 'House 123, Sector B, Okara',
        orderNotes: 'Verify test order notes',
        items: [
          {
            menuItemId: testItemId,
            name: 'Verification Test Item (Updated)',
            price: 349,
            quantity: 2
          }
        ],
        totalAmount: 698
      })
    });

    if (!placeOrderRes.ok) {
      const err = await placeOrderRes.json();
      throw new Error(`Order placement failed: ${JSON.stringify(err)}`);
    }
    const placedOrder = await placeOrderRes.json();
    testOrderId = placedOrder._id;
    console.log(`✅ Order placed successfully. ID: ${testOrderId}`);

    // 7. Test Fetch Orders (Protected)
    console.log('Testing Fetch Orders (GET /api/orders) [Protected]...');
    const fetchOrdersRes = await fetch(`${BASE_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!fetchOrdersRes.ok) throw new Error('Failed to fetch orders');
    const ordersList = await fetchOrdersRes.json();
    const hasOrder = ordersList.some(o => o._id === testOrderId);
    if (!hasOrder) throw new Error('Placed order not found in orders list');
    console.log(`✅ Orders list fetched. Contains placed test order.`);

    // 8. Test Update Order Status (Protected)
    console.log(`Testing Update Order Status (PUT /api/orders/${testOrderId}/status) [Protected]...`);
    const updateOrderRes = await fetch(`${BASE_URL}/api/orders/${testOrderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'Preparing' })
    });
    if (!updateOrderRes.ok) throw new Error('Failed to update order status');
    const updatedOrder = await updateOrderRes.json();
    if (updatedOrder.status !== 'Preparing') throw new Error('Status update mismatch');
    console.log('✅ Order status updated to "Preparing".');

    // 9. Clean up test order and test item
    console.log('Cleaning up verification data...');
    const deleteOrderRes = await fetch(`${BASE_URL}/api/orders/${testOrderId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!deleteOrderRes.ok) console.warn('Warning: Failed to cleanup test order');

    const deleteItemRes = await fetch(`${BASE_URL}/api/menu/${testItemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!deleteItemRes.ok) console.warn('Warning: Failed to cleanup test menu item');

    console.log('✅ Verification cleanup successful.');
    console.log('⭐️ ALL API ENDPOINT TESTS COMPLETED SUCCESSFULLY! ⭐️');
    process.exit(0);

  } catch (error) {
    console.error('❌ VERIFICATION TEST FAILED:', error.message);
    process.exit(1);
  }
}

runTests();
