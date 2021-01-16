import http from "./httpService";

const apiEndPoint = "http://localhost:3001/api/posts";

async function getAllPosts() {
  const { data } = await http.get(apiEndPoint);

  return data;
}

async function getPostsFromUserId(userId) {
  const queryString = userId ? "?userId=" + userId : "";
  const { data } = await http.get(apiEndPoint + queryString);

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

function changePostLike(post, user, isLike) {
  if (isLike) {
    likePost(post.id, user.id);

    post.numLikes++;
    post.userPostLikes.push({
      userId: user.id,
      postId: post.id,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } else {
    unlikePost(post.id, user.id);

    post.numLikes--;
    post.userPostLikes = post.userPostLikes.filter(
      (like) => like.userId !== user.id
    );
  }

  return post;
}

function deletePost(post) {
  http.delete("http://localhost:3001/api/posts/" + post.id);
}

async function getComments(post) {
  console.log();
  const { data } = await http.get(
    "http://localhost:3001/api/posts/" +
      post.id +
      "?createdAt=" +
      new Date(Date.now()).toLocaleString()
  );

  return data;
}

export {
  getAllPosts,
  getPostsFromUserId,
  addPost,
  addCommentToPost,
  likePost,
  unlikePost,
  changePostLike,
  replacePost,
  replaceComment,
  deletePost,
  getComments,
};
