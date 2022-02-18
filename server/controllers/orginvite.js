const OrgInvite = require("../models/orginvite");
const sendgrid = require("../config/sendgrid");
const Organization = require("../models/organization");

exports.createOrgInvite = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.body.organization);
    const orgInvite = new OrgInvite(req.body);
    const newoi = await orgInvite.save();
    sendgrid.sendOrgMemberInvite(org, newoi);
    res.status(201).json({
      orgInvite: newoi,
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateOrgInvite = async (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  try {
    await OrgInvite.findByIdAndUpdate(id, req.body);
    let newoi = await OrgInvite.findById(id).populate("organization");
    sendgrid.sendOrgMemberInvite(newoi.organization, newoi);
    res.status(201).json({
      orgInvite: newoi,
    });
  } catch (err) {
    return next(err);
  }
};

exports.resendOrgInvite = async (req, res, next) => {
  const id = req.body.inv_id;
  try {
    let newoi = await OrgInvite.findById(id).populate("organization");
    sendgrid.sendOrgMemberInvite(newoi.organization, newoi);
    res.status(201).json({
      orgInvite: newoi,
    });
  } catch (err) {
    return next(err);
  }
};

exports.listOrgInvite = async (req, res, next) => {
  try {
    let orgInvites = await OrgInvite.find({ organization: req.params.org_id });
    res.status(201).json({
      orgInvites,
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteOrgInvite = (req, res, next) => {
  OrgInvite.deleteOne({ _id: req.params.id }).exec((err, fd) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      orgInvite: fd,
    });
  });
};
