import { Action } from ".";
import { HueApi, ILight } from "node-hue-api";

export const SET_BRIDGE_DATA = Symbol(),
  REGISTER_NEW_USER = Symbol(),
  ERROR_MSG = Symbol(),
  UPDATE_LIGHTS = Symbol(),
  UPDATE_SINGLE_LIGHT = Symbol(),
  SET_SELECTED = Symbol(),
  UPDATE_SINGLE_COLOR = Symbol();

export type InitBridge = {
  bData: BridgeData | null;
  lights: MyLight[] | null;
  hueApi: HueApi;
  selected: number | null;
  errorMsg: string | null;
};
export interface MyLight extends ILight {
  rgb?: number[];
}
const initBridge: InitBridge = {
  bData: null,
  lights: null,
  hueApi: new HueApi(),
  selected: null,
  errorMsg: null
};
export type BridgeData = {
  user: string;
  host: string;
};
const BridgeReducer = (state = initBridge, { payload, type }: Action) => {
  switch (type) {
    case ERROR_MSG:
      return { ...state, ...payload };
    case REGISTER_NEW_USER:
      const copy = { ...state };
      if (copy.errorMsg) {
        copy.errorMsg = null;
      }
      return { ...copy, ...payload };
    case SET_BRIDGE_DATA:
      return { ...state, ...payload };
    case UPDATE_LIGHTS:
      return { ...state, ...payload };
    case UPDATE_SINGLE_LIGHT:
      const lCopy = [...state.lights];
      lCopy[payload.index].state[payload.key] = payload.value;
      return { ...state, lights: lCopy };
    case SET_SELECTED:
      return { ...state, selected: payload.index };
    default:
      return state;
  }
};

export default BridgeReducer;
