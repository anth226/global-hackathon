const Rule = require("../models/rule");

//= =======================================
// Rule Route
//= =======================================
exports.createRule = async (req, res, next) => {
  try {
    const rule = new Rule({
      participant: req.body.user_id,
    });
    let result = await rule.save();
    res.status(201).json({
      rule: result,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getRule = async (req, res, next) => {
  try {
    let rule = await Rule.findOne({ participant: req.params.user_id });
    res.status(201).json({
      rule,
    });
  } catch (error) {
    return next(error);
  }
};

exports.listRule = async (req, res, next) => {
  try {
    let rules = await Rule.find();
    res.status(201).json({
      rules,
    });
  } catch (error) {
    return next(error);
  }
};
