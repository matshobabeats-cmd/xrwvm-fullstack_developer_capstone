/* jshint esversion: 8 */
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

const reviewsData = JSON.parse(fs.readFileSync('data/reviews.json', 'utf8'));
const dealershipsData = JSON.parse(fs.readFileSync('data/dealerships.json', 'utf8'));

mongoose.connect('mongodb://localhost:27017/dealershipsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Reviews = require('./review');
const Dealerships = require('./dealership');

try {
  Reviews.deleteMany({}).then(() => {
    Reviews.insertMany(reviewsData.reviews);
  });
  Dealerships.deleteMany({}).then(() => {
    Dealerships.insertMany(dealershipsData.dealerships);
  });
} catch (error) {
  console.error('Error initializing database:', error);
}

app.get('/', async (req, res) => {
  res.send('Welcome to the API');
});

app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealerships', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealerships/:state', async (req, res) => {
  try {
    const documents = await Dealerships.find({ state: req.params.state });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const documents = await Dealerships.find({ id: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.post('/insert_review', express.json(), async (req, res) => {
  const data = req.body;
  const documents = await Reviews.find().sort({ id: -1 });
  let newId = 1;
  if (documents.length > 0) {
    newId = documents[0].id + 1;
  }

  const review = new Reviews({
    id: newId,
    name: data.name,
    dealership: data.dealership,
    review: data.review,
    purchase: data.purchase,
    purchase_date: data.purchase_date,
    car_make: data.car_make,
    car_model: data.car_model,
    car_year: data.car_year
  });

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});