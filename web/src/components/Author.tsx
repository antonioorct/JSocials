import { FC, HTMLAttributes } from "react";
import styled from "styled-components";
import { IUser } from "../constants/models";
import { theme } from "../theme/theme.config";
import Anchor from "./shared-components/Anchor";

interface AuthorProps extends HTMLAttributes<HTMLDivElement> {
  user: IUser;

  big?: boolean;
}

const Container = styled.div<{ big?: boolean }>`
  display: flex;
  gap: 1rem;
  align-items: center;

  ${theme.mediaQueries.mobile} {
    ${(props) => props.big && "flex-direction: column;"}
  }
`;

const AuthorImage = styled.img<{ big?: boolean }>`
  border-radius: 50%;
  max-width: ${(props) => (props.big ? "20rem" : "3rem")};
`;

const BigAuthorName = styled.h1`
  margin: 0;
`;

const AuthorName = styled.h2`
  margin: 0;
`;

const Author: FC<AuthorProps> = ({ user, className, big }: AuthorProps) => {
  return (
    <Container className={className} big={big}>
      <Anchor to={`/user/${user.id}`}>
        <AuthorImage src={user.image} alt="" big={big} />
      </Anchor>
      <Anchor to={`/user/${user.id}`}>
        {big ? (
          <BigAuthorName>
            {user.firstName} {user.lastName}
          </BigAuthorName>
        ) : (
          <AuthorName>
            {user.firstName} {user.lastName}
          </AuthorName>
        )}
      </Anchor>
    </Container>
  );
};

export default Author;
