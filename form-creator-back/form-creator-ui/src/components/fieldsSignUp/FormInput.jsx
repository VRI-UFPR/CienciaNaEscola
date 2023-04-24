import React from "react";
import TextField from "@material-ui/core/TextField";

function FormInput(props) {
  return (
    <TextField
      required
      error={props.error}
      id="validation-input"
      onChange={props.onUpdate(props.param)}
      style={{ width: "45%" }}
      id={
        props.param === "password" || props.param === "password_confirm"
          ? "standart-password-input"
          : "standart-basic"
      }
      label={props.label}
      type={
        props.param === "password" || props.param === "password_confirm"
          ? "password"
          : "text"
      }
      autoComplete="off"
    ></TextField>
  );
}
export default FormInput;
