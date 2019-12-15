import React from "react";
import { useSpring, animated } from "react-spring";
import { useDispatch, useSelector } from "react-redux";
import { registerNewUser } from "../../actions/hue_actions";
import "./create.scss";

import HueImage from "../../images/bridge-button.png";
import { ReduxeStore } from "../../reducers";

const CreateUser = () => {
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
        <button onClick={() => dispatch(registerNewUser())}>Connect</button>
      </div>
    </animated.div>
  );
};

export default CreateUser;
