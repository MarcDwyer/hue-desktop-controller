import { DARK_THEME, DEFAULT_THEME } from "../reducers/theme_reducer";

export const changeTheme = (goDark: boolean) => {
  localStorage.setItem("isDark", JSON.stringify(goDark));
  return {
    type: goDark ? DARK_THEME : DEFAULT_THEME
  };
};
