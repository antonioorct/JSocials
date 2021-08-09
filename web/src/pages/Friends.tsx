import { FC } from "react";
import styled from "styled-components";
import FriendList from "../components/FriendList";
import ContainerComponent from "../components/shared-components/Container";

const Container = styled(ContainerComponent)`
  padding: 3rem 0;
  box-sizing: border-box;
`;

const Friends: FC = () => {
  return (
    <Container>
      <h1>Friends</h1>

      <FriendList users={[]} />
    </Container>
  );
};

export default Friends;
