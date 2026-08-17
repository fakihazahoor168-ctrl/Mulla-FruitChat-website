import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  LogOut,
  Calendar,
  Filter,
  CheckCircle,
  Eye,
  Edit2,
  Trash2,
  Plus,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Search,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export default function AdminDashboard({ token, setToken }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // orders, menu, reports

  // Data states
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(true);

  // Filters for orders
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // Search & Filter for menu
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  // Modal control
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  // Menu Form fields
  const [menuForm, setMenuForm] = useState({
    nameEnglish: '',
    nameUrdu: '',
    category: '',
    price: '',
    sizes: {},
    isAvailable: true,
    isSpecial: false
  });
  const [pizzaSizesInput, setPizzaSizesInput] = useState({ Small: '', Medium: '', Large: '' });

  // Sound notification
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playTone = (freq, duration, delay) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
      };
      playTone(784, 0.25, 0);     // G5
      playTone(1046.5, 0.4, 0.12); // C6
    } catch (e) {
      console.warn('Audio Context sound play blocked by browser permissions', e);
    }
  };

  const logout = () => {
    localStorage.removeItem('mulla_token');
    localStorage.removeItem('mulla_admin_user');
    setToken(null);
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  // Check auth
  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  // Fetch orders and menu items
  const fetchOrders = () => {
    setLoadingOrders(true);
    let url = '/api/orders';
    let params = [];
    if (statusFilter !== 'All') params.push(`status=${statusFilter}`);
    if (dateFilter) params.push(`date=${dateFilter}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (res.status === 401) logout();
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoadingOrders(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingOrders(false);
      });
  };

  const fetchMenu = () => {
    setLoadingMenu(true);
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);
        setLoadingMenu(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingMenu(false);
      });
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [statusFilter, dateFilter, token]);

  useEffect(() => {
    if (token) {
      fetchMenu();
    }
  }, [token]);

  // Socket setup for real-time notifications
  useEffect(() => {
    if (!token) return;
    const socket = io('/', { path: '/socket.io' });

    socket.on('newOrder', (newOrder) => {
      playChime();
      toast((t) => (
        <span className="flex flex-col gap-1 text-xs text-stone-700">
          <strong className="text-brand-orange font-bold text-sm">🔔 New Order Placed!</strong>
          <span>Name: <strong>{newOrder.customerName}</strong></span>
          <span>Amount: <strong>Rs. {newOrder.totalAmount}</strong></span>
          <button
            onClick={() => {
              setSelectedOrder(newOrder);
              toast.dismiss(t.id);
            }}
            className="mt-1 px-2.5 py-1 bg-brand-orange text-white rounded text-[10px] font-bold shadow-sm"
          >
            Quick View
          </button>
        </span>
      ), { duration: 8000 });

      // Append new order
      setOrders((prev) => [newOrder, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Order status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');
      
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updated);
      }
      toast.success(`Order status set to: ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order status');
    }
  };

  // Order delete
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete failed');
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete order');
    }
  };

  // Toggle availability in menu
  const handleToggleAvailability = async (item) => {
    const nextAvailability = !item.isAvailable;
    try {
      const res = await fetch(`/api/menu/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...item,
          isAvailable: nextAvailability
        })
      });
      if (!res.ok) throw new Error('Toggle failed');
      const updated = await res.json();
      setMenuItems((prev) => prev.map((m) => (m._id === item._id ? updated : m)));
      toast.success(`${item.nameEnglish} is now ${nextAvailability ? 'In Stock' : 'Out of Stock'}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to toggle availability');
    }
  };

  // Toggle special status
  const handleToggleSpecial = async (item) => {
    const nextSpecial = !item.isSpecial;
    try {
      const res = await fetch(`/api/menu/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...item,
          isSpecial: nextSpecial
        })
      });
      if (!res.ok) throw new Error('Toggle failed');
      const updated = await res.json();
      setMenuItems((prev) => prev.map((m) => (m._id === item._id ? updated : m)));
      toast.success(`${item.nameEnglish} marked as ${nextSpecial ? 'Special' : 'Regular'}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to toggle special');
    }
  };

  // Open Menu Form modal (Add / Edit)
  const openMenuModal = (item = null) => {
    if (item) {
      setEditingMenuItem(item);
      setMenuForm({
        nameEnglish: item.nameEnglish,
        nameUrdu: item.nameUrdu,
        category: item.category,
        price: item.price || '',
        isAvailable: item.isAvailable,
        isSpecial: item.isSpecial
      });
      const sizes = item.sizes || {};
      setPizzaSizesInput({
        Small: sizes.Small || '',
        Medium: sizes.Medium || '',
        Large: sizes.Large || ''
      });
    } else {
      setEditingMenuItem(null);
      setMenuForm({
        nameEnglish: '',
        nameUrdu: '',
        category: 'Pizza',
        price: '',
        isAvailable: true,
        isSpecial: false
      });
      setPizzaSizesInput({ Small: '', Medium: '', Large: '' });
    }
    setIsMenuModalOpen(true);
  };

  // Submit Menu Item (Create / Update)
  const handleMenuFormSubmit = async (e) => {
    e.preventDefault();

    const sizes = {};
    if (pizzaSizesInput.Small) sizes.Small = Number(pizzaSizesInput.Small);
    if (pizzaSizesInput.Medium) sizes.Medium = Number(pizzaSizesInput.Medium);
    if (pizzaSizesInput.Large) sizes.Large = Number(pizzaSizesInput.Large);

    const payload = {
      nameEnglish: menuForm.nameEnglish.trim(),
      nameUrdu: menuForm.nameUrdu.trim(),
      category: menuForm.category,
      price: menuForm.price ? Number(menuForm.price) : undefined,
      sizes: Object.keys(sizes).length > 0 ? sizes : undefined,
      isAvailable: menuForm.isAvailable,
      isSpecial: menuForm.isSpecial
    };

    const isEdit = !!editingMenuItem;
    const url = isEdit ? `/api/menu/${editingMenuItem._id}` : '/api/menu';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Menu save failed');

      if (isEdit) {
        setMenuItems((prev) => prev.map((m) => (m._id === editingMenuItem._id ? data : m)));
        toast.success('Menu item updated successfully');
      } else {
        setMenuItems((prev) => [data, ...prev]);
        toast.success('New menu item added successfully');
      }

      setIsMenuModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save menu item');
    }
  };

  // Delete menu item
  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const res = await fetch(`/api/menu/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete failed');
      setMenuItems((prev) => prev.filter((m) => m._id !== itemId));
      toast.success('Menu item deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete menu item');
    }
  };

  // Calculate statistics (Today's metrics)
  const getTodayStats = () => {
    const todayStr = new Date().toDateString();
    
    const todayOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt).toDateString();
      return orderDate === todayStr && o.status !== 'Cancelled';
    });

    const revenue = todayOrders.reduce((sum, o) => {
      return o.status === 'Completed' ? sum + o.totalAmount : sum;
    }, 0);

    const pending = orders.filter((o) => o.status === 'Pending' || o.status === 'Preparing').length;

    return {
      totalOrders: todayOrders.length,
      revenue,
      pendingCount: pending
    };
  };

  // Calculate report charts data (aggregate by date)
  const getReportData = () => {
    const dateMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      dateMap[key] = { date: key, revenue: 0, count: 0 };
    }

    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      const key = new Date(o.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (dateMap[key]) {
        dateMap[key].count += 1;
        if (o.status === 'Completed') {
          dateMap[key].revenue += o.totalAmount;
        }
      }
    });

    return Object.values(dateMap);
  };

  const stats = getTodayStats();
  const chartData = getReportData();

  // Filter menu items
  const filteredMenuItems = menuItems.filter((item) => {
    const q = menuSearchQuery.toLowerCase().trim();
    return (
      q === '' ||
      item.nameEnglish.toLowerCase().includes(q) ||
      item.nameUrdu.includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 text-stone-800">
      
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-850 font-poppins">Admin Dashboard</h2>
          <p className="text-stone-400 text-xs mt-1 font-semibold">Manage orders, update menus, and analyze sales reports</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-4 py-2 border border-red-200 hover:border-red-500 bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-xl text-xs transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b border-orange-100 pb-3 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'orders'
              ? 'bg-brand-orange text-white shadow-sm'
              : 'text-stone-500 hover:text-brand-orange bg-white border border-orange-200 hover:bg-orange-50'
          }`}
        >
          Orders Manager
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'menu'
              ? 'bg-brand-orange text-white shadow-sm'
              : 'text-stone-500 hover:text-brand-orange bg-white border border-orange-200 hover:bg-orange-50'
          }`}
        >
          Menu Manager
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'reports'
              ? 'bg-brand-orange text-white shadow-sm'
              : 'text-stone-500 hover:text-brand-orange bg-white border border-orange-200 hover:bg-orange-50'
          }`}
        >
          Sales & Reports
        </button>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Today Orders */}
        <div className="bg-white p-5 rounded-2xl border border-orange-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">Orders Today</span>
            <div className="text-2xl font-black text-stone-800">{stats.totalOrders}</div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Today Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-orange-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">Revenue Today (Completed Only)</span>
            <div className="text-2xl font-black text-brand-orange">Rs. {stats.revenue}</div>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-brand-orange border border-orange-200">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Count */}
        <div className="bg-white p-5 rounded-2xl border border-orange-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">Active Queue (Pending + Prep)</span>
            <div className="text-2xl font-black text-stone-800">{stats.pendingCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

      </div>

      {/* ACTIVE TAB CONTENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Filters Area */}
          <div className="bg-white p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 border border-orange-150 shadow-sm">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-brand-orange" />
              <span className="text-xs text-stone-600 font-bold">Filters</span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-xs">
              {/* Status */}
              <div className="flex items-center gap-1.5">
                <span className="text-stone-500 font-semibold">Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-orange-50/50 border border-orange-200 text-stone-700 py-1.5 px-3 rounded-lg focus:outline-none focus:border-brand-orange font-poppins"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date */}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-stone-500 font-semibold">Date</span>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-orange-50/50 border border-orange-200 text-stone-700 py-1.5 px-3 rounded-lg focus:outline-none focus:border-brand-orange font-poppins"
                />
              </div>
            </div>
          </div>

          {/* Orders Table */}
          {loadingOrders ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
              <span className="text-stone-550 text-xs">Loading orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 text-stone-400 flex flex-col items-center gap-2 border border-dashed border-orange-200 rounded-2xl bg-white shadow-sm">
              <AlertCircle className="w-10 h-10 text-stone-300" />
              <span className="text-xs">No orders in matching search query.</span>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-orange-150 bg-white shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-orange-50/50 text-stone-600 font-bold border-b border-orange-150">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Time</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 text-stone-700">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="p-4 font-mono select-all text-stone-400 max-w-28 truncate">{order._id}</td>
                      <td className="p-4 font-bold text-stone-800">{order.customerName}</td>
                      <td className="p-4 font-mono">{order.phone}</td>
                      <td className="p-4 font-bold text-brand-orange">Rs. {order.totalAmount}</td>
                      <td className="p-4">
                        <select
                           value={order.status}
                           onChange={(e) => handleStatusChange(order._id, e.target.value)}
                           className="bg-orange-50/50 border border-orange-200 rounded px-2.5 py-1 text-xs text-stone-700 focus:outline-none focus:border-brand-orange font-poppins"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-stone-400">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded bg-orange-50 hover:bg-orange-100 text-stone-600 hover:text-brand-orange transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="space-y-6">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute inset-y-0 right-3 flex items-center text-stone-400 w-4 h-4 my-auto" />
              <input
                type="text"
                placeholder="Search items..."
                value={menuSearchQuery}
                onChange={(e) => setMenuSearchQuery(e.target.value)}
                className="w-full bg-white border border-orange-200 rounded-xl py-2 px-4 pr-10 text-xs text-stone-700 focus:outline-none focus:border-brand-orange transition-colors shadow-sm"
              />
            </div>
            
            {/* Add Button */}
            <button
              onClick={() => openMenuModal()}
              className="btn-orange-glow px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 self-end"
            >
              <Plus className="w-4 h-4" />
              <span>Add Menu Item</span>
            </button>
          </div>

          {/* Menu Table */}
          {loadingMenu ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
              <span className="text-stone-550 text-xs">Loading menu items...</span>
            </div>
          ) : filteredMenuItems.length === 0 ? (
            <div className="text-center py-20 text-stone-400 flex flex-col items-center gap-2 border border-dashed border-orange-200 rounded-2xl bg-white shadow-sm">
              <AlertCircle className="w-10 h-10 text-stone-300" />
              <span className="text-xs">No menu items found.</span>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-orange-150 bg-white shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-orange-50/50 text-stone-600 font-bold border-b border-orange-150">
                    <th className="p-4">English Name</th>
                    <th className="p-4">Urdu Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-center">Available</th>
                    <th className="p-4 text-center">Special</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100 text-stone-700">
                  {filteredMenuItems.map((item) => {
                    const sizeEntries = item.sizes ? Object.entries(item.sizes) : [];
                    const displayPrice = sizeEntries.length > 0
                      ? sizeEntries.map(([s, p]) => `${s}: ${p}`).join(', ')
                      : `Rs. ${item.price}`;

                    return (
                      <tr key={item._id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="p-4 font-bold text-stone-855">{item.nameEnglish}</td>
                        <td className="p-4 font-urdu text-sm font-semibold text-stone-800">{item.nameUrdu}</td>
                        <td className="p-4 text-stone-500">{item.category}</td>
                        <td className="p-4 font-semibold text-brand-orange max-w-44 truncate" title={displayPrice}>
                          {displayPrice}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className="text-stone-400 hover:text-brand-orange transition-colors"
                            title="Toggle Availability"
                          >
                            {item.isAvailable ? (
                              <ToggleRight className="w-6 h-6 text-green-500 mx-auto" />
                            ) : (
                              <ToggleLeft className="w-6 h-6 text-stone-450 mx-auto" />
                            )}
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleSpecial(item)}
                            className="text-stone-400 hover:text-brand-orange transition-colors"
                            title="Toggle Special Banner"
                          >
                            {item.isSpecial ? (
                              <Sparkles className="w-5 h-5 text-amber-500 mx-auto animate-pulse" />
                            ) : (
                              <Sparkles className="w-5 h-5 text-stone-300 mx-auto" />
                            )}
                          </button>
                        </td>
                        <td className="p-4 flex items-center justify-center gap-2">
                          <button
                            onClick={() => openMenuModal(item)}
                            className="p-1.5 rounded bg-orange-50 hover:bg-orange-100 text-stone-600 hover:text-brand-orange transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item._id)}
                            className="p-1.5 rounded bg-red-550/10 hover:bg-red-100 text-red-500 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Daily Revenue Chart */}
            <div className="bg-white p-5 rounded-2xl border border-orange-150 shadow-sm">
              <h3 className="text-sm font-bold text-stone-800 mb-4">Daily Revenue (PKR)</h3>
              <div className="h-64 text-xs font-poppins">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F58220" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#F58220" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0d9be" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" stroke="#8c8581"/>
                    <YAxis stroke="#8c8581"/>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #f0d9be', borderRadius: '8px', color: '#1c1917' }}/>
                    <Area type="monotone" dataKey="revenue" stroke="#F58220" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Order Counts */}
            <div className="bg-white p-5 rounded-2xl border border-orange-150 shadow-sm">
              <h3 className="text-sm font-bold text-stone-800 mb-4">Daily Order Counts</h3>
              <div className="h-64 text-xs font-poppins">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0d9be" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" stroke="#8c8581"/>
                    <YAxis stroke="#8c8581" allowDecimals={false}/>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #f0d9be', borderRadius: '8px', color: '#1c1917' }}/>
                    <Bar dataKey="count" fill="#FFA65C" radius={[4, 4, 0, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ----------------- MODALS ----------------- */}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl border border-orange-250 max-w-lg w-full text-xs space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-orange-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-850">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded hover:bg-orange-50 text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3 text-stone-500">
              <div>
                <span className="font-semibold block text-[10px] text-stone-400 uppercase">Order ID</span>
                <span className="font-mono text-stone-750 text-[10px] select-all">{selectedOrder._id}</span>
              </div>
              <div>
                <span className="font-semibold block text-[10px] text-stone-400 uppercase">Order Date</span>
                <span className="text-stone-750 text-[10px]">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-3 bg-orange-50/40 border border-orange-150 rounded-xl space-y-2">
              <div>
                <span className="text-stone-450 block font-semibold text-[10px] uppercase">Customer Name</span>
                <span className="text-stone-800 font-bold text-sm">{selectedOrder.customerName}</span>
              </div>
              <div>
                <span className="text-stone-450 block font-semibold text-[10px] uppercase">Phone</span>
                <span className="text-stone-800 font-mono font-bold text-sm">{selectedOrder.phone}</span>
              </div>
              <div>
                <span className="text-stone-450 block font-semibold text-[10px] uppercase">Address</span>
                <span className="text-stone-850 leading-relaxed font-semibold">{selectedOrder.address}</span>
              </div>
              {selectedOrder.orderNotes && (
                <div>
                  <span className="text-stone-450 block font-semibold text-[10px] uppercase">Notes</span>
                  <span className="text-brand-orange italic font-semibold">"{selectedOrder.orderNotes}"</span>
                </div>
              )}
            </div>

            {/* Item Breakdown */}
            <div>
              <span className="text-stone-450 font-semibold block text-[10px] uppercase mb-2">Items list</span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-orange-50 pb-1.5 text-stone-700">
                    <div>
                      <span className="text-stone-850 font-bold">{item.name}</span>
                      {item.size && (
                        <span className="text-[9px] bg-orange-100 text-brand-orange font-bold px-1.5 py-0.5 rounded ml-1.5 border border-orange-200">
                          {item.size}
                        </span>
                      )}
                      <div className="text-[10px] text-stone-400">Qty: {item.quantity}</div>
                    </div>
                    <span className="text-stone-700 font-semibold">
                      Rs. {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Block */}
            <div className="flex justify-between items-center border-t border-orange-100 pt-3">
              <span className="font-extrabold text-sm text-stone-600">Total Amount</span>
              <span className="text-brand-orange text-base font-black">Rs. {selectedOrder.totalAmount}</span>
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center justify-between pt-2">
              <span className="font-bold text-stone-500">Update Status</span>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                className="bg-orange-50/50 border border-orange-250 text-xs rounded px-3 py-1.5 text-stone-750 focus:outline-none focus:border-brand-orange font-poppins"
              >
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

          </div>
        </div>
      )}

      {/* Menu Add / Edit Modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleMenuFormSubmit}
            className="bg-white p-6 rounded-2xl border border-orange-250 max-w-md w-full text-xs space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-orange-100 pb-2">
              <h3 className="text-sm font-extrabold text-stone-850">
                {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button
                type="button"
                onClick={() => setIsMenuModalOpen(false)}
                className="p-1 rounded hover:bg-orange-50 text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* English Name */}
            <div className="flex flex-col text-left">
              <label className="text-stone-500 font-semibold mb-1">English Name *</label>
              <input
                type="text"
                required
                value={menuForm.nameEnglish}
                onChange={(e) => setMenuForm({ ...menuForm, nameEnglish: e.target.value })}
                className="bg-orange-50/30 border border-orange-200 rounded-xl py-2 px-3 text-stone-800 focus:outline-none focus:border-brand-orange"
              />
            </div>

            {/* Urdu Name */}
            <div className="flex flex-col text-left">
              <label className="text-stone-500 font-semibold mb-1">Urdu Name *</label>
              <input
                type="text"
                required
                value={menuForm.nameUrdu}
                onChange={(e) => setMenuForm({ ...menuForm, nameUrdu: e.target.value })}
                className="bg-orange-50/30 border border-orange-200 rounded-xl py-2 px-3 text-stone-800 focus:outline-none focus:border-brand-orange font-urdu text-sm"
              />
            </div>

            {/* Category Select */}
            <div className="flex flex-col text-left">
              <label className="text-stone-500 font-semibold mb-1">Category *</label>
              <select
                value={menuForm.category}
                onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                className="bg-orange-50/30 border border-orange-200 rounded-xl py-2 px-3 text-stone-800 focus:outline-none focus:border-brand-orange font-poppins"
              >
                <option value="Pizza">Pizza</option>
                <option value="Burgers">Burgers</option>
                <option value="Shawarma">Shawarma</option>
                <option value="Paratha Rolls">Paratha Rolls</option>
                <option value="Sandwiches">Sandwiches</option>
                <option value="Wings & Nuggets">Wings & Nuggets</option>
                <option value="Pasta">Pasta</option>
                <option value="Fresh Juices">Fresh Juices</option>
                <option value="Milk Shakes">Milk Shakes</option>
                <option value="Fruit Chaat">Fruit Chaat</option>
                <option value="Ice Cream">Ice Cream</option>
                <option value="Cold Drinks">Cold Drinks</option>
                <option value="Deals">Deals</option>
              </select>
            </div>

            {/* Price (If simple item) */}
            <div className="flex flex-col text-left">
              <label className="text-stone-500 font-semibold mb-1">
                Standard Price (PKR) <span className="text-[10px] text-stone-400 font-normal">(Leave empty for sized items)</span>
              </label>
              <input
                type="number"
                value={menuForm.price}
                onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                className="bg-orange-50/30 border border-orange-200 rounded-xl py-2 px-3 text-stone-800 focus:outline-none focus:border-brand-orange"
              />
            </div>

            {/* Size Based Prices */}
            <div className="p-3 bg-orange-50/40 border border-orange-150 rounded-xl space-y-3">
              <span className="text-stone-500 font-bold block text-[10px] uppercase">
                Size-Based Prices (Optional)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-stone-500 text-[10px] block mb-1">Small</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={pizzaSizesInput.Small}
                    onChange={(e) => setPizzaSizesInput({ ...pizzaSizesInput, Small: e.target.value })}
                    className="w-full bg-white border border-orange-200 rounded py-1.5 px-2 text-stone-800 focus:outline-none focus:border-brand-orange"
                  />
                </div>
                <div>
                  <label className="text-stone-500 text-[10px] block mb-1">Medium</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={pizzaSizesInput.Medium}
                    onChange={(e) => setPizzaSizesInput({ ...pizzaSizesInput, Medium: e.target.value })}
                    className="w-full bg-white border border-orange-200 rounded py-1.5 px-2 text-stone-800 focus:outline-none focus:border-brand-orange"
                  />
                </div>
                <div>
                  <label className="text-stone-500 text-[10px] block mb-1">Large</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={pizzaSizesInput.Large}
                    onChange={(e) => setPizzaSizesInput({ ...pizzaSizesInput, Large: e.target.value })}
                    className="w-full bg-white border border-orange-200 rounded py-1.5 px-2 text-stone-800 focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>
            </div>

            {/* Checkbox triggers */}
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={menuForm.isAvailable}
                  onChange={(e) => setMenuForm({ ...menuForm, isAvailable: e.target.checked })}
                  className="rounded border-orange-200 text-brand-orange focus:ring-0 w-4 h-4"
                />
                <span className="text-stone-600 font-bold">Available</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={menuForm.isSpecial}
                  onChange={(e) => setMenuForm({ ...menuForm, isSpecial: e.target.checked })}
                  className="rounded border-orange-200 text-brand-orange focus:ring-0 w-4 h-4"
                />
                <span className="text-stone-600 font-bold">Mark Special</span>
              </label>
            </div>

            {/* Actions */}
            <button
              type="submit"
              className="w-full btn-orange-glow py-3 rounded-xl font-bold transition-transform hover:scale-[1.02] flex items-center justify-center shadow-md shadow-orange-350/10"
            >
              Save Item
            </button>

          </form>
        </div>
      )}

    </div>
  );
}
