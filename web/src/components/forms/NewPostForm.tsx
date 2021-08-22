import { ChangeEvent } from "react";
import { FormEvent } from "react";
import { FC, FormHTMLAttributes } from "react";
import styled from "styled-components";
import { INewPostForm } from "../../constants/formTypes";
import Localization from "../../constants/Localization";
import { theme } from "../../theme/theme.config";
import Button from "../shared-components/Button";
import { TextArea } from "../shared-components/Input";

interface NewPostFormProps extends FormHTMLAttributes<HTMLFormElement> {
  handleSubmit(): void;
  handleChangeInput(
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ): void;
  state: INewPostForm;
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${theme.mediaQueries.mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FileInput = styled.input`
  ${theme.mediaQueries.mobile} {
    width: 50%;
  }
`;

const NewPostForm: FC<NewPostFormProps> = ({
  handleSubmit,
  handleChangeInput,
  state,
  className,
}: NewPostFormProps) => {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    handleSubmit();
  };

  return (
    <form onSubmit={onSubmit} className={className} encType="multipart/form">
      <TextArea
        value={state.content}
        placeholder={Localization.newPostPlaceholder}
        id="content"
        name="content"
        onChange={handleChangeInput}
      />

      <ButtonContainer>
        <OptionsContainer>
          <FileInput
            type="file"
            accept="image/*"
            id="attachment"
            name="attachment"
            onChange={handleChangeInput}
          />

          <span>
            <input
              type="checkbox"
              checked={state.private}
              id="private"
              name="private"
              onChange={handleChangeInput}
            />
            <label htmlFor="private">{Localization.privatePost}</label>
          </span>
        </OptionsContainer>

        <Button label={Localization.submit} type="submit" color="primary" />
      </ButtonContainer>
    </form>
  );
};

export default NewPostForm;
