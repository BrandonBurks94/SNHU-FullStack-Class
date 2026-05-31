const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

const travel = async (req, res) => {
  try {
    const trips = await Trip.find({}).lean();

    res.render('travel', {
      title: 'Travlr Getaways',
      trips
    });
  } catch (err) {
    res.status(500).render('travel', {
      title: 'Travlr Getaways',
      trips: [],
      error: 'Unable to retrieve trips.'
    });
  }
};

module.exports = {
  travel
};
