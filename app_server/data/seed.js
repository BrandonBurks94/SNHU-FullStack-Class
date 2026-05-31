const mongoose = require('mongoose');
const trips = require('./trips.json');

require('../models/db');

const Trip = mongoose.model('trips');

const seedTrips = async () => {
  try {
    await Trip.deleteMany({});
    await Trip.insertMany(trips);
    console.log(`Loaded ${trips.length} trips into the travlr database.`);
  } catch (err) {
    console.error('Error loading trips:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedTrips();
