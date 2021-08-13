import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import UserList from "../components/UserList";
import ContainerComponent from "../components/shared-components/Container";
import { IUser } from "../constants/models";
import {
  getAllFriends,
  getFriendSuggestions,
  removeFriend,
} from "../services/friendServices";
import handleError from "../utils/errorHandler";
import { sendFriendRequest } from "../services/friendRequestServices";

const Container = styled(ContainerComponent)`
  padding: 3rem 0;
  box-sizing: border-box;
`;

const SubTitle = styled.h2`
  margin: 5rem 0 3rem;
`;

const Friends: FC = () => {
  const [friends, setFriends] = useState<IUser[]>([]);
  const [friendSuggestions, setFriendSuggestions] = useState<IUser[]>([]);

  useEffect(() => {
    (async () => {
      const [friends, friendSuggestions] = await Promise.all([
        getAllFriends(),
        getFriendSuggestions(),
      ]);

      setFriends(friends);
      setFriendSuggestions(friendSuggestions);
    })();
  }, []);

  const handleRemoveFriend = async (user: IUser) => {
    try {
      await removeFriend(user.id);

      const newFriends = friends.filter((friend) => friend.id !== user.id);

      setFriends(newFriends);
    } catch (err) {
      handleError(err);
    }
  };

  const handleSendRequest = async (user: IUser) => {
    await sendFriendRequest(user);

    const newFriendSuggestions = friendSuggestions.filter(
      (friend) => friend.id !== user.id
    );

    setFriendSuggestions(newFriendSuggestions);
  };

  return (
    <Container>
      <h1>Friends</h1>

      <UserList users={friends} onRemoveFriend={handleRemoveFriend} />

      <SubTitle>
        Looking for people to meet? Here are some friend suggestions...
      </SubTitle>

      <UserList users={friendSuggestions} onSendRequest={handleSendRequest} />
    </Container>
  );
};

export default Friends;
