import { ChangeEvent, FC, FormEvent, HTMLAttributes, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import localization, { Language, LANGUAGES } from "../constants/Localization";
import LocalStorage from "../utils/LocalStorage";
import ButtonComponent from "./shared-components/Button";
import { Select } from "./shared-components/Input";

const Container = styled.form`
  gap: 1.5rem;
  flex-direction: column;

  display: flex;

  padding-top: 27px;
`;

const Button = styled(ButtonComponent)`
  align-self: flex-start;
`;

const LanguageSelect: FC<HTMLAttributes<HTMLDivElement>> = ({ className }) => {
  const [language, setLanguage] = useState<Language>(
    LocalStorage.getLanguageToken()
  );

  const history = useHistory();

  const handleChangeInput = ({
    currentTarget: { value },
  }: ChangeEvent<HTMLInputElement>) => setLanguage(value as Language);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    LocalStorage.setLanguageToken(language);

    history.go(0);
  };

  return (
    <Container onSubmit={handleSubmit} className={className}>
      <Select onChange={handleChangeInput} value={language}>
        {Object.keys(LANGUAGES).map((lang, index) => (
          <option value={lang} key={index}>
            {LANGUAGES[lang as keyof typeof LANGUAGES]}
          </option>
        ))}
      </Select>

      <Button label={localization.save} color="primary" />
    </Container>
  );
};

export default LanguageSelect;
