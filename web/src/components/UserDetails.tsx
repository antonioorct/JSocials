import { FC } from "react";
import styled from "styled-components";
import { IUser } from "../constants/models";
import { theme } from "../theme/theme.config";
import { toTitleCase } from "../utils/stringUtils";

interface UserDetailsProps {
  user: IUser;
}

const Title = styled.h2`
  margin-top: 0;
`;

const BioContainer = styled.div`
  border-radius: 0.5rem;

  border: 1px solid ${theme.palette.darkGray};
  padding: 1rem;
  box-shadow: 1px 1px 10px #80808055;

  background: ${theme.palette.white};

  margin-bottom: 3rem;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  column-gap: 2rem;
  row-gap: 4rem;

  & > * {
    flex-basis: calc(33.33% - 1.5rem);
  }

  & hr {
    width: 85%;
  }

  & hr + div {
    text-align: center;
  }

  ${theme.mediaQueries.tablet} {
    & > * {
      flex-basis: calc(50% - 1rem);
    }
  }
`;

const UserDetails: FC<UserDetailsProps> = ({ user }: UserDetailsProps) => {
  const getUserDetails = () => {
    const arr = [];

    for (const [key, value] of Object.entries(user.details)) {
      arr.push(
        <div key={key}>
          <strong>{toTitleCase(key)}</strong>
          <hr />
          <div>{value}</div>
        </div>
      );
    }

    return arr;
  };

  return (
    <>
      <Title>Bio</Title>
      <BioContainer>
        {user.bio ? user.bio : "There's nothing here..."}
      </BioContainer>

      <DetailsContainer>{getUserDetails()}</DetailsContainer>
    </>
  );
};

export default UserDetails;
