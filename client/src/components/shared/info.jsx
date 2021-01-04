import React, { useRef, useEffect } from "react";

export default function Info(props) {
  const ref = useRef(<div />);

  useEffect(() => {
    console.log(ref.current.offsetWidth);
  }, [ref.current]);

  return (
    <td>
      <div className="d-inline-block mr-2" ref={ref}>
        {props.upper}
        <hr
          style={{
            margin: 0,
            borderColor: "darkgray",
          }}
        />
      </div>
      <p className="ml-2 mt-1">{props.lower}</p>
    </td>
  );
}
