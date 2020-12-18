const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send("Access denied. No JWT token provided.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Access denied. Invalid token.");
  }
}

module.exports = authenticate;
