import { UserContext } from "../contexts/UserContext";
import React, { useState, useEffect, useContext } from "react";
import { getFriendsFromUserId } from "../services/friendsService";
import { useParams, Link } from "react-router-dom";

export default function Friends({ userId }) {
  const user = useContext(UserContext)[0];
  const [friends, setFriends] = useState([]);

  const params = useParams();

  useEffect(() => {
    fetchAndSetFriends();
  }, []);

  const fetchAndSetFriends = async () => {
    const friends = userId
      ? await getFriendsFromUserId(userId)
      : await getFriendsFromUserId(user.id);

    setFriends(friends);
  };

  return (
    <div>
      {friends.map((friend, index) => (
        <div className="border border-dark rounded p-2 my-2" key={index}>
          <Link to={"/" + friend.username}>
            <h5 className="ml-2">
              {friend.firstName} {friend.lastName}
            </h5>
          </Link>
        </div>
      ))}
    </div>
  );
}
