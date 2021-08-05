export interface ILoginForm {
  username: string;
  password: string;
}

export interface IRegisterForm {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  repeatPassword: string;
}

export interface INewPostForm {
  content: string;
  attachment: string;
  private: boolean;
}
