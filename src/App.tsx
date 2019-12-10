import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReduxeStore } from "./reducers";

import Main from "./components/Main/main";
import Navbar from "./components/Settings/settings";

const App = () => {
  const [themeData] = useSelector((state: ReduxeStore) => [state.themeData]);
  const { theme, isDark } = themeData;
  return (
    <Router>
      <div
        className="main-container"
        style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
      >
        <Navbar />
        <Route path="/" component={Main} />
      </div>
    </Router>
  );
};

export default App;
