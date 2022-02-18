const ProjectMember = require("../models/projectmember");
const utils = require("./util");

exports.joinProject = (req, res, next) => {
  const pm = new ProjectMember({
    participant: req.user._id,
    project: req.params.projectId,
  });
  pm.save((err, pr) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ projectmember: pr });
  });
};

exports.leaveProject = (req, res, next) => {
  ProjectMember.deleteOne({
    participant: req.user._id,
    project: req.params.projectId,
  }).exec((err, pm) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ projectmember: pm });
  });
};

exports.listProject = (req, res, next) => {
  ProjectMember.find({ participant: req.params.userId })
    .populate("project")
    .sort({ createdAt: "desc" })
    .exec((err, pms) => {
      if (err) {
        return next(err);
      }
      let projects = [];
      pms.map((pm) => {
        if (!pm.project) return;
        projects.push(pm);
      });
      res.status(201).json({ projects });
    });
};

exports.listParticipant = (req, res, next) => {
  ProjectMember.find({ project: req.params.projectId })
    .populate("participant")
    .populate("project")
    .sort({ createdAt: "desc" })
    .exec((err, pms) => {
      if (err) {
        return next(err);
      }
      let participants = [];
      pms.map((pm) => {
        if (!pm.participant) return;
        if (!req.user || !utils.compareIds(pm.project.participant, req.user._id)) {
          pm.participant.email = "";
        }
        pm.participant.password = "";
        pm.project = null;
        participants.push(pm);
      });
      res.status(201).json({ participants });
    });
};

exports.listPublicParticipant = (req, res, next) => {
  ProjectMember.find({ project: req.params.projectId })
    .populate("participant")
    .sort({ createdAt: "desc" })
    .exec((err, pms) => {
      if (err) {
        return next(err);
      }
      let participants = [];
      pms.map((pm) => {
        if (!pm.participant) return;
        pm.participant.email = "";
        pm.participant.password = "";
        participants.push(pm);
      });
      res.status(201).json({ participants });
    });
};

exports.inviteParticipant = async (req, res, next) => {
  try {
    let pm = await ProjectMember.findOne({
      project: req.params.projectId,
      participant: req.body.participant,
    });
    if (!pm) return;
    pm.pending = true;
    await pm.save();
    res.status(201).json({ pm });
  } catch (err) {
    return next(err);
  }
};

exports.cancelInviteParticipant = async (req, res, next) => {
  try {
    let pm = await ProjectMember.findOne({
      project: req.params.projectId,
      participant: req.body.participant,
    });
    if (!pm) return;
    pm.pending = false;
    await pm.save();
    res.status(201).json({ pm });
  } catch (err) {
    return next(err);
  }
};

exports.acceptInviteTeam = async (req, res, next) => {
  try {
    let pm = await ProjectMember.findById(req.params.pmId);
    if (!pm) return;
    pm.member = req.body.accept;
    pm.pending = false;
    await pm.save();
    res.status(201).json({ pm });
  } catch (err) {
    return next(err);
  }
};

// clean tool
exports.cleanProjectMember = async () => {
  try {
    let list = await ProjectMember.find({});
    console.log("total numbers--", list.length);
    let i = 0;
    for (let pm of list) {
      let fr = list.filter(
        (item) =>
          item.participant.equals(pm.participant) &&
          item.project.equals(pm.project)
      );
      if (fr && fr.length > 1) {
        await ProjectMember.deleteOne({ _id: pm._id });
        console.log("removed item", i);
        i++;
      }
    }
    console.log("removing ended");
  } catch (err) {
    console.log("err---", err);
  }
};
