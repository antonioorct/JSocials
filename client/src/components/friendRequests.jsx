import { UserContext } from "../contexts/UserContext";
import React, { useState, useEffect, useContext } from "react";
import http from "../services/httpService";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

export default function FriendRequest() {
  const user = useContext(UserContext)[0];
  const [friendRequests, setFriendRequests] = useState({
    incoming: [],
    outgoing: [],
  });

  useEffect(() => {
    getFriends(user.id);
  }, []);

  const getFriends = async (userId) => {
    const { data } = await http.get(
      "http://localhost:3001/api/users/friends/" +
        userId +
        "/pending?include=all"
    );

    setFriendRequests(data);
  };

  const replyToRequest = async (friendId, accept) => {
    await http.post(
      "http://localhost:3001/api/users/friends?accept=" + accept,
      { user1Id: user.id, user2Id: friendId }
    );

    let tempFriendRequests = { ...friendRequests };
    tempFriendRequests.incoming = tempFriendRequests.incoming.filter(
      (friend) => friend.id !== friendId
    );
    setFriendRequests(tempFriendRequests);
  };

  return (
    <div>
      <h2>Incoming friend requests</h2>
      {friendRequests &&
        friendRequests.incoming.map((friend, index) => (
          <div className="border border-dark rounded p-2 my-2" key={index}>
            <h5 className="ml-2">
              {friend.firstName} {friend.lastName}
            </h5>
            <Button
              variant="success"
              onClick={() => replyToRequest(friend.id, true)}
            >
              Accept
            </Button>
            <Button
              variant="danger"
              onClick={() => replyToRequest(friend.id, false)}
            >
              Reject
            </Button>
          </div>
        ))}

      <h2>Outgoing friend requests</h2>
      {friendRequests &&
        friendRequests.outgoing.map((friend, index) => (
          <div className="border border-dark rounded p-2 my-2" key={index}>
            <h5 className="ml-2">
              {friend.firstName} {friend.lastName}
            </h5>
            <ButtonGroup>
              <Button disabled>Friend Request Pending</Button>
              <Button
                onClick={async () => {
                  await http.delete(
                    `http://localhost:3001/api/users/friends?userIncomingId=${friend.id}&userOutgoingId=${user.id}`
                  );

                  let tempFriendRequests = { ...friendRequests };
                  tempFriendRequests.outgoing = tempFriendRequests.outgoing.filter(
                    (friendRequest) => friendRequest.id !== friend.id
                  );

                  setFriendRequests(tempFriendRequests);
                }}
                variant="danger"
              >
                x
              </Button>
            </ButtonGroup>
          </div>
        ))}
    </div>
  );
}
