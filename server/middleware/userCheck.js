const { models } = require("../sequelize");

async function userExists(req, res, next) {
  let userId = req.params.userId;

  try {
    if (!userId) return res.status(500).send();

    const user = await models.user.findByPk(userId);

    if (!user)
      return res.status(404).json({
        status: 404,
        title: "User not found",
        detail: "User not found",
      });

    next();
  } catch (err) {
    return res.sendStatus(500);
  }
}

module.exports = { userExists };
