import { ChangeEvent, useState } from "react";
import { FormEvent } from "react";
import { FC, FormHTMLAttributes } from "react";
import styled from "styled-components";
import { ICredentialsForm } from "../../constants/formTypes";
import Localization from "../../constants/Localization";
import validation from "../../constants/validation";
import { theme } from "../../theme/theme.config";
import Button from "../shared-components/Button";
import Input from "../shared-components/Input";

interface CredentialsFormProps extends FormHTMLAttributes<HTMLFormElement> {
  handleSubmit(): void;
  handleChangeInput(e: ChangeEvent<HTMLInputElement>): void;
  state: ICredentialsForm;
}

const Container = styled.form`
  flex-basis: 40%;

  ${theme.mediaQueries.tablet} {
    flex-basis: 60%;
  }

  ${theme.mediaQueries.mobile} {
    flex-basis: 100%;

    margin-bottom: 4rem;
  }
`;

const ErrorMessage = styled.div`
  position: relative;
  color: ${theme.palette.danger};

  & span {
    top: 1rem;
    position: absolute;
  }
`;

const CredentialsForm: FC<CredentialsFormProps> = ({
  handleSubmit,
  handleChangeInput,
  state,
  className,
}: CredentialsFormProps) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    let error: string | undefined = undefined;
    for (const [key, value] of Object.entries(state)) {
      // Skip password validation if password field is empty
      if (key === "password" && value === "") continue;
      if (key === "repeatPassword" && state.password === "") continue;

      error = validation[key as keyof typeof state](value, state);

      if (error) break;
    }

    error ? setError(error) : handleSubmit();
  };

  return (
    <Container onSubmit={onSubmit} className={className}>
      <Input
        label={Localization.username}
        value={state.username}
        id="username"
        name="username"
        onChange={handleChangeInput}
        error={error && validation.username(state.username)}
      />

      <Input
        label={Localization.email}
        value={state.email}
        id="email"
        name="email"
        onChange={handleChangeInput}
        error={error && validation.email(state.email)}
      />

      <Input
        type="password"
        label={Localization.password}
        value={state.password}
        id="password"
        name="password"
        onChange={handleChangeInput}
        error={error && validation.password(state.password)}
      />

      <Input
        type="password"
        label={Localization.repeatPassword}
        value={state.repeatPassword}
        id="repeatPassword"
        name="repeatPassword"
        onChange={handleChangeInput}
        error={error && validation.repeatPassword(state.repeatPassword, state)}
      />

      <Button label={Localization.save} type="submit" color="primary" />

      {error && (
        <ErrorMessage>
          <span>{error}</span>
        </ErrorMessage>
      )}
    </Container>
  );
};

export default CredentialsForm;
