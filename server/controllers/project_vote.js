const ProjectVote = require("../models/projectvote");

//= =======================================
// Project Vote Route
//= =======================================
exports.createProjectVote = async (req, res, next) => {
  try {
    let exVotes = await ProjectVote.find({
      paticipant: req.body.paticipant,
      gallery: req.body.gallery,
    });
    if (exVotes && exVotes.length > 0) {
      return req.status(201).json({ message: "success" });
    }
    let pv = new ProjectVote(req.body);
    pv = await pv.save();
    let result = await ProjectVote.findById(pv._id).populate("participant");
    res.status(201).json({
      projectvote: result,
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateProjectVote = async (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  try {
    await ProjectVote.findByIdAndUpdate(id, req.body);
    let pv = await ProjectVote.findById(id).populate("participant");
    res.status(201).json({
      projectvote: pv,
    });
  } catch (err) {
    return next(err);
  }
};
