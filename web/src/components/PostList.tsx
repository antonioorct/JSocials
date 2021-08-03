import { FC, HTMLAttributes } from "react";
import styled from "styled-components";
import { IPost } from "../constants/models";
import Post from "./Post";

interface PostListProps extends HTMLAttributes<HTMLDivElement> {
  posts: IPost[];

  onClickLike(post: IPost): void;
  onClickUnlike(post: IPost): void;
  onClickDelete(post: IPost): void;

  onClickPost?(post: IPost): void;

  onReply?(post: IPost, content: string): void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PostList: FC<PostListProps> = ({
  posts,
  onClickLike,
  onClickUnlike,
  onClickDelete,
  onClickPost,
  onReply,
  className,
}: PostListProps) => {
  return (
    <Container className={className}>
      {posts.map((post, index) => (
        <Post
          post={post}
          key={index}
          onClickLike={onClickLike}
          onClickUnlike={onClickUnlike}
          onClickDelete={onClickDelete}
          onClickPost={onClickPost}
          onReply={onReply}
        />
      ))}
    </Container>
  );
};

export default PostList;
