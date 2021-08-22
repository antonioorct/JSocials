import { FC } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/shared-components/Button";
import localization from "../constants/Localization";
import NotFoundGraphic from "../img/graphics/NotFound";
import { theme } from "../theme/theme.config";

const Container = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  display: flex;

  height: 100vh;

  & h1 {
    margin-bottom: 0;
  }

  ${theme.mediaQueries.mobile} {
    height: ${window.innerHeight}px;
    text-align: center;

    & svg {
      width: 100%;
      height: fit-content;
    }
  }
`;

const NotFound: FC = () => {
  const history = useHistory();

  const handleClickReturn = () => history.goBack();

  return (
    <Container>
      <h1>{localization.pageNotFound}</h1>

      <Button
        label={localization.return}
        color="primary"
        onClick={handleClickReturn}
      />

      <NotFoundGraphic />
    </Container>
  );
};

export default NotFound;
