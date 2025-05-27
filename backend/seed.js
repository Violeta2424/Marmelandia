const mongoose = require('mongoose');
const Product = require('./models/Product');
const Type = require('./models/Type');
const Flavor = require('./models/Flavor');

require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Створюємо типи цукерок
    const types = await Type.create([
      { name: 'Мармелад', icon: '/images/types/marmalade.png' },
      { name: 'Жувастики', icon: '/images/types/gummy.png' },
      { name: 'Шоколад', icon: '/images/types/chocolate.png' },
      { name: 'Кислі', icon: '/images/types/sour.png' },
      { name: 'Гострі', icon: '/images/types/spicy.png' }
    ]);

    // Створюємо смаки
    const flavors = await Flavor.create([
      { name: 'Полуниця', color: '#ff4d4d' },
      { name: 'Лимон', color: '#ffff4d' },
      { name: 'Яблуко', color: '#4dff4d' },
      { name: 'Кола', color: '#4d4d4d' },
      { name: 'Малина', color: '#ff4da6' }
    ]);

    // Створюємо тестові товари
    const products = [
      {
        name: 'Кислі червячки',
        description: 'Кислі желейні цукерки у формі червячків',
        price: 75,
        category: 'цукерки',
        type: types[3]._id, // Кислі
        flavors: [flavors[1]._id, flavors[2]._id], // Лимон, Яблуко
        imageUrl: '/images/products/sour-worms.jpg',
        weight: 100,
        ingredients: 'Цукор, желатин, лимонна кислота, натуральні ароматизатори',
        nutritionalValue: {
          calories: 320,
          proteins: 6,
          fats: 0,
          carbohydrates: 78
        },
        isPopular: true
      },
      {
        name: 'Шоколадні ведмедики',
        description: 'Молочний шоколад у формі ведмедиків',
        price: 120,
        category: 'шоколад',
        type: types[2]._id, // Шоколад
        flavors: [flavors[0]._id], // Полуниця
        imageUrl: '/images/products/chocolate-bears.jpg',
        weight: 100,
        ingredients: 'Молочний шоколад, какао-масло, цукор',
        nutritionalValue: {
          calories: 545,
          proteins: 7,
          fats: 31,
          carbohydrates: 58
        },
        isPopular: true
      },
      {
        name: 'Малинові серця',
        description: 'Желейні цукерки з малиновим смаком',
        price: 85,
        category: 'цукерки',
        type: types[0]._id, // Мармелад
        flavors: [flavors[4]._id], // Малина
        imageUrl: '/images/products/raspberry-hearts.jpg',
        weight: 100,
        ingredients: 'Цукор, желатин, малиновий сік, натуральні ароматизатори',
        nutritionalValue: {
          calories: 290,
          proteins: 5,
          fats: 0,
          carbohydrates: 70
        },
        isPopular: true
      }
    ];

    await Product.create(products);
    console.log('Database seeded successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 