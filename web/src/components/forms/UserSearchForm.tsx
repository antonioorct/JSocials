import { FC, FormEvent, FormHTMLAttributes, useState, MouseEvent } from "react";
import styled from "styled-components";
import Localization from "../../constants/Localization";
import MagnifyingGlass from "../../img/icons/MagnifyingGlass";
import { theme } from "../../theme/theme.config";
import Anchor from "../shared-components/Anchor";
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

  & input {
    margin: 0;
    padding: 0;
    height: calc(100% - 3px);
  }

  & a {
    display: contents;
  }

  & svg {
    vertical-align: middle;
    padding: 0.3rem 0.8rem;
    border-radius: 0 0.3rem 0.3rem 0;

    cursor: pointer;

    background-color: ${theme.palette.primary};

    ${theme.mediaQueries.tablet} {
      display: none;
    }
  }

  ${theme.mediaQueries.mobile} {
    ${(props) => props.hideOnMobile && "display: none"};
    ${(props) => props.hideOnDesktop && "display: flex"};

    width: 50%;

    & svg {
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
        <MagnifyingGlass />
      ) : (
        // <Button label={Localization.search} color="primary" />
        <Anchor to={`/search/${searchValue}`}>
          <MagnifyingGlass />
          {/* <Button label={Localization.search} color="primary" /> */}
        </Anchor>
      )}
    </Container>
  );
};

export default UserSearchForm;
