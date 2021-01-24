import { UserContext } from "../contexts/UserContext";
import React, { useState, useEffect, useContext } from "react";
import { getFriends } from "../services/friendsService";

export default function Friends() {
  const user = useContext(UserContext)[0];
  const [friends, setFriends] = useState([]);

  useEffect(async () => {
    const friends = await getFriends(user);

    setFriends(friends);
  }, []);

  return (
    <div>
      {friends.map((friend, index) => (
        <div className="border border-dark rounded p-2 my-2" key={index}>
          <h5 className="ml-2">
            {friend.user.firstName} {friend.user.lastName}
          </h5>
        </div>
      ))}
    </div>
  );
}
