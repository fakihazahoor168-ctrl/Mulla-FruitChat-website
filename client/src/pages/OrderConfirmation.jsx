import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, Phone, User, Package, ArrowRight, MessageSquare, ChefHat, Truck, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export default function OrderConfirmation() {
  const { id } = useParams();
  const { t, isRtl } = useLanguage();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = () => {
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching order details:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrderDetails();

    // Auto refresh every 8 seconds as fallback
    const interval = setInterval(fetchOrderDetails, 8000);

    // Socket.io connection for real-time order status updates
    const socket = io('/', { path: '/socket.io' });

    socket.on('orderUpdated', (updatedOrder) => {
      if (updatedOrder._id === id) {
        setOrder(updatedOrder);
        toast.success(
          isRtl
            ? `آرڈر کا اسٹیٹس اپڈیٹ ہو گیا: ${updatedOrder.status}`
            : `Order status updated: ${updatedOrder.status}`
        );
      }
    });

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [id, isRtl]);

  const steps = [
    { key: 'Pending', labelEn: 'Order Placed', labelUr: 'آرڈر موصول', icon: <Package className="w-4 h-4" /> },
    { key: 'Preparing', labelEn: 'Preparing Food', labelUr: 'تیاری جاری', icon: <ChefHat className="w-4 h-4" /> },
    { key: 'Out for Delivery', labelEn: 'Out for Delivery', labelUr: 'ڈیلیوری پر روانہ', icon: <Truck className="w-4 h-4" /> },
    { key: 'Completed', labelEn: 'Delivered', labelUr: 'ڈیلیور ہو گیا', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Preparing': return 1;
      case 'Out for Delivery': return 2;
      case 'Completed': return 3;
      default: return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  const handleWhatsAppShare = () => {
    if (!order) return;

    const itemsSummary = order.items
      .map((item) => `• ${item.name} ${item.size ? `(${item.size})` : ''} x${item.quantity} - Rs. ${item.price * item.quantity}`)
      .join('\n');

    const trackUrl = window.location.href;

    const message = `*MULLA FRUIT CHAT ORDER CONFIRMATION* 🍓🍔
----------------------------------
*Order ID:* ${order._id}
*Customer:* ${order.customerName}
*Phone:* ${order.phone}
*Address:* ${order.address}

*ITEMS ORDERED:*
${itemsSummary}

*TOTAL AMOUNT:* Rs. ${order.totalAmount}
*STATUS:* ${order.status}

*Track Live Status:* ${trackUrl}
----------------------------------
Thank you for ordering from Mulla Fruit Chat! Est. 1966.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        <span className="text-stone-500">{isRtl ? 'لوڈ ہو رہا ہے...' : 'Fetching your order...'}</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-red-500">{isRtl ? 'آرڈر نہیں ملا' : 'Order Not Found'}</h2>
        <Link to="/menu" className="btn-orange-glow px-4 py-2 rounded-xl text-xs font-bold">
          {t('goMenu')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
      
      {/* Visual Header */}
      <div
        className="p-8 rounded-3xl flex flex-col items-center text-center mb-8 shadow-xl relative overflow-hidden bg-white border border-brand-creamBorder/50"
      >
        <div className="p-3 bg-green-100 rounded-full text-green-600 mb-4 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-stone-850">{t('orderConfirmed')}</h2>
        <p className="text-stone-500 text-sm mt-1 max-w-md leading-relaxed">
          {t('orderSuccessMsg')}
        </p>

        {/* WhatsApp Direct Action */}
        <button
          onClick={handleWhatsAppShare}
          className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all hover:scale-105"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>{isRtl ? 'واٹس ایپ پر آرڈر کی کاپی بھیجیں' : 'Send Order Receipt to WhatsApp'}</span>
        </button>

        <div className="w-full border-t border-brand-creamBorder/40 my-6" />

        {/* LIVE STEP TRACKER */}
        <div className="w-full my-4 px-2">
          <div className="flex justify-between items-center relative mb-2">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-brand-orange -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, idx) => {
              const isPassed = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isCurrent
                        ? 'bg-brand-orange text-white ring-4 ring-orange-200 scale-110 shadow-md'
                        : isPassed
                        ? 'bg-brand-orange text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span className={`text-[10px] font-extrabold mt-2 ${isPassed ? 'text-brand-orange' : 'text-stone-400'}`}>
                    {isRtl ? step.labelUr : step.labelEn}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full text-xs mt-6 pt-4 border-t border-brand-creamBorder/40">
          <div className="flex flex-col items-center">
            <span className="text-stone-400 font-semibold mb-1 uppercase tracking-wider">{t('orderId')}</span>
            <span className="text-stone-750 font-bold font-poppins text-xs select-all bg-orange-50 px-3 py-1 rounded border border-orange-200">
              {order._id}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-stone-400 font-semibold mb-1 uppercase tracking-wider">{isRtl ? 'اسٹیٹس' : 'Status'}</span>
            <span className="px-3 py-1 rounded-full font-black text-xs uppercase bg-amber-100 text-amber-800 border border-amber-300">
              {order.status}
            </span>
          </div>

          <div className="flex flex-col items-center col-span-2 md:col-span-1">
            <span className="text-stone-400 font-semibold mb-1 uppercase tracking-wider">{t('estTime')}</span>
            <div className="flex items-center gap-1 text-brand-orange font-bold">
              <Clock className="w-4 h-4" />
              <span>{t('minutes')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Customer Details Card */}
        <div className="bg-white p-6 rounded-3xl border border-brand-creamBorder/60 shadow-sm">
          <h3 className={`text-base font-extrabold text-stone-800 mb-4 border-b border-brand-creamBorder/40 pb-2.5 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <User className="w-4 h-4 text-brand-orange" />
            <span>{isRtl ? 'کسٹمر کی تفصیل' : 'Delivery Details'}</span>
          </h3>

          <div className={`space-y-4 text-xs ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-stone-400 font-semibold">{isRtl ? 'نام' : 'Customer Name'}</div>
                <div className="text-stone-750 font-bold text-sm mt-0.5">{order.customerName}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-stone-400 font-semibold">{isRtl ? 'فون نمبر' : 'Phone Number'}</div>
                <div className="text-stone-750 font-bold text-sm mt-0.5">{order.phone}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-stone-400 font-semibold">{isRtl ? 'پتہ' : 'Address'}</div>
                <div className="text-stone-750 font-bold mt-0.5 leading-relaxed">{order.address}</div>
              </div>
            </div>

            {order.orderNotes && (
              <div className="p-3 bg-orange-50/40 border border-orange-200 rounded-xl">
                <span className="text-[10px] text-stone-450 font-bold block mb-1 uppercase">
                  {isRtl ? 'آرڈر نوٹ' : 'Order Notes'}
                </span>
                <p className="text-stone-650 italic">{order.orderNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-brand-creamBorder/60 shadow-sm">
          <h3 className={`text-base font-extrabold text-stone-800 mb-4 border-b border-brand-creamBorder/40 pb-2.5 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Package className="w-4 h-4 text-brand-orange" />
            <span>{isRtl ? 'خریداری کا خلاصہ' : 'Items Ordered'}</span>
          </h3>

          <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-stone-850 font-bold">{item.name}</span>
                  {item.size && (
                    <span className="text-[9px] bg-orange-100 text-brand-orange font-bold px-1.5 py-0.5 rounded ml-1.5 border border-orange-200">
                      {item.size}
                    </span>
                  )}
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    {item.quantity} x {item.price} {t('pkr')}
                  </div>
                </div>
                <span className="text-stone-700 font-bold">
                  {item.price * item.quantity} {t('pkr')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-brand-creamBorder/40 my-4" />

          <div className="flex justify-between items-center font-extrabold text-sm text-stone-850">
            <span>{t('total')}</span>
            <span className="text-brand-orange text-lg">{order.totalAmount} {t('pkr')}</span>
          </div>
        </div>

      </div>

      <div className="text-center mt-8">
        <Link
          to="/menu"
          className="btn-orange-glow px-8 py-3 rounded-2xl font-bold inline-flex items-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <span>{t('goMenu')}</span>
          <ArrowRight className={`w-4.5 h-4.5 ${isRtl ? 'rotate-180' : ''}`} />
        </Link>
      </div>

    </div>
  );
}
