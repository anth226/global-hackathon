// Importing Passport, strategies, and config
const passport = require("passport"),
  User = require("../models/user"),
  Organization = require("../models/organization"),
  config = require("./main"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

// Setting JWT strategy options
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  // Telling Passport where to find the secret
  secretOrKey: config.secret,

  // TO-DO: Add issuer and audience checks
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  if (payload.email) {
    User.findById(payload._id, (err, user) => {
      if (err) {
        return done(err, false);
      }

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  } else if (payload.org_name) {
    Organization.findById(payload._id, (err, org) => {
      if (err) {
        return done(err, false);
      }

      if (org) {
        done(null, org);
      } else {
        done(null, false);
      }
    });
  }
});

passport.use(jwtLogin);
