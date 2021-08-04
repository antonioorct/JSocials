export interface IPost {
  id: number;
  content: string;
  attachment?: string;
  user: IUser;
  comments?: IPost[];
  likes: number;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image: string;

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
    image: "/logo512.png",
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

export const seedPosts: IPost[] = [
  {
    id: 1,
    content: "First post",
    attachment: "/logo512.png",
    user: seedUsers[0],
    comments: [
      {
        id: 1,
        content: "First post",
        likes: 3,
        user: seedUsers[0],
      },
      {
        id: 1,
        content: "First post",
        likes: 3,
        user: seedUsers[0],
      },
    ],
    likes: 9,
  },
  {
    id: 2,
    content: "Second post",
    user: seedUsers[1],
    comments: [],
    likes: 9,
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
