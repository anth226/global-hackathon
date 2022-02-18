const GLHContract = require("../models/glhcontact");

exports.unsubscribe = async (req, res, next) => {
  try {
    let contact = await GLHContract.findOne({ email: req.body.email });
    if (contact) {
      contact.unsubscribed = true;
      await contact.save();
    }
    return res.status(201).json({
      message: "success",
    });
  } catch (err) {
    return next(err);
  }
};
