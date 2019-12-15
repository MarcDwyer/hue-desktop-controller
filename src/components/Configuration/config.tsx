import React from "react";
import { SketchPicker, RGBColor } from "react-color";
import { createPortal } from "react-dom";
import { Spring } from "react-spring/renderprops";
import { useSelector, useDispatch } from "react-redux";
import { ReduxeStore } from "../../reducers";
import { updateSelected, colorChange } from "../../actions/light_actions";
import { useDebouncedCallback } from "use-debounce/lib";

import "./config.scss";

const ColorPicker = () => {
  const [
    selected,
    lights,
    theme
  ] = useSelector(({ bridgeData, themeData }: ReduxeStore) => [
    bridgeData.selected,
    bridgeData.lights,
    themeData.theme
  ]);
  const [sendColor] = useDebouncedCallback(
    (index: number, rgb: RGBColor) => dispatch(colorChange(index, rgb)),
    250
  );
  const dispatch = useDispatch();
  if (!selected || !lights || (lights[selected] && !lights[selected].state.rgb))
    return null;
  const light = lights[selected];
  const [r, g, b] = light.state.rgb;
  return createPortal(
    <div
      className="config-parent"
      onClick={e => {
        //@ts-ignore
        if (e.target.className !== "config-parent") return;
        dispatch(updateSelected(null));
      }}
    >
      <Spring
        to={{ opacity: 1, transform: "translateY(0%" }}
        from={{ opacity: 0, transform: "translateY(-50%)" }}
      >
        {props => {
          return (
            <div
              className="configuration"
              style={{ ...props, backgroundColor: theme.backgroundColor }}
            >
              <SketchPicker
                width="350px"
                color={{
                  r,
                  g,
                  b
                }}
                onChangeComplete={color => sendColor(selected, color.rgb)}
              />
              <button
                className="exit"
                style={{
                  border: `${theme.color} 1px solid`,
                  color: theme.color
                }}
                onClick={() => dispatch(updateSelected(null))}
              >
                EXIT
              </button>
            </div>
          );
        }}
      </Spring>
    </div>,
    document.querySelector("#root")
  );
};

export default ColorPicker;
