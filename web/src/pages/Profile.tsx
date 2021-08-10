import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import { IPost, IUserProfile } from "../constants/models";
import { getUserId } from "../services/authServices";
import { getAllPosts } from "../services/postServices";
import { getUserProfile } from "../services/userServices";
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
  const { id } = useParams<{ id: string }>();

  const [userProfile, setUserProfile] = useState<IUserProfile>();
  const [postModal, setPostModal] = useState<IPost | undefined>(undefined);

  const handleClickOpenModal = (post: IPost) => setPostModal(post);
  const handleClickCloseModal = () => setPostModal(undefined);

  const handleClickLike = (post: IPost) => {};
  const handleClickUnlike = (post: IPost) => {};
  const handleClickDelete = (post: IPost) => {};

  const handleReply = (post: IPost, content: string) => {};

  useEffect(() => {
    (async () => {
      let user;
      const userId = getUserId();
      if (id === undefined && userId !== undefined)
        user = await getUserProfile(userId.sub);
      else user = await getUserProfile(+id);

      setUserProfile(user);
    })();
  }, []);

  return (
    <>
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

      {userProfile && (
        <PageContainer>
          <Container>
            <Author user={userProfile} big />

            <ButtonContainer>
              <Button label="Send friend request" color="primary" />
              <Button label="Message" color="primary" />
            </ButtonContainer>
          </Container>

          <Divider />

          <Tabs>
            <Tab eventkey="About">
              <UserDetails userDetails={userProfile.userDetails} />
            </Tab>

            <Tab eventkey="Posts">
              <PostList
                posts={userProfile.posts}
                onClickLike={handleClickLike}
                onClickUnlike={handleClickUnlike}
                onClickDelete={handleClickDelete}
                onClickPost={handleClickOpenModal}
                onReply={handleReply}
              />
            </Tab>

            <Tab eventkey="Photos">
              <ImageList
                posts={userProfile.posts.filter(
                  (post) => post.attachment !== null
                )}
                onClickImage={handleClickOpenModal}
              />
            </Tab>

            <Tab eventkey="Friends">
              <FriendList users={userProfile.friends} />
            </Tab>
          </Tabs>
        </PageContainer>
      )}
    </>
  );
};

export default Profile;
