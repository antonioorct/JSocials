export interface IPost {
  id: number;
  content: string;
  attachment?: string;
  user: IUser;
  postId?: number;
  comments: IPost[];
  likes: IUser[];
  numLikes: number;
  numComments: number;
  createdAt: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image?: string;

  bio?: string;
  details: IUserDetails;
}

interface IUserDetails {
  relationshipStatus?: string;
  gender?: string;
  location?: string;
  website?: string;
  phone?: string;
}

export interface IMessage {
  id: number;
  chatId: number;
  content: string;
  user: IUser;
  createdAt: string;
}

export interface IChat {
  id: number;
  name?: string;
  users: IUser[];
  recepient: IUser;
  messages: IMessage[];
}

export interface IUserJWT {
  sub: number;
}
