const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Initialize the database
let db;
(async () => {
  try {
    db = await open({
      filename: path.resolve(__dirname, './database.sqlite'),
      driver: sqlite3.Database,
    });
    console.log('Connected to the SQLite database.');
  } catch (error) {
    console.error('Error opening database:', error.message);
    process.exit(1); // Exit if database connection fails
  }
})();


async function fetchAllResturants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { resturants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let result = await fetchAllResturants();
    if (result.resturants.length === 0)
      return res.status(404).json({ message: 'no resturants found' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function GetRestaurantbyId(id) {
  let query = 'SELECT * FROM restaurants WHERE id= ?';
  let response = await db.all(query, [id]);

  return { resturant: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid restaurant ID.' });
    }
    let result = await GetRestaurantbyId(id);
    if (result.resturant.length === 0)
      return res
        .status(404)
        .json({ message: 'no resturant found in this id: ' + id });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function GetRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine=?';
  let response = await db.all(query, [cuisine]);
  return { resturant: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let result = await GetRestaurantsByCuisine(cuisine);
    if (result.resturant.length === 0)
      return res.status(404).json({ message: 'no resturant found ' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function filterResturants(isLuxury, isVeg, hasOutdoorSeating) {
  let query =
    'SELECT * FROM restaurants WHERE isLuxury=? AND isVeg=? AND hasOutdoorSeating=?';
  let response = await db.all(query, [isLuxury, isVeg, hasOutdoorSeating]);
  return { resturants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    let result = await filterResturants(isLuxury, isVeg, hasOutdoorSeating);
    if (result.resturants.length === 0)
      return res.status(404).json({ message: 'no resturant found ' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function sortByrating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await sortByrating();
    if (result.restaurants.length === 0)
      return res.status(404).json({ message: 'no resturant found ' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fectchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let result = await fectchAllDishes();
    if (result.dishes.length === 0)
      return res.status(404).json({ message: 'no resturant found ' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getDishById(id) {
  let query = 'SELECT * FROM dishes WHERE id=?';
  let response = await db.all(query, [id]);
  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await getDishById(id);
    if (result.dishes.length === 0)
      return res.status(404).json({ message: 'no resturant found ' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function filterDishes(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg=?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let result = await filterDishes(isVeg);
    if (result.dishes.length === 0)
      return res.status(404).json({ message: 'no resturant found ' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function sortByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await sortByPrice();
    if (result.dishes.length === 0)
      return res.status(404).json({ message: 'no resturant found ' });
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


