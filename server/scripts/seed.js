const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/../.env' });

const MenuItem = require('../models/MenuItem');
const Admin = require('../models/Admin');

const menuItems = [
  {
    "nameEnglish": "Mosambi Juice",
    "nameUrdu": "مسمی جوس",
    "category": "Fresh Juices",
    "price": 200,
    "image": "/categories/mosambi juice.jpg"
  },
  {
    "nameEnglish": "Pomegranate Juice",
    "nameUrdu": "انار جوس",
    "category": "Fresh Juices",
    "price": 560,
    "image": "/categories/Pomegranate Juice.jpg"
  },
  {
    "nameEnglish": "Carrot Juice",
    "nameUrdu": "گاجر جوس",
    "category": "Fresh Juices",
    "price": 110,
    "image": "/categories/Carrot Juice.jpg"
  },
  {
    "nameEnglish": "Kino Juice",
    "nameUrdu": "کینو جوس",
    "category": "Fresh Juices",
    "price": 230,
    "image": "/categories/kino juice.jpg"
  },
  {
    "nameEnglish": "Pineapple Juice",
    "nameUrdu": "پائن ایپل جوس",
    "category": "Fresh Juices",
    "price": 250,
    "image": "/categories/Pineapple Juice.jpg"
  },
  {
    "nameEnglish": "Apple Juice",
    "nameUrdu": "سیب جوس",
    "category": "Fresh Juices",
    "price": 230,
    "image": "/categories/Apple Juice.jpg"
  },
  {
    "nameEnglish": "Peach Juice",
    "nameUrdu": "آڑو جوس",
    "category": "Fresh Juices",
    "price": 230,
    "image": "/categories/Peach Juice.jpg"
  },
  {
    "nameEnglish": "Strawberry Juice",
    "nameUrdu": "اسٹرابیری جوس",
    "category": "Fresh Juices",
    "price": 250,
    "image": "/categories/Strawberry Juice.jpg"
  },
  {
    "nameEnglish": "Grape Fruit Juice",
    "nameUrdu": "گریپ فروٹ جوس",
    "category": "Fresh Juices",
    "price": 180,
    "image": "/categories/grapefruit juice.jpg"
  },
  {
    "nameEnglish": "Meetha Juice",
    "nameUrdu": "میٹھا جوس",
    "category": "Fresh Juices",
    "price": 230,
    "image": "/categories/meetah juice.jpg"
  },
  {
    "nameEnglish": "Guava Juice",
    "nameUrdu": "امرود جوس",
    "category": "Fresh Juices",
    "price": 270,
    "image": "/categories/Guava Juice.jpg"
  },
  {
    "nameEnglish": "Plum Juice",
    "nameUrdu": "آلو بخارہ جوس",
    "category": "Fresh Juices",
    "price": 270,
    "image": "/categories/Plum Juice.jpg"
  },
  {
    "nameEnglish": "Falsa Juice",
    "nameUrdu": "فالسہ جوس",
    "category": "Fresh Juices",
    "price": 110,
    "image": "/categories/Falsa Juice.jpg"
  },
  {
    "nameEnglish": "Cherry Juice",
    "nameUrdu": "چیری جوس",
    "category": "Fresh Juices",
    "price": 270,
    "image": "/categories/cherry juice.jpg"
  },
  {
    "nameEnglish": "Banana Milk Shake",
    "nameUrdu": "ملک شیک کیلا",
    "category": "Milk Shakes",
    "price": 230,
    "image": "/categories/banana milkshake.jpg"
  },
  {
    "nameEnglish": "Special Banana Milk Shake",
    "nameUrdu": "اسپیشل ملک شیک کیلا",
    "category": "Milk Shakes",
    "price": 250,
    "image": "/categories/banana milkshake.jpg"
  },
  {
    "nameEnglish": "Mango Milk Shake",
    "nameUrdu": "ملک شیک آم",
    "category": "Milk Shakes",
    "price": 250,
    "image": "/categories/mango milkshake.jpg"
  },
  {
    "nameEnglish": "Special Mango Milk Shake",
    "nameUrdu": "اسپیشل ملک شیک آم",
    "category": "Milk Shakes",
    "price": 350,
    "image": "/categories/mango milkshake.jpg"
  },
  {
    "nameEnglish": "Apple Milk Shake",
    "nameUrdu": "ملک شیک سیب",
    "category": "Milk Shakes",
    "price": 230,
    "image": "/categories/Apple Milk Shake.jpg"
  },
  {
    "nameEnglish": "Special Apple Milk Shake",
    "nameUrdu": "اسپیشل ملک شیک سیب",
    "category": "Milk Shakes",
    "price": 280,
    "image": "/categories/Special Apple Milk Shake.jpg"
  },
  {
    "nameEnglish": "Pineapple Milk Shake",
    "nameUrdu": "ملک شیک پائن ایپل",
    "category": "Milk Shakes",
    "price": 250,
    "image": "/categories/Pineapple Juice.jpg"
  },
  {
    "nameEnglish": "Special Pineapple Milk Shake",
    "nameUrdu": "اسپیشل ملک شیک پائن ایپل",
    "category": "Milk Shakes",
    "price": 330,
    "image": "/categories/Pineapple Juice.jpg"
  },
  {
    "nameEnglish": "Dates Almond Milk Shake",
    "nameUrdu": "ملک شیک کھجور بادام",
    "category": "Milk Shakes",
    "price": 280,
    "image": "/categories/dates almond milkshake.jpg"
  },
  {
    "nameEnglish": "Special Dates Almond Milk Shake",
    "nameUrdu": "اسپیشل ملک شیک کھجور بادام",
    "category": "Milk Shakes",
    "price": 380,
    "image": "/categories/Special Dates Almond Milk Shake.jpg"
  },
  {
    "nameEnglish": "Strawberry Milk Shake",
    "nameUrdu": "ملک شیک اسٹرابیری",
    "category": "Milk Shakes",
    "price": 250,
    "image": "/categories/Strawberry Milk Shake.jpg"
  },
  {
    "nameEnglish": "Special Strawberry Milk Shake",
    "nameUrdu": "اسپیشل ملک شیک اسٹرابیری",
    "category": "Milk Shakes",
    "price": 350,
    "image": "/categories/Special Strawberry Milk Shake.jpg"
  },
  {
    "nameEnglish": "Special Cashew Pistachio Shake",
    "nameUrdu": "اسپیشل کاجو پستہ شیک",
    "category": "Milk Shakes",
    "price": 900,
    "image": "/categories/Special Cashew Pistachio Shake.jpg"
  },
  {
    "nameEnglish": "Special Ice Cream Shake",
    "nameUrdu": "اسپیشل آئس کریم شیک",
    "category": "Milk Shakes",
    "price": 580,
    "image": "/categories/Special Ice Cream Shake.jpg"
  },
  {
    "nameEnglish": "Peach Milk Shake",
    "nameUrdu": "ملک شیک آڑو",
    "category": "Milk Shakes",
    "price": 230,
    "image": "/categories/Peach Milk Shake.jpg"
  },
  {
    "nameEnglish": "Pina Shake",
    "nameUrdu": "پینا شیک",
    "category": "Milk Shakes",
    "price": 280,
    "image": "/categories/Pina Shake.jpg"
  },
  {
    "nameEnglish": "Chocolate Shake Special",
    "nameUrdu": "چاکلیٹ شیک اسپیشل",
    "category": "Milk Shakes",
    "price": 550,
    "image": "/categories/chocolate shake special.jpg",
    "isSpecial": true
  },
  {
    "nameEnglish": "Pina Colada Special",
    "nameUrdu": "پینا کولاڈا اسپیشل",
    "category": "Milk Shakes",
    "price": 460,
    "image": "/categories/Pina Colada Special.jpg",
    "isSpecial": true
  },
  {
    "nameEnglish": "Cream Chaat (Plate)",
    "nameUrdu": "کریم چاٹ فی پلیٹ",
    "category": "Fruit Chaat",
    "price": 450,
    "image": "/categories/cream chaat.jpg"
  },
  {
    "nameEnglish": "Fruit Chaat (Plate)",
    "nameUrdu": "فروٹ چاٹ فی پلیٹ",
    "category": "Fruit Chaat",
    "price": 280,
    "image": "/categories/fruit chat.jpg"
  },
  {
    "nameEnglish": "Chana Chaat (Plate)",
    "nameUrdu": "چنا چاٹ فی پلیٹ",
    "category": "Fruit Chaat",
    "price": 230,
    "image": "/categories/chana chaat.jpg"
  },
  {
    "nameEnglish": "Dahi Bhallay (Plate)",
    "nameUrdu": "دہی بھلے پلیٹ",
    "category": "Fruit Chaat",
    "price": 230,
    "image": "/categories/dahi bhllay.jpg"
  },
  {
    "nameEnglish": "Russian Salad (Plate)",
    "nameUrdu": "رشین سیلڈ (پلیٹ)",
    "category": "Fruit Chaat",
    "price": 350,
    "image": "/categories/russian salad.jpg"
  },
  {
    "nameEnglish": "Special Cone Ice Cream",
    "nameUrdu": "اسپیشل کون آئس کریم",
    "category": "Ice Cream",
    "price": 150,
    "image": "/categories/cone icecream.jpg"
  },
  {
    "nameEnglish": "Special Ice Cream (Pista, Choc, Mango, Vanilla)",
    "nameUrdu": "اسپیشل آئس کریم (پستہ، ونڈو، چاکلیٹ، کلک، مینگو، اسٹرابیری، ونیلا، الائچی)",
    "category": "Ice Cream",
    "image": "/categories/icecreams.jpg",
    "sizes": {
      "Small": 280,
      "Medium": 410,
      "Large": 530
    }
  },
  {
    "nameEnglish": "Egg Burger",
    "nameUrdu": "ایگ برگر",
    "category": "Burgers",
    "price": 230,
    "image": "/categories/egg burger.jpg"
  },
  {
    "nameEnglish": "Double Egg Burger",
    "nameUrdu": "ڈبل ایگ برگر",
    "category": "Burgers",
    "price": 280,
    "image": "/categories/double egg burger.jpg"
  },
  {
    "nameEnglish": "Chicken Burger",
    "nameUrdu": "چکن برگر",
    "category": "Burgers",
    "price": 370,
    "image": "/categories/chicken burger.jpg"
  },
  {
    "nameEnglish": "Chicken Cheese Burger",
    "nameUrdu": "چکن چیز برگر",
    "category": "Burgers",
    "price": 420,
    "image": "/categories/chicken chesee burger.jpg"
  },
  {
    "nameEnglish": "Zinger Burger",
    "nameUrdu": "زنگر برگر",
    "category": "Burgers",
    "price": 390,
    "image": "/categories/zinger burger.png",
    "isSpecial": true
  },
  {
    "nameEnglish": "Zinger Cheese Burger",
    "nameUrdu": "زنگر چیز برگر",
    "category": "Burgers",
    "price": 440,
    "image": "/categories/zinger chesee burger.jpg"
  },
  {
    "nameEnglish": "Patty Burger",
    "nameUrdu": "پیٹی برگر",
    "category": "Burgers",
    "price": 280,
    "image": "/categories/paty burger.jpg"
  },
  {
    "nameEnglish": "Chapli Burger",
    "nameUrdu": "چپلی برگر",
    "category": "Burgers",
    "price": 330,
    "image": "/categories/chapli burger.jpg"
  },
  {
    "nameEnglish": "Double Chapli Cheese Burger",
    "nameUrdu": "ڈبل چپلی چیز برگر",
    "category": "Burgers",
    "price": 660,
    "image": "/categories/double chapli cheese burger.jpg"
  },
  {
    "nameEnglish": "Chicken Shawarma",
    "nameUrdu": "چکن شاورما",
    "category": "Shawarma",
    "price": 270,
    "image": "/categories/Chicken Shawarma.jpg"
  },
  {
    "nameEnglish": "Chicken Cheese Shawarma",
    "nameUrdu": "چکن چیز شاورما",
    "category": "Shawarma",
    "price": 320,
    "image": "/categories/Chicken Cheese Shawarma.jpg"
  },
  {
    "nameEnglish": "Zinger Shawarma",
    "nameUrdu": "زنگر شاورما",
    "category": "Shawarma",
    "price": 370,
    "image": "/categories/Zinger Shawarma.jpg"
  },
  {
    "nameEnglish": "Zinger Cheese Shawarma",
    "nameUrdu": "زنگر چیز شاورما",
    "category": "Shawarma",
    "price": 420,
    "image": "/categories/Zinger Cheese Shawarma.jpg"
  },
  {
    "nameEnglish": "Chapli Shawarma",
    "nameUrdu": "چپلی شاورما",
    "category": "Shawarma",
    "price": 230,
    "image": "/categories/Chapli Shawarma.jpg"
  },
  {
    "nameEnglish": "Chapli Cheese Shawarma",
    "nameUrdu": "چپلی چیز شاورما",
    "category": "Shawarma",
    "price": 280,
    "image": "/categories/Chapli Cheese Shawarma.jpg"
  },
  {
    "nameEnglish": "Chicken Paratha Roll",
    "nameUrdu": "چکن پراٹھا رول",
    "category": "Shawarma",
    "price": 400,
    "image": "/categories/Chicken Paratha Roll.jpg"
  },
  {
    "nameEnglish": "Chicken Cheese Paratha Roll",
    "nameUrdu": "چکن چیز پراٹھا رول",
    "category": "Shawarma",
    "price": 450,
    "image": "/categories/Chicken Cheese Paratha Roll.jpg"
  },
  {
    "nameEnglish": "Zinger Paratha Roll",
    "nameUrdu": "زنگر پراٹھا رول",
    "category": "Shawarma",
    "price": 430,
    "image": "/categories/Zinger Paratha Roll.jpg"
  },
  {
    "nameEnglish": "Zinger Cheese Paratha Roll",
    "nameUrdu": "زنگر چیز پراٹھا رول",
    "category": "Shawarma",
    "price": 480,
    "image": "/categories/Zinger Cheese Paratha Roll.jpg"
  },
  {
    "nameEnglish": "Platter Shawarma",
    "nameUrdu": "پلیٹر شاورما",
    "category": "Shawarma",
    "price": 550,
    "image": "/categories/Platter Shawarma.jpg",
    "isSpecial": true
  },
  {
    "nameEnglish": "Spin Roll",
    "nameUrdu": "اسپن رول",
    "category": "Paratha Rolls",
    "price": 490,
    "image": "/categories/Spin Roll.jpg"
  },
  {
    "nameEnglish": "Chilli Milli Roll",
    "nameUrdu": "چلی ملی رول",
    "category": "Paratha Rolls",
    "price": 510,
    "image": "/categories/Chilli Milli Roll.jpg"
  },
  {
    "nameEnglish": "Behari Roll",
    "nameUrdu": "بہاری رول",
    "category": "Paratha Rolls",
    "price": 510,
    "image": "/categories/Behari Roll.jpg"
  },
  {
    "nameEnglish": "Hot Wings",
    "nameUrdu": "ہاٹ ونگز",
    "category": "Wings & Nuggets",
    "image": "/categories/Hot Wings.jpg",
    "sizes": {
      "5 Pcs": 350,
      "10 Pcs": 700
    }
  },
  {
    "nameEnglish": "Nuggets",
    "nameUrdu": "نگٹس",
    "category": "Wings & Nuggets",
    "image": "/categories/Nuggets.jpg",
    "sizes": {
      "5 Pcs": 350,
      "10 Pcs": 650
    }
  },
  {
    "nameEnglish": "Peri Peri Wings (10 pcs)",
    "nameUrdu": "پیری پیری ونگز 10 عدد",
    "category": "Wings & Nuggets",
    "price": 480,
    "image": "/categories/Peri Peri Wings.jpg"
  },
  {
    "nameEnglish": "Bar B Q Wings (10 pcs)",
    "nameUrdu": "بار بی کیو ونگز 10 عدد",
    "category": "Wings & Nuggets",
    "price": 480,
    "image": "/categories/Bar B Q Wings (10 pcs).jpg"
  },
  {
    "nameEnglish": "Flaming Wings (10 pcs)",
    "nameUrdu": "فلیمنگ ونگز 10 عدد",
    "category": "Wings & Nuggets",
    "price": 590,
    "image": "/categories/Flaming Wings.jpg"
  },
  {
    "nameEnglish": "Chicken Fajita Pizza",
    "nameUrdu": "چکن فجیتا پیزا",
    "category": "Pizza",
    "image": "/categories/Chicken Fajita Pizza.jpg",
    "sizes": {
      "Small": 460,
      "Medium": 850,
      "Large": 1280
    }
  },
  {
    "nameEnglish": "Peri Peri Pizza",
    "nameUrdu": "پیری پیری پیزا",
    "category": "Pizza",
    "image": "/categories/Peri Peri Pizza.jpg",
    "sizes": {
      "Small": 460,
      "Medium": 850,
      "Large": 1280
    }
  },
  {
    "nameEnglish": "Chicken Euro Pizza",
    "nameUrdu": "چکن یورو پیزا",
    "category": "Pizza",
    "image": "/categories/Chicken Euro Pizza.jpg",
    "sizes": {
      "Small": 460,
      "Medium": 850,
      "Large": 1280
    }
  },
  {
    "nameEnglish": "Chicken Special Pizza",
    "nameUrdu": "چکن اسپیشل پیزا",
    "category": "Pizza",
    "image": "/categories/Chicken Special Pizza.jpg",
    "sizes": {
      "Small": 460,
      "Medium": 850,
      "Large": 1280
    }
  },
  {
    "nameEnglish": "Italian Pizza",
    "nameUrdu": "اٹالین پیزا",
    "category": "Pizza",
    "image": "/categories/Italian Pizza.jpg",
    "sizes": {
      "Small": 530,
      "Medium": 1080,
      "Large": 1520
    }
  },
  {
    "nameEnglish": "Chicken Supreme Pizza",
    "nameUrdu": "چکن سپریم پیزا",
    "category": "Pizza",
    "image": "/categories/Chicken Supreme Pizza.jpg",
    "sizes": {
      "Small": 460,
      "Medium": 850,
      "Large": 1280
    }
  },
  {
    "nameEnglish": "Chicken Tikka Pizza",
    "nameUrdu": "چکن تکہ پیزا",
    "category": "Pizza",
    "image": "/categories/Chicken Tikka Pizza.jpg",
    "sizes": {
      "Small": 460,
      "Medium": 850,
      "Large": 1280
    }
  },
  {
    "nameEnglish": "Bon Fire Pizza",
    "nameUrdu": "بان فائر پیزا",
    "category": "Pizza",
    "image": "/categories/Bon Fire Pizza.jpg",
    "sizes": {
      "Small": 460,
      "Medium": 850,
      "Large": 1280
    }
  },
  {
    "nameEnglish": "Napoleon Pizza",
    "nameUrdu": "نیپولین پیزا",
    "category": "Pizza",
    "image": "/categories/Napoleon Pizza.jpg",
    "sizes": {
      "Small": 490,
      "Medium": 950,
      "Large": 1350
    }
  },
  {
    "nameEnglish": "Malai Boti Pizza",
    "nameUrdu": "ملائی بوٹی پیزا",
    "category": "Pizza",
    "image": "/categories/Malai Boti Pizza.jpg",
    "sizes": {
      "Small": 490,
      "Medium": 950,
      "Large": 1350
    }
  },
  {
    "nameEnglish": "Behari Pizza",
    "nameUrdu": "بہاری پیزا",
    "category": "Pizza",
    "image": "/categories/Behari Pizza.jpg",
    "sizes": {
      "Medium": 950,
      "Large": 1350
    }
  },
  {
    "nameEnglish": "Crown Crust Pizza",
    "nameUrdu": "کراؤن کرسٹ پیزا",
    "category": "Pizza",
    "image": "/categories/Crown Crust Pizza.jpg",
    "sizes": {
      "Medium": 1030,
      "Large": 1500
    }
  },
  {
    "nameEnglish": "Kabab Stuffer Pizza",
    "nameUrdu": "کباب اسٹفر پیزا",
    "category": "Pizza",
    "image": "/categories/Kabab Stuffer Pizza.jpg",
    "sizes": {
      "Medium": 1030,
      "Large": 1500
    }
  },
  {
    "nameEnglish": "Chicken Cheese Stuffer",
    "nameUrdu": "چکن چیز اسٹفر پیزا",
    "category": "Pizza",
    "image": "/categories/Chicken Cheese Stuffer.jpg",
    "sizes": {
      "Medium": 1030,
      "Large": 1500
    }
  },
  {
    "nameEnglish": "Chicken Cheese Stick",
    "nameUrdu": "چکن چیز اسٹک",
    "category": "Sandwiches",
    "price": 620,
    "image": "/categories/Chicken Cheese Stick.jpg"
  },
  {
    "nameEnglish": "Pizza Sandwich",
    "nameUrdu": "پیزا سینڈوچ",
    "category": "Sandwiches",
    "price": 690,
    "image": "/categories/Pizza Sandwich.jpg"
  },
  {
    "nameEnglish": "Chicken Sandwich Special",
    "nameUrdu": "چکن سینڈوچ اسپیشل",
    "category": "Sandwiches",
    "price": 570,
    "image": "/categories/Chicken Sandwich Special.jpg"
  },
  {
    "nameEnglish": "Creamy Pasta",
    "nameUrdu": "کریمی پاستا",
    "category": "Pasta",
    "price": 530,
    "image": "/categories/Creamy Pasta.jpg"
  },
  {
    "nameEnglish": "Flaming Pasta",
    "nameUrdu": "فلیمنگ پاستا",
    "category": "Pasta",
    "price": 550,
    "image": "/categories/Flaming Pasta.jpg"
  },
  {
    "nameEnglish": "Crunchy Pasta",
    "nameUrdu": "کرنچی پاستا",
    "category": "Pasta",
    "price": 650,
    "image": "/categories/Crunchy Pasta.jpg"
  },
  {
    "nameEnglish": "Smoke Crunchy Pasta",
    "nameUrdu": "سموک کرنچی پاستا",
    "category": "Pasta",
    "price": 700,
    "image": "/categories/Smoke Crunchy Pasta.jpg"
  },
  {
    "nameEnglish": "Coca Cola",
    "nameUrdu": "کوکا کولا",
    "category": "Cold Drinks",
    "image": "/categories/coca cola.jpg",
    "sizes": {
      "500ml": 120,
      "1500ml": 220
    }
  },
  {
    "nameEnglish": "Tin Pack",
    "nameUrdu": "ٹین پیک",
    "category": "Cold Drinks",
    "price": 110,
    "image": "/categories/tin pack.jpg"
  },
  {
    "nameEnglish": "Mineral Water",
    "nameUrdu": "پانی کی بوتل",
    "category": "Cold Drinks",
    "image": "/categories/mineral water.jpg",
    "sizes": {
      "Small": 70,
      "Large": 120
    }
  },
  {
    "nameEnglish": "Dip Sauce",
    "nameUrdu": "ڈپ ساس",
    "category": "Cold Drinks",
    "price": 50,
    "image": "/categories/dip sauce.jpg"
  },
  {
    "nameEnglish": "Lunch Deal (12:00 PM to 04:00 PM) - Large Pizza + Free 1.5 Ltr Coke",
    "nameUrdu": "لنچ ڈیل - 1 لارج پیزا اور مفت 1.5 لیٹر کوک",
    "category": "Deals",
    "price": 1280,
    "image": "/categories/lunch deal.jpg",
    "isSpecial": true
  },
  {
    "nameEnglish": "Midnight Deal (11:00 PM to 01:00 AM) - Large Pizza + Free 1.5 Ltr Coke",
    "nameUrdu": "مڈ نائٹ ڈیل - 1 لارج پیزا اور مفت 1.5 لیٹر کوک",
    "category": "Deals",
    "price": 1280,
    "image": "/categories/midnight deal.jpg",
    "isSpecial": true
  },
  {
    "nameEnglish": "Mix Platter - Oven Baked Wings (10) + Spin Roll + 500ml Coke",
    "nameUrdu": "مکس پلیٹر - 10 ہاٹ ونگز، اسپن رول اور 500 ملی لیٹر کوک",
    "category": "Deals",
    "price": 1180,
    "image": "/categories/mix platter.jpg",
    "isSpecial": true
  },
  {
    "nameEnglish": "Deal: 2 Large Pizzas + 1.5 Ltr Coke",
    "nameUrdu": "ڈیل: 2 لارج پیزا اور 1.5 لیٹر کوک",
    "category": "Deals",
    "price": 2760,
    "image": "/categories/deal 2.jpg",
    "isSpecial": true
  },
  {
    "nameEnglish": "Deal: 1 Medium Pizza + Spin Roll + 1.5 Ltr Coke",
    "nameUrdu": "ڈیل: 1 میڈیم پیزا، اسپن رول اور 1.5 لیٹر کوک",
    "category": "Deals",
    "price": 1570,
    "image": "/categories/deal 1.jpg",
    "isSpecial": true
  },
  {
    "nameEnglish": "Deal: 1 Medium Pizza + Oven Baked Wings (10) + Pasta + 1.5 Ltr Coke",
    "nameUrdu": "ڈیل: 1 میڈیم پیزا، 10 ونگز، پاستا اور 1.5 لیٹر کوک",
    "category": "Deals",
    "price": 2070,
    "image": "/categories/deall.jpg",
    "isSpecial": true
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mulla_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    
    await mongoose.connect(mongoUri);
    console.log('Connected successfully!');

    // Clean collection
    await MenuItem.deleteMany({});
    await Admin.deleteMany({});
    console.log('Cleared existing MenuItems and Admins.');

    // Insert menu items
    const insertedMenu = await MenuItem.insertMany(menuItems);
    console.log(`Successfully seeded ${insertedMenu.length} menu items.`);

    // Seed default admin
    const passwordHash = await bcrypt.hash('admin123', 10);
    const defaultAdmin = new Admin({
      username: 'admin',
      passwordHash: passwordHash
    });
    await defaultAdmin.save();
    console.log('Seeded default administrator user. Username: "admin", Password: "admin123"');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
