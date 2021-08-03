import {
  createGlobalStyle,
  DefaultTheme,
  GlobalStyleComponent,
} from "styled-components";
import { IDefaultTheme, theme } from "./theme.config";

interface ITheme {
  theme: IDefaultTheme;
}

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
`;

export default GlobalStyle;
