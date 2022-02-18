const Resource = require("../models/resource");

exports.createResource = (req, res, next) => {
  const resource = new Resource(req.body);
  resource.save((err, resource) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      resource,
    });
  });
};

exports.listResource = (req, res, next) => {
  Resource.find({}).exec((err, resources) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      resources,
    });
  });
};

exports.deleteResource = (req, res, next) => {
  Resource.deleteOne({ _id: req.params.id }).exec((err, resource) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      resource,
    });
  });
};

exports.updateResource = async (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  try {
    await Resource.findByIdAndUpdate(id, req.body);
    let resource = await Resource.findById(id);
    res.status(201).json({
      resource,
    });
  } catch (err) {
    return next(err);
  }
};
