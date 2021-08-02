import { FC, HTMLAttributes } from "react";
import styled from "styled-components";
import { IUser } from "../constants/models";
import Anchor from "./shared-components/Anchor";

interface AuthorProps extends HTMLAttributes<HTMLDivElement> {
  user: IUser;
}

const Container = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const AuthorImage = styled.img`
  border-radius: 50%;
  max-width: 3rem;
`;

const AuthorName = styled.h2`
  margin: 0;
`;

const Author: FC<AuthorProps> = ({ user, className }: AuthorProps) => {
  return (
    <Container className={className}>
      <Anchor to={`/user/${user.id}`}>
        <AuthorImage src={user.image} alt="" />
      </Anchor>
      <Anchor to={`/user/${user.id}`}>
        <AuthorName>
          {user.firstName} {user.lastName}
        </AuthorName>
      </Anchor>
    </Container>
  );
};

export default Author;
