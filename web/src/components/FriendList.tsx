import { FC } from "react";
import styled from "styled-components";
import { IUser } from "../constants/models";
import { theme } from "../theme/theme.config";
import Author from "./Author";
import Anchor from "./shared-components/Anchor";

interface FriendListProps {
  users: IUser[];
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  & > * {
    flex-grow: 0;
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

  transition: ease-in-out 0.1s;

  background-color: ${theme.palette.white};

  &:hover {
    border: 1px solid ${theme.palette.darkGray};
    background-color: ${theme.palette.darkWhite};
  }

  &:active {
    transform: translate(2px, 2px);
  }
`;

const FriendList: FC<FriendListProps> = ({ users }: FriendListProps) => {
  return (
    <Container>
      {users.map((user) => (
        <Anchor to={`/user/${user.id}`} key={user.id}>
          <AuthorCard user={user} />
        </Anchor>
      ))}
    </Container>
  );
};

export default FriendList;
