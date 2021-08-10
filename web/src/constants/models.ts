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
}

export interface IUserDetails {
  bio?: string;
  relationshipStatus?: string;
  gender?: string;
  location?: string;
  website?: string;
  phone?: string;
}

export interface IUserProfile extends IUser {
  userDetails: IUserDetails;
  friends: IUser[];
  posts: IPost[];
}

export interface IMessage {
  id: number;
  chatId: number;
  content: string;
  user: IUser;
  createdAt: string;
}

export interface IUserMessage extends IUser {
  message: { content: string; createdAt: string };
}

export interface IChat {
  id: number;
  name?: string;
  users: IUser[];
  recepient: IUser;
  messages: IMessage[];
}

export interface IFriendRequests {
  incoming: IUser[];
  outgoing: IUser[];
}

export interface IUserJWT {
  sub: number;
}
