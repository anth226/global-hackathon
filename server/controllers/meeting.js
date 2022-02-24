const Meeting = require("../models/meeting");
const config = require("../config/main");

var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;

exports.createMeeting = async (req, res, next) => {
  try {
    const meeting = new Meeting(req.body);
    await meeting.save();

    res.status(201).send(meeting);
  } catch (err) {
    res.status(500).send(err);
    return next(err);
  }
};

exports.joinMeeting = async (req, res, next) => {
  Meeting.findById(req.params.id)
    .then((data) => {
      // Create an access token which we will sign and return to the client,
      var token = new AccessToken(
        config.TWILIO_ACCOUNT_SID,
        config.TWILIO_API_KEY,
        config.TWILIO_API_SECRET
      );

      // Assign the identity to the token
      token.identity = req.user.email;

      const grant = new VideoGrant();
      token.addGrant(grant);

      // Serialize the token to a JWT string and include it in a JSON response
      res.send({
        identity: token.identity,
        token: token.toJwt(),
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send(err);
    });
};
