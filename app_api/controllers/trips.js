const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find({}).lean();
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving trips', error: err.message });
  }
};

const tripsFindByCode = async (req, res) => {
  const { tripCode } = req.params;

  if (!tripCode) {
    return res.status(400).json({ message: 'Trip code is required' });
  }

  try {
    const trips = await Trip.find({ code: tripCode }).lean();

    if (!trips.length) {
      return res.status(404).json({ message: `Trip code ${tripCode} not found` });
    }

    return res.status(200).json(trips[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving trip', error: err.message });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode
};
