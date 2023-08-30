const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectUser = async (req, res, next) => {
    let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
        token = req.headers.authorization.split(" ")[1];
        const decode = jwt.decode(token,process.env.JWT_SECRET);
        req.user = await User.findById(decode.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({
          error: "UnAuthorized",
          status: false,
        });
    }
  }else {
    res.status(401).json({
            error: "UnAuthorized",
            status: false,
            });
  }
};

module.exports = protectUser;
