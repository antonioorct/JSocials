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
}

export const seedPosts: IPost[] = [
  {
    id: 1,
    content: "First post",
    attachment: "/logo512.png",
    user: {
      id: 1,
      firstName: "Antonio",
      lastName: "Orct",
      username: "antet",
      email: "antonio.orct@hotmail.com",
      image: "/favicon.ico",
    },
    comments: [
      {
        id: 1,
        content: "First post",
        likes: 3,
        user: {
          id: 1,
          firstName: "Antonio",
          lastName: "Orct",
          username: "antet",
          email: "antonio.orct@hotmail.com",
          image: "/favicon.ico",
        },
      },
      {
        id: 1,
        content: "First post",
        likes: 3,
        user: {
          id: 1,
          firstName: "Antonio",
          lastName: "Orct",
          username: "antet",
          email: "antonio.orct@hotmail.com",
          image: "/favicon.ico",
        },
      },
    ],
    likes: 9,
  },
  {
    id: 2,
    content: "Second post",
    user: {
      id: 2,
      firstName: "Ivan",
      lastName: "Horvat",
      username: "ifko",
      email: "ivan.horvat@hotmail.com",
      image: "/favicon.ico",
    },
    comments: [],
    likes: 9,
  },
];
