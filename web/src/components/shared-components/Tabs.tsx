import {
  Children,
  FC,
  HTMLAttributes,
  isValidElement,
  MouseEvent,
  ReactNode,
  useState,
} from "react";
import styled from "styled-components";
import { theme } from "../../theme/theme.config";
import Card from "./Card";
import Container from "./Container";

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  activeKey?: string;
  defaultActiveKey?: string;

  onChangeTab?(newActiveKey: string): void;
}

interface TabProps extends HTMLAttributes<HTMLDivElement> {
  eventkey: string;
}

const getDefaultActiveKey = (
  children: ReactNode,
  defaultActiveKey: string | undefined
): string | undefined => {
  Children.forEach(children, (child: ReactNode) => {
    if (!isValidElement(child)) return;
    if (!defaultActiveKey) defaultActiveKey = child.props.eventkey;
  });

  return defaultActiveKey;
};

const SideTabContainer = styled(Container)`
  & > div {
    display: flex;
  }

  ${theme.mediaQueries.mobile} {
    & > div {
      flex-direction: column;
      width: 100%;
    }
  }
`;

const SideTabHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  width: 15%;
  padding-right: 3rem;
  border-right: 1px solid ${theme.palette.darkGray};

  text-align: center;

  ${theme.mediaQueries.mobile} {
    flex-direction: row;
    gap: 0.5rem;

    overflow: auto;

    width: unset;
    border-right: none;
    padding: 1rem 0;
    margin-bottom: 1rem;
  }
`;

const SideTabContent = styled.div`
  padding: 0 3rem;
  width: 100%;

  ${theme.mediaQueries.mobile} {
    padding: 0;
    width: 85%;
    margin: 0 auto;
  }
`;

const Tabs: FC<TabsProps> = ({
  activeKey: userActiveKey,
  onChangeTab,
  children,
  defaultActiveKey,
}: TabsProps) => {
  const [activeKey, setActiveKey] = useState(
    getDefaultActiveKey(children, defaultActiveKey)
  );

  const handleClickTabButton = (child: ReactNode) => {
    if (isValidElement(child)) {
      if (onChangeTab) onChangeTab(child.props.eventkey);

      if (!userActiveKey) setActiveKey(child.props.eventkey);
    }
  };

  const renderTabCards = () =>
    Children.map(
      children,
      (child: ReactNode) =>
        isValidElement(child) && (
          <Card
            active={child.props.eventkey === (userActiveKey || activeKey)}
            onClick={(e: MouseEvent) => {
              e.currentTarget.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "start",
              });

              handleClickTabButton(child);
            }}
          >
            <h2>{child.props.eventkey}</h2>
          </Card>
        )
    );

  const renderTabContent = () =>
    Children.map(children, (child: ReactNode) => {
      if (
        !isValidElement(child) ||
        (userActiveKey || activeKey) !== child.props.eventkey
      )
        return;

      return <SideTabContent {...child.props} />;
    });

  return (
    <SideTabContainer>
      <SideTabHeader>{renderTabCards()}</SideTabHeader>

      {renderTabContent()}
    </SideTabContainer>
  );
};

export const Tab: FC<TabProps> = (props: TabProps) => {
  return <Card {...props} />;
};

export default Tabs;
