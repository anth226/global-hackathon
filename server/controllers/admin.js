const User = require("../models/user");
const Project = require("../models/project");
const crypto = require("crypto");
const { ROLE_SUPER_ADMIN, ROLE_BLOCK, ROLE_JUDGE } = require("../constants");
const setUserInfo = require("../helpers").setUserInfo;
const sendgrid = require("../config/sendgrid");

const pkhead = "-----BEGIN RSA PUBLIC KEY-----";
const pkfooter = "-----END RSA PUBLIC KEY-----";

exports.listAdminUsers = async (req, res, next) => {
  try {
    let users = await User.find({ role: { $ne: ROLE_BLOCK } }).select(
      "_id email profile verified role"
    ).populate("profile.org").populate("profile.location profile.other_locations");
    return res.status(201).json({
      participants: users,
    });
  } catch (err) {
    return next(err);
  }
};

exports.listAdminJudges = async (req, res, next) => {
  try {
    let users = await User.find({ role: ROLE_JUDGE }).select(
      "_id email profile verified role"
    );
    return res.status(201).json({
      participants: users,
    });
  } catch (err) {
    return next(err);
  }
};

exports.listAdminProjectCreators = (req, res, next) => {
  Project.find({})
    .populate("participant")
    .select("_id email profile")
    .exec((err, participants) => {
      if (err) {
        return next(err);
      }
      let result = [];
      for (let pt of participants) {
        if (pt.participant) {
          result.push(pt);
        }
      }
      res.status(201).json({ participants: result });
    });
};

exports.checkKey = async (req, res, next) => {
  let pubkey = req.body.pubkey.replace(/\\n/g, "\n");
  let text = req.body.text;
  let signature = req.body.signature;

  let fmt = "der";
  if (pubkey.includes(pkhead)) {
    fmt = "pem";
  }
  pubkey = pubkey.replace(pkhead, "");
  pubkey = pubkey.replace(pkfooter, "pkfooter");
  pubkey = pubkey.split(" ").join("+");
  pubkey = pubkey.replace("pkfooter", pkfooter);
  pubkey = pkhead + pubkey;
  console.log(pubkey);
  try {
    let keyData = {
      key: pubkey,
      format: fmt,
    };
    if (fmt === "der") keyData.type = "pkcs1";
    const key = crypto.createPublicKey(keyData);

    let bsign = Buffer.from(signature, "base64");
    const verify = crypto.createVerify("SHA256");

    verify.update(text);
    verify.end();
    let result = verify.verify(key, bsign);

    return res.status(201).json({
      result,
    });
  } catch (err) {
    return res.status(201).send({ error: err.message });
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    if (req.user.role !== ROLE_SUPER_ADMIN)
      return res.status(401).send({ error: "You are not super admin user" });
    await User.findByIdAndUpdate(req.params.id, {
      role: req.body.role,
    });
    let user = await User.findById(req.params.id);
    res.send({ user });
  } catch (err) {
    return next(err);
  }
};

exports.getAdminUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    const userToReturn = setUserInfo(user);
    return res.status(200).json({ user: userToReturn });
  } catch (err) {
    return next(err);
  }
};

exports.upateAdminUser = async (req, res, next) => {
  try {
    let profile = req.body.profile;
    let email = profile.email;
    if (!profile.org) profile.org = null;
    delete profile.email;
    delete profile._id;
    await User.findByIdAndUpdate(req.params.id, {
      profile,
      email,
    });
    let user = await User.findById(req.params.id);
    res.send({ user });
  } catch (err) {
    return next(err);
  }
};

exports.updateJudgeChallenge = async (req, res, next) => {
  try {
    if (req.user.role !== ROLE_SUPER_ADMIN)
      return res.status(401).send({ error: "You are not super admin user" });
    await User.findByIdAndUpdate(req.params.id, {
      "profile.integra_id": req.body.integra_id,
    });
    let user = await User.findById(req.params.id);
    res.send({ user });
  } catch (err) {
    return next(err);
  }
};

exports.getAdminEmailTemplates = (req, res, next) => {
  try {
    let result = [];
    result.push({
      title: "Participant Email Verification",
      html: sendgrid.userEVFactory(
        "participant@mail.com",
        "Sergey Oleh",
        "e494a9ddff8488aa372df18cb884252d"
      ),
    });
    // result.push({
    //   title: "Organization Email Verification",
    //   html: sendgrid.orgEVFactory(
    //     "organization@mail.com",
    //     "Integra",
    //     "e494a9ddff8488aa372df18cb884252d"
    //   ),
    // });
    result.push({
      title: "Participant Reset Password",
      html: sendgrid.userFPFactory("e494a9ddff8488aa372df18cb884252d"),
    });
    // result.push({
    //   title: "Organization Reset Password",
    //   html: sendgrid.orgFPFactory("e494a9ddff8488aa372df18cb884252d"),
    // });
    result.push({
      title: "You have unread messages",
      html: sendgrid.messageFactory("Sergey", "Mike", "Here is sample message"),
    });
    result.push({
      title: "New Notification",
      html: sendgrid.notificationFactory(
        "Group Chat Invitation",
        "You are invited to team chat",
        "Mike",
        "https://hackathon-fourthsector.s3.us-east-2.amazonaws.com/a6d1e651-8198-46a4-a57d-669bd12ba96c.png"
      ),
    });
    result.push({
      title: "New Contact",
      html: sendgrid.galleryContactFactory(
        "123456789",
        "I would like to support team",
        "Integra Gallery"
      ),
    });
    // result.push({
    //   title: "New Challenge Created",
    //   html: sendgrid.createCHLFactory(
    //     { org_name: "Integra" },
    //     {
    //       challenge_name: "Test Challenge",
    //       short_description: "This is short description of Test Challenge",
    //     }
    //   ),
    // });
    return res.status(200).json({ templates: result });
  } catch (err) {
    return next(err);
  }
};

exports.checkIpAddress = (req, res, next) => {
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0] ||
    req.connection.remoteAddress;
  return res.status(200).json({ IpAddress: ip });
};
