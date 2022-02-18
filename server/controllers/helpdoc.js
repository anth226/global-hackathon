const HelpDoc = require("../models/helpdoc");

exports.createHelpDoc = (req, res, next) => {
  const helpdoc = new HelpDoc(req.body);
  helpdoc.save((err, hd) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      helpdoc: hd,
    });
  });
};

exports.updateHelpDoc = async (req, res, next) => {
  try {
    const id = req.body._id;
    delete req.body._id;
    await HelpDoc.findByIdAndUpdate(id, req.body);
    const helpdoc = await HelpDoc.findById(id);
    res.send({ helpdoc });
  } catch (err) {
    return next(err);
  }
};

exports.listHelpDoc = (req, res, next) => {
  HelpDoc.find({}).exec((err, hds) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      helpdocs: hds,
    });
  });
};

exports.deleteHelpDoc = (req, res, next) => {
  HelpDoc.deleteOne({ _id: req.params.id }).exec((err, hd) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      helpdoc: hd,
    });
  });
};
