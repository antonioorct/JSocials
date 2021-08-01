import { ChangeEvent, FC, useState } from "react";
import styled from "styled-components";
import LoginFormComponent from "../components/forms/LoginForm";
import { ILoginForm } from "../constants/formTypes";
import ContainerComponent from "../components/shared-components/Container";
import { theme } from "../theme/theme.config";

const Container = styled(ContainerComponent)`
  background: linear-gradient(
    to right,
    ${theme.palette.white} 0%,
    ${theme.palette.white} 50%,
    ${theme.palette.primary}67 50%,
    ${theme.palette.primary}67 100%
  );

  & > div {
    position: relative;

    padding-top: 70px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;

    height: 100vh;
  }

  ${theme.mediaQueries.mobile} {
    background: ${theme.palette.primary}67;
  }
`;

const TitleContainer = styled.div`
  position: relative;

  & h1 {
    position: absolute;
    bottom: 0;
    right: 0;
  }
`;

const LoginForm = styled(LoginFormComponent)`
  width: 40%;

  ${theme.mediaQueries.mobile} {
    width: 100%;
  }
`;

const initialLoginForm: ILoginForm = {
  username: "",
  password: "",
};

const Login: FC = () => {
  const [form, setForm] = useState(initialLoginForm);

  const onSubmit = () => {
    setForm(initialLoginForm);
  };

  const onChangeInput = ({
    currentTarget: { name, value },
  }: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [name]: value });

  return (
    <Container>
      <TitleContainer>
        <h1>Login</h1>
      </TitleContainer>

      <LoginForm
        handleSubmit={onSubmit}
        state={form}
        handleChangeInput={onChangeInput}
      />
    </Container>
  );
};

export default Login;
