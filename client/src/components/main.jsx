import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { getPostsFromUserId } from "../services/postService";

export default function Main() {
  const user = useContext(UserContext)[0];
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchAndSetPosts = async () => {
      const data = await getPostsFromUserId(user.id);

      setPosts(data);
    };

    fetchAndSetPosts();
  }, [user.id]);

  return (
    <div>
      <div>
        {posts.map((post) => {
          return (
            <div className="border border-dark rounded p-2 my-2" key={post.id}>
              <h5>{user.email}</h5>
              {post.content}
              <div className="">comment</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
