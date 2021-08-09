import { ChangeEvent, FC, HTMLAttributes, useState } from "react";
import styled from "styled-components";
import { IChat, IMessage, IUser } from "../constants/models";
import { theme } from "../theme/theme.config";
import Author from "./Author";
import Button from "./shared-components/Button";
import Input from "./shared-components/Input";

interface FriendListProps extends HTMLAttributes<HTMLDivElement> {
  users: IUser[];

  subTexts?: IUserMessage[];

  fullWidth?: boolean;

  onCancelRequest?(user: IUser): void;
  onAcceptRequest?(user: IUser): void;
  onDeclineRequest?(user: IUser): void;
  onClickUser?(user: IUser): void;
}

const Container = styled.div<{ fullWidth: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  & > * {
    flex-basis: ${(props) =>
      props.fullWidth ? "100% !important" : "calc(33.33% - 0.5rem)"};

    max-width: ${(props) =>
      props.fullWidth ? "100% !important" : "calc(33.33% - 0.5rem)"};

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
  subTexts,
  fullWidth,
  onAcceptRequest,
  onDeclineRequest,
  onCancelRequest,
  onClickUser,
  className,
}: FriendListProps) => (
  <Container fullWidth={fullWidth !== undefined} className={className}>
    {users.map((user, index) => (
      <AuthorCard
        key={user.id}
        user={user}
        subText={subTexts && subTexts[index]}
        onAcceptRequest={onAcceptRequest}
        onDeclineRequest={onDeclineRequest}
        onCancelRequest={onCancelRequest}
        onClickUser={onClickUser}
      />
    ))}
  </Container>
);

const StyledUserList = styled(FriendList)`
  overflow: auto;
  padding-bottom: 1rem;

  ${theme.mediaQueries.mobile} {
    flex-direction: row;
    flex-wrap: nowrap;

    padding: 0 1rem 1rem;

    & > * {
      flex: 0 0 45% !important;
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  & input {
    margin-bottom: 0;
  }

  ${theme.mediaQueries.mobile} {
    width: 100%;
    padding: 0 1rem;
    box-sizing: border-box;
  }
`;

const UserListContainer = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;

  display: flex;

  padding: 3rem 4rem;
  border-radius: 0.8rem;

  background-color: ${theme.palette.white};
`;

export interface IUserMessage extends IUser {
  message: { content: string; createdAt: string };
}

interface UserListProps extends FriendListProps {
  users: IUserMessage[];

  onClickNew?(): void;
  onClickCancel?(): void;
}

export const UserList: FC<UserListProps> = ({
  users,
  onClickUser,
  className,
  onClickNew,
  onClickCancel,
}) => {
  const [filterUserQuery, setFilterUserQuery] = useState("");

  const handleFilterQueryChange = ({
    currentTarget: { value },
  }: ChangeEvent<HTMLInputElement>) => setFilterUserQuery(value);

  const getFilteredUsers = (): IUserMessage[] =>
    users.filter((user: IUserMessage) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(filterUserQuery.toLowerCase())
    );

  return (
    <UserListContainer className={className}>
      <SearchContainer>
        <Input
          value={filterUserQuery}
          onChange={handleFilterQueryChange}
          placeholder="Search users..."
        />
        {onClickCancel ? (
          <Button label="Cancel" color="link" onClick={onClickCancel} />
        ) : (
          <Button label="New" color="primary" onClick={onClickNew} />
        )}
      </SearchContainer>

      <StyledUserList
        users={getFilteredUsers()}
        subTexts={getFilteredUsers()}
        onClickUser={onClickUser}
        fullWidth
      />
    </UserListContainer>
  );
};

export default FriendList;
