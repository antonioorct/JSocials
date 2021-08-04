import { FC, HTMLAttributes } from "react";
import styled from "styled-components";
import { IUser } from "../constants/models";
import { theme } from "../theme/theme.config";
import AnchorComponent from "./shared-components/Anchor";
import Button from "./shared-components/Button";

interface AuthorProps extends HTMLAttributes<HTMLDivElement> {
  user: IUser;

  big?: boolean;

  onCancelRequest?(user: IUser): void;
  onAcceptRequest?(user: IUser): void;
  onDeclineRequest?(user: IUser): void;
  onClickUser?(user: IUser): void;
}

const Container = styled.div<{ big?: boolean }>`
  display: flex;
  gap: 1rem;
  align-items: center;

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

const Author: FC<AuthorProps> = ({
  user,
  className,
  big,
  onCancelRequest,
  onAcceptRequest,
  onDeclineRequest,
  onClickUser,
}: AuthorProps) => {
  const handleCancelRequest = () => onCancelRequest && onCancelRequest(user);

  const handleDeclineRequest = () => onDeclineRequest && onDeclineRequest(user);
  const handleAcceptRequest = () => onAcceptRequest && onAcceptRequest(user);
  const handleClickUser = () => onClickUser && onClickUser(user);

  const renderAuthor = () => {
    const authorComponent = (
      <Container big={big}>
        <AuthorImage src={user.image} alt="" big={big} />
        {big ? (
          <BigAuthorName>
            {user.firstName} {user.lastName}
          </BigAuthorName>
        ) : (
          <AuthorName>
            {user.firstName} {user.lastName}
          </AuthorName>
        )}
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

      {(onAcceptRequest || onDeclineRequest || onCancelRequest) && (
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
        </ButtonContainer>
      )}
    </OuterContainer>
  );
};

export default Author;
