export interface ILoginForm {
  username: string;
  password: string;
}

export interface IRegisterForm {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export interface ICredentialsForm {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export interface INewPostForm {
  content: string;
  attachment?: File;
  private: boolean;
}
