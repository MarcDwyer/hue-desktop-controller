import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "../../actions/theme_actions";
import Switch from "react-switch";
import { ReduxeStore } from "../../reducers";
import "./change-theme.scss";

const ThemeChanger = () => {
  const [themeData] = useSelector((state: ReduxeStore) => [state.themeData]);
  const { isDark, theme } = themeData;
  const dispatch = useDispatch();
  return (
    <nav style={{ backgroundColor: theme.navColor }}>
      <div className="theme-changer">
        <Switch
          checked={isDark}
          onChange={() => dispatch(changeTheme(!isDark))}
          value="checkedA"
          onColor="#7d53cd"
          uncheckedIcon={false}
          checkedIcon={false}
        />
      </div>
    </nav>
  );
};

export default ThemeChanger;
