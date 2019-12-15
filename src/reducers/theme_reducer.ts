import { Action } from ".";

export const DEFAULT_THEME = Symbol(),
  DARK_THEME = Symbol();

export type MyTheme = {
  backgroundColor: string;
  navColor: string;
  color: string;
};
export type ThemeData = {
  theme: MyTheme;
  isDark: boolean;
};

const defaultTheme: MyTheme = {
  backgroundColor: "#eee",
  navColor: "#D6D6D6",
  color: "black"
};

const darkTheme = {
  backgroundColor: "#1a1a1a",
  navColor: "#282828",
  color: "#eee"
};

const initTheme: ThemeData = {
  theme: defaultTheme,
  isDark: false
};

const ThemeReducer = (state: ThemeData = initTheme, { type }: Action) => {
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
