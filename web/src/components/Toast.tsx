import { FC, PropsWithChildren, ReactText } from "react";
import {
  toast as toastFunction,
  TypeOptions,
  ToastContainer as DefaultToastContainer,
  ToastContainerProps,
  Flip,
} from "react-toastify";
import styled, { css } from "styled-components";
import ErrorIcon from "../img/icons/toast/ErrorIcon";
import InfoIcon from "../img/icons/toast/InfoIcon";
import SuccessIcon from "../img/icons/toast/SuccessIcon";
import { IPalette, theme } from "../theme/theme.config";

const COLORS_MAPPING = {
  primary: "default",
  info: "info",
  success: "success",
  warning: "warning",
  danger: "error",
};

const Container = styled.div`
  position: relative;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.2rem;

  display: flex;

  & h2 {
    font-size: 1.5rem;
    margin: 0 0 0.3rem;
  }

  & h3 {
    margin: 0 0 0.1rem;

    font-family: ${theme.globalStyling.fontFamily};
    font-weight: bold;
  }

  & span {
    font-family: ${theme.globalStyling.fontFamily};
    font-size: 0.9rem;
  }

  & svg {
    flex-shrink: 0;

    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.6rem;
  }
`;

const Background = styled.div<{ type: keyof IPalette }>`
  position: absolute;
  left: 0;
  top: 0;

  width: 100%;
  height: 100%;

  background: ${(props) => theme.palette[props.type]};
  opacity: 0.18;
`;

const toast = (text: string, type: TypeOptions = "default"): void => {
  switch (type) {
    case "default":
      toastFunction(
        <>
          <Background type="primary" />
          <Container>
            <div>
              <span>{text}</span>
            </div>
          </Container>
        </>
      );
      break;
    case "error":
      toastFunction.error(
        <>
          <Background type="danger" />
          <Container>
            <ErrorIcon />
            <div>
              <h3>Error!</h3>
              <span>{text}</span>
            </div>
          </Container>
        </>
      );
      break;
    case "info":
      toastFunction.info(
        <>
          <Background type="info" />
          <Container>
            <InfoIcon />
            <div>
              <h3>Info</h3>
              <span>{text}</span>
            </div>
          </Container>
        </>
      );
      break;
    case "success":
      toastFunction.success(
        <>
          <Background type="success" />
          <Container>
            <SuccessIcon />
            <div>
              <span>{text}</span>
            </div>
          </Container>
        </>
      );
      break;
  }
};

interface INotification {
  onClick?(): void;
  title?: string;
  subTitle?: string;
  content?: string;
}

export const notification = ({
  onClick,
  title,
  subTitle,
  content,
}: INotification): ReactText =>
  toastFunction(
    <>
      <Background type="darkWhite" />
      <Container onClick={onClick}>
        <div>
          {title && <h2>{title}</h2>}
          {subTitle && <h3>{subTitle}</h3>}
          {content && <span>{content}</span>}
        </div>
      </Container>
    </>,
    {
      autoClose: 2800,
      transition: Flip,
    }
  );

const StyledToast = styled(DefaultToastContainer)`
  .Toastify__toast {
    border-radius: 0.5rem;
    background: ${theme.palette.white};
    overflow-wrap: anywhere;
  }

  ${Object.keys(COLORS_MAPPING).map(
    (key: string) =>
      css`
        .Toastify__toast--${COLORS_MAPPING[
            key as keyof typeof COLORS_MAPPING
          ]} {
          border: 1px solid ${theme.palette[key as keyof IPalette]};

          color: ${theme.palette[key as keyof IPalette]};

          .Toastify__progress-bar {
            background: ${theme.palette[key as keyof IPalette]};
          }

          .Toastify__close-button {
            color: ${theme.palette[key as keyof IPalette]};
          }
        }
      `
  )}
`;

export const ToastContainer: FC<PropsWithChildren<ToastContainerProps>> = (
  props
) => <StyledToast {...props} />;

export default toast;
