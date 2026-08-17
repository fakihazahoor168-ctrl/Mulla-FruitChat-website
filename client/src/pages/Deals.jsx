import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Tag, Percent, ArrowRight, Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Deals() {
  const { t, isRtl } = useLanguage();
  const { addToCart } = useCart();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        // Filter items that belong to the 'Deals' category
        const dealsList = data.filter(item => item.category === 'Deals');
        setDeals(dealsList);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching deals:', err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (deal) => {
    addToCart(deal, null);
    const displayName = isRtl ? deal.nameUrdu : deal.nameEnglish;
    toast.success(`${displayName} ${t('addedToCart')}`);
  };

  // Helper to extract clean titles and descriptions
  const parseDealName = (fullName) => {
    const parts = fullName.split(' - ');
    if (parts.length > 1) {
      return {
        title: parts[0],
        description: parts[1]
      };
    }
    return {
      title: fullName,
      description: 'Special combo pack curated just for you.'
    };
  };

  // Fake original price to show discount percentage
  const getOriginalPrice = (price) => {
    return Math.round(price * 1.25);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      
      {/* Page Title */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 border border-red-200 text-red-650 text-xs font-black shadow-sm mb-4 animate-pulse"
        >
          <Percent className="w-4 h-4" />
          <span>LIMITED TIME OFFER</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl md:text-5xl font-black text-brand-orange leading-tight ${isRtl ? 'font-urdu' : 'font-poppins'}`}
        >
          {isRtl ? 'اسپیشل ڈیلز اور کمبوز' : 'Super Saver Deals'}
        </motion.h2>
        <div className="w-20 h-1 bg-brand-orange mx-auto mt-4 rounded-full" />
        <p className="text-stone-500 text-xs md:text-sm font-semibold mt-3">
          {isRtl ? 'بچت بھی، ذائقہ بھی! ابھی آرڈر کریں' : 'Delicious combinations crafted to save you money'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal, idx) => {
            const { title, description } = parseDealName(deal.nameEnglish);
            const originalPrice = getOriginalPrice(deal.price);
            const discountPercent = 20; // 20% discount shown visually

            // Alternate entrance direction: left (-60), bottom (60), right (60)
            const dealInitial = idx % 3 === 0 ? { opacity: 0, x: -70 } : idx % 3 === 1 ? { opacity: 0, y: 70 } : { opacity: 0, x: 70 };

            return (
              <motion.div
                key={deal._id}
                initial={dealInitial}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12, type: 'spring', stiffness: 95 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-[2.2rem] overflow-hidden border border-brand-creamBorder/50 shadow-premium hover:shadow-premium-hover flex flex-col justify-between relative group transition-all duration-300"
              >
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>SAVE {discountPercent}%</span>
                </div>

                {/* Banner / Visual Wrapper */}
                <div className="h-56 overflow-hidden bg-brand-cream relative">
                  <img
                    src={deal.image || "/categories/lunch deal.jpg"}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  
                  {/* Category overlay label */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur px-3.5 py-1.5 rounded-xl shadow-sm text-[11px] font-bold text-brand-orange border border-brand-creamBorder/50">
                    <Trophy className="w-4 h-4" />
                    <span>POPULAR CHOICE</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-7 flex flex-col flex-1 justify-between space-y-6">
                  <div className={`space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-stone-850 font-black text-lg md:text-xl group-hover:text-brand-orange transition-colors">
                      {isRtl ? deal.nameUrdu.split(' - ')[0] : title}
                    </h3>
                    <p className="text-xs md:text-sm text-stone-500 leading-relaxed font-semibold">
                      {isRtl ? (deal.nameUrdu.split(' - ')[1] || 'ایک اسپیشل اور لذیذ ڈیل پیکیج۔') : description}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-brand-creamBorder/30 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-stone-400 font-bold line-through">
                        Rs. {originalPrice}
                      </span>
                      <span className="text-brand-orange text-2xl font-black tracking-tight">
                        Rs. {deal.price}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleAddToCart(deal)}
                      className="group/btn relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-orange-700 text-white px-5 py-3 rounded-xl text-xs md:text-sm font-black tracking-wide shadow-[0_8px_20px_-4px_rgba(249,115,22,0.5)] hover:shadow-[0_12px_25px_-4px_rgba(249,115,22,0.75)] flex items-center gap-2.5 border border-white/30 transition-all duration-300"
                    >
                      <span className="w-7 h-7 rounded-full bg-white/25 border border-white/30 flex items-center justify-center shrink-0 shadow-inner group-hover/btn:rotate-90 group-hover/btn:bg-white/40 transition-all duration-300">
                        <Plus className="w-4 h-4 text-white stroke-[3]" />
                      </span>
                      <span className="drop-shadow-sm font-black">{isRtl ? 'ڈیل آرڈر کریں' : 'Add Deal'}</span>
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
