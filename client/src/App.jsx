import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Deals from './pages/Deals';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function AdminRoute({ token, setToken, children }) {
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('mulla_token') || null;
  });

  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FFFBF7' }}>

            {/* Global Toasts */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#1c1917',
                  border: '1px solid #E26A12',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(226,106,18,0.15)',
                },
              }}
            />

            {/* Main Navbar */}
            <Navbar />

            {/* Global Slide-out Drawer */}
            <CartDrawer />

            {/* Routes Container */}
            <main className="flex-1 pb-12">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />

                {/* Admin Auth */}
                <Route path="/admin/login" element={<AdminLogin setToken={setToken} />} />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute token={token} setToken={setToken}>
                      <AdminDashboard token={token} setToken={setToken} />
                    </AdminRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer — Single Unified Section */}
            <footer className="border-t border-orange-200 font-poppins" style={{ backgroundColor: '#FDE8C8' }}>
              <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-3">

                {/* Top Row: Copyright */}
                <div className="text-center">
                  <p className="text-xs font-semibold text-stone-600">© {new Date().getFullYear()} Mulla Fresh Juices &amp; Fried Chicken. All Rights Reserved.</p>
                  <p className="text-[10px] text-orange-500 font-bold tracking-wider mt-0.5">60 Years of Taste — Est. 1966</p>
                </div>

                {/* Bottom Row: Dev Credit */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-3 border-t border-orange-200/60">

                  {/* Left: Built by */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shrink-0">
                      <span className="text-white text-sm font-black">{'</>'}</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-orange-500 uppercase tracking-widest font-bold">Designed &amp; Developed by</p>
                      <p className="text-stone-800 font-black text-sm tracking-tight">Nouman Zahoor &amp; Burhan Zahoor</p>
                    </div>
                  </div>

                  {/* Center: Tagline */}
                  <div className="text-center hidden md:block">
                    <p className="text-stone-500 text-xs font-medium">Need a website for your business?</p>
                    <p className="text-orange-500 text-[11px] font-bold">We build fast, modern &amp; beautiful web apps 🚀</p>
                  </div>

                  {/* Right: Contact CTA */}
                  <a
                    href="mailto:noumanzahoor.cs@gmail.com"
                    className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border-2 border-orange-300 bg-white/60 hover:bg-orange-500 transition-all duration-300 group shrink-0"
                  >
                    <span className="text-sm">✉️</span>
                    <div className="text-left">
                      <p className="text-[10px] text-stone-500 group-hover:text-white transition-colors font-semibold">Hire us / Contact</p>
                      <p className="text-orange-600 group-hover:text-white transition-colors text-xs font-bold">noumanzahoor.cs@gmail.com</p>
                    </div>
                  </a>

                </div>
              </div>
            </footer>

          </div>
        </Router>
      </CartProvider>
    </LanguageProvider>
  );
}
