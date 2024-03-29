import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import UserList from "../components/UserList";
import ContainerComponent from "../components/shared-components/Container";
import { IFriendRequests, IUser } from "../constants/models";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  getAllFriendRequests,
} from "../services/friendRequestServices";
import localization from "../constants/Localization";
import { theme } from "../theme/theme.config";

const Container = styled(ContainerComponent)`
  padding: 6rem 0 3rem;
  box-sizing: border-box;
`;

const Title = styled.h1`
  margin: 0;

  ${theme.mediaQueries.mobile} {
    margin-bottom: 3rem;
  }
`;

const FriendRequestsContainer = styled.div`
  display: flex;
  gap: 3rem;

  & > * {
    flex-grow: 1;
  }

  ${theme.mediaQueries.mobile} {
    flex-direction: column;
  }
`;

const FriendRequests: FC = () => {
  const [friendRequests, setFriendRequests] = useState<IFriendRequests>({
    incoming: [],
    outgoing: [],
  });

  useEffect(() => {
    (async () => {
      const friendRequests = await getAllFriendRequests();

      setFriendRequests(friendRequests);
    })();
  }, []);

  const removeIncomingFriendRequest = (user: IUser) => {
    const newIncomingFriendRequests = friendRequests.incoming.filter(
      (friend) => friend.id !== user.id
    );

    setFriendRequests({
      ...friendRequests,
      incoming: newIncomingFriendRequests,
    });
  };

  const removeOutgoingFriendRequest = (user: IUser) => {
    const newOutgoingFriendRequests = friendRequests.outgoing.filter(
      (friend) => friend.id !== user.id
    );

    setFriendRequests({
      ...friendRequests,
      outgoing: newOutgoingFriendRequests,
    });
  };

  const handleAcceptRequest = async (user: IUser) => {
    await acceptFriendRequest(user);

    removeIncomingFriendRequest(user);
  };

  const handleDeclineRequest = async (user: IUser) => {
    await declineFriendRequest(user);

    removeIncomingFriendRequest(user);
  };

  const handleCancelRequest = async (user: IUser) => {
    await cancelFriendRequest(user);

    removeOutgoingFriendRequest(user);
  };

  return (
    <Container>
      <Title>{localization.friendRequests}</Title>

      <FriendRequestsContainer>
        <div>
          <h2>{localization.incoming}</h2>

          <UserList
            users={friendRequests.incoming}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            fullWidth
          />
        </div>

        <div>
          <h2>{localization.outgoing}</h2>

          <UserList
            users={friendRequests.outgoing}
            onCancelRequest={handleCancelRequest}
            fullWidth
          />
        </div>
      </FriendRequestsContainer>
    </Container>
  );
};

export default FriendRequests;
