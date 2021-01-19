import React, { useState, useEffect, useContext, useRef } from "react";
import { Redirect, useParams } from "react-router-dom";
import http from "../services/httpService";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FormControl from "react-bootstrap/FormControl";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { UserContext } from "../contexts/UserContext";
import Info from "./shared/info";
import { toSentenceCase } from "../util/stringUtil";
import Post from "./post";
import { getImages } from "../services/postService";
import { useHistory } from "react-router-dom";

export default function Profile() {
  const user = useContext(UserContext)[0];
  const [userProfile, setUserProfile] = useState({});
  const { username } = useParams();

  const [editing, setEditing] = useState(false);
  const [friendStatus, setFriendStatus] = useState(false);
  const [info, setInfo] = useState({});

  const [selectedPost, setSelectedPost] = useState(null);
  const [images, setImages] = useState([]);

  const history = useHistory();

  useEffect(() => {
    getProfile(username);
  }, [username]);

  useEffect(() => {
    checkFriend();
    setInfo({
      bio: userProfile.bio,
      gender: userProfile.gender,
      location: userProfile.location,
      phone: userProfile.phone,
      relationshipStatus: userProfile.relationshipStatus,
      website: userProfile.website,
    });
  }, [userProfile]);

  const getProfile = async (username) => {
    try {
      const res = await http.get(
        "http://localhost:3001/api/users" + "?username=" + username
      );
      setUserProfile(res.data);
    } catch (e) {
      setUserProfile({ id: 0 });
    }
  };

  const checkFriend = async () => {
    if (!userProfile) return;
    const { data } = await http.get(
      `http://localhost:3001/api/users/friends/${user.id}/status?user2Id=${userProfile.id}`
    );

    setFriendStatus(data.status);
  };

  const replyToRequest = async (friendId, accept) => {
    await http.post(
      "http://localhost:3001/api/users/friends?accept=" + accept,
      { user1Id: user.id, user2Id: friendId }
    );

    setFriendStatus(accept ? "friends" : "not friends");
  };

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

  const renderImages = () => {
    let returnArray = [],
      tempArray = [];

    images.forEach((img, index) => {
      tempArray.push(
        <Image
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedPost(images[index])}
          className="col-4"
          src={"img/" + img.imagePath}
          key={index}
        />
      );

      if ((index + 1) % 3 === 0) {
        returnArray.push(<div className="row">{tempArray}</div>);

        tempArray = [];
      }
    });
    if (tempArray.length !== 0)
      returnArray.push(<div className="row">{tempArray}</div>);

    return returnArray;
  };

  const handleChange = (e) =>
    setInfo({ ...info, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    setEditing(false);
    e.preventDefault();
    const { data } = await http.put(
      "http://localhost:3001/api/users/" + user.id,
      info
    );

    setUserProfile(data);
  };

  return (
    <div>
      <Post post={selectedPost} setPost={setSelectedPost} />

      <div className="offset-2 col-8 mt-5">
        {userProfile.id === 0 ? (
          <Redirect to="/notfound" />
        ) : (
          <div className="container-fluid">
            <div className="row">
              <div className="col-3 text-center">
                <Image
                  style={{ cursor: "pointer" }}
                  onClick={() => {}}
                  src={userProfile.imagePath}
                  fluid
                  rounded
                />
                {user.username === userProfile.username ? (
                  !editing ? (
                    <Button
                      onClick={() => setEditing((prevEditing) => !prevEditing)}
                    >
                      Edit profile
                    </Button>
                  ) : (
                    <div>
                      <Button type="submit" form="infoForm">
                        Submit
                      </Button>
                      <Button
                        type="reset"
                        form="infoForm"
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )
                ) : (
                  <div>
                    <Button
                      onClick={() =>
                        history.replace("/messenger", {
                          newChatUser: userProfile,
                        })
                      }
                    >
                      Send message
                    </Button>
                    {renderFriendButton(friendStatus)}
                  </div>
                )}
              </div>

              <div className="col-9">
                <h2>{`${userProfile.firstName} ${userProfile.lastName}`}</h2>

                <Tabs
                  className="mb-1"
                  defaultActiveKey="about"
                  onSelect={async (key) => {
                    if (key !== "photos" || images.length !== 0) return;
                    console.log("loading images");
                    const newImages = await getImages(userProfile);

                    setImages(newImages);
                  }}
                >
                  <Tab eventKey="about" title="About">
                    {editing ? (
                      <FormControl
                        value={info["bio"]}
                        name="bio"
                        onChange={handleChange}
                      ></FormControl>
                    ) : (
                      <p className="border border-dark rounded p-2">
                        {info["bio"]}
                      </p>
                    )}

                    <Form id="infoForm" onSubmit={(e) => handleSubmit(e)}>
                      <Table borderless style={{ tableLayout: "fixed" }}>
                        <tbody>
                          <tr>
                            {Object.keys(info)
                              .slice(1, 4)
                              .map((prop) => (
                                <Info
                                  upper={toSentenceCase(prop)}
                                  lower={info[prop]}
                                  name={prop}
                                  handleChange={handleChange}
                                  editing={editing}
                                />
                              ))}
                          </tr>
                          <tr>
                            {Object.keys(info)
                              .slice(4, 7)
                              .map((prop) => (
                                <Info
                                  upper={toSentenceCase(prop)}
                                  lower={info[prop]}
                                  name={prop}
                                  handleChange={handleChange}
                                  editing={editing}
                                />
                              ))}
                          </tr>
                        </tbody>
                      </Table>
                    </Form>
                  </Tab>

                  <Tab eventKey="photos" title="Photos">
                    {renderImages()}
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
