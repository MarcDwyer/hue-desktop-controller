import { DARK_THEME, DEFAULT_THEME } from "../reducers/theme_reducer"

export const changeTheme = (goDark: boolean) => {
    return {
        type: goDark ? DARK_THEME : DEFAULT_THEME,
    }
}