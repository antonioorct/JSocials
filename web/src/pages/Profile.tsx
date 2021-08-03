import { FC, useState } from "react";
import styled from "styled-components";
import Author from "../components/Author";
import PostList from "../components/PostList";
import Button from "../components/shared-components/Button";
import ContainerComponent from "../components/shared-components/Container";
import { SideTab, SideTabs } from "../components/shared-components/Tabs";
import UserDetails from "../components/UserDetails";
import { seedPosts } from "../constants/models";
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

const Profile: FC = () => {
  const [posts, setPosts] = useState(seedPosts);

  return (
    <>
      <Container>
        <Author user={posts[0].user} big />

        <ButtonContainer>
          <Button label="Send friend request" color="primary" />
          <Button label="Message" color="primary" />
        </ButtonContainer>
      </Container>
      <Divider />

      <SideTabs>
        <SideTab eventkey="About">
          <UserDetails user={posts[0].user} />
        </SideTab>
        <SideTab eventkey="Posts">
          <PostList
            posts={posts}
            onClickLike={() => {
              setPosts(posts);
            }}
            onClickUnlike={() => {}}
            onClickDelete={() => {}}
          />
        </SideTab>
        <SideTab eventkey="Photos"></SideTab>
      </SideTabs>
    </>
  );
};

export default Profile;
