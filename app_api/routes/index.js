const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const authController = require('../controllers/authentication');
const tripsController = require('../controllers/trips');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.sendStatus(401);
  }

  return jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
    if (err) {
      return res.sendStatus(401);
    }

    req.auth = verified;
    return next();
  });
};

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/trips', tripsController.tripsList);
router.post('/trips', authenticateJWT, tripsController.tripsAddTrip);
router.get('/trips/:tripCode', tripsController.tripsFindByCode);
router.put('/trips/:tripCode', authenticateJWT, tripsController.tripsUpdateTrip);
router.delete('/trips/:tripCode', authenticateJWT, tripsController.tripsDeleteTrip);

module.exports = router;
