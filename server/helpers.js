const ROLE_MEMBER = require("./constants").ROLE_MEMBER;
const ROLE_BLOCK = require("./constants").ROLE_BLOCK;
const ROLE_RESTRICT = require("./constants").ROLE_RESTRICT;
const ROLE_ADMIN = require("./constants").ROLE_ADMIN;
const crypto = require("crypto");
const iv = "1287cfd558f2523d00f12ba343e99c73";

// Set user info from request
exports.setUserInfo = function setUserInfo(request) {
  return {
    _id: request._id,
    profile: request.profile,
    email: request.email,
    role: request.role,
    integra_id: request.integra_id,
    verified: request.verified,
    blockers: request.blockers,
  };
};

// Set org info from request
exports.setOrgInfo = function setOrgInfo(request) {
  return {
    _id: request._id,
    org_name: request.org_name,
    org_type: request.org_type,
    address: request.address,
    country: request.country,
    city: request.city,
    state: request.state,
    website: request.website,
    logo: request.logo,
    agree_terms: request.agree_terms,
    contact_name: request.contact_name,
    contact_email: request.contact_email,
    contact_phone: request.contact_phone,
    tags: request.tags,
    attr: request.attr,
  };
};

exports.setPublicUsers = (users) => {
  if (!users || users.length === 0) return [];
  let result = [];
  for (let user of users) {
    result.push({
      _id: user._id,
      profile: user.profile,
    });
  }
  return result;
};

exports.setPrivateUsers = (users) => {
  if (!users || users.length === 0) return [];
  let result = [];
  for (let user of users) {
    result.push({
      _id: user._id,
      email: user.email,
      profile: user.profile,
    });
  }
  return result;
};

exports.getRole = function getRole(checkRole) {
  let role;

  switch (checkRole) {
    case ROLE_ADMIN:
      role = 4;
      break;
    case ROLE_BLOCK:
      role = 3;
      break;
    case ROLE_RESTRICT:
      role = 2;
      break;
    case ROLE_MEMBER:
      role = 1;
      break;
    default:
      role = 1;
  }

  return role;
};

exports.translateP = function translateP(pstr) {
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(iv),
    Buffer.from(iv, "hex")
  );
  let encrypted = cipher.update(pstr);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
};
