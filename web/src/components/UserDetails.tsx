import { ChangeEvent, FC, useState } from "react";
import styled from "styled-components";
import { IUserDetails } from "../constants/models";
import { theme } from "../theme/theme.config";
import { toTitleCase } from "../utils/stringUtils";
import Button from "./shared-components/Button";
import InputContainer, {
  TextArea as TextAreaContainer,
} from "./shared-components/Input";

interface UserDetailsProps {
  userDetails: IUserDetails;

  onClickConfirm?(state: IUserDetails): void;
}

const Title = styled.p`
  font-weight: bold;
  margin-top: 0;
`;

const BioContainer = styled.div`
  border-radius: 0.5rem;

  border: 1px solid ${theme.palette.darkGray};
  padding: 1rem;
  margin-bottom: 3rem;
  box-shadow: 1px 1px 10px #80808055;

  background: ${theme.palette.white};

  white-space: pre-line;
`;

const DetailsContainer = styled.div`
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: flex-start;
  column-gap: 2rem;
  row-gap: 4rem;

  display: flex;

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

const Input = styled(InputContainer)`
  border: 1px solid ${theme.palette.darkGray};
  padding: 3px;
  margin-bottom: 0;

  background: ${theme.palette.white};

  text-align: center;
`;

const TextArea = styled(TextAreaContainer)`
  border: 1px solid ${theme.palette.darkGray};
  padding: 3px;
  margin-bottom: 0;

  background: ${theme.palette.white};
`;

const ButtonContainer = styled.div`
  align-items: center;
  justify-content: center;
  gap: 1rem;

  display: flex;

  margin-top: 2rem;
`;

const UserDetails: FC<UserDetailsProps> = ({
  userDetails: { bio, ...details },
  userDetails,
  onClickConfirm,
}: UserDetailsProps) => {
  const [state, setState] = useState<IUserDetails>(userDetails);
  const [editing, setEditing] = useState(false);

  const getUserDetails = () =>
    Object.entries(details).map(([key, value]) => {
      if ((value === null || value === undefined || value === "") && !editing)
        return null;

      return editing ? (
        <Input
          key={key}
          label={toTitleCase(key)}
          value={state[key as keyof IUserDetails]}
          name={key}
          onChange={handleChangeInput}
        />
      ) : (
        <div key={key}>
          <strong>{toTitleCase(key)}</strong>
          <hr />
          <div>{value}</div>
        </div>
      );
    });

  const handleChangeInput = ({
    currentTarget: { name, value },
  }: ChangeEvent<HTMLInputElement>) => setState({ ...state, [name]: value });

  const handleClickEdit = () => setEditing(true);

  const handleClickConfirm = async () => {
    onClickConfirm && (await onClickConfirm(state));

    setEditing(false);
  };

  const handleClickCancel = () => {
    setState(userDetails);

    setEditing(false);
  };

  return (
    <>
      <Title>Bio</Title>
      <BioContainer>
        {editing ? (
          <TextArea value={state.bio} name="bio" onChange={handleChangeInput} />
        ) : bio ? (
          bio
        ) : (
          "There's nothing here..."
        )}
      </BioContainer>

      <DetailsContainer>{getUserDetails()}</DetailsContainer>

      {onClickConfirm && (
        <ButtonContainer>
          {editing ? (
            <>
              <Button
                label="Confirm"
                color="primary"
                onClick={handleClickConfirm}
              />
              <Button label="Cancel" color="link" onClick={handleClickCancel} />
            </>
          ) : (
            <Button label="Edit" color="primary" onClick={handleClickEdit} />
          )}
        </ButtonContainer>
      )}
    </>
  );
};

export default UserDetails;
