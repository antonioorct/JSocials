import http from "./httpService";

const apiEndPoint = "http://localhost:3001/api/posts";

async function getAllPosts() {
  const { data } = await http.get(apiEndPoint);

  return data;
}

async function getPostsFromUserId(userId) {
  const { data } = await http.get(apiEndPoint + `?userId=${userId}`);

  return data;
}

async function addPost(post) {
  const { data: newPost } = await http.post(apiEndPoint, post);

  return newPost;
}

async function addCommentToPost(comment) {
  const { data: newComment } = await http.post(
    apiEndPoint + `/${comment.postId}`,
    comment
  );

  return newComment;
}

async function likePost(postId, userId) {
  const newLike = await http.post(apiEndPoint + `/${postId}/${userId}`);

  return newLike;
}

async function unlikePost(postId, userId) {
  const newLike = await http.delete(apiEndPoint + `/${postId}/${userId}`);

  return newLike;
}

export {
  getAllPosts,
  getPostsFromUserId,
  addPost,
  addCommentToPost,
  likePost,
  unlikePost,
};
