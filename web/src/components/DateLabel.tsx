import { FC, HTMLAttributes } from "react";
import styled from "styled-components";
import { format } from "timeago.js";
import { theme } from "../theme/theme.config";
import LocalStorage from "../utils/LocalStorage";

interface IDateLabel extends HTMLAttributes<HTMLDivElement> {
  date: string;
}

const Label = styled.div`
  font-size: 0.8rem;
  color: ${theme.palette.darkGray};
`;

const DateLabel: FC<IDateLabel> = ({ date, className }) => {
  return (
    <Label title={new Date(date).toLocaleString()} className={className}>
      {format(date, LocalStorage.getLanguageToken())}
    </Label>
  );
};

export default DateLabel;
