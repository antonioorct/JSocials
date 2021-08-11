import { FC, useDebugValue, useEffect, useState } from "react";
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
import { IPost, IUser, IUserDetails, IUserProfile } from "../constants/models";
import { getUserId, isUserOwnerOfObject } from "../services/authServices";
import { removeFriend } from "../services/friendServices";
import {
  addComment,
  deletePost,
  isComment,
  likePost,
  newComment,
  removeComment,
  removePost,
  unlikePost,
  updateComment,
  updatePost,
} from "../services/postServices";
import { getUserProfile, updateUserProfile } from "../services/userServices";
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

  const handleClickLike = async (post: IPost) => {
    if (!userProfile) return;

    const newPost = await likePost(post);

    console.log(isComment(post));

    const posts = isComment(post)
      ? updateComment(userProfile.posts, newPost)
      : updatePost(userProfile.posts, newPost);
    console.log(newPost);

    setUserProfile({ ...userProfile, posts });
    !isComment(newPost) && postModal && setPostModal(newPost);
  };

  const handleClickUnlike = async (post: IPost) => {
    if (!userProfile) return;

    const newPost = await unlikePost(post);

    const posts = isComment(post)
      ? updateComment(userProfile.posts, newPost)
      : updatePost(userProfile.posts, newPost);

    setUserProfile({ ...userProfile, posts });
    !isComment(newPost) && postModal && setPostModal(newPost);
  };

  const handleClickDelete = async (post: IPost) => {
    if (!userProfile) return;

    await deletePost(post);

    const posts = isComment(post)
      ? removeComment(userProfile.posts, post)
      : removePost(userProfile.posts, post);

    setPostModal(undefined);
    setUserProfile({ ...userProfile, posts });
  };

  const handleReply = async (post: IPost, content: string) => {
    if (!userProfile) return;

    const comment = await newComment(post, content);

    const posts = addComment(userProfile.posts, comment);

    setUserProfile({ ...userProfile, posts });
  };

  const handleClickRemoveFriend = async (user: IUser) => {
    if (!userProfile) return;
    await removeFriend(user.id);

    const friends = userProfile.friends.filter(
      (friend) => friend.id !== user.id
    );

    setUserProfile({ ...userProfile, friends });
  };

  const handleChangeDetails = async (userDetails: IUserDetails) => {
    if (!userProfile) return;

    await updateUserProfile(userDetails);

    setUserProfile({ ...userProfile, userDetails });
  };

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
              <UserDetails
                userDetails={userProfile.userDetails}
                onClickConfirm={
                  isUserOwnerOfObject(userProfile)
                    ? handleChangeDetails
                    : undefined
                }
              />
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
              <FriendList
                users={userProfile.friends}
                onRemoveFriend={
                  isUserOwnerOfObject(userProfile)
                    ? handleClickRemoveFriend
                    : undefined
                }
              />
            </Tab>
          </Tabs>
        </PageContainer>
      )}
    </>
  );
};

export default Profile;
