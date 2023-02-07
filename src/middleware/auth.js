const jwt = require("jsonwebtoken");
const StatusCodes = require("http-status");
const Admin = require("../models/admin");
const Student = require("../models/student");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("JWT ", "");
    const decoded = jwt.verify(token, "My Secret");
    const user = await Admin.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(StatusCodes.UNAUTHORIZED).send({ error: "Please authorize!" });
  }
};

const studentAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("JWT ", "");
    const decoded = jwt.verify(token, "My Secret");
    const user = await Student.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(StatusCodes.UNAUTHORIZED).send({ error: "Please authorize!" });
  }
};

module.exports = {
  adminAuth,
  studentAuth
};
