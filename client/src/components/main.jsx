import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import {
  getPostsFromUserId,
  addPost,
  addCommentToPost,
  changePostLike,
  replacePost,
  replaceComment,
  deletePost,
} from "../services/postService";
import http from "../services/httpService";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import FormFile from "react-bootstrap/esm/FormFile";
import Image from "react-bootstrap/Image";
import Post from "./post";

export default function Main() {
  const user = useContext(UserContext)[0];
  const [posts, setPosts] = useState(null);
  const [postForm, setPostForm] = useState({ body: "", file: null });
  const [replying, setReplying] = useState(-1);
  const [replyForm, setReplyForm] = useState("");

  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchAndSetPosts = async () => {
      const data = await getPostsFromUserId(user.id);

      setPosts(data);
    };

    fetchAndSetPosts();
  }, [user.id]);

  useEffect(() => {
    console.log(selectedPost);
    if (!selectedPost) return;
    const newPosts = replacePost(posts, selectedPost);

    setPosts(newPosts);
  }, [selectedPost]);

  const fetchAndSetComments = async (postId, createdAt) => {
    const { data } = await http.get(
      "http://localhost:3001/api/posts/" + postId + "?createdAt=" + createdAt
    );

    return data;
  };

  return (
    <div>
      <Post post={selectedPost} setPost={setSelectedPost} />
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          const sendFormData = new FormData();
          if (postForm.file) sendFormData.append("image", postForm.file);
          sendFormData.append("body", postForm.body);
          sendFormData.append("userId", user.id);

          const result = await addPost(sendFormData);
          console.log(result);

          setPosts([result, ...posts]);
          setPostForm({ body: "", file: null });
        }}
        encType="multipart/form-data"
      >
        <FormFile
          accept="image/png, image/jpeg, image/bmp"
          onChange={({ target }) =>
            setPostForm({ body: postForm.body, file: target.files[0] })
          }
        ></FormFile>
        <FormControl
          value={postForm.body}
          onChange={({ target }) =>
            setPostForm({ body: target.value, file: postForm.file })
          }
          placeholder="Write something here..."
        ></FormControl>
        <Button type="submit">Post</Button>
      </Form>

      <div className="overflow-auto" style={{ height: "calc(100vh - 120px)" }}>
        {posts &&
          posts.map((post, postIndex) => {
            return (
              <div
                className="border border-dark rounded p-2 my-2"
                key={postIndex}
              >
                <h5 className="ml-2">
                  {post.user.firstName} {post.user.lastName}
                </h5>
                <div className="ml-3">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedPost(post)}
                  >
                    <p>{post.body}</p>
                    {post.imagePath && (
                      <Image
                        src={"img/" + post.imagePath}
                        style={{ height: "300px" }}
                      ></Image>
                    )}
                  </div>
                  <p>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        post.userPostLikes.length === 0 ? (
                          <div />
                        ) : (
                          <Tooltip>
                            {post.userPostLikes
                              .map((like, index) => {
                                if (index < 5)
                                  return (
                                    like.user.firstName +
                                    " " +
                                    like.user.lastName
                                  );
                                else return null;
                              })
                              .join(", ") +
                              (post.userPostLikes.length === 1
                                ? " has"
                                : post.userPostLikes.length > 5
                                ? ",... have"
                                : " have") +
                              " liked this post."}
                          </Tooltip>
                        )
                      }
                    >
                      <span>{post.numLikes} Likes</span>
                    </OverlayTrigger>
                    <br />
                    {post.numComments} Comments
                    <br />
                    {replying === postIndex ? (
                      <Form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const newComment = await addCommentToPost({
                            userId: user.id,
                            postId: post.id,
                            body: replyForm,
                          });

                          const tempPosts = [...posts];
                          tempPosts[postIndex].comments.unshift(newComment);
                          tempPosts[postIndex].numComments++;

                          setPosts(tempPosts);
                          setReplying(-1);
                          setReplyForm("");
                        }}
                      >
                        <InputGroup>
                          <FormControl
                            value={replyForm}
                            onChange={({ target }) =>
                              setReplyForm(target.value)
                            }
                            placeholder="Enter reply..."
                            autoFocus
                          ></FormControl>
                          <InputGroup.Append>
                            <Button type="submit" variant="outline-success">
                              Send
                            </Button>
                            <Button
                              onClick={() => setReplying(-1)}
                              variant="outline-danger"
                            >
                              Cancel
                            </Button>
                          </InputGroup.Append>
                        </InputGroup>
                      </Form>
                    ) : (
                      <a href="#" onClick={() => setReplying(postIndex)}>
                        Reply
                      </a>
                    )}
                    {!post.userPostLikes.find(
                      (like) => like.userId === user.id
                    ) ? (
                      <a
                        onClick={() => {
                          const newPost = changePostLike(post, user, true);

                          const newPosts = replacePost(posts, newPost);

                          setPosts(newPosts);
                        }}
                        href="#"
                      >
                        {" "}
                        Like
                      </a>
                    ) : (
                      <a
                        onClick={() => {
                          const newPost = changePostLike(post, user, false);

                          const newPosts = replacePost(posts, newPost);

                          setPosts(newPosts);
                        }}
                        href="#"
                      >
                        {" "}
                        Unlike
                      </a>
                    )}
                    {post.userId === user.id && (
                      <a
                        href="#"
                        onClick={() => {
                          deletePost(post);

                          setPosts(posts.filter((x) => post.id !== x.id));
                        }}
                      >
                        {" "}
                        Delete
                      </a>
                    )}
                  </p>
                  <div className="ml-3">
                    {post.comments.map((comment) => (
                      <div className="mb-3" key={comment.id}>
                        <div className="font-weight-bold">
                          {comment.user.firstName} {comment.user.lastName}
                        </div>
                        <div>{comment.body}</div>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            comment.userPostLikes.length === 0 ? (
                              <div />
                            ) : (
                              <Tooltip>
                                {comment.userPostLikes
                                  .map(
                                    (like) =>
                                      like.user.firstName +
                                      " " +
                                      like.user.lastName
                                  )
                                  .join(", ") +
                                  (comment.userPostLikes.length === 1
                                    ? " has"
                                    : comment.userPostLikes.length > 5
                                    ? ",... have"
                                    : " have") +
                                  " liked this post."}
                              </Tooltip>
                            )
                          }
                        >
                          <span>{comment.numLikes} Likes</span>
                        </OverlayTrigger>
                        {!comment.userPostLikes.find(
                          (like) => like.userId === user.id
                        ) ? (
                          <a
                            onClick={() => {
                              const newComment = changePostLike(
                                comment,
                                user,
                                true
                              );

                              const newPosts = replaceComment(
                                posts,
                                newComment
                              );

                              setPosts(newPosts);
                            }}
                            href="#"
                          >
                            {" "}
                            Like
                          </a>
                        ) : (
                          <a
                            onClick={() => {
                              const newComment = changePostLike(
                                comment,
                                user,
                                false
                              );

                              const newPosts = replaceComment(
                                posts,
                                newComment
                              );

                              setPosts(newPosts);
                            }}
                            href="#"
                          >
                            {" "}
                            Unlike
                          </a>
                        )}
                        {comment.user.id === user.id && (
                          <a
                            href="#"
                            onClick={async () => {
                              await deletePost(comment);
                              const tempPosts = [...posts];
                              tempPosts[postIndex].comments = tempPosts[
                                postIndex
                              ].comments.filter((x) => comment.id !== x.id);
                              tempPosts[postIndex].numComments--;

                              if (tempPosts[postIndex].comments.length === 0)
                                tempPosts[
                                  postIndex
                                ].comments = await fetchAndSetComments(
                                  post.id,
                                  new Date(Date.now()).toISOString()
                                );

                              setPosts(tempPosts);
                            }}
                          >
                            {" "}
                            Delete
                          </a>
                        )}
                      </div>
                    ))}
                    {parseInt(post.numComments) > post.comments.length && (
                      <a
                        href="#"
                        onClick={async () => {
                          const data = await fetchAndSetComments(
                            post.id,
                            post.comments[post.comments.length - 1].createdAt
                          );
                          const tempPosts = [...posts];
                          tempPosts[postIndex].comments.push(...data);

                          setPosts(tempPosts);
                        }}
                      >
                        Show more...
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
