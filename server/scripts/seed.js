import 'dotenv/config';
import mongoose from 'mongoose';

import User from '../src/models/User.js';
import FarmerProfile from '../src/models/FarmerProfile.js';
import Market from '../src/models/Market.js';
import Product from '../src/models/Product.js';
import Category from '../src/models/Category.js';

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected');

    console.log('Clearing old data...');
    await Promise.all([
      User.deleteMany({}),
      FarmerProfile.deleteMany({}),
      Market.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
    ]);
    console.log('✓ Cleared');

    console.log('Creating users...');

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@marketlink.com',
      passwordHash: await User.hashPassword('admin123'),
      phone: '03000000000',
      role: 'admin',
      isActive: true,
      isApproved: true,
    });

    const farmerUser1 = await User.create({
      name: 'Bilal Ahmed',
      email: 'bilal@marketlink.com',
      passwordHash: await User.hashPassword('farmer123'),
      phone: '03001111111',
      role: 'farmer',
      isActive: true,
      isApproved: true,
    });

    const farmerUser2 = await User.create({
      name: 'Hamza Ali',
      email: 'hamza.farmer@marketlink.com',
      passwordHash: await User.hashPassword('farmer123'),
      phone: '03003333333',
      role: 'farmer',
      isActive: true,
      isApproved: true,
    });

    const customer = await User.create({
      name: 'Ali Khan',
      email: 'ali@marketlink.com',
      passwordHash: await User.hashPassword('customer123'),
      phone: '03002222222',
      role: 'customer',
      isActive: true,
      isApproved: true,
    });

    console.log('✓ Users created');

    console.log('Creating markets...');

    const m1 = await Market.create({
      name: 'Empress Market',
      address: 'Saddar, Karachi',
      lat: 24.8607,
      lng: 67.0011,
      mapProvider: 'osm',
      operatingDays: ['Sat', 'Sun'],
      timings: { open: '06:00', close: '14:00' },
      location: { type: 'Point', coordinates: [67.0011, 24.8607] },
      createdBy: admin._id,
    });

    const m2 = await Market.create({
      name: 'Boat Basin Market',
      address: 'Clifton, Karachi',
      lat: 24.82,
      lng: 67.03,
      mapProvider: 'osm',
      operatingDays: ['Fri', 'Sat'],
      timings: { open: '07:00', close: '15:00' },
      location: { type: 'Point', coordinates: [67.03, 24.82] },
      createdBy: admin._id,
    });

    console.log('✓ Markets created');

    console.log('Creating farmer profiles...');

    const f1 = await FarmerProfile.create({
      userId: farmerUser1._id,
      stallName: 'Fresh Farms',
      contactPerson: 'Bilal',
      description: 'Organic vegetables and fruits fresh from the farm',
      imageUrl: '',
      markets: [m1._id],
      operatingDays: ['Sat'],
      pickupWindows: [{ day: 'Sat', startTime: '08:00', endTime: '12:00' }],
      location: {
        address: 'Empress Market, Karachi',
        lat: 24.8607,
        lng: 67.0011,
        type: 'Point',
        coordinates: [67.0011, 24.8607],
      },
      rating: 0,
      totalReviews: 0,
    });

    const f2 = await FarmerProfile.create({
      userId: farmerUser2._id,
      stallName: 'Green Valley',
      contactPerson: 'Hamza',
      description: 'Fresh from the farm — vegetables, fruits, and dairy',
      imageUrl: '',
      markets: [m1._id, m2._id],
      operatingDays: ['Fri', 'Sat'],
      pickupWindows: [{ day: 'Sat', startTime: '09:00', endTime: '13:00' }],
      location: {
        address: 'Boat Basin, Karachi',
        lat: 24.82,
        lng: 67.03,
        type: 'Point',
        coordinates: [67.03, 24.82],
      },
      rating: 0,
      totalReviews: 0,
    });

    console.log('✓ Farmer profiles created');

    console.log('Creating categories...');

    await Category.insertMany([
      { name: 'Vegetables', isActive: true },
      { name: 'Fruits', isActive: true },
      { name: 'Dairy', isActive: true },
      { name: 'Bakery', isActive: true },
      { name: 'Other', isActive: true },
    ]);

    console.log('✓ Categories created');

    console.log('Creating products...');

    await Product.insertMany([
      // Fresh Farms
      {
        farmerId: f1._id,
        name: 'Tomatoes',
        category: 'Vegetables',
        description: 'Fresh red tomatoes',
        price: 120,
        unit: 'kg',
        stockQuantity: 50,
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
        isAvailable: true,
        isTemplate: false,
      },
      {
        farmerId: f1._id,
        name: 'Potatoes',
        category: 'Vegetables',
        description: 'Fresh potatoes',
        price: 80,
        unit: 'kg',
        stockQuantity: 100,
        imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
        isAvailable: true,
        isTemplate: false,
      },
      {
        farmerId: f1._id,
        name: 'Apples',
        category: 'Fruits',
        description: 'Sweet red apples',
        price: 250,
        unit: 'kg',
        stockQuantity: 30,
        imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
        isAvailable: true,
        isTemplate: false,
      },
      {
        farmerId: f1._id,
        name: 'Milk',
        category: 'Dairy',
        description: 'Fresh cow milk',
        price: 200,
        unit: 'litre',
        stockQuantity: 20,
        imageUrl: '',
        isAvailable: true,
        isTemplate: false,
      },
      // Green Valley
      {
        farmerId: f2._id,
        name: 'Spinach',
        category: 'Vegetables',
        description: 'Fresh green spinach',
        price: 60,
        unit: 'bunch',
        stockQuantity: 40,
        imageUrl: '',
        isAvailable: true,
        isTemplate: false,
      },
      {
        farmerId: f2._id,
        name: 'Bananas',
        category: 'Fruits',
        description: 'Ripe yellow bananas',
        price: 180,
        unit: 'dozen',
        stockQuantity: 25,
        imageUrl: '',
        isAvailable: true,
        isTemplate: false,
      },
      {
        farmerId: f2._id,
        name: 'Fresh Bread',
        category: 'Bakery',
        description: 'Baked this morning',
        price: 150,
        unit: 'piece',
        stockQuantity: 15,
        imageUrl: '',
        isAvailable: true,
        isTemplate: false,
      },
    ]);

    console.log('✓ Products created');

    console.log('\n════════════════════════════════════════');
    console.log('  SEED COMPLETE — Demo Credentials');
    console.log('════════════════════════════════════════');
    console.log('  Admin    : admin@marketlink.com         / admin123');
    console.log('  Farmer 1 : bilal@marketlink.com         / farmer123');
    console.log('  Farmer 2 : hamza.farmer@marketlink.com  / farmer123');
    console.log('  Customer : ali@marketlink.com           / customer123');
    console.log('════════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('✗ Seed failed:', err);
    process.exit(1);
  }
};

run();