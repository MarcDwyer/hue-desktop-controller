import React, { useEffect } from "react";
import Light from "../Light/light";

import CreateUser from "../Create-User/create";
import ColorPicker from "../Configuration/config";

import { ReduxeStore } from "../../reducers";
import { useSelector, useDispatch } from "react-redux";

import { checkUser, getLights } from "../../actions/hue_actions";

import "./main.scss";
import { changeTheme } from "../../actions/theme_actions";

const Main = () => {
  const { themeData, bridgeData } = useSelector((state: ReduxeStore) => state);
  const dispatch = useDispatch();
  const { bData, lights, selected } = bridgeData;
  const { theme } = themeData;

  useEffect(() => {
    dispatch(checkUser());
    const darkMode = JSON.parse(localStorage.getItem("isDark"));
    dispatch(changeTheme(darkMode));
  }, []);
  useEffect(() => {
    if (bData && !lights) {
      dispatch(getLights());
    }
  }, [bData]);

  return (
    <div className="main container">
      {!bData && <CreateUser />}
      {lights && (
        <div className="authenticated">
          <div className="light-grid">
            <div className="subdiv">
              {lights.map((l, i) => {
                return <Light key={l.id} light={l} index={i} />;
              })}
            </div>
          </div>
        </div>
      )}
      {selected && <ColorPicker />}
    </div>
  );
};

export default Main;
