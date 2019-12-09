import { combineReducers } from "redux";
import BridgeReducer, { InitBridge } from "./bridge_reducer";
import ThemeReducer, { ThemeData } from "./theme_reducer";

export type Action = {
  payload?: any;
  type?: Symbol;
};
export type ReduxeStore = {
  bridgeData: InitBridge;
  themeData: ThemeData;
};

export default combineReducers({
  bridgeData: BridgeReducer,
  themeData: ThemeReducer
});
