import { ICredentialsForm, IRegisterForm } from "./formTypes";
import localization from "./Localization";

const validation = {
  firstName: (firstName: string): string | undefined => {
    return firstName === "" ? localization.firstNameRequired : undefined;
  },
  lastName: (lastName: string): string | undefined => {
    return lastName === "" ? localization.lastNameRequired : undefined;
  },
  email: (email: string): string | undefined => {
    return email === ""
      ? localization.emailRequired
      : !email.includes("@")
      ? localization.emailValid
      : undefined;
  },
  username: (username: string): string | undefined => {
    return username === "" ? localization.usernameRequired : undefined;
  },
  password: (password: string): string | undefined => {
    return password === "" ? localization.passwordRequired : undefined;
  },
  repeatPassword: (
    repeatPassword: string,
    state: IRegisterForm | ICredentialsForm
  ): string | undefined => {
    return repeatPassword === ""
      ? localization.confirmPasswordRequired
      : state.password !== repeatPassword
      ? localization.confirmPasswordValid
      : undefined;
  },
};

export default validation;
