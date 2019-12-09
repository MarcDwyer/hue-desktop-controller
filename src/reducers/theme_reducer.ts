import { Action } from ".";

export const DEFAULT_THEME = Symbol(),
  DARK_THEME = Symbol();

type MyTheme = {
  backgroundColor: string;
  navColor: string;
};
export type ThemeData = {
  theme: MyTheme;
  isDark: boolean;
};
const defaultTheme = {
  backgroundColor: "inherit",
  navColor: "black"
};

const darkTheme = {
  backgroundColor: "black",
  navColor: "#2B2C2D"
};

const ThemeReducer = (
  state: ThemeData = { theme: defaultTheme, isDark: false },
  { type }: Action
) => {
  switch (type) {
    case DEFAULT_THEME:
      return { theme: defaultTheme, isDark: false };
    case DARK_THEME:
      return { theme: darkTheme, isDark: true };
    default:
      return state;
  }
};

export default ThemeReducer;
