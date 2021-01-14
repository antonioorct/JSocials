import React, { useRef, useEffect } from "react";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import { toCamelCase } from "../../util/stringUtil";

export default function Info({ upper, lower, editing, handleChange }) {
  return (
    <td>
      <div className="d-inline-block mr-2">
        {upper}
        <hr
          style={{
            margin: 0,
            borderColor: "darkgray",
          }}
        />
      </div>
      {editing ? (
        <FormControl
          onChange={handleChange}
          name={toCamelCase(upper)}
          value={lower}
        ></FormControl>
      ) : (
        <p className="ml-2 mt-1">{lower}</p>
      )}
    </td>
  );
}
