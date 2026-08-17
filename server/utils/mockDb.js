const bcrypt = require('bcryptjs');

// In-Memory arrays mimicking MongoDB collections
let mockMenuItems = [
  // === FRESH JUICES ===
  { _id: "m1", nameEnglish: "Mosambi Juice", nameUrdu: "مسمی جوس", category: "Fresh Juices", price: 200, image: "", isAvailable: true, isSpecial: false },
  { _id: "m2", nameEnglish: "Pomegranate Juice", nameUrdu: "انار جوس", category: "Fresh Juices", price: 560, image: "", isAvailable: true, isSpecial: false },
  { _id: "m3", nameEnglish: "Carrot Juice", nameUrdu: "گاجر جوس", category: "Fresh Juices", price: 110, image: "", isAvailable: true, isSpecial: false },
  { _id: "m4", nameEnglish: "Kino Juice", nameUrdu: "کینو جوس", category: "Fresh Juices", price: 230, image: "", isAvailable: true, isSpecial: false },
  { _id: "m5", nameEnglish: "Pineapple Juice", nameUrdu: "پائن ایپل جوس", category: "Fresh Juices", price: 250, image: "", isAvailable: true, isSpecial: false },
  
  // === PIZZA ===
  { _id: "m6", nameEnglish: "Chicken Fajita Pizza", nameUrdu: "چکن فجیتا پیزا", category: "Pizza", sizes: { "Small": 460, "Medium": 850, "Large": 1280 }, isAvailable: true, isSpecial: false },
  { _id: "m7", nameEnglish: "Italian Pizza", nameUrdu: "اٹالین پیزا", category: "Pizza", sizes: { "Small": 530, "Medium": 1080, "Large": 1520 }, isAvailable: true, isSpecial: false },
  
  // === BURGERS ===
  { _id: "m8", nameEnglish: "Zinger Burger", nameUrdu: "زنگر برگر", category: "Burgers", price: 390, image: "", isAvailable: true, isSpecial: true },
  { _id: "m9", nameEnglish: "Chicken Cheese Burger", nameUrdu: "چکن چیز برگر", category: "Burgers", price: 420, image: "", isAvailable: true, isSpecial: false },
  
  // === DEALS ===
  { _id: "m10", nameEnglish: "Lunch Deal (12:00 PM to 04:00 PM) - Large Pizza + Free 1.5 Ltr Coke", nameUrdu: "لنچ ڈیل - 1 لارج پیزا اور مفت 1.5 لیٹر کوک", category: "Deals", price: 1280, image: "", isAvailable: true, isSpecial: true },
  { _id: "m11", nameEnglish: "Mix Platter - Oven Baked Wings (10) + Spin Roll + 500ml Coke", nameUrdu: "مکس پلیٹر - 10 ہاٹ ونگز، اسپن رول اور 500 ملی لیٹر کوک", category: "Deals", price: 1180, image: "", isAvailable: true, isSpecial: true }
];

let mockOrders = [];

// Helper to check if Mongoose is connected
const isConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// --- MENU ACTIONS ---
const getMenuItems = async () => {
  if (isConnected()) {
    const MenuItem = require('../models/MenuItem');
    return await MenuItem.find().sort({ category: 1, nameEnglish: 1 });
  }
  return [...mockMenuItems];
};

const createMenuItem = async (data) => {
  if (isConnected()) {
    const MenuItem = require('../models/MenuItem');
    const item = new MenuItem(data);
    return await item.save();
  }
  const newItem = {
    _id: 'm_' + Math.random().toString(36).substr(2, 9),
    ...data,
    sizes: data.sizes || {}
  };
  mockMenuItems.push(newItem);
  return newItem;
};

const updateMenuItem = async (id, data) => {
  if (isConnected()) {
    const MenuItem = require('../models/MenuItem');
    return await MenuItem.findByIdAndUpdate(id, data, { new: true });
  }
  const idx = mockMenuItems.findIndex(m => m._id === id);
  if (idx === -1) return null;
  const updated = { ...mockMenuItems[idx], ...data };
  mockMenuItems[idx] = updated;
  return updated;
};

const deleteMenuItem = async (id) => {
  if (isConnected()) {
    const MenuItem = require('../models/MenuItem');
    return await MenuItem.findByIdAndDelete(id);
  }
  const idx = mockMenuItems.findIndex(m => m._id === id);
  if (idx === -1) return false;
  mockMenuItems.splice(idx, 1);
  return true;
};

// --- ORDER ACTIONS ---
const getOrders = async (query = {}) => {
  if (isConnected()) {
    const Order = require('../models/Order');
    return await Order.find(query).sort({ createdAt: -1 });
  }
  
  let list = [...mockOrders];
  if (query.status && query.status !== 'All') {
    list = list.filter(o => o.status === query.status);
  }
  if (query.createdAt) {
    const gte = query.createdAt.$gte;
    const lte = query.createdAt.$lte;
    list = list.filter(o => {
      const d = new Date(o.createdAt);
      return d >= gte && d <= lte;
    });
  }
  // Sort descending
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const getOrderById = async (id) => {
  if (isConnected()) {
    const Order = require('../models/Order');
    return await Order.findById(id);
  }
  return mockOrders.find(o => o._id === id) || null;
};

const createOrder = async (data) => {
  if (isConnected()) {
    const Order = require('../models/Order');
    const order = new Order(data);
    return await order.save();
  }
  const newOrder = {
    _id: 'o_' + Math.random().toString(36).substr(2, 9),
    ...data,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  mockOrders.push(newOrder);
  return newOrder;
};

const updateOrderStatus = async (id, status) => {
  if (isConnected()) {
    const Order = require('../models/Order');
    return await Order.findByIdAndUpdate(id, { status }, { new: true });
  }
  const idx = mockOrders.findIndex(o => o._id === id);
  if (idx === -1) return null;
  mockOrders[idx].status = status;
  return mockOrders[idx];
};

const deleteOrder = async (id) => {
  if (isConnected()) {
    const Order = require('../models/Order');
    return await Order.findByIdAndDelete(id);
  }
  const idx = mockOrders.findIndex(o => o._id === id);
  if (idx === -1) return false;
  mockOrders.splice(idx, 1);
  return true;
};

// --- ADMIN AUTH ---
const checkAdmin = async (username, password) => {
  if (isConnected()) {
    const Admin = require('../models/Admin');
    const admin = await Admin.findOne({ username });
    if (!admin) return null;
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    return isMatch ? admin : null;
  }
  
  if (username === 'admin' && password === 'admin123') {
    return { id: 'admin_mock_id', username: 'admin' };
  }
  return null;
};

module.exports = {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  checkAdmin
};
