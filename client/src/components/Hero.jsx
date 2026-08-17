import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, GlassWater, Flame, Star, Trophy, Clock, ShoppingBag, ShieldCheck, Heart, ChefHat, MessageSquare, IceCream, Sandwich } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero() {
  const { t, isRtl } = useLanguage();

  const menuCards = [
    {
      id: 0,
      name: isRtl ? 'آئس کریم' : 'Ice Cream',
      tag: isRtl ? 'بہترین میٹھا' : 'Sweet Delight',
      tagline: isRtl ? 'ٹھنڈی میٹھی خوشی' : 'Cool, Creamy & Irresistible',
      image: '/categories/cone icecream.jpg',
      price: 'Rs. 150',
      rating: 4.9,
      badge: isRtl ? '🍦 مشہور' : '🍦 Fan Favorite',
      accent: 'from-pink-500 to-rose-400',
      bg: 'from-pink-50 to-rose-50',
      border: 'border-pink-200',
      tagBg: 'bg-pink-100 text-pink-700 border-pink-200',
      badgeBg: 'bg-pink-50 border-pink-200 text-pink-600',
      glow: 'bg-pink-400/20',
    },
    {
      id: 1,
      name: isRtl ? 'فروٹ چاٹ' : 'Fruit Chat',
      tag: isRtl ? 'سگنیچر آئٹم' : 'Signature Item',
      tagline: isRtl ? 'تازہ پھلوں کا جادو' : 'Fresh Fruits, Pure Magic',
      image: '/categories/fruit chat.jpg',
      price: 'Rs. 250',
      rating: 4.8,
      badge: isRtl ? '🍓 بیسٹ سیلر' : '🍓 Best Seller',
      accent: 'from-orange-500 to-amber-400',
      bg: 'from-orange-50 to-amber-50',
      border: 'border-orange-200',
      tagBg: 'bg-orange-100 text-orange-700 border-orange-200',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
      glow: 'bg-orange-400/20',
    },
    {
      id: 2,
      name: isRtl ? 'شاورما' : 'Shawarma',
      tag: isRtl ? 'ہاٹ اینڈ سپائسی' : 'Hot & Spicy',
      tagline: isRtl ? 'مصالحے دار لذیذ رول' : 'Bold Spices, Wrapped Perfection',
      image: '/categories/Chicken Shawarma.jpg',
      price: 'Rs. 350',
      rating: 4.9,
      badge: isRtl ? '🌯 نئی آئٹم' : '🌯 Must Try',
      accent: 'from-red-500 to-orange-500',
      bg: 'from-red-50 to-orange-50',
      border: 'border-red-200',
      tagBg: 'bg-red-100 text-red-700 border-red-200',
      badgeBg: 'bg-red-50 border-red-200 text-red-600',
      glow: 'bg-red-400/20',
    },
  ];

  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % menuCards.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);


  return (
    <div className="relative overflow-hidden py-16 md:py-24 border-b border-brand-creamBorder/40 bg-gradient-to-br from-[#FFFDF9] via-[#FFF5EA] to-[#FFE8D2]">
      
      {/* Dynamic Background Glowing Spheres */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-orange-400/10 blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-amber-500/15 blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-400/5 blur-[180px] pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#E26A12_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* Text Area (Left Column - 7 cols) */}
        <div className={`lg:col-span-7 flex flex-col ${isRtl ? 'text-right items-end' : 'text-left items-start'} space-y-7`}>

          {/* Premium Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-brand-orange/30 text-brand-orange text-xs md:text-sm font-black shadow-sm backdrop-blur-md"
          >
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-orange" />
            </span>
            <Sparkles className="w-4 h-4 text-brand-orange" />
            <span>{isRtl ? 'صدیوں کی روایت • 100٪ خالص ذائقہ' : 'Est. 1966 • Authentic Legacy of Taste'}</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-black leading-[1.12] text-stone-900 tracking-tight ${isRtl ? 'font-urdu' : 'font-poppins'}`}
          >
            {isRtl ? (
              <>
                <span className="bg-gradient-to-r from-brand-orange via-amber-600 to-red-500 bg-clip-text text-transparent block drop-shadow-xs">
                  ملا فروٹ چاٹ جوسز
                </span>
                <span className="block mt-2 text-stone-800">
                  اور کرسپی فرائیڈ چکن
                </span>
              </>
            ) : (
              <>
                Savor the Legacy of{' '}
                <span className="bg-gradient-to-r from-brand-orange via-amber-500 to-red-500 bg-clip-text text-transparent inline-block">
                  Mulla Fruit Chat
                </span>
                <span className="block mt-2.5 text-stone-700 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide">
                  Fresh Juices & Crispy Chicken
                </span>
              </>
            )}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone-600 text-sm md:text-base leading-relaxed max-w-xl font-medium"
          >
            {isRtl
              ? '60 سالہ خاندانی روایت۔ ہمارے تازہ پھلوں سے بنے سگنیچر جوسز، فلیورڈ ملک شیکس، کریمی فروٹ چاٹ اور انتہائی خستہ فرائیڈ چکن کا ذائقہ چکھیں۔'
              : 'Serving authentic taste for 60+ years. Discover our signature fresh-squeezed juices, rich thick milkshakes, cream fruit chaat, and the crunchiest fried chicken in town.'}
          </motion.p>

          {/* Customer Rating Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3 p-2.5 px-4 bg-white/80 backdrop-blur-md rounded-2xl border border-brand-creamBorder/70 shadow-sm"
          >
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="/categories/mosambi juice.jpg" alt="User 1" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="/categories/zinger burger.png" alt="User 2" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="/categories/cream chaat.jpg" alt="User 3" />
            </div>
            <div className="flex flex-col text-xs">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="font-extrabold text-stone-800 ml-1">4.9 / 5.0</span>
              </div>
              <span className="text-stone-500 font-semibold text-[11px] mt-0.5">
                {isRtl ? '50,000+ خوشگوار آرڈرز' : 'Trusted by 50,000+ Happy Foodies'}
              </span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              to="/menu"
              className="btn-orange-glow px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2.5 hover:scale-[1.03] transition-all shadow-xl shadow-orange-500/20 group"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span>{t('heroCta')}</span>
              <ArrowRight className={`w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>

            <Link
              to="/deals"
              className="px-7 py-4 rounded-2xl font-extrabold text-sm text-stone-800 bg-white/90 border border-brand-creamBorder hover:bg-brand-cream hover:text-brand-orange transition-all shadow-sm flex items-center gap-2"
            >
              <Trophy className="w-4.5 h-4.5 text-amber-500" />
              <span>{isRtl ? 'اسپیشل ڈیلز' : 'Super Saver Deals'}</span>
            </Link>
          </motion.div>

        </div>

        {/* Left–Center–Right Fan Carousel (Right Column - 5 cols) */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center gap-6 pr-16">

          {/* Stage: fixed size, overflow visible so side cards peek out */}
          <div className="relative w-[240px] h-[410px]" style={{ overflow: 'visible' }}>

            {/* Glow blob tracks active card */}
            <motion.div
              animate={{ opacity: 1 }}
              className={`absolute inset-0 ${menuCards[activeCard].glow} blur-3xl rounded-[3rem] pointer-events-none`}
              style={{ zIndex: 0 }}
            />

            {menuCards.map((c, i) => {
              /**
               * distance 0 → CENTER  (active)
               * distance 1 → RIGHT   (next to come)
               * distance 2 → LEFT    (previous, peeks from left)
               *
               * Auto-rotate increments activeCard → right card slides to center,
               * center slides to left = right-to-left motion.
               */
              const distance = (i - activeCard + menuCards.length) % menuCards.length;

              const pos = [
                // center — full size, upright
                { x: 0,    y: 0,  rotate: 0,   scale: 1,    zIndex: 30, opacity: 1,    blur: 0 },
                // right peek — tilted right, partially visible
                { x: 155,  y: 18, rotate: 9,   scale: 0.78, zIndex: 20, opacity: 0.88, blur: 0 },
                // left peek — tilted left, partially visible
                { x: -155, y: 18, rotate: -9,  scale: 0.78, zIndex: 20, opacity: 0.88, blur: 0 },
              ][distance];

              const isActive = distance === 0;

              return (
                <motion.div
                  key={c.id}
                  animate={{
                    x: pos.x,
                    y: pos.y,
                    rotate: pos.rotate,
                    scale: pos.scale,
                    opacity: pos.opacity,
                  }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ zIndex: pos.zIndex }}
                  onClick={() => !isActive && setActiveCard(i)}
                  className={`absolute top-0 left-0 w-full rounded-[2rem] border shadow-2xl overflow-hidden
                    bg-gradient-to-br ${c.bg} ${c.border}
                    ${!isActive ? 'cursor-pointer hover:brightness-95' : ''}`}
                >
                  {/* Coloured top stripe */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${c.accent}`} />

                  <div className="p-5">
                    {/* Tag + badge row */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-full border ${c.tagBg}`}>
                        {c.tag}
                      </span>
                      <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-full border ${c.badgeBg}`}>
                        {c.badge}
                      </span>
                    </div>

                    {/* Food image */}
                    <div className="relative flex justify-center mb-4">
                      <div className={`p-1.5 bg-gradient-to-br ${c.accent} rounded-2xl shadow-lg`}>
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-44 h-36 object-cover rounded-xl"
                        />
                      </div>
                      {/* Soft glow under image */}
                      <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-28 h-3 bg-gradient-to-r ${c.accent} blur-xl opacity-40 rounded-full`} />
                    </div>

                    {/* Name + tagline */}
                    <div className="text-center mb-3">
                      <h3 className="text-xl font-black text-stone-900 tracking-tight">{c.name}</h3>
                      <p className="text-[11px] text-stone-500 font-semibold mt-0.5">{c.tagline}</p>
                    </div>

                    {/* Stars + price */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/60">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, si) => (
                          <Star key={si} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-[11px] font-black text-stone-700 ml-1">{c.rating}</span>
                      </div>
                      <span className={`text-sm font-black bg-gradient-to-r ${c.accent} bg-clip-text text-transparent`}>
                        {c.price}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Floating badge — top-left of stage */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -left-10 bg-white p-2.5 px-3.5 rounded-2xl shadow-xl border border-brand-creamBorder flex items-center gap-2 z-50"
            >
              <div className="p-1.5 bg-orange-100 rounded-xl text-brand-orange shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[9px] text-stone-400 font-bold uppercase">{isRtl ? 'ڈیلیوری' : 'Delivery'}</div>
                <div className="text-[11px] font-black text-stone-800">30 Mins</div>
              </div>
            </motion.div>

            {/* Floating badge — bottom-right of stage */}
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              className="absolute -bottom-6 -right-10 bg-white p-2.5 px-3.5 rounded-2xl shadow-xl border border-brand-creamBorder flex items-center gap-2 z-50"
            >
              <div className="p-1.5 bg-emerald-100 rounded-xl text-emerald-600 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[9px] text-stone-400 font-bold uppercase">{isRtl ? 'کوالٹی' : 'Hygienic'}</div>
                <div className="text-[11px] font-black text-stone-800">100% Fresh</div>
              </div>
            </motion.div>

          </div>

          {/* Dot navigation */}
          <div className="flex items-center gap-3">
            {menuCards.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveCard(i)}
                aria-label={`Show ${c.name}`}
                className={`rounded-full transition-all duration-300 ${
                  i === activeCard
                    ? `w-8 h-3 bg-gradient-to-r ${c.accent} shadow-md`
                    : 'w-3 h-3 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Modern Stats Counter Ribbon at Bottom */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-brand-creamBorder/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-white/60 border border-brand-creamBorder/50 shadow-2xs backdrop-blur-xs">
            <div className="text-2xl md:text-3xl font-black text-brand-orange">60+</div>
            <div className="text-xs text-stone-500 font-bold mt-0.5">{isRtl ? 'سالہ خاندانی روایت' : 'Years of Tradition'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/60 border border-brand-creamBorder/50 shadow-2xs backdrop-blur-xs">
            <div className="text-2xl md:text-3xl font-black text-brand-orange">98+</div>
            <div className="text-xs text-stone-500 font-bold mt-0.5">{isRtl ? 'لذیذ سگنیچر ڈشز' : 'Menu Specialties'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/60 border border-brand-creamBorder/50 shadow-2xs backdrop-blur-xs">
            <div className="text-2xl md:text-3xl font-black text-brand-orange">100%</div>
            <div className="text-xs text-stone-500 font-bold mt-0.5">{isRtl ? 'تازہ ترین پھل' : 'Fresh Ingredients'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/60 border border-brand-creamBorder/50 shadow-2xs backdrop-blur-xs">
            <div className="text-2xl md:text-3xl font-black text-brand-orange">4.9 ★</div>
            <div className="text-xs text-stone-500 font-bold mt-0.5">{isRtl ? 'کسٹمر ریٹنگ' : 'Customer Rating'}</div>
          </div>
        </div>
      </div>

    </div>
  );
}
