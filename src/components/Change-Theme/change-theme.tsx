import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeTheme } from "../../actions/theme_actions";
import Switch from "react-switch";

import "./change-theme.scss";
const ThemeChanger = () => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState<boolean>(false);
  useEffect(() => {
    dispatch(changeTheme(checked));
  }, [checked]);
  return (
    <div className="theme-changer">
      <Switch
        checked={checked}
        onChange={() => setChecked(!checked)}
        value="checkedA"
        onColor="#5EB246"
        uncheckedIcon={false}
        checkedIcon={false}
      />
    </div>
  );
};

export default ThemeChanger;
