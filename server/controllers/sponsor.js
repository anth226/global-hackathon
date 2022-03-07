const Sponsor = require("../models/sponsor");

exports.createSponsor = (req, res, next) => {
  const sponsors = new Sponsor({
    location: req.body.locationId,
    name: req.body.name,
    link: req.body.link,
    imageUrl: req.body.imageUrl,
  });

  sponsors.save((err, sp) => {
    if (err) {
      return next(err);
    }
    res.status(201).json(sp);
  });
};

exports.updateSponsor = (req, res, next) => {
  Sponsor.findOneAndUpdate(
    { _id: req.body._id },
    { link: req.body.link, imageUrl: req.body.imageUrl, name: req.body.name },
    { new: true },
    (err, cm) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({ sponsors: cm });
    }
  );
};

exports.listSponsors = (req, res, next) => {
  Sponsor.find()
    .populate("location")
    .then((sponsors) => res.status(200).send(sponsors))
    .catch((err) => res.status(500).send(err));
};

exports.getSponsorById = (req, res, next) => {
  Sponsor.findById(re.params.id)
    .populate("location")
    .then((sponsors) => res.status(200).send(sponsors))
    .catch((err) => res.status(500).send(err));
};

exports.getSponsorsByLocation = (req, res, next) => {
  console.log(req.params);
  Sponsor.find({ location: req.params.locationId })
    .populate("location")
    .sort({ createdAt: -1 })
    .then((sponsors) => res.status(200).send(sponsors))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
};

exports.deleteSponsor = (req, res, next) => {
  Sponsor.deleteOne({ _id: req.params.id }).exec((err, cm) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ sponsors: cm });
  });
};
