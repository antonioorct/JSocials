import React, { useState } from "react";

export default function useForm() {
  const [state, setState] = useState({});

  const handleChange = ({ target }) =>
    setState((prevState) => ({ ...prevState, [target.name]: target.value }));

  return [state, handleChange];
}
