import { ChangeEvent, FC, useState } from "react";
import styled from "styled-components";
import LoginFormComponent from "../components/forms/LoginForm";
import { ILoginForm } from "../constants/formTypes";
import ContainerComponent from "../components/shared-components/Container";
import { theme } from "../theme/theme.config";
import LocalStorage from "../utils/LocalStorage";
import { sendLoginInfo } from "../services/authServices";
import { useHistory } from "react-router-dom";
import handleError from "../utils/errorHandler";
import routes from "../constants/routes";
import localization from "../constants/Localization";
import toast from "../components/Toast";
import LanguageSelectComponent from "../components/LanguageSelect";

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
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;

    display: flex;

    height: 100vh;
  }

  ${theme.mediaQueries.mobile} {
    background: ${theme.palette.primary}67;

    & > div {
      height: ${window.innerHeight}px;
    }
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

const LanguageSelect = styled(LanguageSelectComponent)`
  position: absolute;
  right: 1rem;
  top: 1rem;
  flex-direction: row;
  gap: 0;

  z-index: 10;

  width: fit-content;
  padding: 0;

  & select {
    height: 100%;
    margin: 0;
    padding-bottom: 0.2rem;
  }

  & > button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

const initialLoginForm: ILoginForm = {
  username: "",
  password: "",
};

const Login: FC = () => {
  const [form, setForm] = useState(initialLoginForm);

  const history = useHistory();

  const onSubmit = async () => {
    try {
      const token = await sendLoginInfo(form);

      LocalStorage.setUserToken(token);

      history.push(routes.home.href);
    } catch (err) {
      if (err.response.status === 400)
        toast(localization.invalidCredentials, "error");
      else handleError(err);
    }
  };

  const onChangeInput = ({
    currentTarget: { name, value },
  }: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [name]: value });

  return (
    <>
      <LanguageSelect />
      <Container>
        <TitleContainer>
          <h1>{localization.login}</h1>
        </TitleContainer>

        <LoginForm
          handleSubmit={onSubmit}
          state={form}
          handleChangeInput={onChangeInput}
        />
      </Container>
    </>
  );
};

export default Login;
