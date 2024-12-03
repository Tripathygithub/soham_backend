const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const dbPath = path.resolve(__dirname, './database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      cuisine TEXT,
      isVeg TEXT,
      rating REAL,
      priceForTwo INTEGER,
      location TEXT,
      hasOutdoorSeating TEXT,
      isLuxury TEXT
    )`,
    (err) => {
      if (err) {
        console.error('Error creating restaurants table:', err.message);
      } else {
        console.log('Restaurants table created or already exists.');
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS dishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      isVeg TEXT,
      rating REAL,
      price INTEGER
    )`,
    (err) => {
      if (err) {
        console.error('Error creating dishes table:', err.message);
      } else {
        console.log('Dishes table created or already exists.');
      }
    }
  );

  const restaurants = [
    ['Spice Kitchen', 'Indian', 'true', 4.5, 1500, 'MG Road', 'true', 'false'],
    ['Olive Bistro', 'Italian', 'false', 4.2, 2000, 'Jubilee Hills', 'false', 'true'],
    ['Green Leaf', 'Chinese', 'true', 4.0, 1000, 'Banjara Hills', 'false', 'false'],
  ];

  const dishes = [
    ['Paneer Butter Masala', 'true', 4.5, 300],
    ['Chicken Alfredo Pasta', 'false', 4.7, 500],
    ['Veg Hakka Noodles', 'true', 4.3, 250],
  ];

  const insertRestaurants = db.prepare(
    `INSERT INTO restaurants (name, cuisine, isVeg, rating, priceForTwo, location, hasOutdoorSeating, isLuxury) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertDishes = db.prepare(
    `INSERT INTO dishes (name, isVeg, rating, price) VALUES (?, ?, ?, ?)`
  );

  restaurants.forEach((restaurant) => insertRestaurants.run(...restaurant));
  dishes.forEach((dish) => insertDishes.run(...dish));

  insertRestaurants.finalize();
  insertDishes.finalize();

  console.log('Data inserted into tables.');

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
});
