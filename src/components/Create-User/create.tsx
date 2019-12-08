import React, { useState, useRef } from "react";
import { nupnpSearch, HueApi } from "node-hue-api";
import { BeatLoader } from "react-spinners";
import { css } from "@emotion/core";
import { useSpring, animated } from "react-spring";
import { useDispatch, useSelector } from "react-redux";

import "./create.scss";

import HueImage from "../../images/bridge-button.png";
import { ReduxeStore } from "../../reducers";

const CreateUser = () => {
  const newMsg = useRef<string>(
    "Press the Link button on your hue bridge then click connect"
  );
  const [status, setStatus] = useState<boolean>(false);
  const [hueApi] = useSelector((state: ReduxeStore) => [
    state.bridgeData.hueApi
  ]);
  const dispatch = useDispatch();
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
        <h2 className="set-bridge-message">
          {newMsg && newMsg.current && newMsg.current}
        </h2>
        <img src={HueImage} alt="bridge" />
        {status ? (
          <BeatLoader color="#eee" css={loader} />
        ) : (
          <button disabled={status} onClick={() => dispatch}>
            Connect
          </button>
        )}
      </div>
    </animated.div>
  );
};

export default CreateUser;
