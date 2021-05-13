import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import {
  fetchFeed,
  addPost,
  addCommentToPost,
  replacePost,
  replaceComment,
  deletePost,
  getPostsFromUserId,
  likePost,
  unlikePost,
} from "../services/postService";
import http from "../services/httpService";
import Post from "./post";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import FormFile from "react-bootstrap/esm/FormFile";
import Image from "react-bootstrap/Image";
import FormCheck from "react-bootstrap/FormCheck";
import FormGroup from "react-bootstrap/esm/FormGroup";
import { useParams } from "react-router-dom";

export default function Main({ userId }) {
  const user = useContext(UserContext)[0];
  const [posts, setPosts] = useState(null);
  const [postForm, setPostForm] = useState({
    body: "",
    file: null,
    privatePost: false,
  });
  const [replying, setReplying] = useState(-1);
  const [replyForm, setReplyForm] = useState("");

  const [selectedPost, setSelectedPost] = useState(null);

  const params = useParams();

  useEffect(() => {
    if (userId) fetchAndSetPostsFromUserId(userId);
    else fetchAndSetPosts();
  }, [user.id]);

  useEffect(() => {
    if (!selectedPost) return;
    const newPosts = replacePost(posts, selectedPost);

    setPosts(newPosts);
  }, [selectedPost]);

  const fetchAndSetPosts = async () => {
    const data = await fetchFeed(user.id);

    setPosts(data);
  };

  const fetchAndSetPostsFromUserId = async (userId) => {
    const data = await getPostsFromUserId(userId);

    setPosts(data);
  };

  const fetchAndSetComments = async (postId, createdAt) => {
    const { data } = await http.get(
      "http://localhost:3001/api/posts/" +
        postId +
        "/comments" +
        "?createdAt=" +
        createdAt +
        "&limit=5"
    );

    return data;
  };

  const renderLikeTooltip = (post) => {
    return post.userPostLikes.length === 0 ? (
      <span>{post.numLikes} Likes</span>
    ) : (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip>
            {post.userPostLikes
              .map((like) => like.user.firstName + " " + like.user.lastName)
              .join(", ") +
              (post.userPostLikes.length === 1
                ? " has"
                : post.userPostLikes.length > 5
                ? ",... have"
                : " have") +
              " liked this post."}
          </Tooltip>
        }
      >
        <span>{post.numLikes} Likes</span>
      </OverlayTrigger>
    );
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
          sendFormData.append("private", postForm.privatePost);

          const result = await addPost(sendFormData);

          setPosts([result, ...posts]);
          setPostForm({ body: "", file: null, privatePost: false });
        }}
        encType="multipart/form-data"
      >
        <FormFile
          accept="image/png, image/jpeg, image/bmp"
          onChange={({ target }) =>
            setPostForm({
              body: postForm.body,
              file: target.files[0],
              privatePost: postForm.privatePost,
            })
          }
        ></FormFile>
        <FormControl
          value={postForm.body}
          onChange={({ target }) =>
            setPostForm({
              body: target.value,
              file: postForm.file,
              privatePost: postForm.privatePost,
            })
          }
          placeholder="Write something here..."
        ></FormControl>
        <FormGroup controlId="formBasicCheckbox">
          <FormCheck
            value={postForm.privatePost}
            onChange={({ target }) =>
              setPostForm({
                body: postForm.body,
                file: postForm.file,
                privatePost: target.value,
              })
            }
            type="checkbox"
            label="Private"
          ></FormCheck>
        </FormGroup>
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
                  <span
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
                  </span>
                  <p>
                    {renderLikeTooltip(post)}
                    <br />
                    {post.numComments} Comments
                    <br />
                    {replying === postIndex ? (
                      <Form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const newComment = await addCommentToPost(post.id, {
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
                          const tempPost = likePost(post, user);

                          const newPosts = replacePost(posts, tempPost);

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
                          const tempPost = unlikePost(post, user);

                          const newPosts = replacePost(posts, tempPost);

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
                          deletePost(post.id);

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
                        {renderLikeTooltip(comment)}
                        {!comment.userPostLikes.find(
                          (like) => like.userId === user.id
                        ) ? (
                          <a
                            onClick={() => {
                              const tempComment = likePost(comment, user);

                              const newPost = replaceComment(
                                posts,
                                tempComment
                              );

                              setPosts(newPost);
                            }}
                            href="#"
                          >
                            {" "}
                            Like
                          </a>
                        ) : (
                          <a
                            onClick={() => {
                              const tempComment = unlikePost(comment, user);

                              const newPost = replaceComment(
                                posts,
                                tempComment
                              );

                              setPosts(newPost);
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
                              await deletePost(comment.id);
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
