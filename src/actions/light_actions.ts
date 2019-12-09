import * as hue from "node-hue-api";

import { GetState, dispatchError } from "./hue_actions";
import { UPDATE_SINGLE_LIGHT, SET_SELECTED } from "../reducers/bridge_reducer";
import { RGBtoXY } from "../Methods/methods";
import { RGBColor } from "react-color";

export const brightChange = (index: number, bri: number) => async (
  dispatch,
  getState: GetState
) => {
  try {
    const { hueApi } = getState().bridgeData;
    const lightState = hue.lightState.create();
    await hueApi.setLightState(index + 1, lightState.bri(bri));
    dispatch({
      type: UPDATE_SINGLE_LIGHT,
      payload: {
        key: "bri",
        value: bri,
        index
      }
    });
  } catch (err) {
    if (err.message) {
      dispatchError(dispatch, err.message);
    }
  }
};

export const updateSelected = (index: number) => {
  return {
    type: SET_SELECTED,
    payload: {
      index
    }
  };
};

export const powerChange = (index: number, on: boolean) => async (
  dispatch,
  getState: GetState
) => {
  try {
    const { hueApi } = getState().bridgeData;
    const newPower = !on;
    const lightState = hue.lightState.create();
    await hueApi.setLightState(index + 1, lightState.on(newPower));
    dispatch({
      type: UPDATE_SINGLE_LIGHT,
      payload: {
        key: "on",
        value: newPower,
        index
      }
    });
  } catch (err) {
    console.log(err);
    if (err.message) {
      dispatchError(dispatch, err.message);
    }
  }
};

//const [x, y] = RGBtoXY(data[0], data[1], data[2]);
//         isSet = await hueBridge.setLightState(id, state.xy(x, y));
export const colorChange = (index: number, { r, g, b }: RGBColor) => async (
  dispatch,
  getState: GetState
) => {
  try {
    const { hueApi } = getState().bridgeData;
    const lightState = hue.lightState.create();
    const [x, y] = RGBtoXY(r, g, b);
    await hueApi.setLightState(index + 1, lightState.xy(x, y));
    dispatch({
      type: UPDATE_SINGLE_LIGHT,
      payload: {
        key: "rgb",
        value: [r, g, b],
        index
      }
    });
  } catch (err) {
    console.log(err);
    if (err.message) {
      dispatchError(dispatch, err.message);
    }
  }
};
