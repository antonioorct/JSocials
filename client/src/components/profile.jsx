import React, { useState, useEffect, useContext } from "react";
import { Redirect, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FormControl from "react-bootstrap/FormControl";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

import { UserContext } from "../contexts/UserContext";
import { getUser, editUserData } from "../services/userService";
import {
  getFriendStatus,
  removeFriendship,
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
} from "../services/friendsService";
import { toSentenceCase } from "../util/stringUtil";

import Info from "./shared/info";
import ImageTable from "./shared/imageTable";
import Post from "./post";
import Main from "./main";
import Friends from "./friends";

export default function Profile() {
  const user = useContext(UserContext)[0];
  const [userProfile, setUserProfile] = useState({});
  const params = useParams();

  const [editing, setEditing] = useState(false);
  const [friendStatus, setFriendStatus] = useState(false);
  const [info, setInfo] = useState({});

  const [selectedPost, setSelectedPost] = useState(null);
  const [loadedTabs, setLoadedTabs] = useState({
    posts: false,
    friends: false,
    photos: false,
  });

  const history = useHistory();

  useEffect(() => {
    if (userProfile.username && params.username !== userProfile.username)
      return history.go(0);

    fetchAndSetProfile(params.username);
  }, [params]);

  useEffect(() => {
    if (user.id !== userProfile.id) checkFriend();

    setInfo({
      bio: userProfile.bio,
      gender: userProfile.gender,
      location: userProfile.location,
      phone: userProfile.phone,
      relationshipStatus: userProfile.relationshipStatus,
      website: userProfile.website,
    });
  }, [userProfile]);

  const fetchAndSetProfile = async (username) => {
    try {
      const user = await getUser(username);

      setUserProfile(user);
    } catch (e) {
      setUserProfile({ id: 0 });
    }
  };

  const checkFriend = async () => {
    if (!userProfile.id) return;
    const status = await getFriendStatus(user.id, userProfile.id);

    setFriendStatus(status);
  };

  const renderFriendButton = (friendStatus) => {
    switch (friendStatus.status) {
      case "friends":
        return (
          <Button
            onClick={() => {
              removeFriendship(user.id, userProfile.id);

              setFriendStatus({ status: "not friends" });
            }}
          >
            Remove friend
          </Button>
        );
      case "not friends":
        return (
          <Button
            onClick={() => {
              sendFriendRequest(userProfile.id);

              setFriendStatus({ status: "pending", direction: "outgoing" });
            }}
          >
            Add friend
          </Button>
        );
      case "pending":
        if (friendStatus.direction === "incoming")
          return (
            <div>
              <Button
                variant="success"
                onClick={() => {
                  acceptFriendRequest(friendStatus.id);

                  setFriendStatus({ status: "friends" });
                }}
              >
                Accept
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  cancelFriendRequest(friendStatus.id);

                  setFriendStatus({ status: "not friends" });
                }}
              >
                Reject
              </Button>
            </div>
          );
        else
          return (
            <ButtonGroup>
              <Button disabled>Friend Request Pending</Button>
              <Button
                onClick={async () => {
                  cancelFriendRequest(friendStatus.id);

                  setFriendStatus({ status: "not friends" });
                }}
                variant="danger"
              >
                x
              </Button>
            </ButtonGroup>
          );
      default:
        return <div />;
    }
  };

  const renderImages = () => {
    return (
      <ImageTable userId={userProfile.id} setSelectedPost={setSelectedPost} />
    );
  };

  const renderFriendsTab = () => {
    return <Friends userId={userProfile.id} />;
  };

  const handleChange = (e) =>
    setInfo({ ...info, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditing(false);
    const newUserProfile = await editUserData(user.id, info);

    setUserProfile(newUserProfile);
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
                    if (key !== true)
                      setLoadedTabs({ ...loadedTabs, [key]: true });
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
                  <Tab eventKey="posts" title="Posts">
                    {loadedTabs.posts && <Main userId={userProfile.id} />}
                  </Tab>
                  <Tab eventKey="friends" title="Friends">
                    {loadedTabs.friends && renderFriendsTab()}
                  </Tab>

                  <Tab eventKey="photos" title="Photos">
                    {loadedTabs.photos && renderImages()}
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
