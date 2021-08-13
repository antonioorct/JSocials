interface IStyling {
  color?: string;
  background?: string;
  hover?: string;
  backgroundHover?: string;

  boxShadow?: string;

  opacity?: string;

  borderRadius?: string;
  borderColor?: string;

  fontWeight?: string | number;
}

interface IComponents {
  button: {
    primary: IStyling;
    secondary: IStyling;
    link: IStyling;
  };
  anchor: IStyling;
  tooltip: IStyling;
}

interface IFonts {
  default: string;
  heading: string;
}

export interface IPalette {
  primary: string;
  secondary: string;

  success: string;
  danger: string;
  info: string;
  warning: string;

  white: string;
  darkWhite: string;
  lightGray: string;
  darkGray: string;
  lightBlack: string;
  black: string;
}

interface IGlobalStyling {
  color: string;
  background: string;

  fontFamily: string;
  fontSize: string;
}

interface MediaQueries {
  mobile: string;
  tablet: string;
  desktop: string;
}

interface IMediaQueriesPixels {
  mobile: number;
  tablet: number;
  desktop: number;
}

export const mediaQueries: IMediaQueriesPixels = {
  mobile: 768,
  tablet: 1024,
  desktop: 1366,
};

export interface IDefaultTheme {
  mediaQueries: MediaQueries;
  globalStyling: IGlobalStyling;

  palette: IPalette;

  fonts: IFonts;

  components: IComponents;
}

const colors: IPalette = {
  primary: "#307fe2",
  secondary: "black",

  success: "#28a745",
  danger: "#dc3545",
  info: "#17a2b8",
  warning: "#ffc107",

  white: "#fff",
  darkWhite: "#ededed",
  lightGray: "#bbb",
  darkGray: "#999",
  lightBlack: "#333",
  black: "#000",
};

const fonts: IFonts = {
  default: "Open sans",
  heading: "Patua one",
};

export const theme: IDefaultTheme = {
  mediaQueries: {
    mobile: `@media (max-width: ${mediaQueries.mobile}px)`,
    tablet: `@media (max-width: ${mediaQueries.tablet}px)`,
    desktop: `@media (max-width: ${mediaQueries.desktop}px)`,
  },

  palette: colors,

  globalStyling: {
    color: colors.black,
    background: colors.darkWhite,

    fontFamily: "Open sans",
    fontSize: "16px",
  },

  fonts,

  components: {
    button: {
      primary: {
        color: colors.white,
        background: colors.primary,
        backgroundHover: "#309be2",
        boxShadow: "none",
        borderRadius: "0.3rem",
        fontWeight: "bold",
      },
      secondary: {
        color: colors.white,
        background: colors.secondary,
        backgroundHover: colors.lightBlack,
        boxShadow: "1px 2px 8px gray",
        borderRadius: "0.3rem",
        fontWeight: "bold",
      },
      link: {
        background: "transparent",
        color: colors.black,
        fontWeight: "bold",
        hover: colors.lightBlack,
      },
    },
    anchor: {
      color: colors.black,
      hover: "#333",
      fontWeight: "bold",
    },
    tooltip: {
      color: colors.white,
      background: colors.lightGray,
      borderRadius: "0.35rem",
      fontWeight: "bold",
    },
  },
};
