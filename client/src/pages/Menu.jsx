import React, { useState, useEffect } from 'react';
import { 
  Search, Flame, Award, ShieldAlert, Coffee, HelpCircle, Utensils, 
  GlassWater, Trophy, Pizza as PizzaIcon, Cake, Plus, Minus, Star, 
  X, Send, ArrowRight, ShoppingBag, Sparkles, Filter, Check, Clock, Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { FALLBACK_MENU_ITEMS } from '../data/fallbackMenu';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Category fallback images
const CATEGORY_IMAGES = {
  'Fresh Juices':   '/categories/fresh_juices.png',
  'Milk Shakes':    '/categories/milkshake.png',
  'Burgers':        '/categories/zinger burger.png',
  'Pizza':          '/categories/pizza.png',
  'Shawarma':       '/categories/shawarma.png',
  'Wings & Nuggets':'/categories/wings.png',
  'Paratha Rolls':  '/categories/shawarma.png',
  'Sandwiches':     '/categories/shawarma.png',
  'Pasta':          '/categories/cream.jpg',
  'Fruit Chaat':    '/categories/fruit chat.jpg',
  'Ice Cream':      '/categories/milkshake.png',
  'Cold Drinks':    '/categories/coca cola.jpg',
  'Deals':          '/categories/lunch deal.jpg',
};

// Per-item unique images mapped to public categories assets
const ITEM_IMAGES = {
  "Mosambi Juice": "/categories/mosambi juice.jpg",
  "Pomegranate Juice": "/categories/Pomegranate Juice.jpg",
  "Carrot Juice": "/categories/Carrot Juice.jpg",
  "Kino Juice": "/categories/kino juice.jpg",
  "Pineapple Juice": "/categories/Pineapple Juice.jpg",
  "Apple Juice": "/categories/Apple Juice.jpg",
  "Peach Juice": "/categories/Peach Juice.jpg",
  "Strawberry Juice": "/categories/Strawberry Juice.jpg",
  "Grape Fruit Juice": "/categories/grapefruit juice.jpg",
  "Meetha Juice": "/categories/meetah juice.jpg",
  "Guava Juice": "/categories/Guava Juice.jpg",
  "Plum Juice": "/categories/Plum Juice.jpg",
  "Falsa Juice": "/categories/Falsa Juice.jpg",
  "Cherry Juice": "/categories/cherry juice.jpg",
  "Banana Milk Shake": "/categories/banana milkshake.jpg",
  "Special Banana Milk Shake": "/categories/banana milkshake.jpg",
  "Mango Milk Shake": "/categories/mango milkshake.jpg",
  "Special Mango Milk Shake": "/categories/mango milkshake.jpg",
  "Apple Milk Shake": "/categories/Apple Milk Shake.jpg",
  "Special Apple Milk Shake": "/categories/Special Apple Milk Shake.jpg",
  "Pineapple Milk Shake": "/categories/Pineapple Juice.jpg",
  "Special Pineapple Milk Shake": "/categories/Pineapple Juice.jpg",
  "Dates Almond Milk Shake": "/categories/dates almond milkshake.jpg",
  "Special Dates Almond Milk Shake": "/categories/Special Dates Almond Milk Shake.jpg",
  "Strawberry Milk Shake": "/categories/Strawberry Milk Shake.jpg",
  "Special Strawberry Milk Shake": "/categories/Special Strawberry Milk Shake.jpg",
  "Special Cashew Pistachio Shake": "/categories/Special Cashew Pistachio Shake.jpg",
  "Special Ice Cream Shake": "/categories/Special Ice Cream Shake.jpg",
  "Peach Milk Shake": "/categories/Peach Milk Shake.jpg",
  "Pina Shake": "/categories/Pina Shake.jpg",
  "Chocolate Shake Special": "/categories/chocolate shake special.jpg",
  "Pina Colada Special": "/categories/Pina Colada Special.jpg",
  "Cream Chaat (Plate)": "/categories/cream chaat.jpg",
  "Fruit Chaat (Plate)": "/categories/fruit chat.jpg",
  "Chana Chaat (Plate)": "/categories/chana chaat.jpg",
  "Dahi Bhallay (Plate)": "/categories/dahi bhllay.jpg",
  "Russian Salad (Plate)": "/categories/russian salad.jpg",
  "Special Cone Ice Cream": "/categories/cone icecream.jpg",
  "Special Ice Cream (Pista, Choc, Mango, Vanilla)": "/categories/icecreams.jpg",
  "Egg Burger": "/categories/egg burger.jpg",
  "Double Egg Burger": "/categories/double egg burger.jpg",
  "Chicken Burger": "/categories/chicken burger.jpg",
  "Chicken Cheese Burger": "/categories/chicken chesee burger.jpg",
  "Zinger Burger": "/categories/zinger burger.png",
  "Zinger Cheese Burger": "/categories/zinger chesee burger.jpg",
  "Patty Burger": "/categories/paty burger.jpg",
  "Chapli Burger": "/categories/chapli burger.jpg",
  "Double Chapli Cheese Burger": "/categories/double chapli cheese burger.jpg",
  "Chicken Shawarma": "/categories/Chicken Shawarma.jpg",
  "Chicken Cheese Shawarma": "/categories/Chicken Cheese Shawarma.jpg",
  "Zinger Shawarma": "/categories/Zinger Shawarma.jpg",
  "Zinger Cheese Shawarma": "/categories/Zinger Cheese Shawarma.jpg",
  "Chapli Shawarma": "/categories/Chapli Shawarma.jpg",
  "Chapli Cheese Shawarma": "/categories/Chapli Cheese Shawarma.jpg",
  "Chicken Paratha Roll": "/categories/Chicken Paratha Roll.jpg",
  "Chicken Cheese Paratha Roll": "/categories/Chicken Cheese Paratha Roll.jpg",
  "Zinger Paratha Roll": "/categories/Zinger Paratha Roll.jpg",
  "Zinger Cheese Paratha Roll": "/categories/Zinger Cheese Paratha Roll.jpg",
  "Platter Shawarma": "/categories/Platter Shawarma.jpg",
  "Spin Roll": "/categories/Spin Roll.jpg",
  "Chilli Milli Roll": "/categories/Chilli Milli Roll.jpg",
  "Behari Roll": "/categories/Behari Roll.jpg",
  "Hot Wings": "/categories/Hot Wings.jpg",
  "Nuggets": "/categories/Nuggets.jpg",
  "Peri Peri Wings (10 pcs)": "/categories/Peri Peri Wings.jpg",
  "Bar B Q Wings (10 pcs)": "/categories/Bar B Q Wings (10 pcs).jpg",
  "Flaming Wings (10 pcs)": "/categories/Flaming Wings.jpg",
  "Chicken Fajita Pizza": "/categories/Chicken Fajita Pizza.jpg",
  "Peri Peri Pizza": "/categories/Peri Peri Pizza.jpg",
  "Chicken Euro Pizza": "/categories/Chicken Euro Pizza.jpg",
  "Chicken Special Pizza": "/categories/Chicken Special Pizza.jpg",
  "Italian Pizza": "/categories/Italian Pizza.jpg",
  "Chicken Supreme Pizza": "/categories/Chicken Supreme Pizza.jpg",
  "Chicken Tikka Pizza": "/categories/Chicken Tikka Pizza.jpg",
  "Bon Fire Pizza": "/categories/Bon Fire Pizza.jpg",
  "Napoleon Pizza": "/categories/Napoleon Pizza.jpg",
  "Malai Boti Pizza": "/categories/Malai Boti Pizza.jpg",
  "Behari Pizza": "/categories/Behari Pizza.jpg",
  "Crown Crust Pizza": "/categories/Crown Crust Pizza.jpg",
  "Kabab Stuffer Pizza": "/categories/Kabab Stuffer Pizza.jpg",
  "Chicken Cheese Stuffer": "/categories/Chicken Cheese Stuffer.jpg",
  "Chicken Cheese Stick": "/categories/Chicken Cheese Stick.jpg",
  "Pizza Sandwich": "/categories/Pizza Sandwich.jpg",
  "Chicken Sandwich Special": "/categories/Chicken Sandwich Special.jpg",
  "Creamy Pasta": "/categories/Creamy Pasta.jpg",
  "Flaming Pasta": "/categories/Flaming Pasta.jpg",
  "Crunchy Pasta": "/categories/Crunchy Pasta.jpg",
  "Smoke Crunchy Pasta": "/categories/Smoke Crunchy Pasta.jpg",
  "Coca Cola": "/categories/coca cola.jpg",
  "Tin Pack": "/categories/tin pack.jpg",
  "Mineral Water": "/categories/mineral water.jpg",
  "Dip Sauce": "/categories/dip sauce.jpg",
  "Lunch Deal (12:00 PM to 04:00 PM) - Large Pizza + Free 1.5 Ltr Coke": "/categories/lunch deal.jpg",
  "Midnight Deal (11:00 PM to 01:00 AM) - Large Pizza + Free 1.5 Ltr Coke": "/categories/midnight deal.jpg",
  "Mix Platter - Oven Baked Wings (10) + Spin Roll + 500ml Coke": "/categories/mix platter.jpg",
  "Deal: 2 Large Pizzas + 1.5 Ltr Coke": "/categories/deal 1.jpg",
  "Deal: 1 Medium Pizza + Spin Roll + 1.5 Ltr Coke": "/categories/deal 2.jpg",
  "Deal: 1 Medium Pizza + Oven Baked Wings (10) + Pasta + 1.5 Ltr Coke": "/categories/deall.jpg"
};

const ICE_CREAM_FLAVORS = [
  { id: 'Pista', nameEn: 'Pista', nameUr: 'پستہ', emoji: '🥜' },
  { id: 'Chocolate', nameEn: 'Chocolate', nameUr: 'چاکلیٹ', emoji: '🍫' },
  { id: 'Mango', nameEn: 'Mango', nameUr: 'مینگو', emoji: '🥭' },
  { id: 'Vanilla', nameEn: 'Vanilla', nameUr: 'ونیلا', emoji: '🍦' },
  { id: 'Strawberry', nameEn: 'Strawberry', nameUr: 'اسٹرابیری', emoji: '🍓' },
  { id: 'Elaichi', nameEn: 'Elaichi', nameUr: 'الائچی', emoji: '🌿' },
];

export default function Menu() {
  const { t, isRtl } = useLanguage();
  const { cartItems, addToCart, totalAmount, totalQuantity } = useCart();
  const [items, setItems] = useState(FALLBACK_MENU_ITEMS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedFlavors, setSelectedFlavors] = useState({});
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'
  const [quickFilter, setQuickFilter] = useState('all'); // 'all', 'deals', 'specials', 'fastfood', 'drinks'

  // Review Modal State
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchMenuItems = () => {
    fetch('/api/menu')
      .then((res) => {
        if (!res.ok) throw new Error('API fetch error');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch((err) => {
        console.warn('API fetch menu error, using fallback dataset:', err);
      });
  };

  useEffect(() => {
    fetchMenuItems();
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

  const getItemCartQuantity = (itemId, selectedSize, selectedFlavor) => {
    if (!cartItems) return 0;
    const cartItem = cartItems.find(
      (c) => c._id === itemId && c.size === selectedSize && c.flavor === selectedFlavor
    );
    return cartItem ? cartItem.quantity : 0;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName.trim()) {
      toast.error(isRtl ? 'براہ کرم اپنا نام درج کریں' : 'Please enter your name');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/menu/${reviewModalItem._id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: reviewName,
          rating: reviewRating,
          comment: reviewComment
        })
      });

      if (!res.ok) throw new Error('Failed to submit review');

      const updatedItem = await res.json();
      toast.success(isRtl ? 'آپ کی رائے کا شکریہ!' : 'Thank you for your review!');
      
      setItems((prev) => prev.map((it) => (it._id === updatedItem._id ? updatedItem : it)));
      setReviewModalItem(null);
      setReviewName('');
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(isRtl ? 'رائے جمع کرنے میں ناکامی' : 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const categories = [
    'All', 'Deals', 'Pizza', 'Burgers', 'Shawarma', 'Paratha Rolls',
    'Sandwiches', 'Wings & Nuggets', 'Pasta', 'Fresh Juices',
    'Milk Shakes', 'Fruit Chaat', 'Ice Cream', 'Cold Drinks'
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Deals':         return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'Pizza':         return <PizzaIcon className="w-5 h-5 text-brand-orange" />;
      case 'Burgers':       return <Flame className="w-5 h-5 text-red-500" />;
      case 'Shawarma':
      case 'Paratha Rolls': return <Utensils className="w-5 h-5 text-yellow-600" />;
      case 'Fresh Juices':
      case 'Milk Shakes':
      case 'Cold Drinks':   return <GlassWater className="w-5 h-5 text-cyan-500" />;
      case 'Ice Cream':
      case 'Fruit Chaat':   return <Cake className="w-5 h-5 text-pink-500" />;
      default:              return <Coffee className="w-5 h-5 text-stone-500" />;
    }
  };

  // Helper to get base price for sorting
  const getItemBasePrice = (item) => {
    if (item.price) return item.price;
    if (item.sizes && Object.keys(item.sizes).length > 0) {
      return Math.min(...Object.values(item.sizes));
    }
    return 0;
  };

  // Filter and sort items
  const getCategorizedData = () => {
    const query = searchQuery.toLowerCase().trim();
    
    const matchesSearchAndCategory = (item) => {
      // Category Tab Filter
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      
      // Search Query Filter
      const matchesSearch =
        query === '' ||
        item.nameEnglish.toLowerCase().includes(query) ||
        item.nameUrdu.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      // Quick Filter Chip Filter
      let matchesQuickFilter = true;
      if (quickFilter === 'deals') {
        matchesQuickFilter = item.category === 'Deals' || item.nameEnglish.toLowerCase().includes('deal');
      } else if (quickFilter === 'specials') {
        matchesQuickFilter = item.isSpecial;
      } else if (quickFilter === 'fastfood') {
        matchesQuickFilter = ['Burgers', 'Pizza', 'Shawarma', 'Paratha Rolls', 'Wings & Nuggets', 'Pasta'].includes(item.category);
      } else if (quickFilter === 'drinks') {
        matchesQuickFilter = ['Fresh Juices', 'Milk Shakes', 'Cold Drinks'].includes(item.category);
      }

      return matchesCategory && matchesSearch && matchesQuickFilter;
    };

    let filtered = items.filter(matchesSearchAndCategory);

    // Sorting Logic
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => getItemBasePrice(a) - getItemBasePrice(b));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => getItemBasePrice(b) - getItemBasePrice(a));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    const grouped = {};
    filtered.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  };

  const categorizedData = getCategorizedData();
  const activeCategories = Object.keys(categorizedData);
  const totalCartCount = totalQuantity || 0;

  // Chef Specials list for top featured bar
  const chefSpecials = items.filter((item) => item.isSpecial).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-24">

      {/* 1. Ultra-Modern Dark Luxury Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1E1712] via-[#2A1E17] to-[#FAF6F0] text-white pt-10 pb-20 px-4 md:px-8 border-b border-amber-900/20">
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-inner backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{isRtl ? '۶۰ سال کا لاجواب ذائقہ' : '60 Years of Culinary Mastery'}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-4 ${isRtl ? 'font-urdu' : 'font-poppins'}`}
          >
            <span className="text-white">{isRtl ? 'ملا فریش' : 'Mulla '}</span>
            <span className="shimmer-text">{isRtl ? ' مینو' : 'Gourmet Menu'}</span>
          </motion.h1>

          <p className="max-w-2xl mx-auto text-amber-200/80 text-sm md:text-base font-medium leading-relaxed mb-8">
            {isRtl 
              ? 'تازہ پھلوں کے قدرتی جوسز، گارڈن فریش شیکس، اور سپائسی کرسپی چکن - ہر نیا آرڈر ذائقے کا جشن'
              : 'Handcrafted fresh juices, velvety thick shakes, oven-baked pizzas, and golden crispy chicken.'}
          </p>

          {/* Quick Metrics Ticker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto bg-stone-900/60 p-3 rounded-2xl border border-stone-800/80 backdrop-blur-md text-xs font-bold text-stone-300">
            <div className="flex items-center justify-center gap-2 py-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>50+ Delicacies</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-1 border-l border-stone-800">
              <Zap className="w-4 h-4 text-orange-400" />
              <span>15-25 Min Express</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-1 border-l md:border-l border-stone-800">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>4.9★ Rating (1.2k+)</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-1 border-l border-stone-800">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>100% Fresh & Halal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-20">

        {/* 2. Interactive Control Bar (Search + Sort + Quick Tags) */}
        <div className="glass-panel p-4 md:p-6 rounded-3xl mb-8 shadow-xl border border-white/60">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Search Input Box */}
            <div className="relative w-full lg:w-96">
              <div className={`absolute inset-y-0 ${isRtl ? 'left-4' : 'right-4'} flex items-center pointer-events-none text-stone-400`}>
                <Search className="w-5 h-5 text-brand-orange" />
              </div>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-white border border-amber-200/80 rounded-2xl py-3 px-5 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all shadow-inner ${
                  isRtl ? 'text-right pl-12' : 'text-left pr-12'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute inset-y-0 ${isRtl ? 'left-12' : 'right-12'} flex items-center text-stone-400 hover:text-stone-700`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Tag Chips */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto no-scrollbar py-1">
              {[
                { id: 'all', label: isRtl ? 'تمام آیتمز' : 'All Items', icon: <Utensils className="w-3.5 h-3.5" /> },
                { id: 'deals', label: isRtl ? 'ڈیلز' : 'Hot Deals', icon: <Trophy className="w-3.5 h-3.5 text-amber-500" /> },
                { id: 'specials', label: isRtl ? 'سپیشل' : 'Chef Specials', icon: <Award className="w-3.5 h-3.5 text-red-500" /> },
                { id: 'fastfood', label: isRtl ? 'فاسٹ فوڈ' : 'Burgers & Pizza', icon: <PizzaIcon className="w-3.5 h-3.5 text-orange-500" /> },
                { id: 'drinks', label: isRtl ? 'مشروبات' : 'Juices & Shakes', icon: <GlassWater className="w-3.5 h-3.5 text-cyan-500" /> },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setQuickFilter(chip.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    quickFilter === chip.id
                      ? 'bg-stone-900 text-white shadow-md scale-105'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-amber-50 hover:text-stone-900'
                  }`}
                >
                  {chip.icon}
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-stone-200">
              <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-brand-orange" />
                {isRtl ? 'ترتیب:' : 'Sort:'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-stone-200 text-stone-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-brand-orange shadow-xs"
              >
                <option value="featured">{isRtl ? 'ممتاز (Featured)' : 'Featured'}</option>
                <option value="rating">{isRtl ? 'بہترین ریٹنگ' : 'Top Rated'}</option>
                <option value="price-low">{isRtl ? 'قیمت: کم سے زیادہ' : 'Price: Low to High'}</option>
                <option value="price-high">{isRtl ? 'قیمت: زیادہ سے کم' : 'Price: High to Low'}</option>
              </select>
            </div>

          </div>
        </div>

        {/* 3. Category Tab Bar */}
        <div className="mb-12">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all shrink-0 border focus:outline-none ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-orange to-orange-500 text-white border-brand-orange shadow-lg shadow-orange-500/25 scale-[1.03]'
                      : 'bg-white text-stone-700 border-amber-200/60 hover:border-brand-orange/40 hover:bg-amber-50/60 hover:text-brand-orange'
                  }`}
                >
                  <span className="p-1 bg-white/20 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                    {getCategoryIcon(category)}
                  </span>
                  <span>{t(`categories.${category}`)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Chef's Handpicked Showcase (Only when viewing All & no search query) */}
        {selectedCategory === 'All' && !searchQuery && quickFilter === 'all' && chefSpecials.length > 0 && (
          <div className="mb-14 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300/40 p-6 md:p-8 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500 text-white rounded-xl shadow-md">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-stone-900">
                    {isRtl ? 'چیف کی خصوصیات' : "Chef's Handpicked Specials"}
                  </h3>
                  <p className="text-xs text-stone-500 font-semibold">
                    {isRtl ? 'ہماری سب سے زیادہ پسند کی جانے والی آئٹمز' : 'Most loved customer favorites of the week'}
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                ⭐ Top 4 Best Sellers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {chefSpecials.map((item) => {
                const imgSrc = item.image || ITEM_IMAGES[item.nameEnglish] || CATEGORY_IMAGES[item.category];
                return (
                  <div key={item._id} className="bg-white rounded-2xl p-4 border border-amber-200/70 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
                    <div className="h-32 rounded-xl overflow-hidden mb-3 relative bg-amber-50">
                      <img src={imgSrc} alt={item.nameEnglish} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                        SPECIAL
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-850 text-sm line-clamp-1">{item.nameEnglish}</h4>
                      <p className="text-xs font-urdu text-amber-800 line-clamp-1">{item.nameUrdu}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-brand-orange font-black text-base">{item.price || Object.values(item.sizes || {})[0]} PKR</span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="p-2 bg-stone-900 hover:bg-brand-orange text-white rounded-xl transition-colors shadow-sm"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Menu Items Grid */}
        {loading ? (
          /* Skeleton Loader */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs animate-pulse space-y-4">
                <div className="w-full h-44 bg-stone-200 rounded-2xl" />
                <div className="h-4 bg-stone-200 rounded-md w-3/4" />
                <div className="h-3 bg-stone-200 rounded-md w-1/2" />
                <div className="pt-4 flex justify-between items-center">
                  <div className="h-6 bg-stone-200 rounded-md w-20" />
                  <div className="h-9 bg-stone-200 rounded-xl w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : activeCategories.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 px-4 bg-white border border-amber-200/60 rounded-3xl shadow-sm max-w-lg mx-auto my-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="w-10 h-10 text-brand-orange/60" />
            </div>
            <h3 className="text-lg font-black text-stone-800 mb-1">
              {isRtl ? 'کوئی آئٹم نہیں ملا' : 'No Menu Items Found'}
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mb-6">
              {isRtl 
                ? 'براہ کرم اپنی تلاش کے الفاظ تبدیل کریں یا تمام فیلٹرز ہٹا کر کوشش کریں۔'
                : 'Try clearing your search query or choosing a different category filter.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setQuickFilter('all');
              }}
              className="btn-orange-glow px-6 py-2.5 rounded-xl text-xs font-bold shadow-md"
            >
              {isRtl ? 'تمام مینو دیکھیں' : 'Reset Filters & View All'}
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {activeCategories.map((categoryName) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                key={categoryName}
                className="space-y-6"
              >
                {/* Category Header Title */}
                <div className={`flex items-center justify-between border-b border-amber-200/60 pb-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className="p-2.5 bg-gradient-to-br from-amber-500 to-brand-orange text-white rounded-2xl shadow-md">
                      {getCategoryIcon(categoryName)}
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight">
                        {t(`categories.${categoryName}`)}
                      </h3>
                      <p className="text-[11px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">
                        {categorizedData[categoryName].length} {categorizedData[categoryName].length === 1 ? 'delicacy' : 'delicacies'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grid of Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  <AnimatePresence mode="popLayout">
                    {categorizedData[categoryName].map((item) => {
                      const hasSizes = item.sizes && Object.keys(item.sizes).length > 0;
                      const sizeList = hasSizes ? Object.keys(item.sizes) : [];
                      const activeSize = selectedSizes[item._id] || (sizeList.length > 0 ? sizeList[0] : null);
                      const isIceCream = item.category === 'Ice Cream' || item.nameEnglish.toLowerCase().includes('ice cream');
                      const activeFlavor = isIceCream ? (selectedFlavors[item._id] || ICE_CREAM_FLAVORS[0].id) : null;
                      const itemPrice = hasSizes ? item.sizes[activeSize] : item.price;
                      const imgSrc = item.image || ITEM_IMAGES[item.nameEnglish] || CATEGORY_IMAGES[item.category];
                      const inCartQty = getItemCartQuantity(item._id, activeSize, activeFlavor);

                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ y: -8 }}
                          transition={{ duration: 0.3 }}
                          key={item._id}
                          className="group premium-card overflow-hidden flex flex-col justify-between relative bg-white border border-stone-200/80 rounded-3xl shadow-sm hover:shadow-xl transition-all"
                        >
                          {/* Badges */}
                          <div className={`absolute top-3 inset-x-3 flex justify-between items-center z-20 pointer-events-none`}>
                            {item.isSpecial ? (
                              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md pointer-events-auto">
                                <Award className="w-3 h-3" />
                                <span>{t('special')}</span>
                              </span>
                            ) : <span />}

                            {inCartQty > 0 && (
                              <span className="bg-stone-900 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md pointer-events-auto">
                                {inCartQty} in Cart
                              </span>
                            )}
                          </div>

                          {/* Image Box */}
                          <div className="w-full h-48 overflow-hidden relative bg-stone-100 img-zoom-wrapper border-b border-amber-100">
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={item.nameEnglish}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-white">
                                {getCategoryIcon(item.category)}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                          </div>

                          {/* Info Box */}
                          <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
                                  <h4 className="text-stone-900 font-extrabold group-hover:text-brand-orange transition-colors duration-300 line-clamp-1 text-base tracking-tight">
                                    {item.nameEnglish}
                                  </h4>
                                  <p className="text-amber-900 text-xs font-urdu font-semibold leading-relaxed mt-0.5">
                                    {item.nameUrdu}
                                  </p>
                                </div>

                                {/* Star Rating Badge */}
                                <button
                                  onClick={() => setReviewModalItem(item)}
                                  className="shrink-0 inline-flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full text-[10px] font-extrabold text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs"
                                >
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>{item.rating || 5.0}</span>
                                  <span className="text-stone-400 font-medium">({item.numReviews || 1})</span>
                                </button>
                              </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-stone-150 space-y-3">
                              {/* Size Buttons */}
                              {hasSizes && (
                                <div>
                                  <label className="text-[10px] text-stone-450 font-bold uppercase tracking-wider block mb-1.5">
                                    {t('selectSize')}
                                  </label>
                                  <div className="flex gap-1 bg-stone-100 border border-stone-200/70 p-1 rounded-xl">
                                    {sizeList.map((size) => (
                                      <button
                                        key={size}
                                        onClick={() => handleSizeChange(item._id, size)}
                                        className={`flex-1 text-[11px] font-black py-1 rounded-lg transition-all ${
                                          activeSize === size
                                            ? 'bg-brand-orange text-white shadow-sm'
                                            : 'text-stone-600 hover:text-brand-orange hover:bg-white/80'
                                        }`}
                                      >
                                        {size}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Flavor Selector for Ice Creams */}
                              {isIceCream && (
                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-[10px] text-stone-500 font-extrabold uppercase tracking-wider">
                                      {isRtl ? 'ذائقہ منتخب کریں:' : 'Select Flavor:'}
                                    </label>
                                    <span className="text-[10px] font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
                                      🍨 {ICE_CREAM_FLAVORS.find(f => f.id === activeFlavor)?.[isRtl ? 'nameUr' : 'nameEn'] || activeFlavor}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-1 bg-pink-50/60 border border-pink-200/70 p-1 rounded-xl">
                                    {ICE_CREAM_FLAVORS.map((flv) => (
                                      <button
                                        key={flv.id}
                                        type="button"
                                        onClick={() => handleFlavorChange(item._id, flv.id)}
                                        className={`text-[10px] font-extrabold py-1 px-1 rounded-lg transition-all flex items-center justify-center gap-0.5 ${
                                          activeFlavor === flv.id
                                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm scale-[1.02]'
                                            : 'bg-white text-stone-700 hover:text-pink-600 hover:bg-pink-100/60 border border-pink-100'
                                        }`}
                                      >
                                        <span className="text-[11px]">{flv.emoji}</span>
                                        <span className="truncate">{isRtl ? flv.nameUr : flv.nameEn}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Price + Action Button */}
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-brand-orange text-xl font-black tracking-tight">
                                  {itemPrice} <span className="text-[10px] text-stone-400 font-bold uppercase ml-0.5">{t('pkr')}</span>
                                </span>

                                {item.isAvailable ? (
                                  <motion.button
                                    whileTap={{ scale: 0.94 }}
                                    onClick={() => handleAddToCart(item)}
                                    className="btn-orange-glow px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 shadow-md"
                                  >
                                    <Plus className="w-4 h-4 stroke-[3]" />
                                    <span>{t('addToCart')}</span>
                                  </motion.button>
                                ) : (
                                  <span className="text-red-500 border border-red-200 bg-red-50 text-[10px] font-bold py-2 px-3 rounded-xl flex items-center gap-1">
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    <span>{t('itemOutOfStock')}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* 6. Reviews & Feedback Modal */}
      <AnimatePresence>
        {reviewModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border border-amber-200 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setReviewModalItem(null)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-extrabold text-amber-800 mb-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{reviewModalItem.rating || 5.0} Rating</span>
                </div>
                <h3 className="text-2xl font-black text-stone-900">
                  {reviewModalItem.nameEnglish}
                </h3>
                <p className="text-sm font-urdu text-amber-900 mt-0.5">
                  {reviewModalItem.nameUrdu}
                </p>
              </div>

              {/* Review Submit Form */}
              <form onSubmit={handleReviewSubmit} className="bg-amber-50/60 p-4 md:p-5 rounded-2xl border border-amber-200/80 mb-6 space-y-3">
                <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider">
                  {isRtl ? 'اپنی رائے درج کریں' : 'Write a Customer Review'}
                </h4>

                <div>
                  <label className="text-[10px] text-stone-500 font-bold block mb-1">
                    {isRtl ? 'آپ کا نام' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder={isRtl ? 'مثلاً علی خان' : 'e.g. Ali Khan'}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-stone-500 font-bold block mb-1">
                    {isRtl ? 'ریٹنگ' : 'Star Rating'}
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-stone-500 font-bold block mb-1">
                    {isRtl ? 'تبصرہ (اختیاری)' : 'Comment (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={isRtl ? 'ذائقہ کیسا تھا؟' : 'How was the taste and freshness?'}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full btn-orange-glow py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittingReview ? (isRtl ? 'جمع ہو رہا ہے...' : 'Submitting...') : (isRtl ? 'رائے جمع کریں' : 'Submit Review')}</span>
                </button>
              </form>

              {/* Reviews List */}
              <div>
                <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider mb-3">
                  {isRtl ? 'کسٹمرز کے تبصرے' : 'Recent Reviews'} ({reviewModalItem.reviews ? reviewModalItem.reviews.length : 0})
                </h4>

                {(!reviewModalItem.reviews || reviewModalItem.reviews.length === 0) ? (
                  <p className="text-xs text-stone-400 italic text-center py-4">
                    {isRtl ? 'ابھی کوئی تبصرہ نہیں ہے۔ پہلا تبصرہ کریں!' : 'No reviews yet. Be the first to leave a review!'}
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {reviewModalItem.reviews.map((rev, idx) => (
                      <div key={idx} className="p-3 bg-white border border-stone-200 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-stone-900">{rev.userName}</span>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {rev.comment && <p className="text-stone-600 text-[11px] leading-relaxed">{rev.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Floating Quick Cart Action Bar (When items in cart) */}
      <AnimatePresence>
        {totalCartCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 z-40 max-w-xl w-full"
          >
            <div className="glass-panel-dark px-6 py-4 rounded-3xl shadow-2xl border border-amber-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-orange to-amber-500 flex items-center justify-center text-white shadow-lg relative">
                  <ShoppingBag className="w-6 h-6" />
                  <span className="absolute -top-1.5 -right-1.5 bg-white text-stone-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-stone-900">
                    {totalCartCount}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-amber-200/80 font-semibold">{isRtl ? 'کل رقم:' : 'Cart Subtotal:'}</p>
                  <p className="text-lg font-black text-white">{totalAmount || 0} PKR</p>
                </div>
              </div>

              <Link
                to="/cart"
                className="btn-orange-glow px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
              >
                <span>{isRtl ? 'کارٹ دیکھیں' : 'Checkout Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
