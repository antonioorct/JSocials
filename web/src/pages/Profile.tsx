import { FC, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import Author from "../components/Author";
import UserList from "../components/UserList";
import FriendRequest from "../components/FriendRequest";
import ImageList from "../components/ImageList";
import Modal from "../components/Modal";
import Post from "../components/Post";
import PostList from "../components/PostList";
import Button from "../components/shared-components/Button";
import ContainerComponent from "../components/shared-components/Container";
import Tabs, { Tab } from "../components/shared-components/Tabs";
import UserDetails from "../components/UserDetails";
import { IPost, IUser, IUserDetails, IUserProfile } from "../constants/models";
import routes from "../constants/routes";
import { getUserId, isUserOwnerOfObject } from "../services/authServices";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  sendFriendRequest,
} from "../services/friendRequestServices";
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
import {
  getUserProfile,
  removeProfilePhoto,
  updateProfilePhoto,
  updateUserProfile,
} from "../services/userServices";
import { theme } from "../theme/theme.config";
import Anchor from "../components/shared-components/Anchor";

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
  const history = useHistory();

  const [userProfile, setUserProfile] = useState<IUserProfile>();
  const [postModal, setPostModal] = useState<IPost | undefined>(undefined);

  const handleOpenModal = (post: IPost) => setPostModal(post);
  const handleCloseModal = () => setPostModal(undefined);

  useEffect(() => {
    (async () => {
      let user;

      user = await getUserProfile(id ? +id : getUserId());

      setUserProfile(user);
    })();
  }, [id]);

  const handleLikePost = async (post: IPost) => {
    if (!userProfile) return;

    const newPost = await likePost(post);

    const posts = isComment(post)
      ? updateComment(userProfile.posts, newPost)
      : updatePost(userProfile.posts, newPost);

    setUserProfile({ ...userProfile, posts });
    !isComment(newPost) && postModal && setPostModal(newPost);
  };

  const handleUnlikePost = async (post: IPost) => {
    if (!userProfile) return;

    const newPost = await unlikePost(post);

    const posts = isComment(post)
      ? updateComment(userProfile.posts, newPost)
      : updatePost(userProfile.posts, newPost);

    setUserProfile({ ...userProfile, posts });
    !isComment(newPost) && postModal && setPostModal(newPost);
  };

  const handleDeletePost = async (post: IPost) => {
    if (!userProfile) return;

    await deletePost(post);

    const posts = isComment(post)
      ? removeComment(userProfile.posts, post)
      : removePost(userProfile.posts, post);

    setPostModal(undefined);
    setUserProfile({ ...userProfile, posts });
  };

  const handleReplyPost = async (post: IPost, content: string) => {
    if (!userProfile) return;

    const comment = await newComment(post, content);

    const posts = addComment(userProfile.posts, comment);

    setUserProfile({ ...userProfile, posts });
  };

  const handleChangeDetails = async (userDetails: IUserDetails) => {
    if (!userProfile) return;

    await updateUserProfile(userDetails);

    setUserProfile({ ...userProfile, userDetails });
  };

  const handleSendMessage = async () => {
    if (!userProfile) return;

    history.push(routes.messenger.href, { user: userProfile });
  };

  const handleSendRequest = async () => {
    if (!userProfile) return;

    await sendFriendRequest(userProfile);
  };

  const handleAcceptRequest = async (user: IUser) =>
    await acceptFriendRequest(user);

  const handleDeclineRequest = async (user: IUser) =>
    await declineFriendRequest(user);

  const handleCancelRequest = async (user: IUser) =>
    await cancelFriendRequest(user);

  const handleRemoveFriend = async (user: IUser) => {
    if (!userProfile) return;

    await removeFriend(user.id);

    const friends = userProfile.friends.filter(
      (friend) => friend.id !== user.id
    );

    setUserProfile({ ...userProfile, friends });
  };

  const handleChangePhoto = async (photo: File) => {
    if (!userProfile) return;

    const formData = new FormData();
    formData.append("attachment", photo);

    const user = await updateProfilePhoto(formData);

    setUserProfile({ ...userProfile, ...user });
  };

  const handleRemovePhoto = async () => {
    if (!userProfile) return;

    await removeProfilePhoto();

    setUserProfile({ ...userProfile, image: undefined });
  };

  return (
    <>
      <Modal
        show={postModal !== undefined}
        component={Post}
        post={postModal}
        onClickCancel={handleCloseModal}
        onClickDelete={handleDeletePost}
        onClickLike={handleLikePost}
        onClickUnlike={handleUnlikePost}
        onReply={handleReplyPost}
      />

      {userProfile ? (
        <PageContainer>
          <Container>
            <Author
              user={userProfile}
              big
              onClickChangePhoto={handleChangePhoto}
              onClickRemovePhoto={handleRemovePhoto}
            />

            {isUserOwnerOfObject(userProfile) ? (
              <Anchor to={routes.settings.href}>
                <Button label="Settings" color="primary" />
              </Anchor>
            ) : (
              <FriendRequest
                user={userProfile}
                onClickSendRequest={handleSendRequest}
                onClickAcceptRequest={handleAcceptRequest}
                onClickCancelRequest={handleCancelRequest}
                onClickDeclineRequest={handleDeclineRequest}
                onClickRemoveFriend={handleRemoveFriend}
                onClickSendMessage={handleSendMessage}
              />
            )}
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
                onClickLike={handleLikePost}
                onClickUnlike={handleUnlikePost}
                onClickDelete={handleDeletePost}
                onClickPost={handleOpenModal}
                onReply={handleReplyPost}
              />
            </Tab>

            <Tab eventkey="Photos">
              <ImageList
                posts={userProfile.posts.filter(
                  (post) => post.attachment !== null
                )}
                onClickImage={handleOpenModal}
              />
            </Tab>

            <Tab eventkey="Friends">
              <UserList
                users={userProfile.friends}
                onRemoveFriend={
                  isUserOwnerOfObject(userProfile)
                    ? handleRemoveFriend
                    : undefined
                }
              />
            </Tab>
          </Tabs>
        </PageContainer>
      ) : (
        <Container>
          <h1>User not found</h1>
        </Container>
      )}
    </>
  );
};

export default Profile;
