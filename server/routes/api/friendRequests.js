router.get("/friends/:userId/pending", async function (req, res) {
  const userId = req.params.userId;
  const include = req.query.include;

  let friendRequests = { incoming: [], outgoing: [] };
  switch (include) {
    case "all":
      friendRequests.outgoing = await sequelize.query(
        `
      				SELECT 
          users.id "id",
					users.first_name "firstName",
          users.last_name "lastName"
				FROM
					pending_friends
						INNER JOIN
					users ON pending_friends.user_incoming_id = users.id
				WHERE
					user_outgoing_id = ?;
      `,
        {
          type: QueryTypes.SELECT,
          replacements: [userId],
        }
      );
      friendRequests.incoming = await sequelize.query(
        `
      				SELECT 
          users.id "id",
					users.first_name "firstName",
					users.last_name "lastName"
				FROM
					pending_friends
						INNER JOIN
					users ON pending_friends.user_outgoing_id = users.id
				WHERE
					user_incoming_id = ?;
      `,
        {
          type: QueryTypes.SELECT,
          replacements: [userId],
        }
      );
      break;
    case "incoming":
      friendRequests = await models.pendingFriend.findAll({
        include: { model: models.user, foreignKey: "userIncomingId" },
        where: { userOutgoingId: userId },
      });
      break;
    case "outgoing":
      friendRequests = await models.pendingFriend.findAll({
        include: { model: models.user, foreignKey: "userOutgoingId" },
        where: { userIncomingId: userId },
      });
      break;
  }
  console.log(friendRequests);

  res.status(200).send(friendRequests);
});

router.post("/friends", async function (req, res) {
  if (req.query.accept) {
    try {
      await models.pendingFriend.destroy({
        where: {
          userIncomingId: req.body.user2Id,
          userOutgoingId: req.body.user1Id,
        },
      });
      await models.pendingFriend.destroy({
        where: {
          userIncomingId: req.body.user1Id,
          userOutgoingId: req.body.user2Id,
        },
      });

      if (req.query.accept === "false")
        return res.status(200).send("Friend request denied");

      await models.friend.create(req.body);
      const newRequest = await models.friend.create({
        user1Id: req.body.user2Id,
        user2Id: req.body.user1Id,
      });
      res.status(201).send(newRequest);
    } catch (e) {
      res.status(400).send("Error creating user:\n" + e.message);
    }
  } else {
    const newRequest = await models.pendingFriend.create(req.body);

    res.status(201).send(newRequest);
  }
});

router.get("/friends/:user1Id/status", async function (req, res) {
  const userIncomingId = req.params.user1Id;
  const userOutgoingId = req.query.user2Id;

  const isFriend = await models.friend.findOne({
    where: { user1Id: userIncomingId, user2Id: userOutgoingId },
  });

  if (isFriend) return res.status(201).send({ status: "friends" });
  else {
    const isPendingFrom = await models.pendingFriend.findOne({
      where: { userIncomingId, userOutgoingId },
    });

    if (isPendingFrom) return res.status(202).send({ status: "pending from" });
    const isPendingTo = await models.pendingFriend.findOne({
      where: { userIncomingId: userOutgoingId, userOutgoingId: userIncomingId },
    });

    if (isPendingTo) return res.status(202).send({ status: "pending to" });

    return res.status(203).send({ status: "not friends" });
  }
});
