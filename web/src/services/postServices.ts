import axios from "axios";
import { LIKE_POST_URL, POSTS_URL, POST_URL } from "../constants/apiRoutes";
import { IPost } from "../constants/models";

export const getAllPosts = async (): Promise<IPost[]> => {
  const { data } = await axios.get(POSTS_URL);

  return data;
};

export const newPost = async (form: FormData): Promise<IPost> => {
  const { data } = await axios.post(POSTS_URL, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const newComment = async (
  post: IPost,
  content: string
): Promise<IPost> => {
  const { data } = await axios.post(POST_URL(post.id), { content });

  return data;
};

export const deletePost = async (post: IPost): Promise<void> => {
  await axios.delete(POST_URL(post.id));
};

export const isComment = (post: IPost): boolean => post.postId !== null;

export const likePost = async (post: IPost): Promise<void> =>
  await axios.post(LIKE_POST_URL(post.id));
