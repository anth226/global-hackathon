const Sponsor = require("../models/sponsor");
const { ROLE_SUPER_ADMIN, ROLE_ADMIN } = require("../constants");

exports.createSponsor = async (req, res, next) => {
  try {
    const newSponsor = await Sponsor.create(req.body);
    return res
      .status(201)
      .json({ message: "Sponsor created successfully", data: newSponsor });
  } catch (err) {
    return next(err);
  }
};

exports.getAllSponsors = async (req, res, next) => {
  try {
    const sponsors = await Sponsor.find();
    if (sponsors.length == 0)
      return res.status(404).send({ error: "No Sponsors yet" });
    return res
      .status(200)
      .json({ message: "Sponsors fetched successfully", data: sponsors });
  } catch (err) {
    return next(err);
  }
};

exports.getSingleSponsor = async (req, res, next) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) return res.status(404).send({ error: "No sponsor found" });
    return res
      .status(200)
      .json({ message: "Sponsor fetched successfully", data: sponsor });
  } catch (err) {
    return next(err);
  }
};

exports.updateSponsor = async (req, res, next) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) return res.status(404).send({ error: "No sponsor found" });
    const updatedSponsor = await Sponsor.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { safe: true, upsert: true, new: true }
    );
    return res
      .status(200)
      .json({ message: "Sponsor updated successfully", data: updatedSponsor });
  } catch (err) {
    return next(err);
  }
};
