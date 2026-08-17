import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, totalAmount } = useCart();
  const { t, isRtl } = useLanguage();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 bottom-0 right-0 z-50 w-full max-w-md bg-white border-l border-brand-creamBorder/50 shadow-2xl flex flex-col justify-between`}
            style={{ backgroundColor: '#FFFBF7' }}
          >
            {/* Header */}
            <div className="p-5 border-b border-brand-creamBorder/40 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <ShoppingBag className="w-5.5 h-5.5 text-brand-orange" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-brand-orange text-white text-[9px] font-black rounded-full flex items-center justify-center">
                      {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-stone-800">
                  {isRtl ? 'آپ کا کارٹ' : 'Your Shopping Cart'}
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-xl hover:bg-brand-creamDark text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
                  <div className="w-16 h-16 rounded-full bg-brand-creamDark flex items-center justify-center text-brand-orange">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-stone-700">{t('emptyCart')}</h4>
                    <p className="text-xs text-stone-400 max-w-[240px] mx-auto">
                      {isRtl ? 'ہمارے مینو سے مزیدار پکوان شامل کریں۔' : 'Explore our menu and add items to satisfy your cravings!'}
                    </p>
                  </div>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    key={`${item._id}-${item.size}-${item.flavor}`}
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-brand-creamBorder/30 shadow-sm hover:border-brand-orange/20 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <h4 className="font-extrabold text-stone-850 text-xs truncate">
                          {isRtl ? item.nameUrdu : item.nameEnglish}
                        </h4>
                        {item.size && (
                          <span className="text-[8px] bg-orange-100 text-brand-orange font-black px-1.5 py-0.5 rounded border border-orange-200 uppercase">
                            {item.size}
                          </span>
                        )}
                        {item.flavor && (
                          <span className="text-[8px] bg-pink-100 text-pink-700 font-black px-1.5 py-0.5 rounded border border-pink-200 uppercase">
                            🍨 {item.flavor}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-brand-orange font-bold mt-1">
                        {item.price} {t('pkr')}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-brand-cream border border-brand-creamBorder/50 rounded-xl p-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(item._id, item.size, item.flavor, -1)}
                        className="p-1 hover:bg-white text-stone-500 rounded-lg transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-stone-800 w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.size, item.flavor, 1)}
                        className="p-1 hover:bg-white text-stone-500 rounded-lg transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(item._id, item.size, item.flavor)}
                      className="p-1.5 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-xl transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-brand-creamBorder/40 bg-white shadow-inner space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-stone-500">{isRtl ? 'ٹوٹل رقم' : 'Subtotal'}</span>
                  <span className="text-brand-orange text-lg font-black">{totalAmount} {t('pkr')}</span>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full btn-orange-glow py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  <span>{isRtl ? 'آرڈر مکمل کریں' : 'Proceed to Checkout'}</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
