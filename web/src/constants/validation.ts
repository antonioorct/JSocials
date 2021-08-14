import { ICredentialsForm, IRegisterForm } from "./formTypes";

const validation = {
  firstName: (firstName: string): string | undefined => {
    return firstName === "" ? "First name is required" : undefined;
  },
  lastName: (lastName: string): string | undefined => {
    return lastName === "" ? "Last name is required" : undefined;
  },
  email: (email: string): string | undefined => {
    return email === ""
      ? "E-mail is required"
      : !email.includes("@")
      ? "E-mail must be valid"
      : undefined;
  },
  username: (username: string): string | undefined => {
    return username === "" ? "Username is required" : undefined;
  },
  password: (password: string): string | undefined => {
    return password === "" ? "Password is required" : undefined;
  },
  repeatPassword: (
    repeatPassword: string,
    state: IRegisterForm | ICredentialsForm
  ): string | undefined => {
    return repeatPassword === ""
      ? "Confirm password is required"
      : state.password !== repeatPassword
      ? "Passwords must match"
      : undefined;
  },
};

export default validation;
