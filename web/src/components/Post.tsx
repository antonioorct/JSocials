import { FC, HTMLAttributes, MouseEvent, useState } from "react";
import styled from "styled-components";
import { IPost } from "../constants/models";
import { theme } from "../theme/theme.config";
import Author from "./Author";
import ReplyForm from "./forms/ReplyForm";
import PostList from "./PostList";
import Button from "./shared-components/Button";

interface PostProps extends HTMLAttributes<HTMLDivElement> {
  post: IPost;

  onClickLike(post: IPost): void;
  onClickUnlike(post: IPost): void;
  onClickDelete(post: IPost): void;
  onClickCancel?(): void;
  onClickPost?(post: IPost): void;

  onReply?(post: IPost, content: string): void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  box-sizing: border-box;
  padding: 2rem;
  border: 1px solid ${theme.palette.lightGray};
  border-radius: 1rem;

  background-color: ${theme.palette.white};
`;

const Content = styled.div<{ hasModal: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;

  margin: 1rem 0;

  ${(props) => props.hasModal && "cursor: pointer"};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled.span`
  cursor: pointer;

  color: ${theme.palette.darkGray};
  font-size: 2rem;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 32rem;

  ${theme.mediaQueries.mobile} {
    align-self: center;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
`;

const Post: FC<PostProps> = ({
  post,
  onClickLike,
  onClickUnlike,
  onClickDelete,
  onClickCancel,
  onClickPost,
  onReply,
}: PostProps) => {
  const [replyContent, setReplyContent] = useState<string | undefined>(
    undefined
  );

  const handleClickLikeButton = () => onClickLike(post);

  const handleClickDelete = () => onClickDelete(post);

  const handleClickPost = (e: MouseEvent) => {
    e.stopPropagation();

    onClickPost && onClickPost(post);
  };

  const handleClickReply = () =>
    replyContent !== undefined
      ? setReplyContent(undefined)
      : setReplyContent("");

  const handleSubmitReply = () => {
    onReply && replyContent && onReply(post, replyContent);
    setReplyContent(undefined);
  };

  const handleChangeReplyInput = (value: string) => setReplyContent(value);

  return (
    <Container>
      <div>
        <Header>
          <Author user={post.user} />
          <ButtonsContainer>
            <Button label="Delete" color="link" onClick={handleClickDelete} />

            {onClickCancel && (
              <CloseButton onClick={onClickCancel}>&#215;</CloseButton>
            )}
          </ButtonsContainer>
        </Header>

        <Content onClick={handleClickPost} hasModal={onClickPost !== undefined}>
          <p>{post.content}</p>

          {post.attachment && (
            <Image src={post.attachment} alt={post.attachment} />
          )}
        </Content>

        <ActionsContainer>
          <div>
            <div>{post.likes} likes</div>
            {post.comments && <div>{post.comments?.length} comments</div>}
          </div>

          <ButtonsContainer>
            <Button label="Like" color="link" onClick={handleClickLikeButton} />

            {onReply && (
              <Button label="Reply" color="link" onClick={handleClickReply} />
            )}
          </ButtonsContainer>

          {onReply && replyContent !== undefined && (
            <ReplyForm
              handleSubmit={handleSubmitReply}
              handleChangeInput={handleChangeReplyInput}
              state={replyContent}
            />
          )}
        </ActionsContainer>
      </div>

      {post.comments && post.comments.length !== 0 && (
        <PostList
          posts={post.comments}
          onClickLike={onClickLike}
          onClickUnlike={onClickUnlike}
          onClickDelete={onClickDelete}
        />
      )}
    </Container>
  );
};

export default Post;