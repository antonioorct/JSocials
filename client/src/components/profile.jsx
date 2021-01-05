import React, { useState, useEffect, useContext, useRef } from "react";
import { Redirect, useParams } from "react-router-dom";
import http from "../services/httpService";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Info from "./shared/info";
import Table from "react-bootstrap/Table";
import { UserContext } from "../contexts/UserContext";
import InfoTable from "./shared/infoTable";

export default function Profile() {
  const user = useContext(UserContext)[0];
  const [userProfile, setUserProfile] = useState(null);
  const { username } = useParams();
  const [editing, setEditing] = useState(false);
  let loaded = useRef(false);
  const [info, setInfo] = useState({
    Gender: "Male",
    Location: "Zagreb, Croatia",
    Website: "website.com",
    "Relationship status": "Single",
  });

  useEffect(() => {
    getProfile(username);
  }, [username]);

  const getProfile = async (username) => {
    loaded.current = true;
    try {
      const res = await http.get("http://localhost:3001/api/users/" + username);
      setUserProfile(res.data);
    } catch (e) {
      setUserProfile({ id: 0 });
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
                  <Button
                    onClick={() => setEditing((prevEditing) => !prevEditing)}
                  >
                    Edit profile
                  </Button>
                ) : (
                  <Button>Send message</Button>
                )}
              </div>
              <div className="col-9">
                <h2>{`${userProfile.firstName} ${userProfile.lastName}`}</h2>

                <Tabs className="mb-1" defaultActiveKey="about">
                  <Tab eventKey="about" title="About">
                    <p className="border border-dark rounded p-2">
                      {userProfile.bio}
                    </p>
                    <InfoTable
                      info={info}
                      setInfo={setInfo}
                      editing={editing}
                    />
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
