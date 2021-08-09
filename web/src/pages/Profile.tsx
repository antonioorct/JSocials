import { FC, useState } from "react";
import styled from "styled-components";
import Author from "../components/Author";
import FriendList from "../components/FriendList";
import ImageList from "../components/ImageList";
import Modal from "../components/Modal";
import Post from "../components/Post";
import PostList from "../components/PostList";
import Button from "../components/shared-components/Button";
import ContainerComponent from "../components/shared-components/Container";
import Tabs, { Tab } from "../components/shared-components/Tabs";
import UserDetails from "../components/UserDetails";
import { IPost } from "../constants/models";
import { theme } from "../theme/theme.config";

const Container = styled(ContainerComponent)`
  padding-top: 7rem;
  box-sizing: border-box;

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
  }

  ${theme.mediaQueries.mobile} {
    & > div {
      flex-direction: column;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${theme.mediaQueries.mobile} {
    flex-direction: row;
    width: 100%;

    & > * {
      flex-basis: 100%;
    }
  }
`;

const Divider = styled.hr`
  margin-top: 1rem;
  margin-bottom: 4rem;
  width: min(105rem, 95%);
`;

const PageContainer = styled.div`
  margin-bottom: 4rem;
`;

const Profile: FC = () => {
  const [posts] = useState<IPost[]>([]);
  const [postModal, setPostModal] = useState<IPost | undefined>(undefined);

  const handleClickOpenModal = (post: IPost) => setPostModal(post);
  const handleClickCloseModal = () => setPostModal(undefined);

  const handleClickLike = (post: IPost) => {};
  const handleClickUnlike = (post: IPost) => {};
  const handleClickDelete = (post: IPost) => {};

  const handleReply = (post: IPost, content: string) => {};

  return (
    <PageContainer>
      <Modal
        show={postModal !== undefined}
        component={Post}
        post={postModal}
        onClickCancel={handleClickCloseModal}
        onClickDelete={handleClickDelete}
        onClickLike={handleClickLike}
        onClickUnlike={handleClickUnlike}
        onReply={handleReply}
      />

      <Container>
        <Author user={posts[0].user} big />

        <ButtonContainer>
          <Button label="Send friend request" color="primary" />
          <Button label="Message" color="primary" />
        </ButtonContainer>
      </Container>

      <Divider />

      <Tabs>
        <Tab eventkey="About">
          <UserDetails user={posts[0].user} />
        </Tab>

        <Tab eventkey="Posts">
          <PostList
            posts={posts}
            onClickLike={handleClickLike}
            onClickUnlike={handleClickUnlike}
            onClickDelete={handleClickDelete}
            onClickPost={handleClickOpenModal}
            onReply={handleReply}
          />
        </Tab>

        <Tab eventkey="Photos">
          <ImageList
            posts={[posts[0], posts[0], posts[0], posts[0]]}
            onClickImage={handleClickOpenModal}
          />
        </Tab>

        <Tab eventkey="Friends">
          <FriendList users={[]} />
        </Tab>
      </Tabs>
    </PageContainer>
  );
};

export default Profile;
