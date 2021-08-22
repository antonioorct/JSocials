import { FC, useRef, ChangeEvent } from "react";
import styled, { css } from "styled-components";
import { getAssetUrl } from "../constants/apiRoutes";
import { IUser } from "../constants/models";
import CameraIcon from "../img/icons/CameraIcon";
import CrossIcon from "../img/icons/CrossIcon";
import DefaultProfilePhoto from "../img/DefaultProfilePhoto";
import { theme } from "../theme/theme.config";

interface ProfilePhotoProps {
  user: IUser;
  big?: boolean;

  onClickRemovePhoto?(): void;
  onClickChangePhoto?(photo: File): void;
}

const FileInput = styled.input`
  display: none;
`;

const Container = styled.div<{ big?: boolean; editable: boolean }>`
  position: relative;

  border-radius: 50%;
  width: ${(props) => (props.big ? "20rem" : "3rem")};
  height: ${(props) => (props.big ? "20rem" : "3rem")};

  & img,
  & svg {
    width: 100%;
    max-height: ${(props) => (props.big ? "20rem" : "3rem")};
  }

  ${(props) =>
    props.editable &&
    css`
      overflow: hidden;

      transition: filter 0.15s linear;

      cursor: pointer;

      & img {
        transition: transform 0.15s linear;
      }

      &:hover {
        & > div {
          opacity: 1;

          pointer-events: all;
        }

        & img {
          transform: scale(1.1);
        }
      }
    `}
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;

  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  width: 100%;
  height: 100%;

  transition: opacity 0.15s linear;

  background-color: ${theme.palette.darkGray}a7;

  pointer-events: none;

  & svg:hover {
    fill: ${theme.palette.darkWhite};

    transform: scale(1.05);
  }
`;

const ProfilePhoto: FC<ProfilePhotoProps> = ({
  user,
  big,
  onClickChangePhoto,
  onClickRemovePhoto,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangePhoto = () => inputRef.current?.click();

  const handleSelectFile = ({
    currentTarget: { files },
  }: ChangeEvent<HTMLInputElement>) =>
    files && onClickChangePhoto && onClickChangePhoto(files[0]);

  const handleRemovePhoto = () => onClickRemovePhoto && onClickRemovePhoto();

  const editable =
    onClickRemovePhoto !== undefined && onClickChangePhoto !== undefined;

  return (
    <>
      {editable && (
        <FileInput ref={inputRef} type="file" onChange={handleSelectFile} />
      )}

      <Container big={big} editable={editable}>
        {editable && (
          <Background>
            <CameraIcon onClick={handleChangePhoto} />
            {user.image && <CrossIcon onClick={handleRemovePhoto} />}
          </Background>
        )}

        {user.image ? (
          <img src={getAssetUrl(user.image)} alt="" />
        ) : (
          <DefaultProfilePhoto />
        )}
      </Container>
    </>
  );
};

export default ProfilePhoto;
