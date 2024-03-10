const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config/index.js");

function authMiddleware(req, res, next) {
  const getHeader = req.headers.authorization;
  // console.log(getHeader);
  if (!getHeader || !getHeader.startsWith("Bearer ")) {
    return res.status(403).json({});
  }

  const token = getHeader.split(" ")[1];
  console.log(JWT_SECRET);
  // console.log(token);
  if (token) {
    const tt = jwt.verify(token, JWT_SECRET);

    console.log(tt);

    req.userId = tt.userId;
    next();
  } else {
    return res.status(403).json({
      message: "Invalid Credentials",
    });
  }
}

module.exports = authMiddleware;
