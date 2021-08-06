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
  content: string;
  user: IUser;
  sentAt?: Date;
}

export const seedUsers: IUser[] = [
  {
    id: 1,
    firstName: "Antonio",
    lastName: "Orct",
    username: "antet",
    email: "antonio.orct@hotmail.com",
    image: "",
    bio: "This is all about me",
    details: {
      gender: "Male",
      relationshipStatus: "Single",
      website: "www.website.com",
    },
  },
  {
    id: 2,
    firstName: "Ivan",
    lastName: "Horvat",
    username: "ifko",
    email: "ivan.horvat@hotmail.com",
    image: "/favicon.ico",
    details: {},
  },
];

export const seedMessages = [
  { id: 1, content: "First", user: seedUsers[0] },
  { id: 2, content: "Second", user: seedUsers[1] },
  { id: 3, content: "Third", user: seedUsers[0] },
  {
    id: 4,
    content:
      "This is a really long message to test how it will flex and maybe go to other row",
    user: seedUsers[0],
  },
  { id: 5, content: "Third", user: seedUsers[0] },
  { id: 6, content: "Third", user: seedUsers[0] },
  { id: 7, content: "Third", user: seedUsers[0] },
  { id: 8, content: "Third", user: seedUsers[0] },
  { id: 9, content: "Third", user: seedUsers[0] },
  { id: 10, content: "Third", user: seedUsers[0] },
  { id: 11, content: "Third", user: seedUsers[0] },
  { id: 12, content: "Third", user: seedUsers[0] },
  { id: 13, content: "Third", user: seedUsers[0] },
  { id: 14, content: "Third", user: seedUsers[0] },
  { id: 15, content: "Third", user: seedUsers[0] },
  { id: 16, content: "Third", user: seedUsers[0] },
];
