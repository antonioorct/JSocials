import http from "./httpService";

const apiEndPoint = process.env.REACT_APP_API_URL;

async function fetchFeed(userId) {
  const { data } = await http.get(`${apiEndPoint}/posts/feed/${userId}`);

  return data;
}

async function getPostsFromUserId(userId) {
  const { data } = await http.get(`${apiEndPoint}/users/${userId}/posts`);

  return data;
}

async function getPost(post) {
  const { data } = await http.get(`${apiEndPoint}/posts/${post.id}`);

  return data;
}

async function addPost(post) {
  const { data: newPost } = await http.post(`${apiEndPoint}/posts`, post);

  return newPost;
}

function deletePost(postId) {
  http.delete(`${apiEndPoint}/posts/${postId}`);
}

async function addCommentToPost(postId, comment) {
  const { data } = await http.post(
    `${apiEndPoint}/posts/${postId}/comments`,
    comment
  );

  return data;
}

function likePost(post, user) {
  http.post(apiEndPoint + `/posts/${post.id}/likes`);

  post.numLikes++;
  post.userPostLikes.push({
    userId: user.id,
    postId: post.id,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  return post;
}

function unlikePost(post, user) {
  http.delete(apiEndPoint + `/posts/${post.id}/likes`);

  post.numLikes--;
  post.userPostLikes = post.userPostLikes.filter(
    (like) => like.userId !== user.id
  );

  return post;
}

function replacePost(posts, newPost) {
  const tempPosts = [...posts];

  const postIndex = posts.findIndex((post) => post.id === newPost.id);
  tempPosts[postIndex] = newPost;

  return tempPosts;
}

function replaceComment(posts, newComment) {
  const tempPosts = [...posts];

  const postIndex = posts.findIndex((post) => post.id === newComment.postId);
  const commentIndex = tempPosts[postIndex].comments.findIndex(
    (comment) => comment.id === newComment.id
  );
  tempPosts[postIndex].comments[commentIndex] = newComment;

  return tempPosts;
}

async function getComments(post) {
  const { data } = await http.get(
    "http://localhost:3001/api/posts/" +
      post.id +
      "?createdAt=" +
      new Date(Date.now()).toLocaleString()
  );

  return data;
}

async function getImages(userId) {
  const { data } = await http.get(`${apiEndPoint}/users/${userId}/images`);

  return data;
}

export {
  getPostsFromUserId,
  fetchFeed,
  addPost,
  addCommentToPost,
  likePost,
  unlikePost,
  replacePost,
  replaceComment,
  deletePost,
  getComments,
  getImages,
  getPost,
};
