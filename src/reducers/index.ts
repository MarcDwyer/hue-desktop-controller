import { combineReducers } from "redux";
import BridgeReducer, { InitBridge } from "./bridge_reducer";
export type Action = {
  payload?: any;
  type?: string;
};
export type ReduxeStore = {
  bridgeData: InitBridge;
};

export default combineReducers({
  bridgeData: BridgeReducer
});
