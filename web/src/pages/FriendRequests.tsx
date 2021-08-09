import { FC } from "react";
import styled from "styled-components";
import FriendList from "../components/FriendList";
import ContainerComponent from "../components/shared-components/Container";
import { IUser } from "../constants/models";

const Container = styled(ContainerComponent)`
  padding: 6rem 0 3rem;
  box-sizing: border-box;
`;

const Title = styled.h1`
  margin: 0;
`;

const FriendRequestsContainer = styled.div`
  display: flex;
  gap: 3rem;

  & > * {
    flex-grow: 1;
  }
`;

const FriendRequests: FC = () => {
  const handleAcceptRequest = (user: IUser) => {};
  const handleDeclineRequest = (user: IUser) => {};

  const handleCancelRequest = (user: IUser) => {};

  return (
    <Container>
      <Title>Friend Requests</Title>

      <FriendRequestsContainer>
        <div>
          <h2>Incoming</h2>
          <FriendList
            users={[]}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            fullWidth
          />
        </div>

        <div>
          <h2>Outgoing</h2>
          <FriendList
            users={[]}
            onCancelRequest={handleCancelRequest}
            fullWidth
          />
        </div>
      </FriendRequestsContainer>
    </Container>
  );
};

export default FriendRequests;
