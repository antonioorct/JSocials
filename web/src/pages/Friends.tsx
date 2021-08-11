import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import UserList from "../components/UserList";
import ContainerComponent from "../components/shared-components/Container";
import { IUser } from "../constants/models";
import { getAllFriends, removeFriend } from "../services/friendServices";
import handleError from "../utils/errorHandler";

const Container = styled(ContainerComponent)`
  padding: 3rem 0;
  box-sizing: border-box;
`;

const Friends: FC = () => {
  const [friends, setFriends] = useState<IUser[]>([]);

  useEffect(() => {
    (async () => {
      const friends = await getAllFriends();

      setFriends(friends);
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

  return (
    <Container>
      <h1>Friends</h1>

      <UserList users={friends} onRemoveFriend={handleRemoveFriend} />
    </Container>
  );
};

export default Friends;
