const Gallery = require("../models/gallery");
const Challenge = require("../models/challenge");
const ProjectVote = require("../models/projectvote");

//= =======================================
// Gallery Registration Route
//= =======================================
exports.createGallery = (req, res, next) => {
  const gallery = new Gallery(req.body);
  gallery.save((err, gal) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      gallery: gal,
    });
  });
};

exports.updateGallery = async (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  try {
    await Gallery.findByIdAndUpdate(id, req.body);
    let gal = await Gallery.findById(id);
    res.status(201).json({
      gallery: gal,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getGallery = async (req, res, next) => {
  const id = req.params.gallery_id;
  try {
    let gallery = await Gallery.findById(id).populate("challenge");
    let pvs = await ProjectVote.find({ gallery: id }).populate({
      path: "participant",
      select: "_id profile",
    });
    let npro = { ...gallery._doc, pvs: pvs || [] };
    res.status(201).json({ gallery: npro });
  } catch (err) {
    return next(err);
  }
};

exports.getProjectGallery = (req, res, next) => {
  Gallery.findOne({ project: req.params.project_id }).exec((err, gallery) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ gallery });
  });
};

exports.listGallery = async (req, res, next) => {
  let curNum = parseInt(req.params.count) || 0;
  try {
    let sortFilter = req.body.filter_sort || "";
    let searchStr = req.body.searchStr || "";

    let filter = { ready: true };

    if (req.body.judge_challenge) {
      const challenge = await Challenge.findOne({
        challenge_name: req.body.judge_challenge,
      });
      if (!challenge || !challenge._id)
        return res.status(201).json({
          gallerys: [],
          total: 0,
        });
      filter.challenge = challenge._id;
    } else {
      const chcs = req.body.challenge_category || "";
      if (chcs.length > 1)
        return res.status(201).json({
          gallerys: [],
          total: 0,
        });
      if (chcs.length === 1) {
        const challenge = await Challenge.findOne({ tags: chcs[0] });
        if (!challenge || !challenge._id)
          return res.status(201).json({
            gallerys: [],
            total: 0,
          });
        filter.challenge = challenge._id;
      }
    }

    if (searchStr.length > 2)
      filter["$or"] = [
        { name: { $regex: searchStr, $options: "i" } },
        { description: { $regex: searchStr, $options: "i" } },
        { short_description: { $regex: searchStr, $options: "i" } },
      ];

    let sort = { createdAt: -1 };
    switch (sortFilter) {
      case "A-Z":
        sort = { name: 1 };
        break;
      case "Z-A":
        sort = { name: -1 };
        break;
      case "Oldest-Newest":
        sort = { createdAt: 1 };
        break;
      default:
        sort = sort;
    }

    let total = await Gallery.find(filter).countDocuments();
    let gallerys = await Gallery.find(filter).sort(sort).skip(curNum).limit(16);
    res.status(201).json({
      gallerys,
      total,
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteGallery = (req, res, next) => {
  Gallery.deleteOne({ _id: req.params.gallery_id }).exec((err, gallery) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      gallery,
    });
  });
};

exports.privateGallery = async (req, res, next) => {
  try {
    await Gallery.findByIdAndUpdate(req.params.id, { ready: false });
    let gallery = await Gallery.findById(req.params.id).populate("challenge");
    res.status(201).json({
      gallery,
    });
  } catch (err) {
    return next(err);
  }
};

exports.publicGallery = async (req, res, next) => {
  try {
    await Gallery.findByIdAndUpdate(req.params.id, { ready: true });
    let gallery = await Gallery.findById(req.params.id).populate("challenge");
    res.status(201).json({
      gallery,
    });
  } catch (err) {
    return next(err);
  }
};

// for admin
exports.listAllGallery = async (req, res, next) => {
  try {
    let gallerys = await Gallery.find({ ready: true })
      .populate("project")
      .populate("challenge");
    let result = [];
    for (let gal of gallerys) {
      let pvs = await ProjectVote.find({ gallery: gal._id }).populate(
        "participant"
      );
      let npro = { ...gal._doc, pvs: pvs || [] };
      result.push(npro);
    }
    return res.status(201).json({
      gallerys: result,
    });
  } catch (err) {
    return next(err);
  }
};
