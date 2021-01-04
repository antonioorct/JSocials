import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import http from "../services/httpService";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Info from "./shared/info";
import Table from "react-bootstrap/Table";
import { UserContext } from "../contexts/UserContext";

export default function Profile() {
  const user = useContext(UserContext)[0];
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    getProfile(window.location.pathname);
  }, []);

  const getProfile = async (username) => {
    const res = await http.get("http://localhost:3001/api/users" + username);

    if (res.status === 404) setUserProfile({ id: 0 });
    else setUserProfile(res.data);
  };

  return (
    <div className="offset-2 col-8 mt-5">
      {!userProfile ? (
        <div />
      ) : userProfile.id === 0 ? (
        <Redirect to="/notfound" />
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-3 text-center">
              <Image src={userProfile.imagePath} fluid rounded />
              {user.username === userProfile.username && (
                <Button>Edit profile</Button>
              )}
            </div>
            <div className="col-9">
              <h2>{`${userProfile.firstName} ${userProfile.lastName}`}</h2>

              <Tabs className="mb-1" defaultActiveKey="about">
                <Tab eventKey="about" title="About">
                  <p className="border border-dark rounded p-2">
                    {userProfile.bio}
                  </p>
                  <Table borderless style={{ tableLayout: "fixed" }}>
                    <tr>
                      <Info upper="Gender" lower="Male" />
                      <Info upper="Location" lower="Zagreb, Croatia" />
                      <Info upper="Website" lower="website.com" />
                    </tr>
                    <tr>
                      <Info upper="Relationship status" lower="Single" />
                    </tr>
                  </Table>
                </Tab>

                <Tab eventKey="photos" title="Photos">
                  <Table borderless>
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
                  </Table>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
