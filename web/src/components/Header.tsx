import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import routes from "../constants/routes";
import { theme } from "../theme/theme.config";
import LocalStorage from "../utils/LocalStorage";
import Anchor from "./shared-components/Anchor";
import Badge from "./shared-components/Badge";
import Button from "./shared-components/Button";
import ContainerComponent from "./shared-components/Container";

interface HeaderProps {
  transparent?: boolean;
}

const Container = styled(ContainerComponent)<{
  $hide: boolean;
  $topOfPage: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;

  ${(p) => p.$hide && "transform: translateY(-5.1rem)"};

  transition: transform 0.4s ease, background-color 0.1s linear,
    height 1s linear, box-shadow 0.4s ease;

  ${(p) => !p.$topOfPage && `background-color: ${theme.palette.white}`};
  ${(props) =>
    !props.$hide &&
    !props.$topOfPage &&
    "box-shadow: 0 0.5rem 2rem 0 rgb(0 0 0 / 10%)"};

  ${theme.mediaQueries.mobile} {
    & > div {
      width: 90%;
    }
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1rem 0;

  & input[type="checkbox"] {
    display: none;
  }

  ${theme.mediaQueries.mobile} {
    & input[type="checkbox"]:checked ~ div {
      height: ${window.innerHeight}px;
      pointer-events: all;

      transform: translateX(0);
    }

    & input[type="checkbox"]:checked ~ label {
      & div {
        background: ${theme.palette.white};
        &:first-child {
          transform: rotate(45deg);
        }

        &:nth-child(2) {
          width: 0;
        }

        &:nth-child(3) {
          transform: rotate(-45deg);
        }
      }
    }

    & input[type="checkbox"]:checked + div label {
      & div {
        &:first-child {
          transform: rotate(45deg);
        }

        &:nth-child(2) {
          width: 0;
        }

        &:nth-child(3) {
          transform: rotate(-45deg);
        }
      }
    }

    & input[type="checkbox"]:not(:checked) + div {
      transition: height 0.7s ease-out;
      height: 0;
    }
  }
`;

const MobileBackground = styled.div<{ $topOfPage: boolean }>`
  display: none;

  ${theme.mediaQueries.mobile} {
    display: block;
    z-index: 50000;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: ${window.innerHeight}px;

    transition: height 0.7s ease-out;

    background: ${theme.palette.primary};
    overflow: hidden;
  }
`;

const Burger = styled.label<{ $topOfPage: boolean }>`
  display: none;

  ${theme.mediaQueries.mobile} {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 2rem;
    height: 1.5rem;
    background: transparent;
    cursor: pointer;

    div {
      width: 1.55rem;
      height: 0.16rem;
      background: ${(props) =>
        props.$topOfPage ? theme.palette.white : theme.palette.primary};
      border-radius: 0.7rem;
      transition: transform 0.3s linear, width 0.3s linear;
      transform-origin: 1px;
    }
  }
`;

const MobileBurger = styled(Burger)`
  & div {
    background: ${theme.palette.white};
  }
`;

const LinkBar = styled.div<{ $topOfPage: boolean }>`
  display: flex;
  align-items: center;
  gap: 2.25rem;

  & a {
    transition: color 0.1s linear 0.1s;

    ${(p) => p.$topOfPage && `color: ${theme.palette.white}`};
  }

  & a:hover {
    ${(p) => p.$topOfPage && `color: ${theme.palette.white}`};
  }

  & a::after {
    ${(p) => p.$topOfPage && `background-color: ${theme.palette.white}`};
  }

  ${theme.mediaQueries.mobile} {
    z-index: 50001;
    pointer-events: none;
    position: fixed;
    top: 7rem;
    left: 2rem;
    flex-direction: column;
    align-items: start;
    gap: 1rem;

    transition: 0.15s linear transform 0.1s;
    transform: translateX(-100vw);

    width: 75vw;
    height: 80vh;
    box-sizing: border-box;

    & button {
      font-size: 1.2rem;
      margin-top: 1.5rem;
      background: none !important;
      padding: 0;
    }

    & a,
    & > div {
      font-size: 2rem;
      background: none;
      color: ${theme.palette.white};
    }
    & a:hover {
      color: ${theme.palette.white};
    }
    & a::after {
      background-color: ${theme.palette.white};
    }
  }
`;

const ExpandedMobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1rem 0;
  margin: 0 auto;
  width: 90%;
`;

const ExpandedMobileAnchor = styled(Anchor)`
  color: ${theme.palette.white};

  &:hover {
    color: ${theme.palette.white};
  }
`;

const Header: FC<HeaderProps> = ({ transparent }: HeaderProps) => {
  const [hide, setHide] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [topOfPage, setTopOfPage] = useState(
    transparent ? window.scrollY === 0 : false
  );

  const history = useHistory();

  const handleScroll = useCallback(() => {
    // Remove bg from header if scroll is on top of page
    // And transparent prop is set to true
    if (transparent) {
      if (window.scrollY === 0) setTopOfPage(true);
      else if (window.scrollY > 0) setTopOfPage(false);
    }

    // Hide the header if the scroll direction is down
    if (lastScrollY < window.scrollY && window.scrollY > 80) setHide(true);
    else if (lastScrollY > window.scrollY) setHide(false);

    setLastScrollY(window.scrollY);
  }, [lastScrollY, transparent]);

  useEffect(() => {
    setLastScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleClickLogout = () => {
    LocalStorage.removeUserToken();

    history.push(routes.login.href);
  };

  return (
    <Container $hide={hide} $topOfPage={topOfPage}>
      <HeaderContainer>
        <Anchor to="/" label="JSocials" />

        <input
          type="checkbox"
          id="header-toggle"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            e.currentTarget.checked
              ? window.removeEventListener("scroll", handleScroll)
              : window.addEventListener("scroll", handleScroll)
          }
        />

        <MobileBackground $topOfPage={topOfPage}>
          <ExpandedMobileHeader>
            <ExpandedMobileAnchor to="/" label="JSocials" />

            <MobileBurger htmlFor="header-toggle" $topOfPage={topOfPage}>
              <div />
              <div />
              <div />
            </MobileBurger>
          </ExpandedMobileHeader>
        </MobileBackground>

        <LinkBar $topOfPage={topOfPage}>
          <Anchor to="/messenger" label="Messenger" underline />
          <Anchor to="/friends" label="Friends" underline />
          <Badge content="2">
            <Anchor to="/friend-requests" label="Friend Requests" underline />
          </Badge>
          <Anchor to="/profile" label="Profile" underline />
          <Button label="Log out" color="primary" onClick={handleClickLogout} />
        </LinkBar>

        <Burger htmlFor="header-toggle" $topOfPage={topOfPage}>
          <div />
          <div />
          <div />
        </Burger>
      </HeaderContainer>
    </Container>
  );
};

export default Header;
