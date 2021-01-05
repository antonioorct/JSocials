const express = require("express");
const router = express.Router();
const { models } = require("../../sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../../sequelize");
const { QueryTypes } = require("sequelize");

router.get("/", async function (req, res, next) {
  const posts = await models.post.findAll();

  console.log("returning ", posts);
  res.send(posts);
});

router.get("/:userId", async function (req, res, next) {
  const posts = await sequelize.query(
    // ` ( SELECT *
    //     FROM posts
    //     WHERE posts.user_id = ?
    //     AND Isnull(posts.post_id))
    //   UNION
    //   ( SELECT comments.*
    //     FROM   posts AS posts
    //       INNER JOIN posts AS comments
    //         ON posts.id = comments.post_id
    //     WHERE  posts.user_id = ?
    //     AND Isnull(posts.post_id));
    // `,
    `
    SELECT posts.*, comments.* FROM posts as posts 
	inner join posts as comments on posts.id = comments.post_id 
where posts.user_id = 1;
    `,
    {
      type: QueryTypes.SELECT,
      replacements: [req.params.userId, req.params.userId],
      nest: true,
      raw: true,
    }
  );

  console.log("returning ", posts);
  if (!posts) res.sendStatus(404);
  else res.send(posts);
});

/*
router.post("/", async function (req, res, next) {
  try {
    req.body["password"] = await bcrypt.hash(req.body["password"], 10);
    const newUser = await models.user.create(req.body);

    res.status(201).send(newUser);
  } catch (e) {
    res.status(400).send("Error creating user:\n" + e.message);
  }
}); */

module.exports = router;
