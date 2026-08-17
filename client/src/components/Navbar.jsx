import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { language, toggleLanguage, t, isRtl } = useLanguage();
  const { totalQuantity, setIsCartOpen } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navigate = useNavigate();

  const links = [
    { name: t('navHome'), path: '/' },
    { name: t('navMenu'), path: '/menu' },
    { name: isRtl ? 'ڈیلز' : 'Deals', path: '/deals' },
    { name: t('navAdmin'), path: '/admin' }
  ];

  const handleContactClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const scrollToContact = () => {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation + render, then scroll
      setTimeout(scrollToContact, 300);
    } else {
      scrollToContact();
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b border-brand-creamBorder/40 shadow-sm px-4 py-3 md:px-8 transition-all duration-300"
      style={{ backgroundColor: 'rgba(255, 251, 247, 0.9)', backdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src="/logo.jpg"
              alt="Mulla Fresh Juices & Fried Chicken"
              className="h-12 w-auto rounded-xl object-contain border-2 border-brand-orange shadow-md transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute -inset-1 rounded-xl border border-brand-orange/30 animate-ping opacity-25 group-hover:hidden" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-brand-orange tracking-wide font-poppins leading-none group-hover:text-brand-orangeDark transition-colors">
              Mulla
            </span>
            <span className="text-[9px] text-stone-500 font-poppins font-bold tracking-widest uppercase mt-0.5">
              {t('tagline')}
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-semibold transition-all hover:text-brand-orange text-sm relative py-1 ${
                isActive(link.path)
                  ? 'text-brand-orange font-bold'
                  : 'text-stone-600'
              }`}
            >
              <span>{link.name}</span>
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange rounded-full animate-fade-in" />
              )}
            </Link>
          ))}
          {/* Contact — smooth scroll to #contact section */}
          <button
            onClick={handleContactClick}
            className={`font-semibold transition-all hover:text-brand-orange text-sm relative py-1 bg-transparent border-none cursor-pointer ${
              location.hash === '#contact'
                ? 'text-brand-orange font-bold'
                : 'text-stone-600'
            }`}
          >
            <span>{isRtl ? 'رابطہ' : 'Contact'}</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-3.5 py-1.5 rounded-xl border border-brand-creamBorder text-xs font-bold text-brand-orange hover:bg-brand-orange hover:text-white transition-all duration-300 bg-white shadow-sm hover:shadow-orange-200/50"
            title="Switch Language"
          >
            {language === 'en' ? 'اردو' : 'English'}
          </button>

          {/* Cart Icon Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-xl hover:bg-brand-creamDark text-stone-600 hover:text-brand-orange transition-all duration-300"
          >
            <ShoppingCart className="w-5.5 h-5.5" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center pulse-glow animate-bounce">
                {totalQuantity}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-stone-600 hover:text-brand-orange transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 animate-fade-in" /> : <Menu className="w-6 h-6 animate-fade-in" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-brand-creamBorder/40 flex flex-col gap-2.5 animate-slide-up">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-xl transition-all font-semibold ${
                isActive(link.path)
                  ? 'bg-brand-creamDark text-brand-orange'
                  : 'text-stone-600 hover:bg-orange-50/50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {/* Contact — smooth scroll */}
          <button
            onClick={handleContactClick}
            className="px-3 py-2 rounded-xl transition-all font-semibold text-left bg-transparent border-none cursor-pointer text-stone-600 hover:bg-orange-50/50"
          >
            {isRtl ? 'رابطہ' : 'Contact'}
          </button>
        </div>
      )}
    </nav>
  );
}
