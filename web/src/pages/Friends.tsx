import { FC } from "react";
import styled from "styled-components";
import FriendList from "../components/FriendList";
import ContainerComponent from "../components/shared-components/Container";
import { seedUsers } from "../constants/models";

const Container = styled(ContainerComponent)`
  padding: 7rem 0 3rem;
  box-sizing: border-box;
`;

const Friends: FC = () => {
  return (
    <Container>
      <FriendList users={seedUsers} />
    </Container>
  );
};

export default Friends;
