import { combineReducers } from "redux";
import BridgeReducer, { InitBridge } from "./bridge_reducer";
import ThemeReducer, { MyTheme } from "./theme_reducer";

export type Action = {
  payload?: any;
  type?: Symbol;
};
export type ReduxeStore = {
  bridgeData: InitBridge;
  theme: MyTheme;
};

export default combineReducers({
  bridgeData: BridgeReducer,
  theme: ThemeReducer
});
