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
