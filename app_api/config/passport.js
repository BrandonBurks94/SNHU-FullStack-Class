const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy(
  {
    usernameField: 'email'
  },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username.toLowerCase() });

      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));
