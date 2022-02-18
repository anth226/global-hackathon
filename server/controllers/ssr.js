const Challenge = require("../models/challenge");

exports.RenderChallenge = (req, res, next) => {
  Challenge.findById(req.params.challenge_id, (err, challenge) => {
    if (err || !challenge) {
      return res.render("NotFound")
    }
    res.render("Challenge", challenge)
  });
};