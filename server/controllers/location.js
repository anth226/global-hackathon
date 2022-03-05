const Location = require("../models/location");
const User = require("../models/user");
const sendgrid = require("../config/sendgrid");
const chat = require("./chat");

exports.createLocation = async (req, res, next) => {
  try {
    const email = req.body.email;
    let creator = await User.findOne({ email });
    let location = new Location(req.body.location);
    location.creator = creator._id;
    location = await location.save();
    creator.profile.location = location._id;
    creator.profile.location_role = "Admin";
    await creator.save();
    return res.status(201).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

exports.createOtherLocation = async (req, res, next) => {
  try {
    const email = req.body.email;
    let creator = await User.findOne({ email });
    let location = new Location(req.body.location);
    location.creator = creator._id;
    location = await location.save();
    creator.profile.other_locations.push(location._id);
    await creator.save();
    return res.status(201).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};

exports.updateLocation = async (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  try {
    await Location.findByIdAndUpdate(id, req.body);
    let location = await Location.findById(id);
    res.status(201).json({
      location,
    });
  } catch (err) {
    return next(err);
  }
};

exports.listLocation = (req, res, next) => {
  Location.find({ status: "approved" })
    .populate({ path: "creator", select: "email profile" })
    .sort({ venue: 1 })
    .exec((err, fds) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        locations: fds,
      });
    });
};

exports.findLocationById = (req, res, next) => {
  Location.findById(req.params.id)
    .populate({ path: "creator", select: "email profile" })
    .exec((err, fds) => {
      if (err) {
        return next(err);
      }
      res.status(200).json(fds);
    });
};

exports.messageParticipants = async (req, res, next) => {
  try {
    const users = await User.find({ location_role: "Member" });
    const userIds = users.map((user) => user._id);

    userIds.forEach((userId) => {
      req.params.recipient = userId;
      req.body.composedMessage = req.body.message;
      chat
        .newConversation(req, res, next)
        .then(console.log("SENT"))
        .catch((err) => console.error(err));
    });
    res.status(201).json({
      message: "Messages sent successfully.",
    });
  } catch (err) {
    return next(err);
  }
};

exports.listPendingLocation = (req, res, next) => {
  Location.find({ status: "pending" })
    .populate({ path: "creator", select: "email profile" })
    .sort({ venue: 1 })
    .exec((err, fds) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        locations: fds,
      });
    });
};

exports.adminListLocation = (req, res, next) => {
  Location.find({})
    .populate({ path: "creator", select: "email profile" })
    .sort({ venue: 1 })
    .exec((err, fds) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        locations: fds,
      });
    });
};

exports.resolveLocation = async (req, res, next) => {
  try {
    let location = await Location.findById(req.body._id).populate({
      path: "creator",
      select: "email profile",
    });
    location.status = "approved";
    await location.save();
    const email = location.creator.email;
    const user = await User.findOne({ email });
    const contact_name = `${user.profile.first_name} ${user.profile.last_name}`;
    sendgrid.sendApproveLocaionMail(email, contact_name, location.venue);
    res.status(201).json({ location });
  } catch (err) {
    return next(err);
  }
};

exports.deleteLocation = async (req, res, next) => {
  try {
    let location = await Location.findById(req.params.id).populate({
      path: "creator",
      select: "email profile",
    });
    await Location.deleteOne({ _id: req.params.id });

    const email = location.creator.email;
    const user = await User.findOne({ email });
    const contact_name = `${user.profile.first_name} ${user.profile.last_name}`;
    await User.deleteOne({ email });

    sendgrid.sendDeclineLocaionMail(email, contact_name, location.venue);
    res.status(201).json({ location });
  } catch (err) {
    return next(err);
  }
};

exports.hostVerifyUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.user_id, {
      "profile.host_verified": true,
    });
    res.status(201).json({ message: "success" });
  } catch (err) {
    return next(err);
  }
};
