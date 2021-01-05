import React from "react";
import Info from "./info";
import Table from "react-bootstrap/Table";

export default function InfoTable({ info, setInfo, editing }) {
  const handleChange = (e) =>
    setInfo({ ...info, [e.target.id]: e.target.value });

  return (
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
  );
}
