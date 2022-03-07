const jwt = require("jsonwebtoken");
const config = require("../config/main");
const { ROLE_SUPER_ADMIN, ROLE_ADMIN } = require("../constants");

const verify = (payload) => jwt.verify(payload, config.secret);

const decodeToken = (req, res) => {
  try {
    if (!req.headers.authorization) throw new Error("Invalid access token");
    const token = req.headers.authorization.split(" ")[1];
    const user = verify(token, config.secret);
    return user;
  } catch (error) {
    return res.status(403).send({ error: error.message || error });
  }
};

const isAdmin = async (req, res, next) => {
  req.user = await decodeToken(req, res);
  if (req.user.role !== ROLE_SUPER_ADMIN && req.user.role !== ROLE_ADMIN) {
    return res
      .status(403)
      .send({ error: "You don't have access to do that action" });
  }
  return next();
};

module.exports = { isAdmin };
