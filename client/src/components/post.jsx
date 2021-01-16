import React, { useContext, useState, useEffect } from "react";

import {
  addCommentToPost,
  changePostLike,
  deletePost,
  replaceComment,
  getComments,
  getPost,
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
  const [modalPost, setModalPost] = useState(null);

  const getSelectedPost = async () => {
    const selectedPost = await getPost(post);

    setModalPost(selectedPost);
  };

  const closeModal = () => {
    setModalPost(null);
    setPost(null);
  };

  useEffect(async () => {
    if (!post) return;

    await getSelectedPost();
  }, [post]);

  return (
    modalPost && (
      <Modal
        show={true}
        onHide={() => closeModal()}
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
            onClick={() => closeModal()}
          >
            <span>×</span>
          </button>
          {modalPost.imagePath ? (
            <div
              className="col m-auto"
              style={{
                borderRight: "1px solid #444",
              }}
            >
              <Image
                className="modal-img"
                src={"img/" + modalPost.imagePath}
                fluid
              />
            </div>
          ) : (
            <div />
          )}
          <div className="col-3">
            <h4>
              <a href={`/${modalPost.user.username}`}>
                {modalPost.user.firstName} {modalPost.user.lastName}
              </a>
            </h4>

            <p>{modalPost.body}</p>

            <p>
              <OverlayTrigger
                placement="top"
                overlay={
                  modalPost.userPostLikes.length === 0 ? (
                    <div />
                  ) : (
                    <Tooltip>
                      {modalPost.userPostLikes
                        .map((like, index) => {
                          if (index < 5)
                            return (
                              like.user.firstName + " " + like.user.lastName
                            );
                          else return null;
                        })
                        .join(", ") +
                        (modalPost.userPostLikes.length === 1
                          ? " has"
                          : modalPost.userPostLikes.length > 5
                          ? ",... have"
                          : " have") +
                        " liked this post."}
                    </Tooltip>
                  )
                }
              >
                <span>{modalPost.numLikes} Likes</span>
              </OverlayTrigger>
              <br />
              {modalPost.numComments} Comments
              <br />
              {replying ? (
                <Form
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const newComment = await addCommentToPost({
                      userId: user.id,
                      postId: modalPost.id,
                      body: replyForm,
                    });

                    const tempPost = modalPost;
                    tempPost.comments.unshift(newComment);
                    tempPost.numComments++;

                    setModalPost(tempPost);
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
                        onClick={() => setReplying(false)}
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
              {!modalPost.userPostLikes.find(
                (like) => like.userId === user.id
              ) ? (
                <a
                  onClick={() => {
                    const newPost = changePostLike(modalPost, user, true);

                    setModalPost(newPost);
                  }}
                  href="#"
                >
                  {" "}
                  Like
                </a>
              ) : (
                <a
                  onClick={() => {
                    const newPost = changePostLike(modalPost, user, false);

                    setModalPost(newPost);
                  }}
                  href="#"
                >
                  {" "}
                  Unlike
                </a>
              )}
              {modalPost.userId === user.id && (
                <a
                  href="#"
                  onClick={() => {
                    deletePost(modalPost);

                    closeModal();
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
              {modalPost.comments.map((comment) => (
                <div className="mb-3" key={comment.id}>
                  <div className="font-weight-bold">
                    <a href={`/${comment.user.username}`}>
                      {comment.user.firstName} {comment.user.lastName}
                    </a>
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

                        const newPost = replaceComment([modalPost], newComment);

                        setModalPost(newPost[0]);
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

                        const newPost = replaceComment([modalPost], newComment);

                        setModalPost(newPost[0]);
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

                        const tempPost = modalPost;
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

                        setModalPost(tempPost);
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
