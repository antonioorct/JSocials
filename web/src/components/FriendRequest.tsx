import { FC, HTMLAttributes, useEffect, useState } from "react";
import styled from "styled-components";
import Localization from "../constants/Localization";
import { FriendStatus, IUser } from "../constants/models";
import { getFriendStatus } from "../services/friendServices";
import { theme } from "../theme/theme.config";
import Button from "./shared-components/Button";

interface IFriendRequest extends HTMLAttributes<HTMLDivElement> {
  user: IUser;

  onClickRemoveFriend(user: IUser): void;
  onClickSendRequest(user: IUser): void;
  onClickAcceptRequest(user: IUser): void;
  onClickDeclineRequest(user: IUser): void;
  onClickCancelRequest(user: IUser): void;
  onClickSendMessage(user: IUser): void;
}

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${theme.mediaQueries.mobile} {
    flex-direction: row;
    width: 100%;

    & > * {
      flex-basis: 100%;
    }
  }
`;

const FriendRequest: FC<IFriendRequest> = ({
  user,
  onClickSendRequest,
  onClickRemoveFriend,
  onClickAcceptRequest,
  onClickDeclineRequest,
  onClickCancelRequest,
  onClickSendMessage,
}) => {
  const [friendStatus, setFriendStatus] = useState<FriendStatus>("none");

  useEffect(() => {
    (async () => {
      const friendStatus = await getFriendStatus(user);

      setFriendStatus(friendStatus);
    })();
  }, [user]);

  const handleClickSendRequest = async () => {
    await onClickSendRequest(user);

    setFriendStatus("outgoing");
  };

  const handleClickAcceptRequest = async () => {
    await onClickAcceptRequest(user);

    setFriendStatus("friends");
  };
  const handleClickDeclineRequest = async () => {
    await onClickDeclineRequest(user);

    setFriendStatus("none");
  };

  const handleClickCancelRequest = async () => {
    await onClickCancelRequest(user);

    setFriendStatus("none");
  };

  const handleClickRemoveFriend = async () => {
    await onClickRemoveFriend(user);

    setFriendStatus("none");
  };

  return (
    <ButtonContainer>
      {friendStatus === "none" ? (
        <Button
          label={Localization.addFriend}
          color="primary"
          onClick={handleClickSendRequest}
        />
      ) : friendStatus === "incoming" ? (
        <>
          <Button
            label={Localization.acceptRequest}
            color="primary"
            onClick={handleClickAcceptRequest}
          />
          <Button
            label={Localization.declineRequest}
            color="primary"
            onClick={handleClickDeclineRequest}
          />
        </>
      ) : friendStatus === "outgoing" ? (
        <Button
          label={Localization.cancelRequest}
          color="primary"
          onClick={handleClickCancelRequest}
        />
      ) : (
        <>
          <Button
            label={Localization.removeFriend}
            color="primary"
            onClick={handleClickRemoveFriend}
          />
          <Button
            label={Localization.message}
            color="primary"
            onClick={() => onClickSendMessage(user)}
          />
        </>
      )}
    </ButtonContainer>
  );
};

export default FriendRequest;
