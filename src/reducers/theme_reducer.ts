import { Action } from ".";

export const UPDATE_THEME = Symbol();

export type MyTheme = {
  backgroundColor: string;
};
const initTheme: MyTheme = {
  backgroundColor: "black"
};
const ThemeReducer = (state = initTheme, { type, payload }: Action) => {
  switch (type) {
    case UPDATE_THEME:
      return payload;
    default:
      return state;
  }
};

export default ThemeReducer;
