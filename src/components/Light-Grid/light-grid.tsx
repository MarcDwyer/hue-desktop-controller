import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Light from "../Light/light";
import { getLights } from "../../actions/hue_actions";

import "./light-grid.scss";
import { ReduxeStore } from "../../reducers";

const LightGrid = () => {
  const lights = useSelector((state: ReduxeStore) => state.bridgeData.lights);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!lights) {
      dispatch(getLights());
    }
  }, [lights]);
  return (
    <div className="light-grid">
      <div className="subdiv">
        {lights &&
          lights.map((l, i) => {
            return <Light key={l.id} light={l} index={i} />;
          })}
      </div>
    </div>
  );
};

export default LightGrid;
