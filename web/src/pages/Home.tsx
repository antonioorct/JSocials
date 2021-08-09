import { ChangeEvent, FC, useEffect, useState } from "react";
import styled from "styled-components";
import NewPostForm from "../components/forms/NewPostForm";
import Modal from "../components/Modal";
import Post from "../components/Post";
import PostList from "../components/PostList";
import ContainerComponent from "../components/shared-components/Container";
import { INewPostForm } from "../constants/formTypes";
import { IPost } from "../constants/models";
import {
  addComment,
  deletePost,
  getAllPosts,
  isComment,
  likePost,
  newComment,
  newPost,
  removeComment,
  removePost,
  unlikePost,
  updateComment,
  updatePost,
} from "../services/postServices";
import handleError from "../utils/errorHandler";

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
  attachment: undefined,
  private: false,
};

const Home: FC = () => {
  const [newPostForm, setNewPostForm] = useState(initialNewPostForm);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [postModal, setPostModal] = useState<IPost | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const posts = await getAllPosts();

      setPosts(posts);
    })();
  }, []);

  const handleSubmitNewPost = async () => {
    if (newPostForm.content === "") return;

    const sendFormData = new FormData();

    newPostForm.attachment &&
      sendFormData.append("attachment", newPostForm.attachment);
    sendFormData.append("private", newPostForm.private.toString());
    sendFormData.append("content", newPostForm.content);

    try {
      const post = await newPost(sendFormData);

      setPosts([post, ...posts]);
      setNewPostForm(initialNewPostForm);
    } catch (err) {
      handleError(err);
    }
  };

  const handleChangeNewPostInput = ({
    currentTarget: { type, value, name, checked, files },
  }: ChangeEvent<HTMLInputElement>) => {
    switch (type) {
      case "checkbox":
        setNewPostForm({ ...newPostForm, [name]: checked });
        break;
      case "file":
        setNewPostForm({
          ...newPostForm,
          attachment: files ? files[0] : undefined,
        });
        break;
      default:
        setNewPostForm({ ...newPostForm, [name]: value });
    }
  };

  const handleClickLike = async (post: IPost) => {
    const newPost = await likePost(post);

    const newPosts = isComment(post)
      ? updateComment(posts, newPost)
      : updatePost(posts, newPost);

    setPosts(newPosts);
  };

  const handleClickUnlike = async (post: IPost) => {
    const newPost = await unlikePost(post);

    const newPosts = isComment(post)
      ? updateComment(posts, newPost)
      : updatePost(posts, newPost);

    setPosts(newPosts);
  };

  const handleClickDelete = async (post: IPost) => {
    await deletePost(post);

    const newPosts = isComment(post)
      ? removeComment(posts, post)
      : removePost(posts, post);

    setPosts(newPosts);
  };

  const handleClickOpenModal = (post: IPost) => setPostModal(post);
  const handleClickCloseModal = () => setPostModal(undefined);
  const handleClickDeleteModalPost = (post: IPost) => {
    setPostModal(undefined);

    handleClickDelete(post);
  };

  const handleReply = async (post: IPost, content: string) => {
    const comment = await newComment(post, content);

    const newPosts = addComment(posts, comment);

    setPosts(newPosts);
  };

  return (
    <>
      <Modal
        show={postModal !== undefined}
        component={Post}
        post={postModal}
        onClickCancel={handleClickCloseModal}
        onClickDelete={handleClickDeleteModalPost}
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
