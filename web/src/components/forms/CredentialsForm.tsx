import { ChangeEvent, useState } from "react";
import { FormEvent } from "react";
import { FC, FormHTMLAttributes } from "react";
import styled from "styled-components";
import { ICredentialsForm } from "../../constants/formTypes";
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
  width: 40%;

  ${theme.mediaQueries.tablet} {
    width: 60%;
  }

  ${theme.mediaQueries.mobile} {
    width: 100%;
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
      error = validation[key as keyof typeof state](value, state);

      if (error) break;
    }

    error ? setError(error) : handleSubmit();
  };

  return (
    <Container onSubmit={onSubmit} className={className}>
      <Input
        label="Username"
        value={state.username}
        id="username"
        name="username"
        onChange={handleChangeInput}
        error={error && validation.username(state.username)}
      />

      <Input
        label="E-mail"
        value={state.email}
        id="email"
        name="email"
        onChange={handleChangeInput}
        error={error && validation.email(state.email)}
      />

      <Input
        type="password"
        label="Password"
        value={state.password}
        id="password"
        name="password"
        onChange={handleChangeInput}
        error={error && validation.password(state.password)}
      />

      <Input
        type="password"
        label="Confirm password"
        value={state.repeatPassword}
        id="repeatPassword"
        name="repeatPassword"
        onChange={handleChangeInput}
        error={error && validation.repeatPassword(state.repeatPassword, state)}
      />

      <Button label="Save" type="submit" color="primary" />

      {error && (
        <ErrorMessage>
          <span>{error}</span>
        </ErrorMessage>
      )}
    </Container>
  );
};

export default CredentialsForm;
