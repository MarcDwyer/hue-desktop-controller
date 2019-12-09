import { nupnpSearch, HueApi } from "node-hue-api";
import {
  ERROR_MSG,
  REGISTER_NEW_USER,
  SET_BRIDGE_DATA,
  UPDATE_LIGHTS
} from "../reducers/bridge_reducer";
import { BridgeData } from "../reducers/bridge_reducer";
import { Dispatch } from "redux";
import { ReduxeStore } from "../reducers";
import { xyBriToRgb } from "../Methods/methods";

export type GetState = {
  (): ReduxeStore;
};

export const dispatchError = (dispatch, msg: string): void => {
  dispatch({
    type: ERROR_MSG,
    payload: {
      errorMsg: msg
    }
  });
};
export const registerNewUser = () => async (
  dispatch,
  getState
): Promise<void> => {
  try {
    const { hueApi } = getState().bridgeData;
    const [bridgeData] = await nupnpSearch();
    const user = await hueApi.registerUser(
      bridgeData.ipaddress,
      "hue-controller2"
    );
    const bData = { user, host: bridgeData.ipaddress };
    localStorage.setItem("bridgeData", JSON.stringify(bData));
    dispatch({
      type: REGISTER_NEW_USER,
      payload: {
        hueApi: new HueApi(bData.host, user),
        bData
      }
    });
  } catch (err) {
    if (err.message) {
      dispatchError(dispatch, err.message);
    }
  }
};
export const checkUser = () => async dispatch => {
  const bData: BridgeData = JSON.parse(localStorage.getItem("bridgeData"));
  if (!bData) return;
  dispatch({
    type: SET_BRIDGE_DATA,
    payload: {
      bData,
      hueApi: new HueApi(bData.host, bData.user)
    }
  });
};

export const getLights = () => async (
  dispatch: Dispatch,
  getState: GetState
) => {
  const { hueApi } = getState().bridgeData;
  try {
    let { lights } = await hueApi.lights();
    lights.forEach(l => {
      if (!l.state.xy) return;
      const [x, y] = l.state.xy;
      l.state["rgb"] = xyBriToRgb(x, y, l.state.bri);
    });
    dispatch({
      type: UPDATE_LIGHTS,
      payload: {
        lights
      }
    });
  } catch (err) {
    console.log(err);
    if (err.message) {
      dispatchError(dispatch, err.message);
    }
  }
};
