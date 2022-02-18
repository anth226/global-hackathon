const Challenge = require("../models/challenge");
const Organization = require("../models/organization");
const Project = require("../models/project");
const Participant = require("../models/user");
const Gallery = require("../models/gallery");
const setPublicUsers = require("../helpers").setPublicUsers;

//= =======================================
// Search Controller
//= =======================================
exports.totalSearch = async (req, res, next) => {
  searchTxt = req.params.searchTxt;
  try {
    const challenges = await Challenge.find({
      challenge_name: { $regex: searchTxt, $options: "i" },
    }).sort({ createdAt: "desc" });
    const projects = await Project.find({
      name: { $regex: searchTxt, $options: "i" },
    }).sort({ createdAt: "desc" });
    const organizations = await Organization.find({
      org_name: { $regex: searchTxt, $options: "i" },
    }).sort({ createdAt: "desc" });
    const participants = await Participant.find({
      "profile.first_name": { $regex: searchTxt, $options: "i" },
    }).sort({ createdAt: "desc" });
    res.status(201).json({
      challenges,
      projects,
      organizations,
      participants: setPublicUsers(participants),
    });
  } catch (err) {
    return next(err);
  }
};

exports.orgSearch = async (req, res, next) => {
  searchTxt = req.params.searchTxt;
  try {
    const organizations = await Organization.find({
      $or: [
        { org_name: { $regex: searchTxt, $options: "i" } },
        { org_type: { $regex: searchTxt, $options: "i" } },
        { address: { $regex: searchTxt, $options: "i" } },
        { authorized_name: { $regex: searchTxt, $options: "i" } },
        { authorized_title: { $regex: searchTxt, $options: "i" } },
      ],
    }).sort({ createdAt: "desc" });
    let result = [];
    for (let org of organizations) {
      let count = await Participant.where({
        "profile.org": org._id,
      }).countDocuments();
      let newOrg = { ...org._doc, participants: count };
      result.push(newOrg);
    }
    res.status(201).json({
      organizations: result,
    });
  } catch (err) {
    return next(err);
  }
};

exports.challengeSearch = async (req, res, next) => {
  searchTxt = req.params.searchTxt;
  try {
    const challenges = await Challenge.find({
      $or: [
        { challenge_name: { $regex: searchTxt, $options: "i" } },
        { description: { $regex: searchTxt, $options: "i" } },
        { geography: { $regex: searchTxt, $options: "i" } },
        { short_description: { $regex: searchTxt, $options: "i" } },
        { benefit: { $regex: searchTxt, $options: "i" } },
      ],
    }).sort({ createdAt: "desc" });
    res.status(201).json({
      challenges,
    });
  } catch (err) {
    return next(err);
  }
};

exports.participantSearch = async (req, res, next) => {
  searchTxt = req.params.searchTxt;
  try {
    let participants = await Participant.find({
      $or: [
        { "profile.first_name": { $regex: searchTxt, $options: "i" } },
        { "profile.last_name": { $regex: searchTxt, $options: "i" } },
        { "profile.org_name": { $regex: searchTxt, $options: "i" } },
        { "profile.address": { $regex: searchTxt, $options: "i" } },
        { "profile.personal_statement": { $regex: searchTxt, $options: "i" } },
        { "profile.contact": { $regex: searchTxt, $options: "i" } },
        { "profile.role": { $regex: searchTxt, $options: "i" } },
      ],
    }).sort({ createdAt: "desc" });
    res.status(201).json({
      participants,
    });
  } catch (err) {
    return next(err);
  }
};

exports.projectSearch = async (req, res, next) => {
  searchTxt = req.params.searchTxt;
  try {
    const projects = await Project.find({
      $or: [
        { name: { $regex: searchTxt, $options: "i" } },
        { description: { $regex: searchTxt, $options: "i" } },
        { short_description: { $regex: searchTxt, $options: "i" } },
      ],
    }).sort({ createdAt: "desc" });
    res.status(201).json({
      projects,
    });
  } catch (err) {
    return next(err);
  }
};
