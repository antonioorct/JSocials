import React, { useContext, useState, useEffect } from "react";

import {
  addCommentToPost,
  changePostLike,
  deletePost,
  replaceComment,
  getComments,
} from "../services/postService";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Image from "react-bootstrap/Image";

import "../style.css";
import { UserContext } from "../contexts/UserContext";

export default function Post({ post, setPost }) {
  const user = useContext(UserContext)[0];
  const [replying, setReplying] = useState(false);
  const [replyForm, setReplyForm] = useState("");
  const [comments, setComments] = useState([]);

  const getSetComments = async () => {
    const comm = await getComments(post);

    setComments(comm);
  };

  useEffect(() => {
    if (!post) return;
    getSetComments();
  }, [post]);

  return (
    post && (
      <Modal
        show={true}
        onHide={() => setPost(null)}
        dialogClassName="model-dialog"
        contentClassName="model-content"
      >
        <Modal.Body className="row">
          <button
            type="button"
            className="close"
            style={{
              position: "absolute",
              right: "20px",
              zIndex: "2",
              padding: "0 1rem 1rem 1rem",
            }}
            onClick={() => setPost(null)}
          >
            <span>×</span>
          </button>
          {post.imagePath ? (
            <div
              className="col m-auto"
              style={{
                borderRight: "1px solid #444",
              }}
            >
              <Image
                className="modal-img"
                src={"img/" + post.imagePath}
                fluid
              />
            </div>
          ) : (
            <div />
          )}
          <div className="col-3">
            <h4>
              {post.user.firstName} {post.user.lastName}
            </h4>

            <p>{post.body}</p>

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
                              like.user.firstName + " " + like.user.lastName
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
              {replying ? (
                <Form
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const newComment = await addCommentToPost({
                      userId: user.id,
                      postId: post.id,
                      body: replyForm,
                    });

                    const tempPost = post;
                    tempPost.comments.unshift(newComment);
                    tempPost.numComments++;

                    setPost(tempPost);
                    setComments([newComment, ...comments]);
                    setReplying(false);
                    setReplyForm("");
                  }}
                >
                  <InputGroup>
                    <FormControl
                      value={replyForm}
                      onChange={({ target }) => setReplyForm(target.value)}
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
                <a href="#" onClick={() => setReplying(true)}>
                  Reply
                </a>
              )}
              {!post.userPostLikes.find((like) => like.userId === user.id) ? (
                <a
                  onClick={() => {
                    const newPost = changePostLike(post, user, true);

                    setPost(newPost);
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

                    setPost(newPost);
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

                    setPost(null);
                  }}
                >
                  {" "}
                  Delete
                </a>
              )}
            </p>

            <div
              className="ml-3 overflow-auto"
              style={{ height: "calc(90vh - 200px)" }}
            >
              {comments.map((comment) => (
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
                                like.user.firstName + " " + like.user.lastName
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
                        const newComment = changePostLike(comment, user, true);

                        const newPost = replaceComment([post], newComment);

                        setPost(newPost[0]);
                      }}
                      href="#"
                    >
                      {" "}
                      Like
                    </a>
                  ) : (
                    <a
                      onClick={() => {
                        const newComment = changePostLike(comment, user, false);

                        const newPost = replaceComment([post], newComment);

                        setPost(newPost[0]);
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
                      onClick={() => {
                        deletePost(comment);

                        const tempPost = post;
                        tempPost.comments = tempPost.comments.filter(
                          (x) => comment.id !== x.id
                        );
                        tempPost.numComments--;

                        // if (tempPosts[postIndex].comments.length === 0)
                        //   tempPosts[
                        //     postIndex
                        //   ].comments = await fetchAndSetComments(
                        //     post.id,
                        //     new Date(Date.now()).toISOString()
                        //   );

                        setPost(tempPost);
                      }}
                    >
                      {" "}
                      Delete
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  );
}
