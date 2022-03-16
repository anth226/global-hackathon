const Notification = require("../models/notification"),
  User = require("../models/user"),
  Project = require("../models/project"),
  sockets = require("../socket"),
  utils = require("./util"),
  sendgrid = require("../config/sendgrid");

exports.notifyAllUsers = async (req, res, next) => {
  try {
    let notif = new Notification({
      receptors: [],
      alias: "all",
      title: req.body.title,
      body: req.body.content,
      author: req.user._id,
    });
    notif = await notif.save();

    const io = sockets.io;
    const participants = await User.find({}).select("_id email");
    let receptors = [];
    for (let key in io.sockets.sockets) {
      if (io.sockets.sockets.hasOwnProperty(key)) {
        io.sockets.sockets[key].emit("NEW_NOTIFICATION", {
          notification: notif,
        });
        receptors.push(io.sockets.sockets[key].userId);
      }
    }
    for (let pt of participants) {
      if (!receptors.some((r) => utils.compareIds(r, pt._id))) {
        this.sendNotificationMail(
          req.user,
          pt,
          req.body.title,
          req.body.content
        );
      }
    }
    return res.status(200).json({ message: "Notification sent successfully" });
  } catch (err) {
    res.status(500).send({ error: err });
    return next(err);
  }
};

exports.notifyProjectCreators = async (req, res, next) => {
  try {
    let projects = await Project.find({})
      .populate("participant")
      .select("_id email");
    let participants = [],
      pIds = [];
    for (let proj of projects) {
      if (proj.participant) {
        participants.push(proj.participant);
        pIds.push(proj.participant._id);
      }
    }

    let notif = new Notification({
      receptors: pIds,
      alias: "project_creators",
      title: req.body.title,
      body: req.body.content,
      author: req.user._id,
    });
    notif = await notif.save();

    const io = sockets.io;
    let receptors = [];
    for (let key in io.sockets.sockets) {
      if (io.sockets.sockets.hasOwnProperty(key)) {
        if (
          pIds.some((p) => utils.compareIds(p, io.sockets.sockets[key].userId))
        ) {
          io.sockets.sockets[key].emit("NEW_NOTIFICATION", {
            notification: notif,
          });
          receptors.push(io.sockets.sockets[key].userId);
        }
      }
    }
    for (let pt of participants) {
      if (!receptors.some((r) => utils.compareIds(r, pt._id))) {
        this.sendNotificationMail(
          req.user,
          pt,
          req.body.title,
          req.body.content
        );
      }
    }
    return res.status(200).json({ message: "Notification sent successfully" });
  } catch (err) {
    res.status(500).send({ error: err });
    return next(err);
  }
};

exports.notifyOrganizations = async (req, res, next) => {
  try {
    let hosts = await User.find({ "profile.location_role": "Admin" }).select(
      "_id email"
    );
    // let pIds = [];
    // for (let host of hosts) {
    //   pIds.push(host._id);
    // }

    // let notif = new Notification({
    //   receptors: pIds,
    //   alias: "hosts",
    //   title: req.body.title,
    //   body: req.body.content,
    //   author: req.user._id,
    // });
    // notif = await notif.save();
    const files = req.files;

    for (let host of hosts) {
      await this.sendNotificationMail(
        req.user,
        { email: host.email },
        req.body.title,
        req.body.content,
        files
      );
    }

    res.status(200).json({ message: "Notification sent successfully" });
  } catch (err) {
    res.status(500).send({ error: err });
    return next(err);
  }
};

exports.getNotification = async (req, res, next) => {
  try {
    let notifications = await Notification.find({
      $or: [{ alias: "all" }, { receptors: req.user._id }],
    })
      .populate({ path: "author", select: "_id profile" })
      .sort("-createdAt")
      .limit(16);

    return res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).send({ error: err });
    return next(err);
  }
};

exports.readNotification = async (req, res, next) => {
  try {
    let notification = await Notification.findById(req.body._id);
    let reads = notification.read || [];
    if (!reads.includes(req.user._id)) {
      reads.push(req.user._id);
    }
    notification = await Notification.findOneAndUpdate(
      { _id: req.body._id },
      { read: reads },
      { new: true }
    );
    return res.status(200).json({ notification });
  } catch (err) {
    res.status(500).send({ error: err });
    return next(err);
  }
};

exports.sendNotificationMail = async (
  sender,
  receptor,
  title,
  content,
  files
) => {
  if (utils.compareIds(sender._id, receptor._id)) return;
  try {
    if (!sender || !receptor) return;
    let senderName = `${sender.profile.first_name} ${sender.profile.last_name}`;
    sendgrid.newNotification(
      receptor.email,
      title,
      content,
      senderName,
      sender.profile.photo,
      files
    );
  } catch (err) {
    console.log(err);
    return;
  }
};

exports.notifyAllHostUsers = async (req, res, next) => {
  try {
    const io = sockets.io;
    const participants = await User.find({
      "profile.location": req.user.profile.location,
    }).select("_id email");
    const pids = participants.map((pt) => pt._id);

    let notif = new Notification({
      receptors: pids,
      alias: "hostusers",
      title: req.body.title,
      body: req.body.content,
      author: req.user._id,
    });
    notif = await notif.save();

    for (let key in io.sockets.sockets) {
      if (io.sockets.sockets.hasOwnProperty(key)) {
        io.sockets.sockets[key].emit("NEW_NOTIFICATION", {
          notification: notif,
        });
      }
    }
    for (let pt of participants) {
      this.sendNotificationMail(req.user, pt, req.body.title, req.body.content);
    }
    return res.status(200).json({ message: "Notification sent successfully" });
  } catch (err) {
    res.status(500).send({ error: err });
    return next(err);
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
