import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Main from "./components/Main/main";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import MyReducers from "./reducers/index";

const store = createStore(MyReducers, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById("root")
);
