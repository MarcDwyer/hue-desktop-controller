import React, { useEffect } from "react";
import { BounceLoader } from "react-spinners";
import { useSelector, shallowEqual } from "react-redux";
import { ReduxeStore } from "../../reducers";
import { RouteChildrenProps } from "react-router";

import "./loading.scss";

const LoadingScreen = React.memo((props: RouteChildrenProps) => {
  const [theme, errorMsg] = useSelector(
    (store: ReduxeStore) => [store.themeData.theme, store.bridgeData.errorMsg],
    shallowEqual
  );
  useEffect(() => {
    if (errorMsg) {
      props.history.goBack();
    }
  }, [errorMsg]);
  return (
    <div className="main-loading">
      <h1>Please wait while loading data</h1>
      <BounceLoader color={theme.color} />
    </div>
  );
});

export default LoadingScreen;
