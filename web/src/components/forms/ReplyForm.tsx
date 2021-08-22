import { ChangeEvent } from "react";
import { FormEvent } from "react";
import { FC, FormHTMLAttributes } from "react";
import styled from "styled-components";
import Localization from "../../constants/Localization";
import { theme } from "../../theme/theme.config";
import Button from "../shared-components/Button";
import InputComponent from "../shared-components/Input";

interface ReplyFormProps extends FormHTMLAttributes<HTMLFormElement> {
  handleSubmit(): void;
  handleChangeInput(value: string): void;
  state: string;
}

const Container = styled.form`
  display: flex;
  gap: 1rem;
  align-items: flex-end;

  ${theme.mediaQueries.mobile} {
    width: 100%;
  }
`;

const Input = styled(InputComponent)`
  margin-bottom: 0;
`;

const ReplyForm: FC<ReplyFormProps> = ({
  handleSubmit,
  handleChangeInput,
  state,
  className,
}: ReplyFormProps) => {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    handleSubmit();
  };

  const onInputChange = ({
    currentTarget: { value },
  }: ChangeEvent<HTMLInputElement>) => handleChangeInput(value);

  return (
    <Container onSubmit={onSubmit} className={className}>
      <Input
        value={state}
        placeholder={Localization.replyPlaceholder}
        id="state"
        name="state"
        onChange={onInputChange}
      />

      <Button label={Localization.submit} type="submit" color="primary" />
    </Container>
  );
};

export default ReplyForm;
