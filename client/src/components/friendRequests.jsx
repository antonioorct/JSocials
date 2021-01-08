import { UserContext } from "../contexts/UserContext";
import React, { useState, useEffect, useContext } from "react";
import http from "../services/httpService";
import Button from "react-bootstrap/Button";

export default function FriendRequest() {
  const user = useContext(UserContext)[0];
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    getFriends(user.id);
  }, []);

  const getFriends = async (userId) => {
    const { data: friends } = await http.get(
      "http://localhost:3001/api/users/friends/" + userId + "/pending"
    );

    setFriendRequests(friends);
  };

  const replyToRequest = async (friendId, accept) => {
    await http.post(
      "http://localhost:3001/api/users/friends?accept=" + accept,
      { user1Id: user.id, user2Id: friendId }
    );

    let tempFriendRequests = [...friendRequests];
    tempFriendRequests = tempFriendRequests.filter(
      (friend) => friend.user.id !== friendId
    );
    setFriendRequests(tempFriendRequests);
  };

  return (
    <div>
      {friendRequests &&
        friendRequests.map((friend, index) => (
          <div className="border border-dark rounded p-2 my-2" key={index}>
            <h5 className="ml-2">
              {friend.user.firstName} {friend.user.lastName}
            </h5>
            <Button
              variant="success"
              onClick={() => replyToRequest(friend.user.id, true)}
            >
              Accept
            </Button>
            <Button
              variant="danger"
              onClick={() => replyToRequest(friend.user.id, false)}
            >
              Reject
            </Button>
          </div>
        ))}
    </div>
  );
}
