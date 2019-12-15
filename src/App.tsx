import React, { useEffect, useMemo } from "react";
import { Route, withRouter, RouteChildrenProps } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ReduxeStore } from "./reducers";

import Main from "./components/Main-App/main-app";
import Navbar from "./components/Navbar/navbar";
import CreateUser from "./components/Create-User/create";

import { checkUser } from "./actions/hue_actions";
import { changeTheme } from "./actions/theme_actions";

export const routes = {
  main: "/main-app",
  createUser: "/create-user"
};

const App = (props: RouteChildrenProps) => {
  const [theme, bData] = useSelector((state: ReduxeStore) => [
    state.themeData.theme,
    state.bridgeData.bData
  ]);
  const dispatch = useDispatch();
  useEffect(() => {
    const darkMode = JSON.parse(localStorage.getItem("isDark"));
    dispatch(changeTheme(darkMode));
  }, []);
  useEffect(() => {
    dispatch(checkUser());
  }, []);
  useEffect(() => {
    if (!bData) {
      props.history.push(routes.createUser);
    } else {
      props.history.push(routes.main);
    }
  }, [bData]);
  return (
    <div
      className="main-container"
      style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
    >
      <Navbar />
      <Route path="/create-user" component={CreateUser} />
      {useMemo(
        () => (
          <Route path="/main-app" component={Main} />
        ),
        []
      )}
    </div>
  );
};

export default withRouter(App);
