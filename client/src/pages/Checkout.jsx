import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShoppingBag, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { t, isRtl } = useLanguage();
  const { cartItems, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    orderNotes: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // If cart is empty, redirect to menu
  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
        <ShieldAlert className="w-12 h-12 text-brand-orange animate-bounce" />
        <h2 className="text-xl font-bold text-stone-700">{t('emptyCart')}</h2>
        <Link to="/menu" className="btn-orange-glow px-4 py-2 rounded-xl text-xs font-bold">
          {t('goMenu')}
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error(isRtl ? 'براہ کرم تمام لازمی فیلڈز پُر کریں۔' : 'Please fill all required fields.');
      return;
    }

    setSubmitting(true);

    // Map cart items for API payload
    const apiItems = cartItems.map((item) => ({
      menuItemId: item._id,
      name: `${item.nameEnglish}${item.size ? ` (${item.size})` : ''}${item.flavor ? ` [Flavor: ${item.flavor}]` : ''}`,
      price: item.price,
      quantity: item.quantity,
      size: item.size || undefined,
      flavor: item.flavor || undefined,
    }));

    const orderData = {
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      orderNotes: formData.orderNotes.trim(),
      items: apiItems,
      totalAmount,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Order placement failed');
      }

      const order = await response.json();
      toast.success(t('orderConfirmed'));
      clearCart();
      navigate(`/order-confirmation/${order._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(isRtl ? 'آرڈر دینے میں خرابی۔ دوبارہ کوشش کریں۔' : 'Error placing order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      
      {/* Back Button */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-stone-550 hover:text-brand-orange text-xs font-semibold mb-6 transition-colors"
      >
        <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
        <span>{isRtl ? 'کارٹ پر واپس جائیں' : 'Back to Cart'}</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Checkout Form */}
        <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-lg shadow-orange-100/40">
          <h2 className={`text-xl font-bold text-stone-850 mb-6 border-b border-orange-100 pb-3 ${isRtl ? 'font-urdu' : 'font-poppins'}`}>
            {t('checkoutFormTitle')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Customer Name */}
            <div className={`flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
              <label className="text-xs font-semibold text-stone-500 mb-1.5">
                {t('customerName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="bg-orange-50/30 border border-orange-200 rounded-xl py-2.5 px-4 text-stone-800 focus:outline-none focus:border-brand-orange transition-colors text-sm"
              />
            </div>

            {/* Phone Number */}
            <div className={`flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
              <label className="text-xs font-semibold text-stone-500 mb-1.5">
                {t('phone')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="e.g. 03001234567"
                className="bg-orange-50/30 border border-orange-200 rounded-xl py-2.5 px-4 text-stone-800 focus:outline-none focus:border-brand-orange transition-colors text-sm"
              />
            </div>

            {/* Delivery Address */}
            <div className={`flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
              <label className="text-xs font-semibold text-stone-500 mb-1.5">
                {t('address')} <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="bg-orange-50/30 border border-orange-200 rounded-xl py-2.5 px-4 text-stone-800 focus:outline-none focus:border-brand-orange transition-colors text-sm resize-none"
              />
            </div>

            {/* Order Notes */}
            <div className={`flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
              <label className="text-xs font-semibold text-stone-500 mb-1.5">
                {t('orderNotes')}
              </label>
              <textarea
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleChange}
                rows="2"
                className="bg-orange-50/30 border border-orange-200 rounded-xl py-2.5 px-4 text-stone-800 focus:outline-none focus:border-brand-orange transition-colors text-sm resize-none"
              />
            </div>

            {/* Payment Method - cash on delivery (Default) */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-stone-500 block mb-2">
                {t('paymentMethod')}
              </label>
              <div className="p-3 bg-orange-50/60 border border-orange-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-orange" />
                  <span className="text-xs font-bold text-stone-700">{t('cod')}</span>
                </div>
                <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-100 border border-orange-250">
                  {isRtl ? 'پہلے وصولی' : 'Default'}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-orange-glow py-3 rounded-xl font-bold mt-4 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('placingOrder')}</span>
                </>
              ) : (
                <span>{t('placeOrder')}</span>
              )}
            </button>

          </form>
        </div>

        {/* Order Review panel */}
        <div
          className="p-6 rounded-2xl h-fit shadow-md"
          style={{ background: 'rgba(255,248,239,0.95)', border: '1px solid rgba(245,130,32,0.25)' }}
        >
          <h3 className="text-lg font-bold text-stone-800 mb-4 border-b border-orange-100 pb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-orange" />
            <span>{isRtl ? 'آرڈر کا جائزہ' : 'Review Order'}</span>
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={`${item._id}-${item.size}-${item.flavor}`} className="flex justify-between items-center text-xs">
                <div className="min-w-0">
                  <div className="text-stone-850 font-semibold truncate flex items-center flex-wrap gap-1">
                    <span>{isRtl ? item.nameUrdu : item.nameEnglish}</span>
                    {item.size && (
                      <span className="text-[9px] bg-orange-100 text-brand-orange font-extrabold px-1.5 py-0.5 rounded-full border border-orange-200">
                        {item.size}
                      </span>
                    )}
                    {item.flavor && (
                      <span className="text-[9px] bg-pink-100 text-pink-700 font-extrabold px-1.5 py-0.5 rounded-full border border-pink-200">
                        🍨 {item.flavor}
                      </span>
                    )}
                  </div>
                  <div className="text-stone-400 mt-0.5">
                    {item.quantity} x {item.price} {t('pkr')}
                  </div>
                </div>
                <span className="text-stone-700 font-bold shrink-0">
                  {item.price * item.quantity} {t('pkr')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-orange-100 my-4" />

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-stone-500">
              <span>{t('subtotal')}</span>
              <span>{totalAmount} {t('pkr')}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>{isRtl ? 'ڈیلیوری' : 'Delivery'}</span>
              <span className="text-green-600 font-semibold">{t('shipping')}</span>
            </div>
            <div className="border-t border-orange-100 my-2" />
            <div className="flex justify-between text-sm font-extrabold text-stone-850">
              <span>{t('total')}</span>
              <span className="text-brand-orange text-base">{totalAmount} {t('pkr')}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
