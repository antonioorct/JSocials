import { FC } from "react";
import styled from "styled-components";
import { IUser } from "../constants/models";
import { theme } from "../theme/theme.config";
import Author from "./Author";

interface FriendListProps {
  users: IUser[];

  onCancelRequest?(user: IUser): void;
  onAcceptRequest?(user: IUser): void;
  onDeclineRequest?(user: IUser): void;
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  & > * {
    flex-basis: calc(33.33% - 0.5rem);

    max-width: calc(33.33% - 0.5rem);

    cursor: pointer;
  }

  ${theme.mediaQueries.tablet} {
    & > * {
      flex-basis: calc(50% - 0.25rem);

      max-width: calc(50% - 0.25rem);
    }
  }
`;

const AuthorCard = styled(Author)`
  border-radius: 0.5rem;
  border: 1px solid ${theme.palette.darkGray};
  padding: 1rem;
  box-shadow: 1px 1px 10px #80808055;

  cursor: pointer;

  background-color: ${theme.palette.white};

  &:hover {
    border: 1px solid ${theme.palette.darkGray};
    background-color: ${theme.palette.darkWhite};
  }
`;

const FriendList: FC<FriendListProps> = ({
  users,
  onAcceptRequest,
  onDeclineRequest,
  onCancelRequest,
}: FriendListProps) => {
  return (
    <Container>
      {users.map((user) => (
        <AuthorCard
          key={user.id}
          user={user}
          onAcceptRequest={onAcceptRequest}
          onDeclineRequest={onDeclineRequest}
          onCancelRequest={onCancelRequest}
        />
      ))}
    </Container>
  );
};

export default FriendList;
