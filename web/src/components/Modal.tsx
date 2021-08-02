import { ComponentType, FC, MouseEvent } from "react";
import styled from "styled-components";
import { theme } from "../theme/theme.config";

interface ModalComponentProps {
  onClickConfirm?(): void;
  onClickCancel?(): void;
}

interface ModalProps extends ModalComponentProps {
  component: ComponentType<any>;

  show: boolean;
  [prop: string]: any;
}

const Container = styled.div`
  position: fixed;

  overflow: auto;

  width: 100vw;
  height: 100vh;
  padding: 5rem;
  box-sizing: border-box;
  margin: auto;

  background-color: #000000af;
  animation: 0.15s fade-in linear;

  ${theme.mediaQueries.mobile} {
    padding: 5rem 2rem 2rem;
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Modal: FC<ModalProps> = ({
  component: Component,
  onClickConfirm,
  onClickCancel,
  show,
  ...props
}: ModalProps) => {
  const handleClickBackground = (e: MouseEvent) => {
    if (e.currentTarget !== e.target) return;

    onClickCancel && onClickCancel();
  };

  return show ? (
    <Container onClick={handleClickBackground}>
      <Component
        onClickConfirm={onClickConfirm}
        onClickCancel={onClickCancel}
        {...props}
      />
    </Container>
  ) : null;
};

export default Modal;
