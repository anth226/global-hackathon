const User = require("../models/user");
const sendgrid = require("../config/sendgrid");
const Organization = require("../models/organization");
const Token = require("../models/token");
const setUserInfo = require("../helpers").setUserInfo;
const crypto = require("crypto");
const ROLE_JUDGE = require("../constants").ROLE_JUDGE;
const setPublicUsers = require("../helpers").setPublicUsers;

exports.sendJudgeInvite = async (req, res, next) => {
  try {
    sendgrid.judgeInviteMail(req.body.email);
    return res.status(200).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

exports.judgeRegister = async function (req, res, next) {
  const email = req.body.email;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const password = req.body.password;
  const title = req.body.title;
  const org_name = req.body.org_name;
  const role = "judge";
  const personal_statement = req.body.personal_statement;
  try {
    let users = await User.find({ email });
    let orgs = await Organization.find({ authorized_email: email });
    if (users.length > 0 || orgs.length > 0) {
      return res
        .status(422)
        .send({ error: "That email address is already in use." });
    }
    const user = new User({
      email,
      password,
      profile: {
        first_name,
        last_name,
        org_name,
        role: title,
        personal_statement,
      },
      role,
    });
    const usr = await user.save();
    const userInfo = setUserInfo(usr);
    const token = new Token({
      _userId: userInfo._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    token.save();
    sendgrid.userEmailVerification(
      userInfo.email,
      `${userInfo.profile.first_name} ${userInfo.profile.last_name} `,
      token.token
    );
    return res.status(201).json({ user: userInfo });
  } catch (err) {
    return next(err);
  }
};

exports.listJudges = async (req, res, next) => {
  let curNum = parseInt(req.params.count) || 0;
  try {
    let sortFilter = req.body.filter_sort || "";
    let searchStr = req.body.searchStr || "";
    delete req.body.loading;
    delete req.body.searchStr;
    delete req.body.filter_sort;
    let filter = { role: ROLE_JUDGE };
    if (searchStr.length > 2)
      filter["$or"] = [
        { "profile.first_name": { $regex: searchStr, $options: "i" } },
        { "profile.last_name": { $regex: searchStr, $options: "i" } },
        { "profile.country": { $regex: searchStr, $options: "i" } },
        { "profile.personal_statement": { $regex: searchStr, $options: "i" } },
        { "profile.role": { $regex: searchStr, $options: "i" } },
      ];
    let sort = { createdAt: -1 };
    switch (sortFilter) {
      case "A-Z":
        sort = { "profile.first_name": 1 };
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
    return res.status(201).json({
      participants: users,
      total,
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteJudge = (req, res, next) => {
  User.deleteOne({ _id: req.params.id }).exec((err, participant) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ participant });
  });
};
