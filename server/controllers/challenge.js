const Challenge = require("../models/challenge");
const Project = require("../models/project");
const sendgrid = require("../config/sendgrid");

//= =======================================
// Challenge Registration Route
//= =======================================
exports.createChallenge = async (req, res, next) => {
  try {
    const challenge = new Challenge(req.body);
    let chl = await challenge.save();
    sendgrid.challegeCreateMail(req.user, chl);
    res.status(201).json({
      challenge: chl,
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateChallenge = async (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  try {
    await Challenge.findByIdAndUpdate(id, req.body);
    let chl = await Challenge.findById(id);
    res.status(201).json({
      challenge: chl,
    });
  } catch (err) {
    return next(err);
  }
};

exports.supportChallenge = async (req, res, next) => {
  const support = req.body.support;
  if (!req.user || !req.user.org_name) {
    return res
      .status(401)
      .json({ error: "Only organization can support challenge" });
  }
  try {
    let challenge = await Challenge.findById(req.params.id);
    let spts = challenge.supports;
    if (support === false) spts.splice(spts.indexOf(req.user._id), 1);
    if (support === true && spts.indexOf(req.user._id) === -1) {
      spts.push(req.user._id);
    }
    challenge.supports = spts;
    challenge = await challenge.save();
    return res.status(201).json({
      challenge,
    });
  } catch (err) {
    return next(err);
  }
};

exports.voteChallenge = async (req, res, next) => {
  const vote = req.body.vote;
  if (!req.user || !req.user.email) {
    return res
      .status(401)
      .json({ error: "Only participants can upvote challenge" });
  }
  try {
    let challenge = await Challenge.findById(req.params.id);
    let likes = challenge.likes;
    if (vote === false) likes.splice(likes.indexOf(req.user._id), 1);
    if (vote === true && likes.indexOf(req.user._id) === -1) {
      likes.push(req.user._id);
    }
    challenge.likes = likes;
    challenge = await challenge.save();
    return res.status(201).json({
      challenge,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getChallenge = (req, res, next) => {
  Challenge.findById(req.params.challenge_id)
    .populate({ path: "participant", select: "_id profile" })
    .populate({ path: "supports", select: "_id org_name logo country city" })
    .exec((err, challenge) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({ challenge });
    });
};

exports.listChallenge = async (req, res, next) => {
  let curNum = parseInt(req.params.count) || 0;
  try {
    let sortFilter = req.body.filter_sort || "";
    let searchStr = req.body.searchStr || "";
    delete req.body.loading;
    delete req.body.searchStr;
    delete req.body.filter_sort;

    let filter = { public: true };
    let tags = [];
    for (let k of Object.keys(req.body)) {
      if (req.body[k] && req.body[k].length > 0) {
        tags = [...tags, ...req.body[k]];
      }
    }
    if (tags.length > 0) filter["tags"] = { $all: tags };
    if (searchStr.length > 2)
      filter["$or"] = [
        { challenge_name: { $regex: searchStr, $options: "i" } },
        { description: { $regex: searchStr, $options: "i" } },
        { short_description: { $regex: searchStr, $options: "i" } },
      ];
    let sort = { createdAt: -1 };
    switch (sortFilter) {
      case "A-Z":
        sort = { challenge_name: 1 };
        break;
      case "Z-A":
        sort = { challenge_name: -1 };
        break;
      case "Oldest-Newest":
        sort = { createdAt: 1 };
        break;
      default:
        sort = sort;
    }

    let total = await Challenge.find(filter).countDocuments();
    let challenges = await Challenge.find(filter)
      .sort(sort)
      .skip(curNum)
      .limit(16);

    let result = [];
    for (let chl of challenges) {
      let count = await Project.where({ challenge: chl._id }).countDocuments();
      let newChl = { ...chl._doc, projects: count };
      result.push(newChl);
    }
    res.status(201).json({
      challenges: result,
      total,
    });
  } catch (error) {
    return next(error);
  }
};

exports.listChallengesByOrg = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({
      organization: req.params.org_id,
    }).sort({ createdAt: "desc" });
    let result = [];
    for (let chl of challenges) {
      let count = await Project.where({ challenge: chl._id }).countDocuments();
      let newChl = { ...chl._doc, projects: count };
      result.push(newChl);
    }
    res.status(201).json({
      challenges: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.listChallengesByUser = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({
      participant: req.params.user_id,
    }).sort({ createdAt: "desc" });
    let result = [];
    for (let chl of challenges) {
      let count = await Project.where({ challenge: chl._id }).countDocuments();
      let newChl = { ...chl._doc, projects: count };
      result.push(newChl);
    }
    res.status(201).json({
      challenges: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.listSupportChallengeByOrg = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({
      supports: req.params.org_id,
    }).select("_id challenge_name logo short_description");
    res.status(201).json({
      challenges,
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteChallenge = (req, res, next) => {
  Challenge.deleteOne({ _id: req.params.challenge_id }).exec(
    (err, challenge) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        challenge,
      });
    }
  );
};

exports.adminApproveChallenge = async (req, res, next) => {
  const id = req.params.challenge_id;
  try {
    await Challenge.findByIdAndUpdate(id, { public: true });
    let chl = await Challenge.findById(id);
    res.status(201).json({
      challenge: chl,
    });
  } catch (err) {
    return next(err);
  }
};

exports.adminListChallenge = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ public: true }).sort({
      createdAt: "desc",
    });
    let result = [];
    for (let chl of challenges) {
      let count = await Project.where({ challenge: chl._id }).countDocuments();
      let org = {};
      let newChl = {
        logo: chl._doc.logo,
        challenge_name: chl._doc.challenge_name,
        _id: chl._id,
        short_description: chl._doc.short_description,
        geography: chl._doc.geography,
        org_name: org.org_name,
        benefit: chl._doc.benefit,
        projects: count,
      };
      result.push(newChl);
    }
    res.status(201).json({
      challenges: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.adminPendingChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ public: false })
      .populate("participant")
      .sort({ updatedAt: "desc" });
    let result = [];
    for (let chl of challenges) {
      let user = chl.participant || { profile: {} };
      let newChl = {
        logo: chl._doc.logo,
        challenge_name: chl._doc.challenge_name,
        _id: chl._id,
        short_description: chl._doc.short_description,
        geography: chl._doc.geography,
        participant_name: `${user.profile.first_name} ${user.profile.last_name}`,
        benefit: chl._doc.benefit,
      };
      result.push(newChl);
    }
    res.status(201).json({
      challenges: result,
    });
  } catch (error) {
    return next(error);
  }
};
