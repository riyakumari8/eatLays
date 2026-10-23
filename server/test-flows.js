const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting eatLays automated end-to-end integration tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`).then((r) => r.json());
    assert(healthRes.status === 'UP' && healthRes.database === 'CONNECTED', 'Backend /api/health responds UP and PostgreSQL CONNECTED');

    // 2. Student Registration
    const studentEmail = `student.test.${Date.now()}@campus.edu`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Lee',
        email: studentEmail,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: 'ADMIN', // Attacker attempts privilege escalation to ADMIN
      }),
    }).then((r) => r.json());

    assert(regRes.success === true, 'Student registration succeeds');
    assert(regRes.data?.user?.role === 'STUDENT', 'Public registration strictly enforces STUDENT role (prevents escalation to ADMIN)');
    const student1Token = regRes.data?.token;

    // 3. Student Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentEmail,
        password: 'Password123!',
      }),
    }).then((r) => r.json());

    assert(loginRes.success === true && loginRes.data?.token, 'Student login succeeds and returns valid JWT token');

    // 4. Fetch Outlets
    const outletsRes = await fetch(`${BASE_URL}/outlets`).then((r) => r.json());
    assert(outletsRes.success === true && outletsRes.data.length >= 4, 'Outlets retrieved from PostgreSQL (4 canteens found)');
    const centralOutlet = outletsRes.data.find((o) => o.name.includes('Central'));
    const northOutlet = outletsRes.data.find((o) => o.name.includes('North'));

    // 5. Fetch Menu
    const menuRes = await fetch(`${BASE_URL}/outlets/${centralOutlet.id}`).then((r) => r.json());
    assert(menuRes.success === true && menuRes.data.menuItems.length > 0, 'Central Canteen menu and items retrieved');
    const dosaItem = menuRes.data.menuItems.find((i) => i.name.includes('Dosa'));
    const idliItem = menuRes.data.menuItems.find((i) => i.name.includes('Idli'));

    // Fetch North Canteen item to test multi-outlet rejection
    const northMenuRes = await fetch(`${BASE_URL}/outlets/${northOutlet.id}`).then((r) => r.json());
    const wrapItem = northMenuRes.data.menuItems[0];

    // 6. Test Single-Outlet Constraint (Attempt adding item from North outlet to Central order)
    const multiOutletRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({
        outletId: centralOutlet.id,
        items: [
          { menuItemId: dosaItem.id, quantity: 1 },
          { menuItemId: wrapItem.id, quantity: 1 }, // from North!
        ],
      }),
    }).then((r) => r.json());

    assert(multiOutletRes.success === false, 'Server rejects orders containing items from different outlets');

    // 7. Create Valid Order & verify server-side calculated totals and price snapshots
    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({
        outletId: centralOutlet.id,
        specialInstructions: 'Pack coconut chutney separately',
        items: [
          { menuItemId: dosaItem.id, quantity: 2 },
          { menuItemId: idliItem.id, quantity: 1 },
        ],
      }),
    }).then((r) => r.json());

    const expectedTotal = Number(dosaItem.price) * 2 + Number(idliItem.price) * 1;
    assert(orderRes.success === true, 'Student pre-order created successfully in database transaction');
    assert(
      Number(orderRes.data?.total) === expectedTotal,
      `Authoritative total calculated on server (₹${orderRes.data?.total} === ₹${expectedTotal})`
    );
    assert(orderRes.data?.pickupCode && orderRes.data?.pickupCode.length === 4, 'Unique 4-digit counter pickup token generated');
    assert(
      orderRes.data?.items?.[0]?.itemNameSnapshot && orderRes.data?.items?.[0]?.unitPriceSnapshot,
      'Order preserves immutable item name and unit price snapshot'
    );

    const createdOrderId = orderRes.data.id;

    // 8. Register Student 2 and test unauthorized access
    const student2Res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sam Wilson',
        email: `student2.${Date.now()}@campus.edu`,
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }),
    }).then((r) => r.json());
    const student2Token = student2Res.data.token;

    // Student 2 attempts to fetch Student 1's order
    const unauthorizedOrderRes = await fetch(`${BASE_URL}/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${student2Token}` },
    });
    assert(unauthorizedOrderRes.status === 403, 'Cross-student order access forbidden (403)');

    // 9. Vendor Login (Vendor 2 - North Block)
    const vendor2Login = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vendor.north@campus.edu',
        password: 'Vendor123!',
      }),
    }).then((r) => r.json());

    // Vendor 2 attempts to update Central Canteen's order status
    const unauthorizedVendorUpdate = await fetch(`${BASE_URL}/vendor/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vendor2Login.data.token}`,
      },
      body: JSON.stringify({ status: 'ACCEPTED' }),
    });
    assert(unauthorizedVendorUpdate.status === 403, 'Vendor cannot modify orders belonging to another outlet (403)');

    // 10. Vendor 1 (Central Canteen) logs in
    const vendor1Login = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vendor.central@campus.edu',
        password: 'Vendor123!',
      }),
    }).then((r) => r.json());
    const vendor1Token = vendor1Login.data.token;

    // 11. State Machine: PLACED -> ACCEPTED
    const acceptRes = await fetch(`${BASE_URL}/vendor/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vendor1Token}`,
      },
      body: JSON.stringify({ status: 'ACCEPTED' }),
    }).then((r) => r.json());
    assert(acceptRes.success === true && acceptRes.data.status === 'ACCEPTED', 'Vendor transitions order from PLACED -> ACCEPTED');

    // 12. State Machine: ACCEPTED -> PREPARING
    const prepRes = await fetch(`${BASE_URL}/vendor/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vendor1Token}`,
      },
      body: JSON.stringify({ status: 'PREPARING' }),
    }).then((r) => r.json());
    assert(prepRes.success === true && prepRes.data.status === 'PREPARING', 'Vendor transitions order from ACCEPTED -> PREPARING');

    // 13. State Machine: PREPARING -> READY
    const readyRes = await fetch(`${BASE_URL}/vendor/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vendor1Token}`,
      },
      body: JSON.stringify({ status: 'READY' }),
    }).then((r) => r.json());
    assert(readyRes.success === true && readyRes.data.status === 'READY', 'Vendor transitions order from PREPARING -> READY for pickup');

    // 14. Student checks order tracking and sees READY
    const studentTrackRes = await fetch(`${BASE_URL}/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${student1Token}` },
    }).then((r) => r.json());
    assert(studentTrackRes.data?.status === 'READY', 'Student order tracking reflects live status change (READY)');

    // 15. Vendor marks COMPLETED upon counter pickup
    const completeRes = await fetch(`${BASE_URL}/vendor/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vendor1Token}`,
      },
      body: JSON.stringify({ status: 'COMPLETED' }),
    }).then((r) => r.json());
    assert(completeRes.success === true && completeRes.data.status === 'COMPLETED', 'Vendor marks order COMPLETED after counter verification');

    // 16. State Machine: Invalid transition test (COMPLETED -> PLACED)
    const invalidJump = await fetch(`${BASE_URL}/vendor/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vendor1Token}`,
      },
      body: JSON.stringify({ status: 'PLACED' }),
    });
    assert(invalidJump.status === 400, 'Invalid state machine rollback prevented (400)');

    // 17. Admin Login & Stats Verification
    const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@campus.edu',
        password: 'Admin123!',
      }),
    }).then((r) => r.json());

    const adminStats = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminLogin.data.token}` },
    }).then((r) => r.json());

    assert(adminStats.success === true && adminStats.data.totalOrders > 0, 'Admin analytics aggregates live database metrics');

    console.log(`\n===============================================`);
    console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`===============================================`);

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
