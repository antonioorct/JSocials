import { FC, HTMLAttributes } from "react";
import styled from "styled-components";
import { IUser, IUserMessage } from "../constants/models";
import { theme } from "../theme/theme.config";
import DateLabel from "./DateLabel";
import ProfilePhoto from "./ProfilePhoto";
import AnchorComponent from "./shared-components/Anchor";
import Button from "./shared-components/Button";

interface AuthorProps extends HTMLAttributes<HTMLDivElement> {
  user: IUser;

  subText?: IUserMessage;

  big?: boolean;

  onSendRequest?(user: IUser): void;
  onCancelRequest?(user: IUser): void;
  onRemoveFriend?(user: IUser): void;
  onAcceptRequest?(user: IUser): void;
  onDeclineRequest?(user: IUser): void;
  onClickUser?(user: IUser): void;

  onClickRemovePhoto?(): void;
  onClickChangePhoto?(photo: File): void;
}

const Container = styled.div<{ big?: boolean }>`
  display: flex;
  gap: ${(props) => (props.big ? "4rem" : "1rem")};
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
  justify-content: space-between;
  align-items: center;

  display: flex;
`;

const ButtonContainer = styled.div`
  flex-direction: column;
  gap: 0.5rem;

  display: flex;
`;

const BigAuthorName = styled.h1`
  margin: 0;
`;

const AuthorName = styled.h3`
  margin: 0;
`;

const AuthorNameContainer = styled.div`
  flex-direction: column;
  flex: 1 1 auto;

  display: flex;

  box-sizing: border-box;
  padding-right: 0.5rem;
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
  onSendRequest,
  onCancelRequest,
  onRemoveFriend,
  onAcceptRequest,
  onDeclineRequest,
  onClickUser,
  onClickChangePhoto,
  onClickRemovePhoto,
}: AuthorProps) => {
  const handleAddFriend = () => onSendRequest && onSendRequest(user);
  const handleCancelRequest = () => onCancelRequest && onCancelRequest(user);
  const handleRemoveFriend = () => onRemoveFriend && onRemoveFriend(user);

  const handleDeclineRequest = () => onDeclineRequest && onDeclineRequest(user);
  const handleAcceptRequest = () => onAcceptRequest && onAcceptRequest(user);
  const handleClickUser = () => onClickUser && onClickUser(user);

  const renderAuthor = () => {
    const authorComponent = (
      <Container big={big}>
        <ProfilePhoto
          user={user}
          big={big}
          onClickChangePhoto={onClickChangePhoto}
          onClickRemovePhoto={onClickRemovePhoto}
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

    return onClickUser || (onClickChangePhoto && onClickRemovePhoto) ? (
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
        onRemoveFriend ||
        onSendRequest) && (
        <ButtonContainer>
          {onSendRequest && (
            <Button label="Add" color="primary" onClick={handleAddFriend} />
          )}
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
