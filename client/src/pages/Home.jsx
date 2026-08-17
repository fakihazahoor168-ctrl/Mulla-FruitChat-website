import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Clock, Award, Users, Heart, Star, Quote, ArrowRight, 
  Plus, ShieldAlert, MapPin, Phone, Mail, Facebook, Instagram, MessageCircle, 
  Globe, Navigation, ExternalLink, Calendar, Sparkles, Flame
} from 'lucide-react';
import Hero from '../components/Hero';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Per-item images for Famous Items section
const ITEM_IMAGES = {
  'Zinger Burger':                                    '/categories/zinger burger.png',
  'Cream Chaat (Plate)':                              '/categories/cream chaat.jpg',
  'Special Ice Cream (Pista, Choc, Mango, Vanilla)':  '/categories/milkshake.png',
  'Platter Shawarma':                                 '/categories/shawarma.png',
};

const ICE_CREAM_FLAVORS = [
  { id: 'Pista', nameEn: 'Pista', nameUr: 'پستہ', emoji: '🥜' },
  { id: 'Chocolate', nameEn: 'Chocolate', nameUr: 'چاکلیٹ', emoji: '🍫' },
  { id: 'Mango', nameEn: 'Mango', nameUr: 'مینگو', emoji: '🥭' },
  { id: 'Vanilla', nameEn: 'Vanilla', nameUr: 'ونیلا', emoji: '🍦' },
  { id: 'Strawberry', nameEn: 'Strawberry', nameUr: 'اسٹرابیری', emoji: '🍓' },
  { id: 'Elaichi', nameEn: 'Elaichi', nameUr: 'الائچی', emoji: '🌿' },
];

export default function Home() {
  const { t, isRtl } = useLanguage();
  const { addToCart } = useCart();
  const [famousItems, setFamousItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedFlavors, setSelectedFlavors] = useState({});

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter for specific signature items
          const selected = data.filter(item => 
            item.nameEnglish === 'Zinger Burger' || 
            item.nameEnglish === 'Cream Chaat (Plate)' || 
            item.nameEnglish === 'Special Ice Cream (Pista, Choc, Mango, Vanilla)' || 
            item.nameEnglish === 'Platter Shawarma'
          );
          setFamousItems(selected);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching famous items:', err);
        setLoading(false);
      });
  }, []);

  const handleSizeChange = (itemId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: size }));
  };

  const handleFlavorChange = (itemId, flavor) => {
    setSelectedFlavors((prev) => ({ ...prev, [itemId]: flavor }));
  };

  const handleAddToCart = (item) => {
    const hasSizes = item.sizes && Object.keys(item.sizes).length > 0;
    let selectedSize = null;
    if (hasSizes) {
      selectedSize = selectedSizes[item._id] || Object.keys(item.sizes)[0];
    }
    const isIceCream = item.category === 'Ice Cream' || item.nameEnglish.toLowerCase().includes('ice cream');
    let selectedFlavor = null;
    if (isIceCream) {
      selectedFlavor = selectedFlavors[item._id] || ICE_CREAM_FLAVORS[0].id;
    }
    addToCart(item, selectedSize, selectedFlavor);
    const displayName = isRtl ? item.nameUrdu : item.nameEnglish;
    const sizeLabel = selectedSize ? ` (${selectedSize})` : '';
    const flavorLabel = selectedFlavor ? ` [${selectedFlavor}]` : '';
    toast.success(`${displayName}${sizeLabel}${flavorLabel} ${t('addedToCart')}`);
  };

  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      titleEn: '60 Years of Legacy',
      titleUr: '60 سالہ روایت',
      descEn: 'Est. 1966. Serving authentic and pure tastes passed down through generations.',
      descUr: '1966 سے قائم شدہ۔ نسل در نسل منتقل ہونے والے خالص اور مستند ذائقے کی خدمت۔'
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      titleEn: '100% Fresh & Pure',
      titleUr: '100% تازہ اور خالص',
      descEn: 'Only the finest premium fruits and ingredients reach our kitchen every day.',
      descUr: 'روزانہ صرف بہترین اور اعلیٰ ترین پھل اور اشیاء ہمارے کچن تک پہنچتی ہیں۔'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      titleEn: 'Fast Doorstep Delivery',
      titleUr: 'تیز ترین ہوم ڈیلیوری',
      descEn: 'Hot crispy chicken and fresh juices delivered quick to preserve perfect taste.',
      descUr: 'مکمل ذائقہ برقرار رکھنے کے لیے گرم کرسپی چکن اور تازہ جوسز گھر پر تیز ترین ڈیلیور۔'
    }
  ];

  const testimonials = [
    {
      name: 'Kamran Mughal',
      rating: 5,
      commentEn: 'Mulla Fruit Chat is unmatched! The cream fruit chat is loaded with fresh fruits, and their special milkshakes are extremely thick and delicious. Highly recommended!',
      commentUr: 'ملا فروٹ چاٹ کا کوئی مقابلہ نہیں! کریم فروٹ چاٹ تازہ پھلوں سے بھری ہوتی ہے، اور ان کے اسپیشل ملک شیک انتہائی گاڑھے اور لذیذ ہوتے ہیں۔'
    },
    {
      name: 'Sana Fatima',
      rating: 5,
      commentEn: 'Their crispy fried chicken is so crunchy and juicy inside, better than big international brands! And the Nectar of Pomegranate juice is pure heaven.',
      commentUr: 'ان کا کرسپی فرائیڈ چکن اندر سے انتہائی رسیلا اور باہر سے کرچی ہے! اور انار کا تازہ جوس تو کمال ہے۔'
    },
    {
      name: 'Bilal Khan',
      rating: 5,
      commentEn: 'Serving taste for generations. My grandfather used to visit them, and now I order online. Their user experience and live tracking are super convenient.',
      commentUr: 'نسلوں سے ذائقہ فراہم کر رہے ہیں۔ میرے دادا وہاں جایا کرتے تھے، اور اب میں آن لائن آرڈر کرتا ہوں۔ ان کا لائیو ٹریکنگ سسٹم لاجواب ہے۔'
    }
  ];

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      
      {/* Hero Section */}
      <Hero />

      {/* Why Choose Us Section (Side Slide-in Cards) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
            {isRtl ? 'ہمیں کیوں منتخب کریں؟' : 'Why Choose Mulla?'}
          </h2>
          <div className="w-16 h-1 bg-brand-orange mx-auto mt-3 rounded-full" />
          <p className="text-stone-500 text-xs md:text-sm mt-3 font-semibold">
            {isRtl ? 'وہ باتیں جو ہمیں دوسروں سے منفرد بناتی ہیں' : 'What makes us stand out from the rest'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            // Alternating entrance animation: 0 -> Left (-60), 1 -> Bottom (60), 2 -> Right (60)
            const initialPos = idx === 0 ? { opacity: 0, x: -70 } : idx === 1 ? { opacity: 0, y: 70 } : { opacity: 0, x: 70 };
            return (
              <motion.div
                key={idx}
                initial={initialPos}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.04, y: -8 }}
                transition={{ duration: 0.6, delay: idx * 0.15, type: 'spring', stiffness: 100 }}
                className="bg-white p-8 rounded-3xl border border-amber-200/60 shadow-md hover:shadow-2xl transition-all flex flex-col items-center text-center space-y-4 group"
              >
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/60 group-hover:scale-110 group-hover:bg-brand-orange transition-all duration-300 text-brand-orange group-hover:text-white">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-extrabold text-stone-850">
                  {isRtl ? feat.titleUr : feat.titleEn}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                  {isRtl ? feat.descUr : feat.descEn}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Famous / Signature Items Section (Staggered Side Slides) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 rounded-full text-brand-orange text-xs font-black mb-2">
            <Flame className="w-3.5 h-3.5" />
            <span>BESTSELLERS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
            {isRtl ? 'ہمارے مشہور آئٹمز' : 'Our Famous Items'}
          </h2>
          <div className="w-16 h-1 bg-brand-orange mx-auto mt-3 rounded-full" />
          <p className="text-stone-500 text-xs md:text-sm mt-3 font-semibold">
            {isRtl ? 'سب سے زیادہ پسند کیے جانے والے ذائقے' : 'Top requested signature dishes loved by everyone'}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {famousItems.map((item, index) => {
              const hasSizes = item.sizes && Object.keys(item.sizes).length > 0;
              const sizeList = hasSizes ? Object.keys(item.sizes) : [];
              const activeSize = selectedSizes[item._id] || (sizeList.length > 0 ? sizeList[0] : null);
              const isIceCream = item.category === 'Ice Cream' || item.nameEnglish.toLowerCase().includes('ice cream');
              const activeFlavor = isIceCream ? (selectedFlavors[item._id] || ICE_CREAM_FLAVORS[0].id) : null;
              const itemPrice = hasSizes ? item.sizes[activeSize] : item.price;
              const imgSrc = ITEM_IMAGES[item.nameEnglish] || '/logo.jpg';

              // Alternate slide direction: Even from Left (-60px), Odd from Right (60px)
              const cardInitial = index % 2 === 0 ? { opacity: 0, x: -60 } : { opacity: 0, x: 60 };

              return (
                <motion.div
                  key={item._id}
                  initial={cardInitial}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="group premium-card overflow-hidden flex flex-col justify-between relative bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="w-full h-44 overflow-hidden relative bg-stone-100 img-zoom-wrapper border-b border-amber-100">
                    <img
                      src={imgSrc}
                      alt={item.nameEnglish}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-2.5 text-[9px] text-white bg-brand-orange px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
                      {t(`categories.${item.category}`)}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-stone-850 font-extrabold group-hover:text-brand-orange transition-colors duration-300 line-clamp-1 text-xs tracking-wide">
                          {item.nameEnglish}
                        </h3>
                        <span className="shrink-0 inline-flex items-center gap-0.5 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold text-amber-800">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <span>{item.rating || 5.0}</span>
                        </span>
                      </div>
                      <p className="text-stone-450 text-[11px] font-urdu leading-relaxed mt-1">
                        {item.nameUrdu}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-brand-creamBorder/30 space-y-2">
                      {hasSizes && (
                        <div>
                          <div className="flex gap-1 bg-brand-cream border border-brand-creamBorder/60 p-0.5 rounded-lg">
                            {sizeList.map((size) => (
                              <button
                                key={size}
                                onClick={() => handleSizeChange(item._id, size)}
                                className={`flex-1 text-[9px] font-extrabold py-1 rounded transition-all ${
                                  activeSize === size
                                    ? 'bg-brand-orange text-white shadow-sm'
                                    : 'text-stone-550 hover:text-brand-orange'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {isIceCream && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[9px] text-stone-500 font-extrabold uppercase">
                              {isRtl ? 'ذائقہ:' : 'Flavor:'}
                            </label>
                            <span className="text-[9px] font-black text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-200">
                              🍨 {ICE_CREAM_FLAVORS.find(f => f.id === activeFlavor)?.[isRtl ? 'nameUr' : 'nameEn'] || activeFlavor}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 bg-pink-50/50 border border-pink-200/60 p-1 rounded-lg">
                            {ICE_CREAM_FLAVORS.map((flv) => (
                              <button
                                key={flv.id}
                                type="button"
                                onClick={() => handleFlavorChange(item._id, flv.id)}
                                className={`text-[9px] font-extrabold py-0.5 px-1 rounded transition-all flex items-center justify-center gap-0.5 ${
                                  activeFlavor === flv.id
                                    ? 'bg-pink-500 text-white shadow-xs'
                                    : 'bg-white text-stone-700 hover:text-pink-600 border border-pink-100'
                                }`}
                              >
                                <span>{flv.emoji}</span>
                                <span className="truncate">{isRtl ? flv.nameUr : flv.nameEn}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-brand-orange text-base font-black">
                          {itemPrice} <span className="text-[9px] text-stone-400 font-bold uppercase">{t('pkr')}</span>
                        </span>

                        {item.isAvailable ? (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="btn-orange-glow px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3 stroke-[3]" />
                            <span>{t('addToCart')}</span>
                          </button>
                        ) : (
                          <span className="text-red-500 text-[8px] font-bold py-1 px-2 rounded-lg bg-red-50 border border-red-200">
                            {t('itemOutOfStock')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-brand-orange hover:text-brand-orangeDark font-bold text-sm transition-colors group"
          >
            <span>{isRtl ? 'مکمل مینو دیکھیں' : 'See Full Menu'}</span>
            <ArrowRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Legacy Story Section (Left Logo Slide & Right Text Slide) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 py-16 rounded-[2.5rem] border border-amber-200/60 grid grid-cols-1 md:grid-cols-2 gap-12 items-center overflow-hidden">
        {/* Left Side Slide in with slight rotation */}
        <motion.div
          initial={{ opacity: 0, x: -80, rotate: -4 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="flex justify-center"
        >
          <img
            src="/logo.jpg"
            alt="Mulla Legacy"
            className="w-auto h-64 md:h-80 rounded-[2rem] object-contain border-4 border-brand-orange shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* Right Side Slide in */}
        <motion.div 
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-extrabold">
            <Heart className="w-3.5 h-3.5 fill-brand-orange" />
            <span>SINCE 1966</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
            {isRtl ? '60 سالہ لازوال ذائقہ کا سفر' : 'Our Story of 60 Years'}
          </h2>

          <p className="text-stone-600 text-sm leading-relaxed font-semibold">
            {isRtl
              ? 'ملا فروٹ چاٹ اور فریش جوسز کی بنیاد 1966 میں رکھی گئی تھی۔ ہمارا مقصد ہمیشہ سے خالص پھلوں اور بہترین اجزاء کی مدد سے ایسا ذائقہ فراہم کرنا رہا ہے جو لوگوں کے دلوں میں گھر کر جائے۔ ہماری ہر پراڈکٹ اور ریسیپی وقت کی آزمودہ ہے اور آج بھی وہی پرانا روایتی معیار برقرار رکھے ہوئے ہے۔'
              : 'Founded in 1966, Mulla Fruit Chat & Fresh Juices has grown from a humble local spot into a symbol of purity and legacy. For six decades, our commitment has remained unchanged: sourcing the freshest fruits, using premium ingredients, and crafting flavors that leave a lasting memory. Taste the tradition that has delighted families for generations.'}
          </p>

          <Link
            to="/menu"
            className="btn-orange-glow px-8 py-3.5 rounded-2xl font-bold inline-flex items-center gap-2 hover:scale-105 transition-all shadow-md"
          >
            <span>{isRtl ? 'ہمارا مینو دیکھیں' : 'View Our Menu'}</span>
            <ArrowRight className={`w-4.5 h-4.5 ${isRtl ? 'rotate-180' : ''}`} />
          </Link>
        </motion.div>
      </section>

      {/* Testimonials (Staggered Bottom Up Slide-in) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">
            {isRtl ? 'ہمارے گاہک کیا کہتے ہیں' : 'What Our Clients Say'}
          </h2>
          <div className="w-16 h-1 bg-brand-orange mx-auto mt-3 rounded-full" />
          <p className="text-stone-500 text-xs md:text-sm mt-3 font-semibold">
            {isRtl ? 'خالص اور سچے ریویوز' : 'Real experiences shared by our beloved customers'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, idx) => {
            const testiInitial = idx === 0 ? { opacity: 0, x: -70 } : idx === 1 ? { opacity: 0, y: 70, scale: 0.9 } : { opacity: 0, x: 70 };
            return (
              <motion.div
                key={idx}
                initial={testiInitial}
                whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md flex flex-col justify-between hover:shadow-xl transition-all relative"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-orange/10 rotate-180 pointer-events-none" />
                
                <div className="space-y-4">
                  <div className="flex gap-0.5">
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className={`text-stone-600 text-xs leading-relaxed italic ${isRtl ? 'text-right font-urdu' : 'text-left'}`}>
                    "{isRtl ? testi.commentUr : testi.commentEn}"
                  </p>
                </div>

                <div className={`mt-6 pt-4 border-t border-stone-150 flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center font-black text-sm border border-brand-orange/20 shadow-sm">
                    {testi.name[0]}
                  </div>
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <h4 className="font-extrabold text-stone-800 text-xs">{testi.name}</h4>
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Verified Customer</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 📍 CONTACT US SECTION (Left Cards Slide & Right Map Slide) */}
      <section id="contact" className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-brand-orange text-xs font-black uppercase tracking-wider mb-3">
            <MapPin className="w-4 h-4 text-brand-orange" />
            <span>{isRtl ? 'ہمیں تلاش کریں' : 'Visit & Order'}</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight">
            {isRtl ? 'ہم سے رابطہ کریں' : 'Contact Us'}
          </h2>
          <div className="w-20 h-1 bg-brand-orange mx-auto mt-3 rounded-full" />
          <p className="text-stone-500 text-xs md:text-sm mt-3 font-semibold max-w-lg mx-auto">
            {isRtl 
              ? 'ہم سے ملیں، آن لائن آرڈر کریں یا براہِ راست کال کر کے معلومات حاصل کریں۔' 
              : 'Visit our flagship outlet, place an order online, or reach out for catering inquiries.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Details Cards (Sliding in from LEFT with spring animation) */}
          <motion.div 
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 90 }}
            className="lg:col-span-5 space-y-5 flex flex-col justify-between"
          >
            {/* Address Card */}
            <motion.div
              whileHover={{ scale: 1.02, x: 5 }}
              className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-md hover:shadow-xl transition-all flex items-start gap-4"
            >
              <div className="p-3 bg-gradient-to-br from-brand-orange to-amber-500 text-white rounded-2xl shrink-0 shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <h4 className="text-stone-900 font-extrabold text-sm mb-1">
                  {isRtl ? 'مقام اور پتہ' : 'Restaurant Address'}
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed font-medium">
                  {isRtl 
                    ? 'RC6X+X7G تحصیل روڈ، بلاک-F، اوکاڑہ 56300، پاکستان'
                    : 'RC6X+X7G Tehsil Road, Block-F, Okara 56300, Pakistan'}
                </p>
              </div>
            </motion.div>

            {/* Phone Card */}
            <motion.div
              whileHover={{ scale: 1.02, x: 5 }}
              className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-md hover:shadow-xl transition-all flex items-start gap-4"
            >
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shrink-0 shadow-md">
                <Phone className="w-6 h-6" />
              </div>
              <div className={`flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                <h4 className="text-stone-900 font-extrabold text-sm mb-1">
                  {isRtl ? 'فون نمبرز' : 'Phone Numbers'}
                </h4>
                <div className="flex flex-col gap-1 text-xs font-bold text-stone-700">
                  <a href="tel:+923001234567" className="hover:text-brand-orange transition-colors flex items-center gap-1.5">
                    <span>+92 300 1234567</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">Hotline</span>
                  </a>
                  <a href="tel:+92519876543" className="hover:text-brand-orange transition-colors">
                    +92 51 9876543
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div
              whileHover={{ scale: 1.02, x: 5 }}
              className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-md hover:shadow-xl transition-all flex items-start gap-4"
            >
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shrink-0 shadow-md">
                <Mail className="w-6 h-6" />
              </div>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <h4 className="text-stone-900 font-extrabold text-sm mb-1">
                  {isRtl ? 'ای میل ایڈریس' : 'Email Support'}
                </h4>
                <a href="mailto:info@mullafreshjuices.com" className="text-xs text-stone-600 font-semibold hover:text-brand-orange transition-colors block">
                  info@mullafreshjuices.com
                </a>
                <a href="mailto:orders@mullafreshjuices.com" className="text-xs text-stone-600 font-semibold hover:text-brand-orange transition-colors block mt-0.5">
                  orders@mullafreshjuices.com
                </a>
              </div>
            </motion.div>

            {/* Opening Hours Card */}
            <motion.div
              whileHover={{ scale: 1.02, x: 5 }}
              className="bg-gradient-to-br from-stone-900 to-stone-800 text-white p-5 rounded-3xl shadow-xl flex items-start gap-4 border border-stone-700"
            >
              <div className="p-3 bg-amber-500 text-stone-900 rounded-2xl shrink-0 shadow-md">
                <Clock className="w-6 h-6" />
              </div>
              <div className={`flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                <h4 className="font-black text-sm mb-1 text-amber-400">
                  {isRtl ? 'اوقات کار' : 'Opening Hours'}
                </h4>
                <div className="text-xs text-stone-300 space-y-1 font-medium">
                  <p className="flex justify-between border-b border-stone-700/60 pb-1">
                    <span>Mon – Sun:</span>
                    <span className="font-bold text-white">11:00 AM – 02:00 AM</span>
                  </p>
                  <p className="flex justify-between text-[11px] text-amber-200/80 pt-0.5">
                    <span>Lunch Deals:</span>
                    <span>12:00 PM – 04:00 PM</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Social Media Links Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-md text-center"
            >
              <h4 className="text-stone-900 font-black text-xs uppercase tracking-wider mb-3">
                {isRtl ? 'سوشل میڈیا پر فالو کریں' : 'Connect With Us'}
              </h4>
              <div className="flex items-center justify-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:scale-110 transition-all shadow-xs"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center hover:bg-pink-600 hover:text-white hover:scale-110 transition-all shadow-xs"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:scale-110 transition-all shadow-xs"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href="https://mullafreshjuices.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-2xl bg-amber-50 text-brand-orange border border-amber-200 flex items-center justify-center hover:bg-brand-orange hover:text-white hover:scale-110 transition-all shadow-xs"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column: Embedded Google Map (Sliding in from RIGHT with spring animation) */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 90 }}
            className="lg:col-span-7 bg-white p-4 rounded-3xl border border-amber-200/80 shadow-xl flex flex-col justify-between relative overflow-hidden min-h-[420px]"
          >
            <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden relative border border-stone-200">
              <iframe
                title="Mulla Fresh Juices Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3472.3!2d73.4536!3d30.8092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3922922e4b7b6b41%3A0x0!2sRC6X%2BX7G%20Tehsil%20Road%2C%20Block-F%2C%20Okara%2C%2056300%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000001!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[400px]"
              />

              {/* Map Floating Badge */}
              <div className="absolute top-4 left-4 bg-stone-900/90 text-white backdrop-blur-md px-4 py-2 rounded-2xl border border-stone-700 shadow-xl flex items-center gap-2 text-xs font-bold pointer-events-none">
                <Navigation className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Mulla Fresh Juices & Fried Chicken Outlet</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
              <div className="text-xs text-stone-500 font-semibold">
                📍 Tehsil Road, Block-F, Okara 56300
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=RC6X%2BX7G+Tehsil+Road+Block-F+Okara+56300+Pakistan"
                target="_blank"
                rel="noreferrer"
                className="btn-orange-glow px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
