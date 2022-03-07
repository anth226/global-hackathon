const News = require("../models/news");

exports.createNews = (req, res, next) => {
  const news = new News({
    project: req.body.projectId,
    location: req.body.locationId,
    title: req.body.title,
    content: req.body.content,
  });

  news.save((err, cm) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ news: cm });
  });
};

exports.updateNews = (req, res, next) => {
  News.findOneAndUpdate(
    { _id: req.body._id },
    { content: req.body.content, title: req.body.title },
    { new: true },
    (err, cm) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({ news: cm });
    }
  );
};

exports.listNews = (req, res, next) => {
  News.find()
    .populate("project")
    .populate("location")
    .then((news) => res.status(200).send(news))
    .catch((err) => res.status(500).send(err));
};

exports.getNewsById = (req, res, next) => {
  News.findById(re.params.id)
    .populate("project")
    .populate("location")
    .then((news) => res.status(200).send(news))
    .catch((err) => res.status(500).send(err));
};

exports.getProjectNews = (req, res, next) => {
  News.find({ project: req.params.projectId })
    .populate("project")
    .populate("location")
    .then((news) => res.status(200).send(news))
    .catch((err) => res.status(500).send(err));
};

exports.getNewsByLocation = (req, res, next) => {
  console.log(req.params);
  News.find({ location: req.params.locationId })
    .populate("project")
    .populate("location")
    .then((news) => res.status(200).send(news))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
};

exports.deleteNews = (req, res, next) => {
  News.deleteOne({ _id: req.params.id }).exec((err, cm) => {
    if (err) {
      return next(err);
    }
    res.status(201).json({ news: cm });
  });
};
