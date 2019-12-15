import React from "react";
import ReactDOM from "react-dom";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import MyReducers from "./reducers/index";

import { BrowserRouter as Router, Switch } from "react-router-dom";

import "./index.scss";

import App from "./App";

const store = createStore(MyReducers, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <App />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
