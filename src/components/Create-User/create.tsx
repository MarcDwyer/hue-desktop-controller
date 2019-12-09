import React, { useState, useRef } from "react";
import { BeatLoader } from "react-spinners";
import { css } from "@emotion/core";
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
  const loader = css`
    margin: 25px auto auto auto;
  `;

  const createDiv = useSpring({
    opacity: 1,
    from: { opacity: 0 }
  });
  return (
    <animated.div className="create-div" style={createDiv}>
      <div className="inner-content">
        {errorMsg && <h2 className="set-bridge-message">{errorMsg}</h2>}
        <img src={HueImage} alt="bridge" />
        <button onClick={() => dispatch(registerNewUser())}>Connect</button>
        {/* {status ? (
          <BeatLoader color="#eee" css={loader} />
        ) : (
         
        )} */}
      </div>
    </animated.div>
  );
};

export default CreateUser;
