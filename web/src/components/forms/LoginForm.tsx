import { ChangeEvent, useState } from "react";
import { FormEvent } from "react";
import { FC, FormHTMLAttributes } from "react";
import styled from "styled-components";
import { ILoginForm } from "../../constants/formTypes";
import { theme } from "../../theme/theme.config";
import Anchor from "../shared-components/Anchor";
import Button from "../shared-components/Button";
import Input from "../shared-components/Input";

interface LoginFormProps extends FormHTMLAttributes<HTMLFormElement> {
  handleSubmit(): void;
  handleChangeInput(
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ): void;
  state: ILoginForm;
}

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ErrorMessage = styled.div`
  position: relative;
  color: ${theme.palette.danger};

  & span {
    top: 1rem;
    position: absolute;
  }
`;

const validation = {
  username: (username: string): string | undefined => {
    return username === "" ? "Username is required" : undefined;
  },
  password: (password: string): string | undefined => {
    return password === "" ? "Password is required" : undefined;
  },
};

const LoginForm: FC<LoginFormProps> = ({
  handleSubmit,
  handleChangeInput,
  state,
  className,
}: LoginFormProps) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    let error: string | undefined = undefined;
    for (const [key, value] of Object.entries(state)) {
      error = validation[key as keyof typeof state](value);

      if (error) break;
    }

    error ? setError(error) : handleSubmit();
  };

  return (
    <form onSubmit={onSubmit} className={className}>
      <Input
        autoFocus
        label="Username"
        value={state.username}
        id="username"
        name="username"
        onChange={handleChangeInput}
        error={error && validation.username(state.username)}
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

      <ButtonsContainer>
        <Button label="Login" type="submit" color="primary" />
        <Anchor to="/register" label="Register" />
      </ButtonsContainer>

      {error && (
        <ErrorMessage>
          <span>{error}</span>
        </ErrorMessage>
      )}
    </form>
  );
};

export default LoginForm;
