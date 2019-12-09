import React, { useEffect } from "react";
import Light from "../Light/light";

import ThemeChanger from "../Change-Theme/change-theme";
import CreateUser from "../Create-User/create";
import ColorPicker from "../Configuration/config";

import { ReduxeStore } from "../../reducers";
import { useSelector, useDispatch } from "react-redux";

import { checkUser, getLights } from "../../actions/hue_actions";

import "./main.scss";

const Main = () => {
  const { theme, bridgeData } = useSelector((state: ReduxeStore) => state);
  const dispatch = useDispatch();
  const { bData, lights, selected } = bridgeData;

  useEffect(() => {
    dispatch(checkUser());
  }, []);
  useEffect(() => {
    if (bData && !lights) {
      dispatch(getLights());
    }
  }, [bData]);

  return (
    <div
      className="main container"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <ThemeChanger />
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
