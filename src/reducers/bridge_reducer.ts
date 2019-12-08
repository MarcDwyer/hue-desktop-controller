import { Action } from ".";
import { BridgeData, LightParent } from "../components/Main/main";
import { HueApi } from "node-hue-api";

export const SET_BRIDGE_DATA = Symbol();

export type InitBridge = {
  bData: BridgeData | null;
  lights: LightParent | null;
  hueApi: HueApi;
  selected: number | null;
};
const initBridge = {
  bData: null,
  lights: null,
  hueApi: new HueApi(),
  selected: null
};
const BridgeReducer = (state = initBridge, { payload, type }: Action) => {
  if (payload) {
    const clone = { ...state };
    clone[payload.key] = payload.data;
    return clone;
  } else {
    console.log(state);
    return state;
  }
};

export default BridgeReducer;
