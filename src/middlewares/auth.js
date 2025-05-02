const jwt = require("jsonwebtoken");
const db = require("../models");
const UsersModel = db.users;

const authentication = async (req, res, next) => {
  const token = req.headers.authentication;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UsersModel.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
module.exports = authentication;
