import { FC, HTMLAttributes } from "react";
import styled from "styled-components";
import { DEFAULT_USER_IMAGE } from "../constants/constants";
import { IUser, IUserMessage } from "../constants/models";
import { theme } from "../theme/theme.config";
import DateLabel from "./DateLabel";
import AnchorComponent from "./shared-components/Anchor";
import Button from "./shared-components/Button";

interface AuthorProps extends HTMLAttributes<HTMLDivElement> {
  user: IUser;

  subText?: IUserMessage;

  big?: boolean;

  onCancelRequest?(user: IUser): void;
  onRemoveFriend?(user: IUser): void;
  onAcceptRequest?(user: IUser): void;
  onDeclineRequest?(user: IUser): void;
  onClickUser?(user: IUser): void;
}

const Container = styled.div<{ big?: boolean }>`
  display: flex;
  gap: 1rem;
  align-items: center;

  width: 100%;

  ${theme.mediaQueries.mobile} {
    ${(props) => props.big && "flex-direction: column;"}
  }
`;

const Anchor = styled(AnchorComponent)`
  flex-grow: 1;
`;

const OuterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AuthorImage = styled.img<{ big?: boolean }>`
  border-radius: 50%;
  max-width: ${(props) => (props.big ? "20rem" : "3rem")};
`;

const BigAuthorName = styled.h1`
  margin: 0;
`;

const AuthorName = styled.h3`
  margin: 0;
`;

const AuthorNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

const SubTextMessage = styled.div`
  width: 16vw;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Author: FC<AuthorProps> = ({
  user,
  subText,
  className,
  big,
  onCancelRequest,
  onRemoveFriend,
  onAcceptRequest,
  onDeclineRequest,
  onClickUser,
}: AuthorProps) => {
  const handleCancelRequest = () => onCancelRequest && onCancelRequest(user);
  const handleRemoveFriend = () => onRemoveFriend && onRemoveFriend(user);

  const handleDeclineRequest = () => onDeclineRequest && onDeclineRequest(user);
  const handleAcceptRequest = () => onAcceptRequest && onAcceptRequest(user);
  const handleClickUser = () => onClickUser && onClickUser(user);

  const renderAuthor = () => {
    const authorComponent = (
      <Container big={big}>
        <AuthorImage
          src={user.image ? user.image : DEFAULT_USER_IMAGE}
          alt=""
          big={big}
        />
        <AuthorNameContainer>
          {big ? (
            <BigAuthorName>
              {user.firstName} {user.lastName}
            </BigAuthorName>
          ) : (
            <AuthorName>
              {user.firstName} {user.lastName}
            </AuthorName>
          )}

          {subText && subText.message && (
            <div>
              <SubTextMessage>{subText.message.content}</SubTextMessage>
              <DateLabel date={subText.message.createdAt} />
            </div>
          )}
        </AuthorNameContainer>
      </Container>
    );

    return onClickUser ? (
      authorComponent
    ) : (
      <Anchor to={`/user/${user.id}`}>{authorComponent}</Anchor>
    );
  };

  return (
    <OuterContainer className={className} onClick={handleClickUser}>
      {renderAuthor()}

      {(onAcceptRequest ||
        onDeclineRequest ||
        onCancelRequest ||
        onRemoveFriend) && (
        <ButtonContainer>
          {onAcceptRequest && (
            <Button
              label="Accept"
              color="primary"
              onClick={handleAcceptRequest}
            />
          )}
          {onDeclineRequest && (
            <Button
              label="Decline"
              color="primary"
              onClick={handleDeclineRequest}
            />
          )}
          {onCancelRequest && (
            <Button
              label="Cancel"
              color="primary"
              onClick={handleCancelRequest}
            />
          )}
          {onRemoveFriend && (
            <Button
              label="Remove"
              color="primary"
              onClick={handleRemoveFriend}
            />
          )}
        </ButtonContainer>
      )}
    </OuterContainer>
  );
};

export default Author;
