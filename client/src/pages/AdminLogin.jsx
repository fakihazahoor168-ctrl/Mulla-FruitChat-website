import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists already
    const existingToken = localStorage.getItem('mulla_token');
    if (existingToken) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('mulla_token', data.token);
      localStorage.setItem('mulla_admin_user', data.username);
      setToken(data.token);
      toast.success('Admin login successful!');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 flex flex-col justify-center min-h-[70vh]">
      
      <div className="bg-white p-8 rounded-3xl border border-orange-200 shadow-xl relative">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <img
            src="/logo.jpg"
            alt="Mulla Logo"
            className="w-auto h-16 rounded-xl object-contain border-2 border-brand-orange shadow-md mx-auto mb-3"
          />
          <h2 className="text-2xl font-bold text-stone-800 font-poppins">Admin Login</h2>
          <p className="text-stone-400 text-xs mt-1 font-semibold">Mulla Fresh Juices & Fried Chicken</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Username */}
          <div className="flex flex-col text-left">
            <label className="text-xs font-semibold text-stone-500 mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-brand-orange" />
              <span>Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter admin username"
              className="bg-orange-50/30 border border-orange-200 rounded-xl py-2.5 px-4 text-stone-800 focus:outline-none focus:border-brand-orange transition-colors text-sm font-poppins"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col text-left">
            <label className="text-xs font-semibold text-stone-500 mb-1.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-brand-orange" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
              className="bg-orange-50/30 border border-orange-200 rounded-xl py-2.5 px-4 text-stone-800 focus:outline-none focus:border-brand-orange transition-colors text-sm font-poppins"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-orange-glow py-3 rounded-xl font-bold mt-4 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>

        </form>

        <div className="mt-6 flex items-center gap-1.5 p-3 rounded-xl bg-orange-50 border border-orange-200 text-[11px] text-stone-500 font-semibold">
          <ShieldAlert className="w-4 h-4 text-brand-orange shrink-0" />
          <span>Default credentials: <strong className="text-stone-700">admin</strong> / <strong className="text-stone-700">admin123</strong></span>
        </div>

      </div>

    </div>
  );
}
