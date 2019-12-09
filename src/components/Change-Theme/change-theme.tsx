import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ReduxeStore } from "../../reducers";

const ThemeChanger = () => {
  const theme = useSelector((state: ReduxeStore) => state.theme);
  const [hexCode, setHexCode] = useState<string>(theme.backgroundColor);
  return null;
};

export default ThemeChanger;
