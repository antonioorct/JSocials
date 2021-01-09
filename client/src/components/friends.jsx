import { UserContext } from "../contexts/UserContext";
import React, { useState, useEffect, useContext } from "react";
import http from "../services/httpService";

export default function Friends() {
  const user = useContext(UserContext)[0];
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    getFriends(user.id);
  }, []);

  const getFriends = async (userId) => {
    const { data: friends } = await http.get(
      "http://localhost:3001/api/users/friends/" + userId
    );

    setFriends(friends);
  };

  return (
    <div>
      {friends &&
        friends.map((friend, index) => (
          <div className="border border-dark rounded p-2 my-2" key={index}>
            <h5 className="ml-2">
              {friend.user.firstName} {friend.user.lastName}
            </h5>
          </div>
        ))}
    </div>
  );
}
