const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(express.json());

// Locate JSON files dynamically in current directory or data subfolder
const reviewsPath = fs.existsSync(path.join(__dirname, 'reviews.json'))
    ? path.join(__dirname, 'reviews.json')
    : path.join(__dirname, 'data', 'reviews.json');

const dealersPath = fs.existsSync(path.join(__dirname, 'dealerships.json'))
    ? path.join(__dirname, 'dealerships.json')
    : path.join(__dirname, 'data', 'dealerships.json');

const reviews_data = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
const dealers_data = JSON.parse(fs.readFileSync(dealersPath, 'utf8'));

mongoose.connect("mongodb://127.0.0.1:27017/", { 'dbName': 'dealershipsDB' });

const Reviews = require('./review');
const Dealerships = require('./dealership');

try {
  Reviews.deleteMany({}).then(() => {
    Reviews.insertMany(reviews_data['reviews']);
  });
  Dealerships.deleteMany({}).then(() => {
    Dealerships.insertMany(dealers_data['dealerships']);
  });
} catch (error) {
  console.log("Error initializing database: ", error);
}

// Home route
app.get('/', async (req, res) => {
    res.send("Welcome to the API");
});

// Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
    try {
        const documents = await Dealerships.find();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealerships' });
    }
});

// Fetch dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
    try {
        const documents = await Dealerships.find({ state: req.params.state });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealerships by state' });
    }
});

// Fetch single dealer by ID
app.get('/fetchDealer/:id', async (req, res) => {
    try {
        const documents = await Dealerships.find({ id: parseInt(req.params.id) });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealer by ID' });
    }
});

// Fetch reviews by dealer ID
app.get('/fetchReviews/dealer/:id', async (req, res) => {
    try {
        const documents = await Reviews.find({ dealership: parseInt(req.params.id) });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});

// Insert review
app.post('/insert_review', async (req, res) => {
    const data = req.body;
    const documents = await Reviews.find().sort({ id: -1 });
    let new_id = documents[0] ? documents[0]['id'] + 1 : 1;

    const review = new Reviews({
        "id": new_id,
        "name": data['name'],
        "dealership": parseInt(data['dealership']),
        "review": data['review'],
        "purchase": data['purchase'],
        "purchase_date": data['purchase_date'],
        "car_make": data['car_make'],
        "car_model": data['car_model'],
        "car_year": parseInt(data['car_year']) || data['car_year']
    });

    try {
        const savedReview = await review.save();
        res.json(savedReview);
    } catch (error) {
        console.log("Error inserting review: ", error);
        res.status(500).json({ error: 'Error inserting review' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});