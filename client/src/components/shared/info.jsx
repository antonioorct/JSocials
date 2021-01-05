import React, { useRef, useEffect } from "react";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";

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
        <Form>
          <FormControl
            onChange={handleChange}
            id={upper}
            value={lower}
          ></FormControl>
        </Form>
      ) : (
        <p className="ml-2 mt-1">{lower}</p>
      )}
    </td>
  );
}
