const jwt = require("jsonwebtoken");
const logger = require("../logger");

function authenticate(req, res, next) {
  const token = req.header("Authorization");

  if (!token)
    return res.status(401).send("Access denied. No JWT token provided.");

  try {
    const { sub } = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = sub;
    next();
  } catch (err) {
    logger.info(token);
    logger.error(err);

    return res.status(403).send("Access denied. Invalid token.");
  }
}

function authenticateSameUser(req, res, next) {
  let token = req.header("Authorization");

  if (!token)
    return res.status(401).send("Access denied. No JWT token provided.");

  token = token.split(" ")[1];

  try {
    const { sub } = jwt.verify(token, process.env.JWT_SECRET);

    if (sub != req.params.userId) return res.status(403).send("Access denied.");

    req.userId = sub;
    next();
  } catch (err) {
    logger.info(token);
    logger.error(err);

    return res.status(403).send("Access denied. Invalid token.");
  }
}

function generateToken(userId) {
  return jwt.sign(
    {
      sub: userId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = { authenticate, authenticateSameUser, generateToken };
