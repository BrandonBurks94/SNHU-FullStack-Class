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

const requiredTripFields = [
  'code',
  'name',
  'image',
  'duration',
  'price',
  'description',
  'details'
];

const buildTripPayload = (body) => requiredTripFields.reduce((payload, field) => {
  payload[field] = body[field];
  return payload;
}, {});

const missingTripFields = (body) => requiredTripFields.filter((field) => !body[field]);

const tripsAddTrip = async (req, res) => {
  const missingFields = missingTripFields(req.body);

  if (missingFields.length) {
    return res.status(400).json({
      message: `Missing required trip fields: ${missingFields.join(', ')}`
    });
  }

  try {
    const trip = await Trip.create(buildTripPayload(req.body));
    return res.status(201).json(trip);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: `Trip code ${req.body.code} already exists` });
    }

    return res.status(500).json({ message: 'Error creating trip', error: err.message });
  }
};

const tripsUpdateTrip = async (req, res) => {
  const { tripCode } = req.params;

  if (!tripCode) {
    return res.status(400).json({ message: 'Trip code is required' });
  }

  const missingFields = missingTripFields(req.body);

  if (missingFields.length) {
    return res.status(400).json({
      message: `Missing required trip fields: ${missingFields.join(', ')}`
    });
  }

  try {
    const trip = await Trip.findOneAndUpdate(
      { code: tripCode },
      buildTripPayload(req.body),
      { returnDocument: 'after', runValidators: true }
    ).lean();

    if (!trip) {
      return res.status(404).json({ message: `Trip code ${tripCode} not found` });
    }

    return res.status(200).json(trip);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: `Trip code ${req.body.code} already exists` });
    }

    return res.status(500).json({ message: 'Error updating trip', error: err.message });
  }
};

const tripsDeleteTrip = async (req, res) => {
  const { tripCode } = req.params;

  if (!tripCode) {
    return res.status(400).json({ message: 'Trip code is required' });
  }

  try {
    const trip = await Trip.findOneAndDelete({ code: tripCode }).lean();

    if (!trip) {
      return res.status(404).json({ message: `Trip code ${tripCode} not found` });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting trip', error: err.message });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};
