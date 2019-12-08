import { ReduxeStore } from "../reducers";
import { BridgeData } from "../components/Main/main";

import { nupnpSearch } from "node-hue-api";

export const registerNewUser = () => async (
  dispatch,
  getState: Function
): Promise<BridgeData | null> => {
  try {
    const { hueApi } = getState();
    const [bridgeData] = await nupnpSearch();
    const user = await hueApi.registerUser(
      bridgeData.ipaddress,
      "hue-controller2"
    );
    const bData = { user, host: bridgeData.ipaddress };
    localStorage.setItem("bridgeData", JSON.stringify(bData));
    dispatch({
      paylaod: {
        key: ""
      }
    });
  } catch (err) {
    return null;
  }
  return null;
};
export const checkUser = () => async (dispatch, getState: Function) => {
  const { bridgeData }: ReduxeStore = getState();
  const bData = JSON.parse(localStorage.getItem("bridgeData"));
  if (!bData) return;
  dispatch({
    type: "notype",
    payload: {
      key: "bData",
      data: bData
    }
  });
};
