import { ChangeEvent, FC, useEffect, useState } from "react";
import styled from "styled-components";
import CredentialsForm from "../components/forms/CredentialsForm";
import ContainerComponent from "../components/shared-components/Container";
import toast from "../components/Toast";
import { ICredentialsForm } from "../constants/formTypes";
import {
  getUserCredentials,
  updateUserCredentials,
} from "../services/userServices";
import handleError from "../utils/errorHandler";

const Container = styled(ContainerComponent)`
  margin-top: 8rem;
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

      toast("Credentials changed successfully!", "success");
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <Container>
      <h1>User settings</h1>

      <CredentialsForm
        handleSubmit={handleSubmit}
        handleChangeInput={handleChangeInput}
        state={form}
      />
    </Container>
  );
};

export default Settings;
