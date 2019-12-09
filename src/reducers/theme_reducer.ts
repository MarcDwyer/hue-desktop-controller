import { Action } from ".";

export const DEFAULT_THEME = Symbol(),
  DARK_THEME = Symbol();

export type MyTheme = {
  backgroundColor: string;
};
const initTheme: MyTheme = {
  backgroundColor: "inherit"
};
const ThemeReducer = (state = initTheme, { type, payload }: Action) => {
  switch (type) {
    case DEFAULT_THEME:
      return { backgroundColor: "inherit" };
    case DARK_THEME:
      return { backgroundColor: "black" };
    default:
      return state;
  }
};

export default ThemeReducer;
