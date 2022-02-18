const Announce = require("../models/announce");
const { ROLE_SUPER_ADMIN, ROLE_ADMIN } = require("../constants");

//= =======================================
// Announce Route
//= =======================================
exports.createAnnounce = async (req, res, next) => {
  if (req.user.role !== ROLE_SUPER_ADMIN && req.user.role !== ROLE_ADMIN)
    return res.status(401).send({ error: "You are not admin user" });
  try {
    const announce = new Announce(req.body);
    let result = await announce.save();
    res.status(201).json({
      announce: result,
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateAnnounce = async (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  try {
    await Announce.findByIdAndUpdate(id, req.body);
    let announce = await Announce.findById(id);
    res.status(201).json({
      announce,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getAnnounce = (req, res, next) => {
  Announce.findById(req.params.id).exec((err, announce) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ announce });
  });
};

exports.listAnnounce = async (req, res, next) => {
  try {
    let announces = await Announce.find();
    res.status(201).json({
      announces,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getRecentAnnounce = async (req, res, next) => {
  try {
    let announce = await Announce.findOne({ active: true });
    if (!announce) announce = {};
    res.status(201).json({
      announce,
    });
  } catch (error) {
    return next(error);
  }
};
