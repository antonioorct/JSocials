import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import {
  getPostsFromUserId,
  addPost,
  addCommentToPost,
} from "../services/postService";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

export default function Main() {
  const user = useContext(UserContext)[0];
  const [posts, setPosts] = useState(null);
  const [postForm, setPostForm] = useState("");
  const [replying, setReplying] = useState(-1);
  const [replyForm, setReplyForm] = useState("");

  useEffect(() => {
    const fetchAndSetPosts = async () => {
      const data = await getPostsFromUserId(user.id);

      setPosts(data);
    };

    fetchAndSetPosts();
  }, [user.id]);

  return (
    <div>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await addPost({ userId: user.id, body: postForm });
          setPosts([...posts, result]);
        }}
      >
        <FormControl
          value={postForm}
          onChange={({ target }) => setPostForm(target.value)}
          placeholder="Write something here..."
        ></FormControl>
        <Button type="submit">Post</Button>
      </Form>
      <div className="overflow-auto" style={{ height: "calc(100vh - 104px)" }}>
        {posts &&
          posts.map((post, index) => {
            return (
              <div className="border border-dark rounded p-2 my-2" key={index}>
                <h5 className="ml-2">
                  {user.firstName} {user.lastName}
                </h5>
                <div className="ml-3">
                  <p>{post.body}</p>
                  <p>
                    {post.numLikes} Likes
                    <br />
                    {post.comments.length} Comments
                    <br />
                    {replying === index ? (
                      <Form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const newComment = await addCommentToPost({
                            userId: user.id,
                            postId: post.id,
                            body: replyForm,
                          });
                          const tempPosts = [...posts];
                          tempPosts[index].comments.push(newComment);
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
                          ></FormControl>
                          <InputGroup.Append>
                            <Button type="submit" variant="outline-success">
                              Send
                            </Button>
                            <Button variant="outline-danger">Cancel</Button>
                          </InputGroup.Append>
                        </InputGroup>
                      </Form>
                    ) : (
                      <a href="#" onClick={() => setReplying(index)}>
                        Reply
                      </a>
                    )}
                    <a href="#"> Like</a>
                  </p>
                  <div className="ml-3">
                    {post.comments.map((comment) => (
                      <div className="mb-3" key={comment.id}>
                        <div className="font-weight-bold">
                          {comment.user.firstName} {comment.user.lastName}
                        </div>
                        <div>{comment.body}</div>
                        <a href="#">Like</a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
