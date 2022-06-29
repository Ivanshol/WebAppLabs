const jwt = require("jsonwebtoken");
const { secretAccessKey } = require("../config");

module.exports = function(req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers?.authorization?.split(" ")?.[1];

    if (!token) {
      return res.status(403).json({ message: "User not authorized" });
    }

    req.user = jwt.verify(token, secretAccessKey);
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: "User not authorized" });
  }
};
