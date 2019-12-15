import React from "react";
import { useSpring, animated } from "react-spring";
import { RouteChildrenProps } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { registerNewUser } from "../../actions/hue_actions";

import HueImage from "../../images/bridge-button.png";
import { ReduxeStore } from "../../reducers";
import { routes } from "../../App";

import "./create.scss";

const CreateUser = (props: RouteChildrenProps) => {
  const dispatch = useDispatch();
  const [errorMsg] = useSelector((state: ReduxeStore) => [
    state.bridgeData.errorMsg
  ]);
  const createDiv = useSpring({
    opacity: 1,
    from: { opacity: 0 }
  });
  return (
    <animated.div className="create-div" style={createDiv}>
      <div className="inner-content">
        <h2>Press the button on your Philips Hue Bridge then click connect!</h2>
        {errorMsg && <h4 className="set-bridge-message">{errorMsg}</h4>}
        <img src={HueImage} alt="bridge" />
        <button
          onClick={() => {
            props.history.push(routes.loading);
            dispatch(registerNewUser());
          }}
        >
          Connect
        </button>
      </div>
    </animated.div>
  );
};

export default CreateUser;
