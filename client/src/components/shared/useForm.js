import { useState, useEffect } from "react";

export default function useForm(submitCallback, validation = {}) {
  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({ temp: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(checkValidation());
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0) submitCallback(errors);
  }, [errors]);

  const handleChange = ({ target }) => {
    setFields({ ...fields, [target.name]: target.value });
  };

  const checkValidation = () => {
    let tempErrors = {};

    Object.keys(validation).forEach((fieldName) => {
      Object.keys(validation[fieldName]).forEach((validationName) => {
        if (validationName === "required")
          if (!fields[fieldName] || fields[fieldName].length === 0)
            tempErrors = addError(tempErrors, fieldName, "Required");

        if (validationName === "minLength") {
          if (
            !fields[fieldName] ||
            fields[fieldName].length < validation[fieldName].minLength
          )
            tempErrors = addError(
              tempErrors,
              fieldName,
              "Minimum length should be " + validation[fieldName].minLength
            );
        }

        if (validationName === "type") {
          if (validation[fieldName]["type"] === "mail") {
            if (!fields[fieldName] || !fields[fieldName].includes("@"))
              tempErrors = addError(
                tempErrors,
                fieldName,
                "Must be valid email"
              );
          }
        }
      });
    });

    return tempErrors;
  };

  const addError = (errors, prop, str) => {
    if (errors[prop]) str = errors[prop] + String.fromCharCode(10) + str;
    return (errors = { ...errors, [prop]: str });
  };

  return [fields, errors, handleChange, handleSubmit];
}
