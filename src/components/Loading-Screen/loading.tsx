import React from "react";
import { BounceLoader } from "react-spinners";
import { useSelector, shallowEqual } from "react-redux";
import { ReduxeStore } from "../../reducers";
import { MyTheme } from "../../reducers/theme_reducer";

import "./loading.scss";

const LoadingScreen = React.memo(() => {
  const theme: MyTheme = useSelector(
    (store: ReduxeStore) => store.themeData.theme,
    shallowEqual
  );
  console.log("rendered");
  return (
    <div className="main-loading">
      <h1>Please wait while loading data</h1>
      <BounceLoader color={theme.color} />
    </div>
  );
});

export default LoadingScreen;
