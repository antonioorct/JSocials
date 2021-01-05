import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { getPostsFromUserId, addPost } from "../services/postService";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

export default function Main() {
  const user = useContext(UserContext)[0];
  const [posts, setPosts] = useState(null);
  const [postForm, setPostForm] = useState("");
  const [replying, setReplying] = useState(-1);

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
      <div>
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
                      <InputGroup>
                        <FormControl placeholder="Enter reply..."></FormControl>
                        <InputGroup.Append>
                          <Button variant="outline-success">Send</Button>
                          <Button
                            onClick={() => setReplying(-1)}
                            variant="outline-danger"
                          >
                            Cancel
                          </Button>
                        </InputGroup.Append>
                      </InputGroup>
                    ) : (
                      <a href="#" onClick={() => setReplying(index)}>
                        Reply
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
