import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { t, isRtl } = useLanguage();
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-brand-orange shadow-md">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-stone-700">{t('emptyCart')}</h2>
        <p className="text-stone-400 text-sm">
          {isRtl
            ? 'مینو پر جائیں اور کچھ لذیذ کھانا شامل کریں۔'
            : 'Explore our catalog and add mouth-watering dishes to your cart.'}
        </p>
        <Link
          to="/menu"
          className="btn-orange-glow px-6 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 mt-2"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{t('goMenu')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">

      {/* Title */}
      <h2 className={`text-2xl md:text-3xl font-extrabold text-stone-800 mb-6 ${isRtl ? 'font-urdu' : 'font-poppins'}`}>
        {t('cartSummary')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item._id}-${item.size}-${item.flavor}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-orange-100 hover:border-brand-orange/30 hover:shadow-sm transition-all"
            >
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className={`flex flex-wrap items-baseline gap-2 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-stone-800 font-bold text-sm md:text-base truncate">
                    {isRtl ? item.nameUrdu : item.nameEnglish}
                  </h3>
                  {item.size && (
                    <span className="text-[10px] bg-orange-100 text-brand-orange font-extrabold px-2 py-0.5 rounded-full border border-orange-200">
                      {item.size}
                    </span>
                  )}
                  {item.flavor && (
                    <span className="text-[10px] bg-pink-100 text-pink-700 font-extrabold px-2 py-0.5 rounded-full border border-pink-200">
                      🍨 {item.flavor}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">{t(`categories.${item.category}`)}</p>
                <div className="text-brand-orange font-bold text-xs mt-1">
                  {item.price} {t('pkr')}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg p-1">
                <button
                  onClick={() => updateQuantity(item._id, item.size, item.flavor, -1)}
                  className="p-1 hover:bg-orange-100 text-stone-500 hover:text-brand-orange rounded transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-stone-700 px-2 min-w-6 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item._id, item.size, item.flavor, 1)}
                  className="p-1 hover:bg-orange-100 text-stone-500 hover:text-brand-orange rounded transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right min-w-20">
                <span className="text-stone-700 font-bold text-sm">
                  {item.price * item.quantity} {t('pkr')}
                </span>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeFromCart(item._id, item.size, item.flavor)}
                className="p-1.5 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Actions */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={clearCart}
              className="text-stone-400 hover:text-red-500 text-xs font-semibold underline underline-offset-4 transition-colors"
            >
              {t('clearCart')}
            </button>
            <Link
              to="/menu"
              className="text-brand-orange hover:text-brand-orangeDark text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              <span>{isRtl ? 'مزید شامل کریں' : 'Add More Items'}</span>
            </Link>
          </div>
        </div>

        {/* Checkout Summary */}
        <div
          className="p-6 rounded-2xl h-fit"
          style={{ background: 'rgba(255,248,239,0.95)', border: '1px solid rgba(245,130,32,0.25)', boxShadow: '0 4px 20px rgba(245,130,32,0.08)' }}
        >
          <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-orange-100 pb-3">
            {isRtl ? 'بل کی تفصیل' : 'Payment Summary'}
          </h3>

          <div className="space-y-3 text-sm mb-4">
            <div className="flex justify-between text-stone-500">
              <span>{t('subtotal')}</span>
              <span>{totalAmount} {t('pkr')}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>{isRtl ? 'ڈیلیوری چارجز' : 'Delivery Charges'}</span>
              <span className="text-green-600 font-medium">{t('shipping')}</span>
            </div>
            <div className="border-t border-orange-100 my-3" />
            <div className="flex justify-between text-stone-800 font-extrabold text-base">
              <span>{t('total')}</span>
              <span className="text-brand-orange">{totalAmount} {t('pkr')}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full btn-orange-glow py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <span>{isRtl ? 'چیک آؤٹ کریں' : 'Proceed to Checkout'}</span>
            <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </Link>
        </div>

      </div>
    </div>
  );
}
