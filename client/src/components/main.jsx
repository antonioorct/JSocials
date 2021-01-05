import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { getPostsFromUserId } from "../services/postService";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

export default function Main() {
  const user = useContext(UserContext)[0];
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const fetchAndSetPosts = async () => {
      const data = await getPostsFromUserId(user.id);

      console.log(data);
      setPosts(data);
    };

    fetchAndSetPosts();
  }, [user.id]);

  return (
    <div>
      <Form>
        <FormControl placeholder="Write something here..."></FormControl>
        <Button>Post</Button>
      </Form>
      <div>
        {posts &&
          posts.map((post) => {
            return (
              <div
                className="border border-dark rounded p-2 my-2"
                key={post.id}
              >
                <h5 className="ml-2">
                  {user.firstName} {user.lastName}
                </h5>
                <div className="ml-3">
                  <p>{post.body}</p>
                  <p>
                    {post.numLikes} Likes
                    <br />
                    {post.comments.length} Comments
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
