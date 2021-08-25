import { ChangeEvent, FC, useEffect, useState } from "react";
import styled from "styled-components";
import CredentialsForm from "../components/forms/CredentialsForm";
import LanguageSelect from "../components/LanguageSelect";
import ContainerComponent from "../components/shared-components/Container";
import toast from "../components/Toast";
import { ICredentialsForm } from "../constants/formTypes";
import localization from "../constants/Localization";
import {
  getUserCredentials,
  updateUserCredentials,
} from "../services/userServices";
import { theme } from "../theme/theme.config";
import handleError from "../utils/errorHandler";

const Container = styled(ContainerComponent)`
  margin-top: 8rem;

  & > div {
    gap: 20%;

    display: flex;

    ${theme.mediaQueries.mobile} {
      gap: none;
      flex-direction: column;
    }
  }

  ${theme.mediaQueries.mobile} {
    margin: 5rem 0 4rem;
  }
`;

const initialCredentialsForm: ICredentialsForm = {
  username: "",
  email: "",
  password: "",
  repeatPassword: "",
};

const Settings: FC = () => {
  const [form, setForm] = useState(initialCredentialsForm);

  useEffect(() => {
    (async () => {
      const credentials = await getUserCredentials();

      setForm(credentials);
    })();
  }, []);

  const handleChangeInput = ({
    currentTarget: { name, value },
  }: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [name]: value });

  const handleSubmit = async () => {
    try {
      await updateUserCredentials(form);

      toast(localization.credentialsSuccess, "success");
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <Container>
      <div>
        <h1>{localization.userSettings}</h1>

        <CredentialsForm
          handleSubmit={handleSubmit}
          handleChangeInput={handleChangeInput}
          state={form}
        />
      </div>

      <div>
        <h1>{localization.language}</h1>
        <LanguageSelect />
      </div>
    </Container>
  );
};

export default Settings;
