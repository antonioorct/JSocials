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

export const likePost = async (post: IPost): Promise<IPost> => {
  const { data } = await axios.post(LIKE_POST_URL(post.id));

  return data;
};

export const unlikePost = async (post: IPost): Promise<IPost> => {
  const { data } = await axios.delete(LIKE_POST_URL(post.id));

  return data;
};

export const addComment = ([...posts]: IPost[], comment: IPost) => {
  const postIndex = posts.findIndex((post) => post.id === comment.postId);

  posts[postIndex].comments = [comment, ...posts[postIndex].comments];

  return posts;
};

export const updateComment = ([...posts]: IPost[], comment: IPost) => {
  const postIndex = posts.findIndex((post) => post.id === comment.postId);

  const commentIndex = posts[postIndex].comments.findIndex(
    (postComment) => postComment.id === comment.id
  );

  posts[postIndex].comments[commentIndex] = comment;

  return posts;
};

export const removeComment = ([...posts]: IPost[], removeComment: IPost) => {
  const postIndex = posts.findIndex((post) => post.id === removeComment.postId);

  posts[postIndex].comments = posts[postIndex].comments.filter(
    (comment) => comment.id !== removeComment.id
  );

  return posts;
};

export const removePost = ([...posts]: IPost[], removePost: IPost) =>
  posts.filter((post) => post.id !== removePost.id);

export const updatePost = ([...posts]: IPost[], newPost: IPost) => {
  const postIndex = posts.findIndex((post) => post.id === newPost.id);

  posts[postIndex] = newPost;

  return posts;
};
