import {
  createGlobalStyle,
  css,
  DefaultTheme,
  GlobalStyleComponent,
} from "styled-components";
import { IDefaultTheme, theme } from "./theme.config";

interface ITheme {
  theme: IDefaultTheme;
}

const Tooltip = css`
  .rc-tooltip-inner {
    border-radius: ${theme.components.tooltip.borderRadius};
    min-height: unset;
    max-width: 8rem;

    cursor: default;

    background: ${theme.components.tooltip.background};

    color: ${theme.components.tooltip.color};
    font-weight: ${theme.components.tooltip.fontWeight};
    font-size: 0.8rem;
    line-height: 0.9rem;
    text-align: center;
  }
  .rc-tooltip-placement-top .rc-tooltip-arrow,
  .rc-tooltip-placement-topLeft .rc-tooltip-arrow,
  .rc-tooltip-placement-topRight .rc-tooltip-arrow {
    border-top-color: ${theme.components.tooltip.background};
  }
  .rc-tooltip-placement-left .rc-tooltip-arrow,
  .rc-tooltip-placement-leftTop .rc-tooltip-arrow,
  .rc-tooltip-placement-leftBottom .rc-tooltip-arrow {
    border-left-color: ${theme.components.tooltip.background};
  }
  .rc-tooltip-placement-bottom .rc-tooltip-arrow,
  .rc-tooltip-placement-bottomLeft .rc-tooltip-arrow,
  .rc-tooltip-placement-bottomRight .rc-tooltip-arrow {
    border-bottom-color: ${theme.components.tooltip.background};
  }
  .rc-tooltip-placement-right .rc-tooltip-arrow,
  .rc-tooltip-placement-rightTop .rc-tooltip-arrow,
  .rc-tooltip-placement-rightBottom .rc-tooltip-arrow {
    border-right-color: ${theme.components.tooltip.background};
  }
`;

const GlobalStyle: GlobalStyleComponent<
  ITheme,
  DefaultTheme
> = createGlobalStyle<ITheme>`
  html {
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  body {
    padding: 0;
    margin: 0;

    background-color: ${theme.globalStyling.background};

    color: ${theme.globalStyling.color};
    font-family: ${theme.globalStyling.fontFamily};
    font-size: ${theme.globalStyling.fontSize};
  }

  h1, h2,
  h3, h4,
  h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: normal;
  }

  h1 {
    font-size: 4rem;

    ${theme.mediaQueries.mobile}{ 
      font-size: 3rem;
    }
  }

  h2 {
    margin: 1rem 0;
    font-size: 2.5rem;
  }

  p, input, button,
  textarea {
    font-family: ${theme.fonts.default};
  }

  @font-face {
    font-family: "Open sans";
    src: url("/fonts/OpenSans-Regular.ttf") format("truetype");
  }

  @font-face {
    font-family: "Patua one";
    src: url("/fonts/PatuaOne-Regular.otf") format("opentype");
  }

  ${Tooltip}
`;

export default GlobalStyle;
