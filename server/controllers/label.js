const Label = require("../models/label");

exports.fetchLabelData = (req, res, next) => {
  Label.findOne({}).exec((err, lbs) => {
    if (err) {
      return next(err);
    }
    if (!lbs) {
      return res.status(422).send({ error: "Label data has not been set yet" });
    }
    res.status(201).json({
      label: lbs,
    });
  });
};

exports.updateLabelData = async (req, res, next) => {
  try {
    const id = req.body._id;
    delete req.body._id;

    await Label.findByIdAndUpdate(id, req.body);
    const label = await Label.findById(id);
    res.send({ label });
  } catch (err) {
    return next(err);
  }
};
