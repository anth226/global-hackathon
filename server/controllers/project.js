const Project = require("../models/project");
const sendgrid = require("../config/sendgrid");
const Gallery = require("../models/gallery");
const ProjectVote = require("../models/projectvote");
const Challenge = require("../models/challenge");

exports.createProject = (req, res, next) => {
  const project = new Project(req.body);
  project.save((err, pr) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ project: pr });
  });
};

exports.updateProject = (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  Project.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true },
    (err, project) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({ project });
    }
  );
};

exports.voteProject = async (req, res, next) => {
  const vote = req.body.vote;
  if (!req.user || !req.user.email) {
    return res
      .status(401)
      .json({ error: "Only participants can upvote project" });
  }
  try {
    let project = await Project.findById(req.params.id);
    let likes = project.likes;
    if (vote === false) likes.splice(likes.indexOf(req.user._id), 1);
    if (vote === true && likes.indexOf(req.user._id) === -1) {
      likes.push(req.user._id);
    }
    project.likes = likes;
    project = await project.save();
    return res.status(201).json({
      project,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getProject = (req, res, next) => {
  Project.findById(req.params.projectId)
    .populate("participant")
    .populate("challenge")
    .exec((err, project) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({ project });
    });
};

exports.listProject = async (req, res, next) => {
  let curNum = parseInt(req.params.count) || 0;
  try {
    let sortFilter = req.body.filter_sort || "";
    let searchStr = req.body.searchStr || "";
    delete req.body.loading;
    delete req.body.searchStr;
    delete req.body.filter_sort;
    let filter = {};
    let tags = [];
    for (let k of Object.keys(req.body)) {
      if (req.body[k] && req.body[k].length > 0) {
        tags = [...tags, ...req.body[k]];
      }
    }
    if (tags.length > 0) filter["tags"] = { $all: tags };
    // if (req.user.role === "judge") {
    //   const challenge_name = req.user.profile.integra_id;
    //   if (!challenge_name)
    //     return res.status(201).json({
    //       projects: [],
    //       total: 0,
    //     });
    //   const challenge = await Challenge.findOne({ challenge_name });
    //   if (!challenge || !challenge._id)
    //     return res.status(201).json({
    //       projects: [],
    //       total: 0,
    //     });
    //   filter = { challenge: challenge._id };
    // } else {
    //   const chcs = req.body.challenge_category || "";
    //   if (chcs.length > 1)
    //     return res.status(201).json({
    //       projects: [],
    //       total: 0,
    //     });
    //   if (chcs.length === 1) {
    //     const challenge = await Challenge.findOne({ tags: chcs[0] });
    //     if (!challenge || !challenge._id)
    //       return res.status(201).json({
    //         projects: [],
    //         total: 0,
    //       });
    //     filter = { challenge: challenge._id };
    //   }
    // }
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

    let total = await Project.find(filter).countDocuments();
    let projects = await Project.find(filter).sort(sort).skip(curNum).limit(16);
    return res.status(201).json({
      projects,
      total,
    });
  } catch (err) {
    return next(err);
  }
};

exports.listReviewProject = async (req, res, next) => {
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

    let total = await Project.find(filter).countDocuments();
    let projects = await Project.find(filter).sort(sort).skip(curNum).limit(16);
    let result = [];
    for (let proj of projects) {
      let pvs = await ProjectVote.find({ project: proj._id }).populate(
        "participant"
      );
      let npro = { ...proj._doc, pvs: pvs || [] };
      result.push(npro);
    }
    return res.status(201).json({
      projects: result,
      total,
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteProject = (req, res, next) => {
  Project.deleteOne({ _id: req.params.projectId }).exec((err, project) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ project });
  });
};

exports.challengeProjects = (req, res, next) => {
  Project.find({ challenge: req.params.challengeId })
    .sort({ createdAt: "desc" })
    .exec((err, projects) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({ projects });
    });
};

exports.listProjectByCreator = (req, res, next) => {
  Project.find({ participant: req.params.participantId })
    .sort({ createdAt: "desc" })
    .exec((err, projects) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({ projects });
    });
};

exports.listProjectByOrgCreator = (req, res, next) => {
  Project.find({ organization: req.params.orgId })
    .sort({ createdAt: "desc" })
    .exec((err, projects) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({ projects });
    });
};

exports.updateProjectSharers = async (req, res, next) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, {
      sharers: req.body.sharers,
    });
    let project = await Project.findById(req.params.id);
    res.send({ project });
  } catch (err) {
    return next(err);
  }
};

exports.contactCreator = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id).populate("participant");
    let email = "";
    if (project.participant) {
      email = project.participant.email;
    } else if (project.organization) {
      email = project.organization.contact_email;
    } else {
      return res
        .status(400)
        .json({ message: "Failed to send contact information" });
    }
    sendgrid.newContactProject(
      email,
      req.body.email,
      req.body.phone,
      req.body.message,
      req.body.gallery
    );
    res.status(201).json({ message: "Contact submitted successfully" });
  } catch (err) {
    return next(err);
  }
};

// for admin
exports.listAllProject = async (req, res, next) => {
  try {
    let projects = await Project.find({}).populate("participant").populate({
      path: "challenge",
      select: "challenge_name short_description",
    });
    let result = [];
    for (let proj of projects) {
      let challenge = proj.challenge || {};
      let participant = proj.participant || { profile: {} };
      result.push({
        project_name: proj.name,
        project_creator: `${participant.profile.first_name} ${participant.profile.last_name}`,
        short_description: proj.short_description,
        challenge_name: challenge.challenge_name,
        logo: proj.logo,
        _id: proj._id,
        city: proj.city,
        country: proj.country,
      });
    }
    return res.status(201).json({
      projects: result,
    });
  } catch (err) {
    return next(err);
  }
};
