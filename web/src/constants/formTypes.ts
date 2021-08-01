export interface ILoginForm {
  username: string;
  password: string;
}

export interface IRegisterForm extends ILoginForm {
  firstName: string;
  lastName: string;
  email: string;
  repeatPassword: string;
}
