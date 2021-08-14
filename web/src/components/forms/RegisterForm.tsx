import { ChangeEvent, useState } from "react";
import { FormEvent } from "react";
import { FC, FormHTMLAttributes } from "react";
import styled from "styled-components";
import { IRegisterForm } from "../../constants/formTypes";
import validation from "../../constants/validation";
import { theme } from "../../theme/theme.config";
import Anchor from "../shared-components/Anchor";
import Button from "../shared-components/Button";
import FormRow from "../shared-components/FormRow";
import Input from "../shared-components/Input";

interface RegisterFormProps extends FormHTMLAttributes<HTMLFormElement> {
  handleSubmit(): void;
  handleChangeInput(
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ): void;
  state: IRegisterForm;
}

const ErrorMessage = styled.div`
  position: relative;
  color: ${theme.palette.danger};

  & span {
    top: 1rem;
    position: absolute;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RegisterForm: FC<RegisterFormProps> = ({
  handleSubmit,
  handleChangeInput,
  state,
  className,
}: RegisterFormProps) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    let error: string | undefined = undefined;
    for (const [key, value] of Object.entries(state)) {
      error = validation[key as keyof typeof state](value, state);

      if (error) break;
    }

    if (error) setError(error);
    else {
      setError(undefined);
      handleSubmit();
    }
  };

  return (
    <form onSubmit={onSubmit} className={className}>
      <FormRow>
        <Input
          label="First name"
          value={state.firstName}
          id="firstName"
          name="firstName"
          onChange={handleChangeInput}
          error={error && validation.firstName(state.firstName)}
        />

        <Input
          label="Last name"
          value={state.lastName}
          id="lastName"
          name="lastName"
          onChange={handleChangeInput}
          error={error && validation.lastName(state.lastName)}
        />
      </FormRow>

      <Input
        label="E-mail"
        value={state.email}
        id="email"
        name="email"
        onChange={handleChangeInput}
        error={error && validation.email(state.email)}
      />

      <Input
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

      <Input
        type="password"
        label="Confirm password"
        value={state.repeatPassword}
        id="repeatPassword"
        name="repeatPassword"
        onChange={handleChangeInput}
        error={error && validation.repeatPassword(state.repeatPassword, state)}
      />

      <ButtonContainer>
        <Anchor to="/login" label="Back to login" />
        <Button label="Register" type="submit" color="primary" />
      </ButtonContainer>

      {error && (
        <ErrorMessage>
          <span>{error}</span>
        </ErrorMessage>
      )}
    </form>
  );
};

export default RegisterForm;
