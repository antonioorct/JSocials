import { FC, FormEvent, FormHTMLAttributes, useState, MouseEvent } from "react";
import styled from "styled-components";
import Localization from "../../constants/Localization";
import { theme } from "../../theme/theme.config";
import Anchor from "../shared-components/Anchor";
import Button from "../shared-components/Button";
import Input from "../shared-components/Input";

interface UserSearchFromProps extends FormHTMLAttributes<HTMLFormElement> {
  handleSubmit(searchQuery: string): void;
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
}

const Container = styled.form<{
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
}>`
  display: flex;

  ${(props) => props.hideOnDesktop && "display: none;"}
  margin-left: 2rem;

  & input {
    margin: 0;
    padding: 0;
    height: calc(100% - 3px);
  }

  & button {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;

    ${theme.mediaQueries.tablet} {
      display: none;
    }
  }

  ${theme.mediaQueries.mobile} {
    ${(props) => props.hideOnMobile && "display: none"};
    ${(props) => props.hideOnDesktop && "display: flex"};

    & button {
      display: block;
    }
  }
`;

const UserSearchForm: FC<UserSearchFromProps> = ({
  handleSubmit,
  hideOnMobile,
  hideOnDesktop,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSubmitSearch = (e: FormEvent) => {
    e.preventDefault();

    handleSubmit(searchValue);
  };

  const handleChangeInput = ({
    currentTarget: { value },
  }: MouseEvent<HTMLInputElement>) => setSearchValue(value);

  return (
    <Container
      onSubmit={handleSubmitSearch}
      hideOnMobile={hideOnMobile}
      hideOnDesktop={hideOnDesktop}
    >
      <Input
        value={searchValue}
        name="searchValue"
        onChange={handleChangeInput}
        placeholder={Localization.userSearchPlaceholder}
      />

      {searchValue === "" ? (
        <Button label={Localization.search} color="primary" />
      ) : (
        <Anchor to={`/search/${searchValue}`}>
          <Button label={Localization.search} color="primary" />
        </Anchor>
      )}
    </Container>
  );
};

export default UserSearchForm;
