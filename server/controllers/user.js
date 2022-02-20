const User = require("../models/user");
const setUserInfo = require("../helpers").setUserInfo;
const setPublicUsers = require("../helpers").setPublicUsers;
const ROLE_MEMBER = require("../constants").ROLE_MEMBER;
const ROLE_RESTRICT = require("../constants").ROLE_RESTRICT;
const ROLE_BLOCK = require("../constants").ROLE_BLOCK;
const ROLE_ADMIN = require("../constants").ROLE_ADMIN;
const ROLE_SUPER_ADMIN = require("../constants").ROLE_SUPER_ADMIN;
const Challenge = require("../models/challenge");
const Project = require("../models/project");
const ProjectMember = require("../models/projectmember");
const Token = require("../models/token");

//= =======================================
// User Routes
//= =======================================
exports.viewProfile = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    let user = await User.findById(userId)
      .populate("profile.location profile.other_locations");
    const userToReturn = setUserInfo(user);
    return res.status(200).json({ user: userToReturn });
  } catch (err) {
    return next(err);
  }
};

exports.getUserSession = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id)
      .populate("profile.location profile.other_locations");
    const userToReturn = setUserInfo(user);
    return res.status(200).json({ user: userToReturn });
  } catch (err) {
    return next(err);
  }
};

exports.updateUserLocation = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      user.profile.location = req.body.locationId;
      await user.save();
    }
    return res.status(200).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

exports.updateUserAddress = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      user.profile.country = req.body.country;
      user.profile.city = req.body.city;
      await user.save();
    }
    return res.status(200).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    let profile = req.body.profile;
    let email = profile.email;
    if (!profile.org) profile.org = null;
    delete profile.email;
    await User.findByIdAndUpdate(
      req.user._id,
      {
        profile,
        email,
      },
      {
        new: true,
      }
    );
    let user = await User.findById(req.user._id)
      .populate("profile.org")
      .populate("profile.location");
    res.send({ user });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

exports.deleteProfile = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId }).exec((err, user) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      user,
    });
  });
};

exports.orgUsers = (req, res, next) => {
  User.find({ "profile.org": req.params.org_id })
    .sort({ createdAt: "desc" })
    .exec((err, users) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        participants: setPublicUsers(users),
      });
    });
};

exports.listAllUsers = async (req, res, next) => {
  let curNum = parseInt(req.params.count) || 0;
  try {
    let sortFilter = req.body.filter_sort || "";
    let searchStr = req.body.searchStr || "";
    let user_roles = req.body.user_role || [];
    delete req.body.loading;
    delete req.body.searchStr;
    delete req.body.filter_sort;
    delete req.body.user_role;
    let filter = {
      role: [ROLE_MEMBER, ROLE_SUPER_ADMIN, ROLE_RESTRICT, ROLE_ADMIN],
    };
    if (user_roles.length > 0)
      filter["profile.position"] = { $all: user_roles };
    if (searchStr.length > 2)
      filter["$or"] = [
        { "profile.first_name": { $regex: searchStr, $options: "i" } },
        { "profile.last_name": { $regex: searchStr, $options: "i" } },
        { "profile.country": { $regex: searchStr, $options: "i" } },
        { "profile.personal_statement": { $regex: searchStr, $options: "i" } },
      ];
    let sort = { "profile.first_name": 1 };

    switch (sortFilter) {
      case "Newest-Oldest":
        sort = { createdAt: -1 };
        break;
      case "Z-A":
        sort = { "profile.first_name": -1 };
        break;
      case "Oldest-Newest":
        sort = { createdAt: 1 };
        break;
      default:
        sort = sort;
    }

    let total = await User.find(filter).countDocuments();
    let users = await User.find(filter).sort(sort).skip(curNum).limit(16);
    users = setPublicUsers(users);
    let result = [];
    for (let user of users) {
      let chl_count = await Challenge.where({
        participant: user._id,
      }).countDocuments();
      let proj_count = await Project.where({
        participant: user._id,
      }).countDocuments();
      let pm_count = await ProjectMember.where({
        participant: user._id,
      }).countDocuments();
      let newUser = {
        ...user,
        challenges: chl_count,
        projects: proj_count + pm_count,
      };
      result.push(newUser);
    }
    return res.status(201).json({
      participants: result,
      total,
    });
  } catch (err) {
    return next(err);
  }
};

exports.restrictUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      role: ROLE_RESTRICT,
    });
    let user = await User.findById(req.params.id);
    res.send({ user });
  } catch (err) {
    return next(err);
  }
};

exports.blockUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      role: ROLE_BLOCK,
    });
    let user = await User.findById(req.params.id);
    res.send({ user });
  } catch (err) {
    return next(err);
  }
};

exports.listSimpleParticipants = async (req, res, next) => {
  try {
    let users = await User.find({ role: { $ne: ROLE_BLOCK } }, "_id profile");
    return res.status(201).json({
      participants: users,
    });
  } catch (err) {
    return next(err);
  }
};

exports.adminListUnverifiedParticipants = async (req, res, next) => {
  try {
    let users = await User.find(
      { verified: { $ne: true } },
      "_id profile email"
    );
    return res.status(201).json({
      participants: users,
    });
  } catch (err) {
    return next(err);
  }
};

exports.adminVerifyParticipant = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      verified: true,
    });
    let user = await User.findById(req.params.id);
    res.send({ user });
  } catch (err) {
    return next(err);
  }
};

exports.inviteVerifyUser = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const t = await Token.findOne({ token });
    if (!t) {
      res.status(201).json({
        message: "Invalid token",
      });
      return;
    }
    let user = await User.findById(t._userId);
    user.password = password;
    await user.save();
    await Token.deleteMany({ token });
    return res.status(200).json({
      message:
        "Password updated successfully. Please login with your new password.",
    });
  } catch (err) {
    return next(err);
  }
};

exports.listLocationParticipants = async (req, res, next) => {
  try {
    let users = await User.find(
      {
        role: { $ne: ROLE_BLOCK },
        "profile.location": req.params.location_id,
        "profile.location_role": "Participant",
      },
      "_id profile email"
    );
    return res.status(201).json({
      participants: users,
    });
  } catch (err) {
    return next(err);
  }
};
