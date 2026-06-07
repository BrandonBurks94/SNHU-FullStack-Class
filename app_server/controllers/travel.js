const travel = async (req, res) => {
  try {
    const apiUrl = `${req.protocol}://${req.get('host')}/api/trips`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const trips = await response.json();

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
