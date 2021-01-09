import React, { useState, useEffect, useContext, useRef } from "react";
import { Redirect, useParams } from "react-router-dom";
import http from "../services/httpService";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import { UserContext } from "../contexts/UserContext";
import Info from "./shared/info";

export default function Profile() {
  const user = useContext(UserContext)[0];
  const [userProfile, setUserProfile] = useState(null);
  const { username } = useParams();
  const [editing, setEditing] = useState(false);
  const [friendStatus, setFriendStatus] = useState(false);
  let loaded = useRef(false);
  const [info, setInfo] = useState({
    Bio: "djkajdkasjdsk",
    Gender: "Male",
    Location: "Zagreb, Croatia",
    Website: "website.com",
    "Relationship status": "Single",
  });

  const replyToRequest = async (friendId, accept) => {
    await http.post(
      "http://localhost:3001/api/users/friends?accept=" + accept,
      { user1Id: user.id, user2Id: friendId }
    );

    setFriendStatus(accept ? "friends" : "not friends");
  };

  useEffect(() => {
    getProfile(username);
  }, [username]);

  useEffect(() => {
    checkFriend();
  }, [userProfile]);

  const changeEditing = async (updateUser) => {
    setEditing(false);

    if (updateUser) {
      const { data } = await http.post(
        "http://localhost:3001/api/users/" + user.id,
        info
      );

      setUserProfile(data);
      setInfo({
        Bio: data.bio,
        Gender: data.gender,
        Location: data.location,
        Website: data.website,
        "Relationship status": data.relationshipStatus,
      });
    } else {
      setInfo({
        Bio: "djkajdkasjdsk",
        Gender: "Male",
        Location: "Zagreb, Croatia",
        Website: "website.com",
        "Relationship status": "Single",
      });
    }
  };

  const checkFriend = async () => {
    if (!userProfile) return;
    const { data } = await http.get(
      `http://localhost:3001/api/users/friends/${user.id}/status?user2Id=${userProfile.id}`
    );

    setFriendStatus(data.status);
  };

  const getProfile = async (username) => {
    loaded.current = true;
    try {
      const res = await http.get(
        "http://localhost:3001/api/users" + "?username=" + username
      );
      setUserProfile(res.data);
    } catch (e) {
      setUserProfile({ id: 0 });
    }
  };

  const handleChange = (e) =>
    setInfo({ ...info, [e.target.id]: e.target.value });

  const renderFriendButton = (friendStatus) => {
    switch (friendStatus) {
      case "not friends":
        return (
          <Button
            onClick={async () => {
              await http.post("http://localhost:3001/api/users/friends", {
                userOutgoingId: user.id,
                userIncomingId: userProfile.id,
              });

              setFriendStatus("pending to");
            }}
          >
            Add friend
          </Button>
        );
      case "friends":
        return (
          <Button
            onClick={async () => {
              await http.delete(
                `http://localhost:3001/api/users/friends?userIncomingId=${user.id}&userOutgoingId=${userProfile.id}`
              );

              setFriendStatus("not friends");
            }}
          >
            Remove friend
          </Button>
        );
      case "pending to":
        return (
          <ButtonGroup>
            <Button disabled>Friend Request Pending</Button>
            <Button
              onClick={async () => {
                await http.delete(
                  `http://localhost:3001/api/users/friends?userOutgoingId=${user.id}&userIncomingId=${userProfile.id}`
                );

                setFriendStatus("not friends");
              }}
              variant="danger"
            >
              x
            </Button>
          </ButtonGroup>
        );
      case "pending from":
        return (
          <div>
            <Button
              variant="success"
              onClick={() => replyToRequest(userProfile.id, true)}
            >
              Accept
            </Button>
            <Button
              variant="danger"
              onClick={() => replyToRequest(userProfile.id, false)}
            >
              Reject
            </Button>
          </div>
        );
      default:
        return <div />;
    }
  };

  return (
    <div className="offset-2 col-8 mt-5">
      {loaded.current &&
        (userProfile.id === 0 ? (
          <Redirect to="/notfound" />
        ) : (
          <div className="container-fluid">
            <div className="row">
              <div className="col-3 text-center">
                <Image src={userProfile.imagePath} fluid rounded />
                {user.username === userProfile.username ? (
                  !editing ? (
                    <Button
                      onClick={() => setEditing((prevEditing) => !prevEditing)}
                    >
                      Edit profile
                    </Button>
                  ) : (
                    <div>
                      <Button onClick={() => changeEditing(true)}>
                        Submit
                      </Button>
                      <Button onClick={() => changeEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  )
                ) : (
                  <div>
                    <Button>Send message</Button>
                    {renderFriendButton(friendStatus)}
                  </div>
                )}
              </div>

              <div className="col-9">
                <h2>{`${userProfile.firstName} ${userProfile.lastName}`}</h2>

                <Tabs className="mb-1" defaultActiveKey="about">
                  <Tab eventKey="about" title="About">
                    {editing ? (
                      <FormControl
                        value={info["Bio"]}
                        id="Bio"
                        onChange={handleChange}
                      ></FormControl>
                    ) : (
                      <p className="border border-dark rounded p-2">
                        {info["Bio"]}
                      </p>
                    )}

                    <Table borderless style={{ tableLayout: "fixed" }}>
                      <tbody>
                        <tr>
                          <Info
                            upper="Gender"
                            lower={info["Gender"]}
                            handleChange={handleChange}
                            editing={editing}
                          />
                          <Info
                            upper="Location"
                            lower={info["Location"]}
                            handleChange={handleChange}
                            editing={editing}
                          />
                          <Info
                            upper="Website"
                            lower={info["Website"]}
                            handleChange={handleChange}
                            editing={editing}
                          />
                        </tr>
                        <tr>
                          <Info
                            upper="Relationship status"
                            lower={info["Relationship status"]}
                            handleChange={handleChange}
                            editing={editing}
                          />
                        </tr>
                      </tbody>
                    </Table>
                  </Tab>

                  <Tab eventKey="photos" title="Photos">
                    <Table borderless>
                      <tbody>
                        <tr>
                          <td>
                            <Image src="img/profile_photo.png" fluid />
                          </td>
                          <td>
                            <Image src="img/profile_photo.png" fluid />
                          </td>
                          <td>
                            <Image src="img/profile_photo.png" fluid />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <Image src="img/profile_photo.png" fluid />
                          </td>
                          <td>
                            <Image src="img/profile_photo.png" fluid />
                          </td>
                          <td>
                            <Image src="img/profile_photo.png" fluid />
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
