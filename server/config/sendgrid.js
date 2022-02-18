const config = require("./main");
const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

sgMail.setApiKey(config.sendgridApiKey);
const mainURL = "https://glh2022.globallegalhackathon.com";

exports.userEmailVerification = function userEmailVerification(
  recipient,
  name,
  token
) {
  const msg = {
    to: recipient,
    from: "glh2022@globallegalhackathon.com",
    subject: "Participant Email Verification",
    html: userEVFactory(recipient, name, token),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.userForgotPasword = function userForgotPasword(recipient, token) {
  const msg = {
    to: recipient,
    from: "glh2022@globallegalhackathon.com",
    subject: "Participant Reset Password",
    html: userFPFactory(token),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.newMessage = function newMessage(name, sender, content, email) {
  const msg = {
    to: email,
    from: "glh2022@globallegalhackathon.com",
    subject: "You have unread messages",
    html: messageFactory(name, sender, content),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.newNotification = function newNotification(
  email,
  title,
  content,
  senderName,
  senderPhoto,
  file
) {
  const msg = {
    to: email,
    from: "glh2022@globallegalhackathon.com",
    subject: senderName,
    html: notificationFactory(title, content, senderName, senderPhoto),
  };
  if (file) {
    const attachment = fs.readFileSync(file).toString("base64");
    msg.attachments = [
      {
        content: attachment,
        filename: path.basename(file),
        type: "application/pdf",
        disposition: "attachment",
      },
    ];
  }
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.newContactProject = function newContactProject(
  toEmail,
  fromEmail,
  phone,
  content,
  gallery
) {
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: "New Contact",
    html: galleryContactFactory(phone, content, gallery),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.challegeCreateMail = function challegeCreateMail(org, challenge) {
  if (!org.authorized_email) return;
  const msg = {
    to: org.authorized_email,
    from: "glh2022@globallegalhackathon.com",
    subject: "New Challenge Created",
    html: createCHLFactory(org, challenge),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.judgeInviteMail = function judgeInviteMail(email) {
  const msg = {
    to: email,
    from: "glh2022@globallegalhackathon.com",
    subject: "You are invited",
    html: judgeInviteFactory(),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.orgInviteMail = function orgInviteMail(recipient, name, token) {
  const msg = {
    to: recipient,
    from: "glh2022@globallegalhackathon.com",
    subject: "You are invited",
    html: orgINVFactory(recipient, name, token),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.sendOrgMemberInvite = function sendOrgMemberInvite(org, newoi) {
  const msg = {
    to: newoi.email,
    from: "glh2022@globallegalhackathon.com",
    subject: "You are invited",
    html: orgMemberInviteFactory(org, newoi),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.sendApproveLocaionMail = function sendApproveLocaionMail(
  recipient,
  name,
  location
) {
  const msg = {
    to: recipient,
    from: "glh2022@globallegalhackathon.com",
    subject: "Your hosting location is approved",
    html: approveLocFactory(recipient, name, location),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.sendDeclineLocaionMail = function sendDeclineLocaionMail(
  recipient,
  name,
  location
) {
  const msg = {
    to: recipient,
    from: "glh2022@globallegalhackathon.com",
    subject: "Your hosting location is declined",
    html: declineLocFactory(recipient, name, location),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.sendIdentityEmail = function sendIdentityEmail(email, filename) {
  const pathToAttachment = `${__dirname}/../uploads/${filename}`;
  const attachment = fs.readFileSync(pathToAttachment).toString("base64");
  const msg = {
    to: email,
    from: "glh2022@globallegalhackathon.com",
    subject: "You have a GLH Private Key",
    html: emailIdentityFactory(email),
    attachments: [
      {
        content: attachment,
        filename: filename,
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.sendInviteUser = function sendInviteUser(recipient) {
  const msg = {
    to: recipient,
    from: "glh2022@globallegalhackathon.com",
    subject: "You are invited",
    html: inviteUserFactory(recipient),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

exports.userSignup = function userSignup(recipient, name) {
  const msg = {
    to: recipient,
    from: "glh2022@globallegalhackathon.com",
    subject: "Welcome to the Global Legal Hackathon 2022",
    html: signupFactory(name),
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

function userEVFactory(recipient, name, token) {
  const link = `${mainURL}/email-verify/user/${token}`;
  const mailData = { recipient, name, link };
  const template = fs.readFileSync("template/UserEV.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function userFPFactory(token) {
  const link = `${mainURL}/reset-password/user/${token}`;
  const mailData = { link };
  const template = fs.readFileSync("template/UserFP.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function messageFactory(name, sender, content) {
  const mailData = { name, sender, content };
  const template = fs.readFileSync("template/Message.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function notificationFactory(title, content, senderName, senderPhoto) {
  const mailData = { title, content, senderName, senderPhoto };
  const template = fs.readFileSync("template/Notification.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function galleryContactFactory(phone, content, gallery) {
  const mailData = { phone, content, gallery };
  const template = fs.readFileSync("template/GalleryContact.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function createCHLFactory(org, challenge) {
  // const link = `${mainURL}/email-verify/user/${token}`;
  const mailData = {
    org: org.org_name,
    name: challenge.challenge_name,
    description: challenge.short_description,
  };
  const template = fs.readFileSync("template/CreateChallenge.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function judgeInviteFactory() {
  const link = `${mainURL}/register-judge`;
  const mailData = { link };
  const template = fs.readFileSync("template/JudgeInvite.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function orgINVFactory(recipient, name, token) {
  const link = `${mainURL}/invite/organization/${token}`;
  const mailData = { recipient, name, link };
  const template = fs.readFileSync("template/OrgInv.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function orgMemberInviteFactory(org, newoi) {
  const link = `${mainURL}/register?inv_id=${newoi._id}`;
  const mailData = {
    org_name: org.org_name,
    username: newoi.name,
    logo: org.logo,
    role: newoi.role,
    link,
  };
  const template = fs.readFileSync("template/OrgMemberInv.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function approveLocFactory(recipient, name, location) {
  const link = `${mainURL}/dashboard`;
  const mailData = { recipient, name, location, link };
  const template = fs.readFileSync("template/LocationApprove.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function declineLocFactory(recipient, name, location) {
  const link = `${mainURL}/dashboard`;
  const mailData = { recipient, name, location, link };
  const template = fs.readFileSync("template/LocationDecline.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function emailIdentityFactory(email) {
  const link = mainURL;
  const mailData = { link, email };
  const template = fs.readFileSync("template/IdentityFile.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function inviteUserFactory(email) {
  const link = `${mainURL}/identity`;
  const mailData = { link, email };
  const template = fs.readFileSync("template/InviteUser.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

function signupFactory(name) {
  const mailData = { name };
  const template = fs.readFileSync("template/Signup.html", {
    encoding: "utf-8",
  });
  var text = ejs.render(template, mailData);
  return text;
}

exports.userEVFactory = userEVFactory;
exports.userFPFactory = userFPFactory;
exports.createCHLFactory = createCHLFactory;
exports.messageFactory = messageFactory;
exports.notificationFactory = notificationFactory;
exports.galleryContactFactory = galleryContactFactory;
exports.mainURL = mainURL;
