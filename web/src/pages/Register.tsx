import { ChangeEvent, FC, useState } from "react";
import styled from "styled-components";
import RegisterFormComponent from "../components/forms/RegisterForm";
import { IRegisterForm } from "../constants/formTypes";
import ContainerComponent from "../components/shared-components/Container";
import { theme } from "../theme/theme.config";
import { createUser } from "../services/userServices";
import toast from "../components/Toast";
import handleError from "../utils/errorHandler";
import Localization from "../constants/Localization";

const Container = styled(ContainerComponent)`
  background: linear-gradient(
    to right,
    ${theme.palette.primary}67 0%,
    ${theme.palette.primary}67 50%,
    ${theme.palette.white} 50%,
    ${theme.palette.white} 100%
  );

  & > div {
    position: relative;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    display: flex;

    height: 100vh;
  }

  ${theme.mediaQueries.mobile} {
    min-height: 100vh;

    background: ${theme.palette.primary}67;

    & > div {
      padding-bottom: 3rem;
      height: 100%;
    }
  }
`;

const TitleContainer = styled.div`
  position: relative;

  & h1 {
    position: absolute;
    bottom: 0;
    left: 0;

    ${theme.mediaQueries.mobile} {
      position: relative;
    }
  }
`;

const RegisterForm = styled(RegisterFormComponent)`
  width: 40%;

  ${theme.mediaQueries.mobile} {
    width: 100%;
  }
`;

const initialRegisterForm: IRegisterForm = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  repeatPassword: "",
};

const Register: FC = () => {
  const [form, setForm] = useState(initialRegisterForm);

  const onSubmit = async () => {
    try {
      await createUser(form);

      toast(Localization.registrationSuccess, "success");
      setForm(initialRegisterForm);
    } catch (err) {
      handleError(err);
    }
  };

  const onChangeInput = ({
    currentTarget: { name, value },
  }: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [name]: value });

  return (
    <Container>
      <TitleContainer>
        <h1>{Localization.register}</h1>
      </TitleContainer>

      <RegisterForm
        handleSubmit={onSubmit}
        state={form}
        handleChangeInput={onChangeInput}
      />
    </Container>
  );
};

export default Register;
