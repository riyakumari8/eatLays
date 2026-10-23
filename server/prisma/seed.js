import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting eatLays database seed...');

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const studentPasswordHash = await bcrypt.hash('Student123!', salt);
  const vendorPasswordHash = await bcrypt.hash('Vendor123!', salt);
  const adminPasswordHash = await bcrypt.hash('Admin123!', salt);

  // 1. Seed Users (Upsert to be safely repeatable)
  console.log('👤 Seeding demo users...');

  const student1 = await prisma.user.upsert({
    where: { email: 'student@campus.edu' },
    update: {},
    create: {
      name: 'Alex Rivera',
      email: 'student@campus.edu',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'priya@campus.edu' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'priya@campus.edu',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
    },
  });

  const vendor1 = await prisma.user.upsert({
    where: { email: 'vendor.central@campus.edu' },
    update: {},
    create: {
      name: 'Chef Rajan',
      email: 'vendor.central@campus.edu',
      passwordHash: vendorPasswordHash,
      role: 'VENDOR',
    },
  });

  const vendor2 = await prisma.user.upsert({
    where: { email: 'vendor.north@campus.edu' },
    update: {},
    create: {
      name: 'Gurpreet Singh',
      email: 'vendor.north@campus.edu',
      passwordHash: vendorPasswordHash,
      role: 'VENDOR',
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@campus.edu' },
    update: {},
    create: {
      name: 'Campus Dining Director',
      email: 'admin@campus.edu',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  console.log('🏪 Seeding campus outlets...');

  // 2. Outlets
  const centralOutlet = await prisma.outlet.upsert({
    where: { id: 'outlet-central-01' },
    update: {},
    create: {
      id: 'outlet-central-01',
      name: 'Central Food Court',
      description: 'The primary dining hub on campus. Fresh South Indian tiffins, satisfying rice bowls, and sizzling hot plates.',
      location: 'Student Activity Center, Level 1 (Counter 3 & 4)',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      isOpen: true,
      acceptsOrders: true,
    },
  });

  const northOutlet = await prisma.outlet.upsert({
    where: { id: 'outlet-north-02' },
    update: {},
    create: {
      id: 'outlet-north-02',
      name: 'North Block Tuck Shop',
      description: 'Quick-fire counter for students between lecture blocks. Crispy paneer wraps, toasties, and energy rolls.',
      location: 'Engineering & IT Quad, Block 3 Ground Concourse',
      imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
      isOpen: true,
      acceptsOrders: true,
    },
  });

  const scienceCafe = await prisma.outlet.upsert({
    where: { id: 'outlet-science-03' },
    update: {},
    create: {
      id: 'outlet-science-03',
      name: 'Science Cafe & Juice Bar',
      description: 'Cold-pressed seasonal juices, wholesome protein salads, artisanal coffee, and fresh fruit bowls.',
      location: 'Bio-Sciences Concourse, Ground Floor Garden View',
      imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&auto=format&fit=crop&q=80',
      isOpen: true,
      acceptsOrders: true,
    },
  });

  const nightOwl = await prisma.outlet.upsert({
    where: { id: 'outlet-night-04' },
    update: {},
    create: {
      id: 'outlet-night-04',
      name: 'Night Owl Maggi & Chai Point',
      description: 'Campus comfort food headquarters. Loaded butter masala Maggi, cheese buns, kulhad masala chai, and crispy pakoras.',
      location: 'Hostel Zone B, Near Sports Complex Gazebo',
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      isOpen: true,
      acceptsOrders: true,
    },
  });

  // 3. Link Vendors to Outlets
  await prisma.vendorOutlet.upsert({
    where: { userId_outletId: { userId: vendor1.id, outletId: centralOutlet.id } },
    update: {},
    create: {
      userId: vendor1.id,
      outletId: centralOutlet.id,
    },
  });

  await prisma.vendorOutlet.upsert({
    where: { userId_outletId: { userId: vendor2.id, outletId: northOutlet.id } },
    update: {},
    create: {
      userId: vendor2.id,
      outletId: northOutlet.id,
    },
  });

  // 4. Categories
  console.log('📂 Seeding menu categories...');
  const catTiffins = await prisma.category.upsert({
    where: { id: 'cat-tiffins' },
    update: {},
    create: { id: 'cat-tiffins', name: 'South Indian Tiffins', outletId: centralOutlet.id },
  });

  const catMeals = await prisma.category.upsert({
    where: { id: 'cat-meals' },
    update: {},
    create: { id: 'cat-meals', name: 'Rice Bowls & Thalis', outletId: centralOutlet.id },
  });

  const catWraps = await prisma.category.upsert({
    where: { id: 'cat-wraps' },
    update: {},
    create: { id: 'cat-wraps', name: 'Wraps & Sandwiches', outletId: northOutlet.id },
  });

  const catSnacks = await prisma.category.upsert({
    where: { id: 'cat-snacks' },
    update: {},
    create: { id: 'cat-snacks', name: 'Crispy Snacks & Chaat', outletId: northOutlet.id },
  });

  const catJuices = await prisma.category.upsert({
    where: { id: 'cat-juices' },
    update: {},
    create: { id: 'cat-juices', name: 'Fresh Juices & Smoothies', outletId: scienceCafe.id },
  });

  const catCoffee = await prisma.category.upsert({
    where: { id: 'cat-coffee' },
    update: {},
    create: { id: 'cat-coffee', name: 'Coffee & Coolers', outletId: scienceCafe.id },
  });

  const catMaggi = await prisma.category.upsert({
    where: { id: 'cat-maggi' },
    update: {},
    create: { id: 'cat-maggi', name: 'Maggi & Comfort Bowls', outletId: nightOwl.id },
  });

  const catChai = await prisma.category.upsert({
    where: { id: 'cat-chai' },
    update: {},
    create: { id: 'cat-chai', name: 'Hot Chai & Bun Maska', outletId: nightOwl.id },
  });

  // 5. Menu Items
  console.log('🍛 Seeding delicious menu items...');

  const menuItems = [
    // Central Food Court - Tiffins
    {
      id: 'item-dosa-01',
      outletId: centralOutlet.id,
      categoryId: catTiffins.id,
      name: 'Crispy Butter Masala Dosa',
      description: 'Golden fermented crepe roasted in amul butter, stuffed with spiced potato mash, served with sambar & coconut chutney.',
      imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
      price: 65.0,
      prepTimeMinutes: 8,
      stockQuantity: 40,
      isAvailable: true,
    },
    {
      id: 'item-idli-02',
      outletId: centralOutlet.id,
      categoryId: catTiffins.id,
      name: 'Steamed Idli Vada Combo',
      description: 'Pair of pillowy soft steamed rice cakes and a crispy spiced medu vada with hot lentil stew.',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      price: 45.0,
      prepTimeMinutes: 5,
      stockQuantity: 50,
      isAvailable: true,
    },
    {
      id: 'item-uttapam-03',
      outletId: centralOutlet.id,
      categoryId: catTiffins.id,
      name: 'Onion Tomato Uttapam',
      description: 'Thick savoury pancake topped with caramelized red onions, juicy tomatoes, cilantro and green chillies.',
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      price: 55.0,
      prepTimeMinutes: 10,
      stockQuantity: 30,
      isAvailable: true,
    },
    // Central Food Court - Meals
    {
      id: 'item-paneer-thali-04',
      outletId: centralOutlet.id,
      categoryId: catMeals.id,
      name: 'Paneer Butter Masala Meal Box',
      description: 'Rich paneer gravy served with 3 fluffy phulkas, jeera rice, dal tadka, salad and roasted papad.',
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
      price: 110.0,
      prepTimeMinutes: 12,
      stockQuantity: 35,
      isAvailable: true,
    },
    {
      id: 'item-rajma-chawal-05',
      outletId: centralOutlet.id,
      categoryId: catMeals.id,
      name: 'Punjabi Rajma Chawal Bowl',
      description: 'Slow-cooked red kidney beans in aromatic whole spice gravy over steamed basmati rice with pickled onions.',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
      price: 85.0,
      prepTimeMinutes: 7,
      stockQuantity: 45,
      isAvailable: true,
    },
    {
      id: 'item-veg-biryani-06',
      outletId: centralOutlet.id,
      categoryId: catMeals.id,
      name: 'Hyderabadi Dum Veg Biryani',
      description: 'Long-grain fragrant rice layered with marinated seasonal vegetables, saffron, mint and fried shallots.',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      price: 95.0,
      prepTimeMinutes: 10,
      stockQuantity: 25,
      isAvailable: true,
    },

    // North Block Tuck Shop - Wraps
    {
      id: 'item-paneer-wrap-07',
      outletId: northOutlet.id,
      categoryId: catWraps.id,
      name: 'Tandoori Paneer Roll',
      description: 'Grilled spiced cottage cheese, pickled mint onions, crunchy bell peppers wrapped in a toasted paratha.',
      imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80',
      price: 75.0,
      prepTimeMinutes: 8,
      stockQuantity: 50,
      isAvailable: true,
    },
    {
      id: 'item-cheese-sandwich-08',
      outletId: northOutlet.id,
      categoryId: catWraps.id,
      name: 'Bombay Veg Grilled Cheese',
      description: 'Layered spiced potatoes, beetroots, cucumbers, mint chutney and generous cheddar grilled till crunchy.',
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
      price: 60.0,
      prepTimeMinutes: 6,
      stockQuantity: 40,
      isAvailable: true,
    },
    {
      id: 'item-egg-roll-09',
      outletId: northOutlet.id,
      categoryId: catWraps.id,
      name: 'Double Egg Kathi Roll',
      description: 'Fluffy double egg crepe with tangy coleslaw, chaat masala, lemon splash, rolled in crisp paratha.',
      imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80',
      price: 65.0,
      prepTimeMinutes: 7,
      stockQuantity: 30,
      isAvailable: true,
    },
    // North Block Tuck Shop - Snacks
    {
      id: 'item-samosa-pav-10',
      outletId: northOutlet.id,
      categoryId: catSnacks.id,
      name: 'Mumbai Samosa Pav (2 pcs)',
      description: 'Crispy fried potato samosas tucked into soft pav with dry garlic coconut chutney and fried chillies.',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      price: 40.0,
      prepTimeMinutes: 4,
      stockQuantity: 60,
      isAvailable: true,
    },
    {
      id: 'item-french-fries-11',
      outletId: northOutlet.id,
      categoryId: catSnacks.id,
      name: 'Peri-Peri Masala Fries',
      description: 'Hot crispy potato fries dusted with fiery peri-peri seasoning, served with creamy mayo dip.',
      imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
      price: 50.0,
      prepTimeMinutes: 6,
      stockQuantity: 40,
      isAvailable: true,
    },

    // Science Cafe & Juice Bar - Juices & Coffee
    {
      id: 'item-mango-shake-12',
      outletId: scienceCafe.id,
      categoryId: catJuices.id,
      name: 'Alphonso Mango Thick Shake',
      description: 'Pure mango pulp blended with chilled milk and a scoop of vanilla ice cream topped with roasted pistachios.',
      imageUrl: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=600&auto=format&fit=crop&q=80',
      price: 70.0,
      prepTimeMinutes: 5,
      stockQuantity: 35,
      isAvailable: true,
    },
    {
      id: 'item-orange-juice-13',
      outletId: scienceCafe.id,
      categoryId: catJuices.id,
      name: 'Fresh Valencia Orange Juice',
      description: 'Cold-pressed 100% natural orange juice without added sugar or water. Pure vitamin C boost.',
      imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
      price: 55.0,
      prepTimeMinutes: 4,
      stockQuantity: 40,
      isAvailable: true,
    },
    {
      id: 'item-cold-coffee-14',
      outletId: scienceCafe.id,
      categoryId: catCoffee.id,
      name: 'Classic Thick Cold Coffee',
      description: 'Frothy double-shot espresso shake with cocoa dust and chocolate drizzle. Student exam favourite.',
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
      price: 60.0,
      prepTimeMinutes: 5,
      stockQuantity: 50,
      isAvailable: true,
    },
    {
      id: 'item-iced-americano-15',
      outletId: scienceCafe.id,
      categoryId: catCoffee.id,
      name: 'Iced Americano Roast',
      description: 'Freshly extracted dark roast espresso poured over ice and chilled mineral water.',
      imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
      price: 50.0,
      prepTimeMinutes: 3,
      stockQuantity: 60,
      isAvailable: true,
    },

    // Night Owl - Maggi & Chai
    {
      id: 'item-cheese-maggi-16',
      outletId: nightOwl.id,
      categoryId: catMaggi.id,
      name: 'Loaded Cheese & Corn Maggi',
      description: 'Double noodles cooked in special spicy tastemaker, sweet golden corn kernels, and melted mozzarella.',
      imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
      price: 50.0,
      prepTimeMinutes: 6,
      stockQuantity: 70,
      isAvailable: true,
    },
    {
      id: 'item-masala-maggi-17',
      outletId: nightOwl.id,
      categoryId: catMaggi.id,
      name: 'Street Style Butter Masala Maggi',
      description: 'Stir-fried peas, onions, carrots and tomatoes tossed with piping hot Maggi and an amul butter dollop.',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
      price: 40.0,
      prepTimeMinutes: 6,
      stockQuantity: 80,
      isAvailable: true,
    },
    {
      id: 'item-kulhad-chai-18',
      outletId: nightOwl.id,
      categoryId: catChai.id,
      name: 'Adrak Elaichi Kulhad Chai',
      description: 'Fresh crushed ginger and green cardamom simmered with strong Assam tea leaves, served in earthen clay cup.',
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
      price: 20.0,
      prepTimeMinutes: 4,
      stockQuantity: 100,
      isAvailable: true,
    },
    {
      id: 'item-bun-maska-19',
      outletId: nightOwl.id,
      categoryId: catChai.id,
      name: 'Toasted Bun Maska with Jam',
      description: 'Pillow-soft bakery bun sliced and toasted with salted butter and sweet strawberry preserve.',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      price: 30.0,
      prepTimeMinutes: 4,
      stockQuantity: 50,
      isAvailable: true,
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  // 6. Sample Live Order to illustrate working state
  console.log('📦 Seeding demonstration orders...');
  const sampleOrder = await prisma.order.upsert({
    where: { orderNumber: 'EL-DEMO-001' },
    update: {},
    create: {
      orderNumber: 'EL-DEMO-001',
      pickupCode: '4291',
      studentId: student1.id,
      outletId: centralOutlet.id,
      status: 'PREPARING',
      subtotal: 110.0,
      total: 110.0,
      specialInstructions: 'Make dosa extra crispy please!',
      placedAt: new Date(Date.now() - 15 * 60 * 1000),
      acceptedAt: new Date(Date.now() - 12 * 60 * 1000),
      preparingAt: new Date(Date.now() - 5 * 60 * 1000),
      items: {
        create: [
          {
            menuItemId: 'item-dosa-01',
            itemNameSnapshot: 'Crispy Butter Masala Dosa',
            unitPriceSnapshot: 65.0,
            quantity: 1,
            lineTotal: 65.0,
          },
          {
            menuItemId: 'item-idli-02',
            itemNameSnapshot: 'Steamed Idli Vada Combo',
            unitPriceSnapshot: 45.0,
            quantity: 1,
            lineTotal: 45.0,
          },
        ],
      },
    },
  });

  const sampleCompletedOrder = await prisma.order.upsert({
    where: { orderNumber: 'EL-DEMO-002' },
    update: {},
    create: {
      orderNumber: 'EL-DEMO-002',
      pickupCode: '7823',
      studentId: student2.id,
      outletId: northOutlet.id,
      status: 'COMPLETED',
      subtotal: 135.0,
      total: 135.0,
      placedAt: new Date(Date.now() - 60 * 60 * 1000),
      acceptedAt: new Date(Date.now() - 55 * 60 * 1000),
      preparingAt: new Date(Date.now() - 45 * 60 * 1000),
      readyAt: new Date(Date.now() - 35 * 60 * 1000),
      completedAt: new Date(Date.now() - 30 * 60 * 1000),
      items: {
        create: [
          {
            menuItemId: 'item-paneer-wrap-07',
            itemNameSnapshot: 'Tandoori Paneer Roll',
            unitPriceSnapshot: 75.0,
            quantity: 1,
            lineTotal: 75.0,
          },
          {
            menuItemId: 'item-cheese-sandwich-08',
            itemNameSnapshot: 'Bombay Veg Grilled Cheese',
            unitPriceSnapshot: 60.0,
            quantity: 1,
            lineTotal: 60.0,
          },
        ],
      },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials:');
  console.log('Student 1: student@campus.edu / Student123!');
  console.log('Student 2: priya@campus.edu / Student123!');
  console.log('Vendor 1 (Central): vendor.central@campus.edu / Vendor123!');
  console.log('Vendor 2 (North): vendor.north@campus.edu / Vendor123!');
  console.log('Admin: admin@campus.edu / Admin123!');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
