import { ChangeEvent, FC, useState } from "react";
import styled from "styled-components";
import NewPostForm from "../components/forms/NewPostForm";
import Modal from "../components/Modal";
import Post from "../components/Post";
import PostList from "../components/PostList";
import ContainerComponent from "../components/shared-components/Container";
import { INewPostForm } from "../constants/formTypes";
import { IPost, seedPosts } from "../constants/models";

const Container = styled(ContainerComponent)`
  padding: 7rem 0 3rem;
  box-sizing: border-box;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
`;

const Divider = styled.hr`
  margin-right: 3rem;
  margin-left: 3rem;
`;

const initialNewPostForm: INewPostForm = {
  content: "",
  attachment: "",
  private: false,
};

const Home: FC = () => {
  const [newPostForm, setNewPostForm] = useState(initialNewPostForm);
  const [posts, setPosts] = useState<IPost[]>(seedPosts);
  const [postModal, setPostModal] = useState<IPost | undefined>(undefined);

  const handleSubmitNewPost = () => {
    setNewPostForm(initialNewPostForm);
  };

  const handleChangeNewPostInput = ({
    currentTarget: { type, value, name, checked },
  }: ChangeEvent<HTMLInputElement>) =>
    type === "checkbox"
      ? setNewPostForm({ ...newPostForm, [name]: checked })
      : setNewPostForm({ ...newPostForm, [name]: value });

  const handleClickLike = (post: IPost) => {};
  const handleClickUnlike = (post: IPost) => {};
  const handleClickDelete = (post: IPost) => {};

  const handleClickOpenModal = (post: IPost) => setPostModal(post);
  const handleClickCloseModal = () => setPostModal(undefined);

  const handleReply = (post: IPost, content: string) => {
    setPosts(posts);
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

      <Container>
        <NewPostForm
          handleSubmit={handleSubmitNewPost}
          handleChangeInput={handleChangeNewPostInput}
          state={newPostForm}
        />

        <Divider />

        <PostList
          posts={posts}
          onClickLike={handleClickLike}
          onClickUnlike={handleClickUnlike}
          onClickDelete={handleClickDelete}
          onClickPost={handleClickOpenModal}
          onReply={handleReply}
        />
      </Container>
    </>
  );
};

export default Home;
