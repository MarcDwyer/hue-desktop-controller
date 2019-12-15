import React from "react";
import LightGrid from "../Light-Grid/light-grid";

import ColorPicker from "../Configuration/config";

import "./main.scss";

const MainApp = () => {
  console.log("main");
  return (
    <React.Fragment>
      <div className="authenticated">
        <LightGrid />
      </div>
      <ColorPicker />
    </React.Fragment>
  );
};

export default MainApp;
